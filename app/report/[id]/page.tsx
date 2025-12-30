import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: submission, error } = await supabase
    .from('Submission')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !submission || !submission.reportUrl) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md text-center p-6">
                <h1 className="text-xl font-bold mb-4">报告生成中...</h1>
                <p className="text-gray-500">您的诊断报告正在加急生成中，请稍后再试或联系顾问。</p>
            </Card>
        </div>
    )
  }

  // Extract path from reportUrl for proxy download
  const reportPath = submission.reportUrl ? submission.reportUrl.split('/reports/').pop() : null;
  const proxyDownloadUrl = reportPath ? `/api/proxy-download?path=${encodeURIComponent(reportPath)}&filename=诊断报告-${submission.redBookName || '家长'}.pdf` : '#';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">家庭内驱力诊断报告</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
                <p className="text-gray-600">亲爱的家长，您的专属诊断报告已生成。</p>
                
                <div className="p-10 border-2 border-dashed rounded-lg bg-white">
                    <p className="mb-4 font-semibold text-lg">点击下方按钮查看完整报告</p>
                    <Button size="lg" asChild>
                        {/* Use proxy download link */}
                        <a href={proxyDownloadUrl} target="_blank" rel="noopener noreferrer">
                            查看/下载报告 (加速通道)
                        </a>
                    </Button>
                </div>

                <p className="text-sm text-gray-400 mt-8">
                    建议您下载保存报告，方便随时查阅。
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
