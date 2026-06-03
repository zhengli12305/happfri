import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseQuizFile } from '@/api/quiz'
import { useGameStore } from '@/stores/game'
import { useUiStore } from '@/stores/ui'
import './UploadDrawer.css'

interface UploadDrawerProps {
  onClose: () => void
}

export default function UploadDrawer({ onClose }: UploadDrawerProps) {
  const navigate = useNavigate()
  const setParseResult = useGameStore((s) => s.setParseResult)
  const loading = useUiStore((s) => s.loading)
  const error = useUiStore((s) => s.error)
  const setLoading = useUiStore((s) => s.setLoading)
  const setError = useUiStore((s) => s.setError)
  const clearError = useUiStore((s) => s.clearError)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      setSelectedFile(null)
      clearError()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [clearError])

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
      onClose()
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
    <aside className="upload-drawer slide-in">
      <header className="drawer-header">
        <h2>动态题库上传</h2>
        <button type="button" className="close-btn" onClick={onClose}>
          关闭
        </button>
      </header>

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
        <h3>标准格式示例（两种格式都支持）</h3>

        <p className="example-title">格式一：每题后紧跟答案</p>
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

答案: A,C,D`}</pre>

        <p className="example-title">格式二：题目在前，答案集中在后</p>
        <pre className="example">{`[单选]
1. 2+2等于几？
A. 3
B. 4
C. 5

[多选]
2. 以下哪些是编程语言？
A. Python
B. Excel
C. Java
D. C++

参考答案
1. B
2. A,C,D`}</pre>
      </section>
    </aside>
  )
}
