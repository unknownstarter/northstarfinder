import { useProjectionStore } from '../store/useProjectionStore'

export default function ProjectionTable() {
  const results = useProjectionStore((s) => s.projectionResult)
  const factors = useProjectionStore((s) => s.factors)

  if (results.length === 0) {
    return (
      <div className="text-neutral-600 text-sm p-4">
        Projection 결과가 없습니다.
      </div>
    )
  }

  const names = factors.map((f) => f.name)

  return (
    <div className="overflow-auto max-h-80">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="text-left px-3 py-2 text-neutral-500 font-medium text-xs sticky left-0 bg-neutral-950">
              Factor
            </th>
            {results.map((r) => (
              <th
                key={r.period}
                className="text-right px-3 py-2 text-neutral-500 font-medium text-xs whitespace-nowrap"
              >
                {r.period}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {names.map((name) => (
            <tr
              key={name}
              className="border-b border-neutral-900 hover:bg-neutral-800/30"
            >
              <td className="px-3 py-1.5 text-neutral-400 text-xs sticky left-0 bg-neutral-950 whitespace-nowrap">
                {name}
              </td>
              {results.map((r) => (
                <td
                  key={r.period}
                  className="text-right px-3 py-1.5 text-neutral-300 font-mono text-xs whitespace-nowrap"
                >
                  {formatValue(r.values[name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatValue(v: number | undefined): string {
  if (v === undefined) return '-'
  if (Number.isInteger(v)) return v.toLocaleString()
  return v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
