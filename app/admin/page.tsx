import { supabase } from '@/lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { data: submissions, error } = await supabase
    .from('Submission')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
      console.error("Error fetching submissions:", error)
      return <div className="p-10">Error loading data. Please check console.</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">后台管理 - 问卷列表</h1>
        <Button asChild variant="outline">
            <Link href="/">返回首页</Link>
        </Button>
      </div>
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>提交时间</TableHead>
              <TableHead>孩子年级</TableHead>
              <TableHead>家长联系方式</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions?.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
                <TableCell>{sub.childAge || '-'}</TableCell>
                <TableCell>{sub.parentContact || '-'}</TableCell>
                <TableCell>
                  <Badge variant={sub.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {sub.status === 'COMPLETED' ? '已生成报告' : '待处理'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm">
                    <Link href={`/admin/submission/${sub.id}`}>查看详情</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!submissions || submissions.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
