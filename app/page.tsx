import { SurveyForm } from '@/components/survey-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between p-4 max-w-6xl mx-auto items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/check" className="text-gray-600 hover:text-green-600">
            🔍 查询我的报告
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/login" className="text-gray-400 hover:text-gray-900 text-xs">
            管理员入口
          </Link>
        </Button>
      </header>

      <main className="flex-1 py-6">
        <div className="container mx-auto">
          <SurveyForm />
        </div>
      </main>
    </div>
  )
}
