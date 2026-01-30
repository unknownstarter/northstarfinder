import { useProjectionStore } from '../store/useProjectionStore'
import type { Factor, GrowthType, PeriodType } from '../types/factor'

const PERIOD_LABEL: Record<PeriodType, string> = {
  daily: '일간',
  weekly: '주간',
  monthly: '월간',
}

export default function FactorEditor() {
  const factors = useProjectionStore((s) => s.factors)
  const selectedId = useProjectionStore((s) => s.selectedFactorId)
  const updateFactor = useProjectionStore((s) => s.updateFactor)
  const errors = useProjectionStore((s) => s.errors)
  const periodType = useProjectionStore((s) => s.periodConfig.type)

  const factor = factors.find((f) => f.id === selectedId)

  if (!factor) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
        Factor를 선택하세요
      </div>
    )
  }

  const factorErrors = errors.filter((e) => e.factorId === factor.id)

  const update = (updates: Partial<Factor>) => {
    updateFactor(factor.id, updates)
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-sm font-semibold text-neutral-200">Factor 편집</h2>

      {/* Name */}
      <Field label="Name (식별자)">
        <input
          type="text"
          value={factor.name}
          onChange={(e) => update({ name: e.target.value })}
          className="input-field"
          placeholder="예: users, revenue"
        />
      </Field>

      {/* Description */}
      <Field label="설명 (선택)">
        <input
          type="text"
          value={factor.description ?? ''}
          onChange={(e) => update({ description: e.target.value })}
          className="input-field"
          placeholder="이 Factor에 대한 설명"
        />
      </Field>

      {/* Unit */}
      <Field label="단위 (선택)">
        <input
          type="text"
          value={factor.unit ?? ''}
          onChange={(e) => update({ unit: e.target.value })}
          className="input-field"
          placeholder="예: %, 원, $"
        />
      </Field>

      {factor.type === 'input' && (
        <>
          {/* Base Value */}
          <Field label="기준값 (Base Value)">
            <input
              type="number"
              value={factor.baseValue}
              onChange={(e) =>
                update({ baseValue: parseFloat(e.target.value) || 0 })
              }
              className="input-field"
            />
          </Field>

          {/* Growth Type */}
          <Field label="성장 방식">
            <select
              value={factor.growthType}
              onChange={(e) =>
                update({ growthType: e.target.value as GrowthType })
              }
              className="input-field"
            >
              <option value="none">고정 (변화 없음)</option>
              <option value="compound">복리 (%)</option>
              <option value="linear">선형 (+값)</option>
            </select>
          </Field>

          {/* Growth Value */}
          {factor.growthType !== 'none' && (
            <Field
              label={
                factor.growthType === 'compound'
                  ? `${PERIOD_LABEL[periodType]} 성장률 (%)`
                  : `${PERIOD_LABEL[periodType]} 증가량`
              }
            >
              <input
                type="number"
                value={factor.growthValue}
                onChange={(e) =>
                  update({
                    growthValue: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field"
              />
            </Field>
          )}
        </>
      )}

      {factor.type === 'formula' && (
        <Field label="수식 (Expression)">
          <input
            type="text"
            value={factor.expression}
            onChange={(e) => update({ expression: e.target.value })}
            className="input-field font-mono"
            placeholder="예: users * conversion_rate * fee"
          />
          <p className="text-xs text-neutral-600 mt-1">
            다른 Factor name으로 참조. if(조건, 참값, 거짓값) 사용 가능.
          </p>
        </Field>
      )}

      {/* Errors */}
      {factorErrors.length > 0 && (
        <div className="space-y-1">
          {factorErrors.map((err, i) => (
            <div
              key={i}
              className="text-xs text-red-400 bg-red-400/10 rounded px-3 py-2"
            >
              {err.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs text-neutral-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
