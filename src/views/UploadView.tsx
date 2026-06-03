import axios from 'axios'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseQuizFile } from '@/api/quiz'
import { useGameStore } from '@/stores/game'
import { useUiStore } from '@/stores/ui'
import './UploadView.css'

export default function UploadView() {
  const navigate = useNavigate()
  const setParseResult = useGameStore((s) => s.setParseResult)
  const loading = useUiStore((s) => s.loading)
  const error = useUiStore((s) => s.error)
  const setLoading = useUiStore((s) => s.setLoading)
  const setError = useUiStore((s) => s.setError)
  const clearError = useUiStore((s) => s.clearError)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null)
    clearError()
  }

  function clearSelection() {
    setSelectedFile(null)
    clearError()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleUpload() {
    if (!selectedFile) return
    setLoading(true)
    clearError()

    try {
      const result = await parseQuizFile(selectedFile)
      if (!result.questions?.length) {
        throw new Error('解析结果为空，请检查文件内容后重试。')
      }
      setParseResult(result)
      await navigate('/item')
    } catch (err) {
      let message = '解析失败，请稍后重试。'
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail
        if (typeof detail === 'string' && detail.trim()) {
          message = detail
        } else if (err.message) {
          message = err.message
        }
      } else if (err instanceof Error) {
        message = err.message
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="upload-page">
      <h5 className="title">动态题库上传</h5>
      <p className="desc">请选择 Word、PDF 或 Excel 文件，系统会自动解析题目。</p>

      <input
        ref={fileInputRef}
        className="file-input"
        type="file"
        accept=".doc,.docx,.pdf,.xls,.xlsx"
        onChange={handleFileChange}
      />

      <div className="actions">
        <button
          type="button"
          className="primary-btn"
          disabled={!selectedFile || loading}
          onClick={handleUpload}
        >
          {loading ? '解析中...' : '上传并开始答题'}
        </button>
        <button type="button" className="ghost-btn" disabled={loading} onClick={clearSelection}>
          清空选择
        </button>
      </div>

      {selectedFile ? <p className="filename">当前文件：{selectedFile.name}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <section className="format-tips">
        <h2>文档格式要求</h2>
        <ul>
          <li>Word 支持 `.doc`/`.docx`（`.doc` 会自动转换）</li>
          <li>题目行：`1. 题目内容`（也支持 `1、` 或 `1)`）</li>
          <li>选项行：`A. 选项内容`（也支持 `A、` 或 `A)`）</li>
          <li>答案行：`答案: B` 或 `答案：A,C`</li>
          <li>支持题型标记：`[单选]`、`[多选]`、`[判断]`</li>
        </ul>
        <pre className="example">{`[单选]
1. 2+2等于几？
A. 3
B. 4
C. 5
答案: B

[多选]
2. 以下哪些是编程语言？
A. Python
B. Excel
C. Java
D. C++
答案: A,C,D

[判断]
3. 地球是圆的
A. 对
B. 错
答案: A`}</pre>
      </section>
    </section>
  )
}
