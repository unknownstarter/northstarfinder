import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useProjectionStore } from '../store/useProjectionStore'

const COLORS = [
  '#a3a3a3',
  '#737373',
  '#d4d4d4',
  '#525252',
  '#e5e5e5',
  '#404040',
]

export default function ProjectionChart() {
  const results = useProjectionStore((s) => s.projectionResult)
  const factors = useProjectionStore((s) => s.factors)
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set())

  if (results.length === 0) return null

  const allNames = factors.map((f) => f.name)
  const displayNames =
    selectedNames.size > 0 ? Array.from(selectedNames) : allNames

  const toggle = (name: string) => {
    setSelectedNames((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  return (
    <div>
      {/* Factor 선택 칩 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {allNames.map((name, i) => {
          const active = selectedNames.size === 0 || selectedNames.has(name)
          return (
            <button
              key={name}
              onClick={() => toggle(name)}
              className={`px-2 py-0.5 text-xs rounded cursor-pointer transition-colors ${
                active
                  ? 'text-white'
                  : 'bg-neutral-900 text-neutral-600'
              }`}
              style={
                active
                  ? { backgroundColor: COLORS[i % COLORS.length] }
                  : undefined
              }
            >
              {name}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={results}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: '#737373' }}
            stroke="#262626"
          />
          <YAxis tick={{ fontSize: 11, fill: '#737373' }} stroke="#262626" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#a3a3a3' }}
          />
          {displayNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={`values.${name}`}
              name={name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={1.5}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
