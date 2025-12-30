'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { checkSubmission } from '@/app/actions'
import Link from 'next/link'

export default function CheckReportPage() {
  const [redBookName, setRedBookName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ found: boolean; id?: string; status?: string; reportUrl?: string } | null>(null)
  const [error, setError] = useState('')

  // 页面加载时自动填充小红书名（如果之前提交过）
  useEffect(() => {
    const savedName = localStorage.getItem('user_redbook_name')
    if (savedName) {
      setRedBookName(savedName)
    }
  }, [])

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (!redBookName.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    const res = await checkSubmission(redBookName)
    setLoading(false)

    if (res.success && res.data) {
        setResult(res.data)
    } else {
        setError(res.error || '未找到该用户的提交记录，请确认名字是否输入正确。')
    }
  }

  // Helper to extract path for proxy
  const getProxyLink = (url: string, name: string) => {
      if (!url) return '#';
      const path = url.split('/reports/').pop();
      return `/api/proxy-download?path=${encodeURIComponent(path || '')}&filename=诊断报告-${name}.pdf`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">查询我的诊断报告</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="redBookName">请输入您填写问卷时的“小红书名字”</Label>
              <Input
                id="redBookName"
                placeholder="例如：小红薯123"
                value={redBookName}
                onChange={(e) => setRedBookName(e.target.value)}
                required
              />
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            {result && result.found && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-md space-y-3">
                    <p className="font-semibold text-green-800">🎉 找到记录了！</p>

                    {result.status === 'COMPLETED' && result.reportUrl ? (
                        <div className="space-y-3">
                            <p className="text-sm text-green-700">您的报告已生成！</p>

                            <div className="space-y-2">
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Link href={`/report?url=${encodeURIComponent(result.reportUrl)}&name=${encodeURIComponent(redBookName)}`}>
                                        👁️ 在线查看报告
                                    </Link>
                                </Button>

                                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                                    <a href={result.reportUrl} download={`诊断报告-${redBookName}.pdf`} target="_blank" rel="noopener noreferrer">
                                        📥 直接下载报告
                                    </a>
                                </Button>
                            </div>

                            <p className="text-xs text-gray-500 text-center pt-2">
                                💡 提示：点击"在线查看"可直接在网页中预览
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-yellow-700 mb-2">您的报告正在加急生成中，请耐心等待。</p>
                            <p className="text-xs text-gray-500">建议您稍后再来查询。</p>
                        </div>
                    )}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '查询中...' : '查询'}
            </Button>

            <div className="text-center pt-2">
                <Link href="/" className="text-sm text-gray-500 hover:underline">返回首页</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

