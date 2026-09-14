import { useRef, useState } from 'react'
import { Upload, FileSpreadsheet, X, Download, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onClose: () => void
}

export function StatementImportModal({ onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  const ACCEPTED = ['.xlsx', '.xls', '.csv']

  function validateFile(file: File): string | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED.includes(ext)) return `Unsupported file type. Use ${ACCEPTED.join(', ')}.`
    if (file.size > 10 * 1024 * 1024) return 'File is too large (max 10 MB).'
    return null
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateFile(file)
    setImportError(err)
    setSelectedFile(err ? null : file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    const err = validateFile(file)
    setImportError(err)
    setSelectedFile(err ? null : file)
  }

  async function handleImport() {
    if (!selectedFile) return
    setImporting(true)
    // Placeholder — real parsing would call a service here
    await new Promise((r) => setTimeout(r, 1200))
    setImporting(false)
    console.log('import statements from', selectedFile.name)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl border border-[#e4e7ec] shadow-2xl w-[480px] max-w-[95vw] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f2f4f7]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#0e2c46]" />
            <p className="text-sm font-semibold text-[#0e2c46]">Import Statements</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f2f4f7] text-[#98a2b3] hover:text-[#344054] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Description */}
          <p className="text-xs text-[#667085] leading-relaxed">
            Upload an Excel (.xlsx / .xls) or CSV file. Each row becomes a statement.
            Columns: <strong className="text-[#344054]">direction, service_type, model, discount, discount_unit, from, to, band_unit, channel, apply_to</strong>.
          </p>

          {/* Template download */}
          <button
            type="button"
            onClick={() => console.log('download template')}
            className="flex items-center gap-1.5 text-xs text-[#82bc34] font-medium hover:text-[#6fa02c] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download statement template
          </button>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer transition-colors',
              dragging
                ? 'border-[#82bc34] bg-[#f6fbee]'
                : selectedFile
                  ? 'border-[#82bc34] bg-[#f6fbee]'
                  : 'border-[#d0d5dd] hover:border-[#0e2c46] bg-[#f9fafb] hover:bg-white',
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <>
                <FileSpreadsheet className="w-8 h-8 text-[#82bc34]" />
                <div className="text-center">
                  <p className="text-sm font-medium text-[#0e2c46]">{selectedFile.name}</p>
                  <p className="text-xs text-[#98a2b3] mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#98a2b3]" />
                <div className="text-center">
                  <p className="text-sm font-medium text-[#344054]">Drop file here or click to browse</p>
                  <p className="text-xs text-[#98a2b3] mt-0.5">{ACCEPTED.join(', ')} · max 10 MB</p>
                </div>
              </>
            )}
          </div>

          {/* Error */}
          {importError && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {importError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[#f2f4f7] bg-[#f9fafb]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#d0d5dd] px-4 py-2 text-xs font-medium text-[#344054] hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!selectedFile || importing}
            className="rounded-lg bg-[#0e2c46] text-white px-4 py-2 text-xs font-semibold hover:bg-[#185992] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing…' : 'Import statements'}
          </button>
        </div>
      </div>
    </div>
  )
}
