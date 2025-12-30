'use server'

import { supabase, supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function submitSurvey(data: any) {
  try {
    const { data: submission, error } = await supabase
      .from('Submission')
      .insert([
        {
          childGender: data.childGender,
          childAge: data.childAge,
          parentContact: data.parentContact || null,
          redBookName: data.redBookName || null,
          answers: JSON.stringify(data),
          status: 'PENDING',
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: submission.id }
  } catch (error) {
    console.error('Submission error:', error)
    return { success: false, error: 'Failed to submit survey' }
  }
}

export async function uploadReport(formData: FormData) {
  const file = formData.get('file') as File
  const submissionId = formData.get('submissionId') as string

  if (!file || !submissionId) {
    return { success: false, error: 'Missing file or ID' }
  }

  // Use Admin client for upload to bypass RLS policies safely
  // This ensures only the server (Admin) can perform this upload, not the public client
  const client = supabaseAdmin || supabase;

  try {
    // 1. Sanitize Filename to ASCII
    const fileExt = file.name.split('.').pop() || 'pdf';
    const filename = `${submissionId}-${Date.now()}.${fileExt}`
    
    // 2. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await client
      .storage
      .from('reports') 
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError)
      return { success: false, error: 'File upload failed: ' + uploadError.message }
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = client
      .storage
      .from('reports')
      .getPublicUrl(filename)

    // 4. Update Database Record
    const { error: dbError } = await client
      .from('Submission')
      .update({
        reportUrl: publicUrl,
        status: 'COMPLETED',
        updatedAt: new Date().toISOString(),
      })
      .eq('id', submissionId)

    if (dbError) {
       console.error('Supabase DB Update Error:', dbError)
       return { success: false, error: 'Database update failed: ' + dbError.message }
    }

    revalidatePath(`/admin/submission/${submissionId}`)
    return { success: true }

  } catch (error) {
    console.error('Unexpected Upload Error:', error)
    return { success: false, error: 'Upload failed' }
  }
}

export async function checkSubmission(redBookName: string) {
  try {
    // Use Supabase client to query
    const { data, error } = await supabase
      .from('Submission')
      .select('id, status, reportUrl')
      .eq('redBookName', redBookName)
      .order('createdAt', { ascending: false }) // Get the latest one if multiple
      .limit(1)
      .single()

    if (error) {
      // PGRST116 is code for "The result contains 0 rows" when using .single()
      if (error.code === 'PGRST116') {
          return { success: true, data: null, error: '未找到该用户的提交记录' }
      }
      console.error('Check submission error:', error)
      return { success: false, error: '查询失败，请稍后重试' }
    }

    if (!data) {
        return { success: true, data: null, error: '未找到该用户的提交记录' }
    }

    return { 
        success: true, 
        data: { 
            found: true, 
            id: data.id, 
            status: data.status, 
            reportUrl: data.reportUrl 
        } 
    }

  } catch (error) {
    console.error('Unexpected error checking submission:', error)
    return { success: false, error: '系统错误' }
  }
}
