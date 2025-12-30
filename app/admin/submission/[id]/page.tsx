import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UploadReportForm } from '@/components/upload-report-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { surveyQuestions, Question, Option } from '@/components/survey-config'
import { ExportSubmissionButton } from '@/components/export-submission-button'

// Helper function to render answer content
function AnswerDisplay({ question, answers }: { question: Question, answers: any }) {
  // 1. Handle "info" type - skip
  if (question.type === 'info') return null;

  // 2. Handle "rank-group" type (e.g., Dopamine ranking)
  if (question.type === 'rank-group' && question.subFields) {
    return (
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">{question.title}</h4>
        <div className="space-y-2">
            {question.subFields.map(sub => {
                const val = answers[sub.field];
                const option = question.options?.find(o => o.value === val);
                const label = option ? option.label : val;
                const otherVal = sub.otherField ? answers[sub.otherField] : '';
                
                return (
                    <div key={sub.field} className="text-sm">
                        <span className="text-gray-500 mr-2">{sub.label}:</span>
                        <span className="font-medium">{label}</span>
                        {otherVal && <span className="text-gray-600 italic ml-2">({otherVal})</span>}
                    </div>
                )
            })}
        </div>
      </div>
    );
  }

  // 3. Handle "group" type (e.g., Conflict Black Box)
  if (question.type === 'group' && question.subFields) {
      return (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">{question.title}</h4>
            <div className="space-y-3">
                {question.subFields.map(sub => {
                     const val = answers[sub.field];
                     // Check if this subfield is a select/radio with options
                     const option = sub.options?.find(o => o.value === val);
                     const label = option ? option.label : val;
                     
                     return (
                         <div key={sub.field} className="text-sm border-l-2 border-gray-200 pl-3">
                             <div className="text-gray-500 mb-1">{sub.label}</div>
                             <div className="font-medium whitespace-pre-wrap">{label || '-'}</div>
                         </div>
                     )
                })}
            </div>
        </div>
      )
  }

  // 4. Handle standard Single Field questions (radio, select, input, checkbox)
  const val = question.field ? answers[question.field] : null;
  
  // Find option label if applicable
  let displayValue = val;
  if (question.options) {
      const option = question.options.find(o => o.value === val);
      if (option) {
          displayValue = option.label;
      }
  }

  // Checkbox handling
  if (question.type === 'checkbox') {
      displayValue = val ? '已确认' : '未确认';
  }

  // "Other" field value
  const otherVal = question.otherField ? answers[question.otherField] : '';

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <h4 className="font-semibold text-gray-900 mb-2">{question.title}</h4>
      <div className="text-sm">
        <div className="font-medium text-gray-800">
            {displayValue || <span className="text-gray-300">未填写</span>}
            {otherVal && <span className="block mt-2 text-gray-600 bg-gray-50 p-2 rounded">补充说明: {otherVal}</span>}
        </div>
      </div>
    </div>
  );
}

export default async function SubmissionDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: submission, error } = await supabase
    .from('Submission')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !submission) {
    notFound()
  }

  const answers = JSON.parse(submission.answers)

  // Extract path from reportUrl for proxy download
  // Expected format: .../reports/filename.pdf
  const reportPath = submission.reportUrl ? submission.reportUrl.split('/reports/').pop() : null;
  const proxyDownloadUrl = reportPath ? `/api/proxy-download?path=${encodeURIComponent(reportPath)}&filename=诊断报告-${submission.redBookName || '家长'}.pdf` : '#';

  return (
    <div className="container mx-auto py-10 space-y-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">问卷详情</h1>
            <Button variant="outline" asChild><Link href="/admin">返回列表</Link></Button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Answers (Takes up 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-white border-b">
                <CardTitle>家长填写内容</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                   <div><span className="font-semibold text-gray-700">提交时间:</span> {new Date(submission.createdAt).toLocaleString()}</div>
                   <div><span className="font-semibold text-gray-700">小红书名:</span> {submission.redBookName || '-'}</div>
                   <div><span className="font-semibold text-gray-700">孩子年级:</span> {answers.childAge}</div>
                   <div><span className="font-semibold text-gray-700">性别:</span> {answers.childGender === 'male' ? '男' : '女'}</div>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-gray-50/50">
                <div className="space-y-1">
                    {surveyQuestions.map((q) => (
                        <AnswerDisplay key={q.id} question={q} answers={answers} />
                    ))}
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Right Column: Actions (Takes up 1 col) */}
        <div className="space-y-6">
             <Card>
                <CardHeader className="bg-white border-b">
                   <CardTitle className="text-lg">数据导出</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <p className="text-sm text-gray-500 mb-4">
                       一键生成排版好的文本，方便复制到微信、文档或保存为文件。
                   </p>
                   <ExportSubmissionButton 
                     answers={answers} 
                     metadata={{
                         submissionTime: new Date(submission.createdAt).toLocaleString(),
                         redBookName: submission.redBookName,
                         childAge: answers.childAge,
                         childGender: answers.childGender
                     }}
                   />
                </CardContent>
            </Card>

            <Card className="sticky top-6">
              <CardHeader className="bg-gray-100 border-b">
                <CardTitle className="text-lg">报告管理</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">当前状态:</span>
                    <Badge variant={submission.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {submission.status === 'COMPLETED' ? '已生成报告' : '待处理'}
                    </Badge>
                </div>

                {submission.reportUrl ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-3 border rounded-md bg-green-50 text-green-700 text-sm">
                            ✅ 报告已上传
                        </div>
                        <Button asChild className="w-full" variant="default">
                            {/* Use proxy download link */}
                            <a href={proxyDownloadUrl} target="_blank" rel="noopener noreferrer">
                                查看/下载报告 (加速通道)
                            </a>
                        </Button>
                        
                        <div className="border-t pt-4 mt-4">
                             <p className="font-semibold mb-2 text-sm">发给家长的链接:</p>
                             <div className="bg-gray-100 p-2 rounded text-xs break-all font-mono select-all">
                                 {/* Just display the relative path for localhost, or construct full URL if env var set */}
                                 {`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/report/${submission.id}`}
                             </div>
                             <Button asChild variant="link" className="px-0 h-auto mt-1">
                                <Link href={`/report/${submission.id}`} target="_blank">打开家长查看页 ↗</Link>
                             </Button>
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <p className="text-xs text-gray-500 mb-2">需要更新报告？重新上传即可覆盖。</p>
                            <UploadReportForm submissionId={submission.id} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-md">
                            ⚠️ 尚未上传诊断报告，家长看到的页面显示为“生成中”。
                        </div>
                        <UploadReportForm submissionId={submission.id} />
                    </div>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
