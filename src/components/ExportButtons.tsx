import { useProjectionStore } from '../store/useProjectionStore'
import { exportToXLSX, exportToCSV } from '../utils/export'

export default function ExportButtons() {
  const results = useProjectionStore((s) => s.projectionResult)
  const factors = useProjectionStore((s) => s.factors)

  if (results.length === 0) return null

  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportToXLSX(results, factors)}
        className="px-3 py-1.5 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
      >
        XLSX 다운로드
      </button>
      <button
        onClick={() => exportToCSV(results, factors)}
        className="px-3 py-1.5 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
      >
        CSV 다운로드
      </button>
    </div>
  )
}
