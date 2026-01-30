import { useState, useEffect } from 'react'
import { useProjectionStore } from '../store/useProjectionStore'
import FactorList from './FactorList'
import FactorEditor from './FactorEditor'
import ProjectionTable from './ProjectionTable'
import ProjectionChart from './ProjectionChart'
import ExportButtons from './ExportButtons'

export default function Layout() {
  const compute = useProjectionStore((s) => s.compute)
  const errors = useProjectionStore((s) => s.errors)
  const periodConfig = useProjectionStore((s) => s.periodConfig)
  const setPeriodConfig = useProjectionStore((s) => s.setPeriodConfig)
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table')

  // 초기 계산
  useEffect(() => {
    compute()
  }, [compute])

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-200">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
        <h1 className="text-sm font-bold tracking-tight">
          NorthStar Finder
          <span className="ml-2 text-neutral-600 font-normal">
            Projection Builder
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={periodConfig.type}
            onChange={(e) =>
              setPeriodConfig({
                ...periodConfig,
                type: e.target.value as 'daily' | 'weekly' | 'monthly',
              })
            }
            className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input
            type="number"
            min={1}
            max={365}
            value={periodConfig.count}
            onChange={(e) =>
              setPeriodConfig({
                ...periodConfig,
                count: Math.max(1, parseInt(e.target.value) || 1),
              })
            }
            className="w-16 px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
          />
          <span className="text-xs text-neutral-600">periods</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        {/* 좌측: Factor 리스트 */}
        <aside className="w-64 border-r border-neutral-800 flex-shrink-0 overflow-hidden">
          <FactorList />
        </aside>

        {/* 우측: Editor + Results */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Editor */}
          <div className="border-b border-neutral-800 max-h-80 overflow-y-auto">
            <FactorEditor />
          </div>

          {/* Global Errors */}
          {errors.length > 0 && (
            <div className="px-4 py-2 border-b border-neutral-800 space-y-1">
              {errors.map((err, i) => (
                <div
                  key={i}
                  className="text-xs text-red-400 bg-red-400/10 rounded px-3 py-1.5"
                >
                  [{err.factorName}] {err.message}
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="flex-1 flex flex-col min-h-0 p-4 overflow-y-auto">
            {/* Tab + Export */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1">
                <TabButton
                  label="테이블"
                  active={activeTab === 'table'}
                  onClick={() => setActiveTab('table')}
                />
                <TabButton
                  label="차트"
                  active={activeTab === 'chart'}
                  onClick={() => setActiveTab('chart')}
                />
              </div>
              <ExportButtons />
            </div>

            {activeTab === 'table' ? <ProjectionTable /> : <ProjectionChart />}
          </div>
        </main>
      </div>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
        active
          ? 'bg-neutral-800 text-neutral-200'
          : 'text-neutral-500 hover:text-neutral-300'
      }`}
    >
      {label}
    </button>
  )
}
