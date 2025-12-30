'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { uploadReport } from "@/app/actions"
import { UploadCloud, FileText, CheckCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function UploadReportForm({ submissionId }: { submissionId: string }) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  async function handleUpload() {
    if (!selectedFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append('submissionId', submissionId)
    formData.append('file', selectedFile)

    const result = await uploadReport(formData)
    
    if (!result.success) {
        alert("上传失败: " + result.error)
    } else {
        setSelectedFile(null)
        // Reset the file input manually if needed, though state reset handles UI
        // Reload page to see changes or rely on revalidatePath
    }
    
    setUploading(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="report-file">上传报告文件</Label>
        <Input 
            id="report-file" 
            type="file" 
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="cursor-pointer"
        />
      </div>

      {selectedFile && (
          <Button 
            onClick={handleUpload} 
            disabled={uploading} 
            className="w-full"
          >
            {uploading ? (
                <>上传中...</>
            ) : (
                <>
                    <CheckCircle className="w-4 h-4 mr-2" /> 确认上传
                </>
            )}
          </Button>
      )}
    </div>
  )
}
