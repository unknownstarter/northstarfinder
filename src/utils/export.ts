import * as XLSX from 'xlsx'
import type { PeriodResult, Factor } from '../types/factor'

function buildRows(
  results: PeriodResult[],
  factors: Factor[],
): Record<string, string | number>[] {
  const names = factors.map((f) => f.name)
  return results.map((r) => {
    const row: Record<string, string | number> = { Period: r.period }
    for (const name of names) {
      row[name] = r.values[name] ?? ''
    }
    return row
  })
}

export function exportToXLSX(
  results: PeriodResult[],
  factors: Factor[],
  filename = 'projection.xlsx',
): void {
  const rows = buildRows(results, factors)
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Projection')
  XLSX.writeFile(wb, filename)
}

export function exportToCSV(
  results: PeriodResult[],
  factors: Factor[],
  filename = 'projection.csv',
): void {
  const rows = buildRows(results, factors)
  const ws = XLSX.utils.json_to_sheet(rows)
  const csv = XLSX.utils.sheet_to_csv(ws)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
