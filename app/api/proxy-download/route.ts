import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path')
  const filename = searchParams.get('filename') || 'report.pdf'

  if (!path) {
    return new NextResponse('Missing path', { status: 400 })
  }

  try {
    const { data, error } = await supabase.storage
      .from('reports')
      .download(path)

    if (error) {
      console.error('Download error:', error)
      return new NextResponse('File not found', { status: 404 })
    }

    const headers = new Headers()
    headers.set('Content-Type', data.type)
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    headers.set('Cache-Control', 'public, max-age=3600')

    return new NextResponse(data, { headers })
  } catch (error) {
    console.error('Proxy error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

