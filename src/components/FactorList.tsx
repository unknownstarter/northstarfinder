import { useProjectionStore, generateId } from '../store/useProjectionStore'
import type { Factor } from '../types/factor'

export default function FactorList() {
  const factors = useProjectionStore((s) => s.factors)
  const selectedId = useProjectionStore((s) => s.selectedFactorId)
  const setSelected = useProjectionStore((s) => s.setSelectedFactor)
  const addFactor = useProjectionStore((s) => s.addFactor)
  const removeFactor = useProjectionStore((s) => s.removeFactor)

  const handleAdd = (type: Factor['type']) => {
    const id = generateId()
    const factor: Factor =
      type === 'input'
        ? {
            id,
            name: `factor_${id.slice(-4)}`,
            type: 'input',
            baseValue: 0,
            growthType: 'none',
            growthValue: 0,
          }
        : {
            id,
            name: `formula_${id.slice(-4)}`,
            type: 'formula',
            expression: '',
          }
    addFactor(factor)
    setSelected(id)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-200">Factors</h2>
        <div className="flex gap-1">
          <button
            onClick={() => handleAdd('input')}
            className="px-2 py-1 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            + Input
          </button>
          <button
            onClick={() => handleAdd('formula')}
            className="px-2 py-1 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            + Formula
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {factors.map((f) => (
          <div
            key={f.id}
            onClick={() => setSelected(f.id)}
            className={`flex items-center justify-between px-4 py-2.5 cursor-pointer border-b border-neutral-900 transition-colors ${
              selectedId === f.id
                ? 'bg-neutral-800'
                : 'hover:bg-neutral-800/50'
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm text-neutral-200 truncate">{f.name}</div>
              <div className="text-xs text-neutral-500">
                {f.type === 'input' ? 'Input' : 'Formula'}
                {f.description && ` · ${f.description}`}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeFactor(f.id)
              }}
              className="ml-2 text-neutral-600 hover:text-red-400 text-xs shrink-0 cursor-pointer"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
