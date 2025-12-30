'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { submitSurvey } from '@/app/actions'
import { Label } from '@/components/ui/label'
import { surveyQuestions, Question } from './survey-config'
import Link from 'next/link'

// Dynamically generate Zod schema from questions config
const schemaShape: any = {}

surveyQuestions.forEach((q) => {
  if (q.type === 'info') return

  if (q.field) {
    if (q.type === 'checkbox') {
        schemaShape[q.field] = z.boolean().refine(val => val === true, { message: "请确认" })
    } else {
        schemaShape[q.field] = z.string().min(1, "此项必填")
    }
  }

  if (q.otherField) {
    schemaShape[q.otherField] = z.string().optional()
  }

  // Handle subfields (for rank-group or group)
  if (q.subFields) {
      q.subFields.forEach(sub => {
          schemaShape[sub.field] = z.string().min(1, "此项必填")
          if (sub.otherField) {
              schemaShape[sub.otherField] = z.string().optional()
          }
      })
  }
})

const formSchema = z.object(schemaShape)

const SURVEY_STORAGE_KEY = 'family_drive_survey_progress'

export function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with default values
  const defaultValues: any = {}
  surveyQuestions.forEach(q => {
      if (q.field) defaultValues[q.field] = q.type === 'checkbox' ? false : ""
      if (q.otherField) defaultValues[q.otherField] = ""
      if (q.subFields) {
          q.subFields.forEach(sub => {
              defaultValues[sub.field] = ""
              if (sub.otherField) defaultValues[sub.otherField] = ""
          })
      }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Load saved progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SURVEY_STORAGE_KEY)
      if (saved) {
        const { step, values } = JSON.parse(saved)
        // Ensure step is within valid range
        if (typeof step === 'number' && step >= 0 && step < surveyQuestions.length) {
            setCurrentStep(step)
        }
        if (values) {
          Object.keys(values).forEach(key => {
            form.setValue(key, values[key])
          })
        }
      }
      setIsLoaded(true)
    } catch (e) {
      console.error("Failed to load saved progress", e)
      setError("加载失败，请刷新页面")
      setIsLoaded(true)
    }
  }, [form])

  // Save progress whenever step changes or values change (debounced could be better but this is simple)
  useEffect(() => {
    if (!isLoaded) return
    const subscription = form.watch((value) => {
      localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify({
        step: currentStep,
        values: value
      }))
    })
    // Also save current step
    localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify({
        step: currentStep,
        values: form.getValues()
    }))
    return () => subscription.unsubscribe()
  }, [currentStep, isLoaded, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting values:", values) // Debug
    setIsSubmitting(true)
    const res = await submitSurvey(values)
    setIsSubmitting(false)
    if (res.success) {
      // 保存小红书名到localStorage，方便后续查询
      const redBookName = (values as any).redBookName || ''
      if (redBookName) {
        localStorage.setItem('user_redbook_name', redBookName)
      }
      setIsSuccess(true)
      localStorage.removeItem(SURVEY_STORAGE_KEY) // Clear progress on success
    } else {
      alert("提交失败，请重试")
    }
  }

  const nextStep = async () => {
    const currentQuestion = surveyQuestions[currentStep]
    
    // If it's an info step, just go next
    if (currentQuestion.type === 'info') {
      setCurrentStep(prev => prev + 1)
      return
    }

    // Validate current field
    let fieldsToValidate: any[] = []
    if (currentQuestion.field) fieldsToValidate.push(currentQuestion.field)
    if (currentQuestion.otherField) fieldsToValidate.push(currentQuestion.otherField)
    
    if (currentQuestion.subFields) {
        currentQuestion.subFields.forEach(sub => {
            fieldsToValidate.push(sub.field)
            if (sub.otherField) fieldsToValidate.push(sub.otherField)
        })
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
    window.scrollTo(0, 0)
  }

  if (!isLoaded) {
      return <div className="p-10 text-center">正在加载问卷...</div>
  }

  if (error) {
      return <div className="p-10 text-center text-red-600">{error}</div>
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 text-center p-10">
        <div className="mb-4 text-green-600">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <CardTitle className="text-2xl mb-4">提交成功！</CardTitle>
        <p className="text-gray-600 mb-4">感谢您的真实填写。我们会进行详细的诊断分析。</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <p className="font-semibold text-blue-900 mb-2">📋 后续步骤：</p>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>我们会在 <span className="font-bold">24-48小时内</span> 生成您的专属诊断报告</li>
            <li>报告生成后，您可以随时回来 <span className="font-bold">查询和下载报告</span></li>
            <li>点击下方按钮进入报告查询页面</li>
          </ol>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link href="/check">
              🔍 立即查询我的报告
            </Link>
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            返回首页
          </Button>
        </div>
      </Card>
    )
  }

  const currentQuestion = surveyQuestions[currentStep]
  const progress = ((currentStep) / (surveyQuestions.length - 1)) * 100

  // Watch for "Other" selection (Single question)
  const currentFieldValue = currentQuestion.field ? form.watch(currentQuestion.field) : null
  const selectedOption = currentQuestion.options?.find(o => o.value === currentFieldValue)
  const isOtherSelected = selectedOption?.label?.includes('(请注明)') || currentFieldValue === 'Other' || currentFieldValue === 'other' || currentFieldValue === 'D'

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Hide progress bar on intro step */}
      {currentQuestion.type !== 'info' && (
        <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="text-right text-xs text-gray-500 mt-2">
            {currentStep + 1} / {surveyQuestions.length}
            </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Validation errors:", errors))} className="space-y-6">
          <Card key={currentQuestion.id} className={currentQuestion.type === 'info' ? "border-0 shadow-none bg-transparent" : ""}>
            <CardHeader className={currentQuestion.type === 'info' ? "text-center" : ""}>
              <CardTitle className={`text-xl leading-relaxed ${currentQuestion.type === 'info' ? "text-3xl font-bold" : ""}`}>
                {currentQuestion.title}
              </CardTitle>
              {currentQuestion.type === 'info' && currentQuestion.subtitle && (
                  <CardDescription className="text-lg mt-2">
                      {currentQuestion.subtitle}
                  </CardDescription>
              )}
              {currentQuestion.description && currentQuestion.type !== 'info' && (
                <CardDescription className="whitespace-pre-line">
                  {currentQuestion.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {currentQuestion.type === 'info' && (
                 <div className="my-8 border-2 border-black p-6 bg-white rounded-none">
                   <p className="whitespace-pre-line font-medium text-lg leading-relaxed text-black">
                    {currentQuestion.description}
                   </p>
                 </div>
              )}

              {(currentQuestion.type === 'radio' && currentQuestion.options) && (
                <FormField control={form.control} name={currentQuestion.field!} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value as string} className="space-y-3">
                        {currentQuestion.options!.map((opt) => (
                          <div key={opt.value} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                            <RadioGroupItem value={opt.value} id={`${currentQuestion.id}-${opt.value}`} />
                            <Label htmlFor={`${currentQuestion.id}-${opt.value}`} className="flex-1 cursor-pointer font-normal">
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {(currentQuestion.type === 'select' && currentQuestion.options) && (
                <FormField control={form.control} name={currentQuestion.field!} render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentQuestion.options!.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {/* Render 'rank-group' type */}
              {currentQuestion.type === 'rank-group' && currentQuestion.subFields && (
                  <div className="space-y-6">
                      {currentQuestion.subFields.map((sub, idx) => {
                          const subFieldValue = form.watch(sub.field);
                          const subOption = currentQuestion.options?.find(o => o.value === subFieldValue);
                          const isSubOther = subOption?.label?.includes('(请注明)') || subFieldValue === 'Other' || subFieldValue === 'other';

                          return (
                              <div key={sub.field} className="space-y-3">
                                  <Label className="text-base font-semibold">{sub.label}</Label>
                                  <FormField control={form.control} name={sub.field} render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} value={field.value as string}>
                                        <FormControl>
                                            <SelectTrigger className="h-12">
                                            <SelectValue placeholder="请选择" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {currentQuestion.options!.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )} />
                                    {isSubOther && sub.otherField && (
                                        <FormField control={form.control} name={sub.otherField} render={({ field }) => (
                                            <FormItem className="animate-in fade-in slide-in-from-top-2">
                                                <FormControl>
                                                    <Input placeholder="请输入具体内容..." {...field} value={field.value as string} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}
                              </div>
                          )
                      })}
                  </div>
              )}

              {/* Render 'group' type for general grouped fields (like input fields) */}
              {currentQuestion.type === 'group' && currentQuestion.subFields && (
                <div className="space-y-6">
                  {currentQuestion.subFields.map((sub) => {
                    const subType = sub.type || 'input'; // Default to input if not specified in subField
                    
                    return (
                      <div key={sub.field} className="space-y-2">
                         <Label className="text-base font-medium">{sub.label}</Label>
                         {subType === 'input' && (
                            <FormField control={form.control} name={sub.field} render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder={sub.placeholder} {...field} value={field.value as string} className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                         )}
                         {subType === 'select' && sub.options && (
                             <FormField control={form.control} name={sub.field} render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value as string}>
                                  <FormControl>
                                    <SelectTrigger className="h-12">
                                      <SelectValue placeholder="请选择" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {sub.options!.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                         )}
                      </div>
                    )
                  })}
                </div>
              )}

              {currentQuestion.type === 'input' && (
                <FormField control={form.control} name={currentQuestion.field!} render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder={currentQuestion.placeholder} {...field} value={field.value as string} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {currentQuestion.type === 'checkbox' && (
                <FormField control={form.control} name={currentQuestion.field!} render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        我确认
                      </FormLabel>
                    </div>
                  </FormItem>
                )} />
              )}

              {/* Render Other Input if needed (for single questions) */}
              {(isOtherSelected && currentQuestion.otherField && !currentQuestion.subFields) && (
                 <FormField control={form.control} name={currentQuestion.otherField} render={({ field }) => (
                  <FormItem className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <FormLabel>请具体说明：</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入..." {...field} value={field.value as string} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

            </CardContent>
            <CardFooter className={`flex justify-between pt-6 ${currentQuestion.type === 'info' ? 'justify-center' : ''}`}>
              {currentQuestion.type !== 'info' && (
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                    上一题
                </Button>
              )}
              
              {currentStep < surveyQuestions.length - 1 ? (
                <Button type="button" onClick={nextStep} className={`px-8 ${currentQuestion.type === 'info' ? 'w-full max-w-xs h-12 text-lg border-2 border-black bg-white text-black hover:bg-gray-100' : ''}`}>
                  {currentQuestion.type === 'info' ? '开始答题' : '下一题'}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="px-8 bg-green-600 hover:bg-green-700">
                  {isSubmitting ? '提交中...' : '提交问卷'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
