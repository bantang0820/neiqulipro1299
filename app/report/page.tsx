'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function ReportContent() {
  const searchParams = useSearchParams()
  const reportUrl = searchParams.get('url')
  const fileName = searchParams.get('name') || '诊断报告'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">我的诊断报告</h1>
          <Button variant="outline" asChild>
            <Link href="/check">← 返回查询</Link>
          </Button>
        </div>

        {!reportUrl ? (
          <Card className="p-10 text-center">
            <CardTitle className="text-red-600 mb-4">⚠️ 错误</CardTitle>
            <p className="text-gray-600">未找到报告链接，请重新查询。</p>
            <Button asChild className="mt-6">
              <Link href="/check">返回查询页面</Link>
            </Button>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle>📄 报告预览</CardTitle>
              <p className="text-sm text-gray-600 mt-2">如需下载，请点击下方按钮</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[800px] bg-gray-100">
                <iframe
                  src={reportUrl}
                  className="w-full h-full border-0"
                  title="诊断报告"
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setLoading(false)
                    setError(true)
                  }}
                />
              </div>
            </CardContent>
            <CardHeader className="bg-gray-50 border-t">
              <div className="flex gap-3 justify-center">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href={reportUrl} download={`诊断报告-${fileName}.pdf`}>
                    📥 下载报告到本地
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                    🔗 新窗口打开
                  </a>
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <ReportContent />
    </Suspense>
  )
}
