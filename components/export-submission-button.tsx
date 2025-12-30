'use client'

import { Button } from "@/components/ui/button"
import { DownloadIcon, CopyIcon, CheckIcon } from "lucide-react"
import { useState } from "react"
import { surveyQuestions } from "./survey-config"

interface ExportSubmissionButtonProps {
  answers: any
  metadata: {
    submissionTime: string
    redBookName?: string
    childAge?: string
    childGender?: string
  }
}

export function ExportSubmissionButton({ answers, metadata }: ExportSubmissionButtonProps) {
  const [copied, setCopied] = useState(false)

  const generateText = () => {
    let text = `【家庭内驱力诊断问卷反馈】\n`
    text += `----------------------------------------\n`
    text += `提交时间: ${metadata.submissionTime}\n`
    text += `小红书号: ${metadata.redBookName || '-'}\n`
    text += `孩子信息: ${metadata.childGender === 'male' ? '男' : '女'} / ${metadata.childAge}\n`
    text += `----------------------------------------\n\n`

    surveyQuestions.forEach((q) => {
      if (q.type === 'info') return

      text += `${q.title}\n`

      // Logic similar to display logic to get readable values
      if (q.type === 'rank-group' && q.subFields) {
          q.subFields.forEach(sub => {
            const val = answers[sub.field]
            const option = q.options?.find(o => o.value === val)
            const label = option ? option.label : val
            const otherVal = sub.otherField ? answers[sub.otherField] : ''
            text += `  - ${sub.label}: ${label} ${otherVal ? `(${otherVal})` : ''}\n`
          })
      } else if (q.type === 'group' && q.subFields) {
           q.subFields.forEach(sub => {
               const val = answers[sub.field]
               const option = sub.options?.find(o => o.value === val)
               const label = option ? option.label : val
               text += `  - ${sub.label}: ${label || '-'}\n`
           })
      } else {
          // Standard fields
          const val = q.field ? answers[q.field] : null
          let displayValue = val
          if (q.options) {
             const option = q.options.find(o => o.value === val)
             if (option) displayValue = option.label
          }
          if (q.type === 'checkbox') displayValue = val ? '已确认' : '未确认'
          
          text += `  回答: ${displayValue || '未填写'}\n`
          
          if (q.otherField && answers[q.otherField]) {
              text += `  补充: ${answers[q.otherField]}\n`
          }
      }
      text += `\n`
    })

    return text
  }

  const handleCopy = async () => {
    const text = generateText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
      alert('复制失败，请重试')
    }
  }

  const handleDownload = () => {
     const text = generateText()
     const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
     const url = URL.createObjectURL(blob)
     const link = document.createElement('a')
     link.href = url
     link.download = `诊断问卷-${metadata.redBookName || '家长'}-${new Date().toISOString().slice(0,10)}.txt`
     document.body.appendChild(link)
     link.click()
     document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="flex-1" onClick={handleCopy}>
        {copied ? <CheckIcon className="mr-2 h-4 w-4" /> : <CopyIcon className="mr-2 h-4 w-4" />}
        {copied ? '已复制' : '复制内容'}
      </Button>
      <Button variant="outline" className="flex-1" onClick={handleDownload}>
        <DownloadIcon className="mr-2 h-4 w-4" />
        下载文本
      </Button>
    </div>
  )
}

