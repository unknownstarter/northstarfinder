import type {
  Factor,
  PeriodConfig,
  PeriodResult,
  ProjectionError,
} from '../types/factor'
import { topologicalSort } from './dependency'
import math from './mathSetup'

function computeInputValue(
  factor: Extract<Factor, { type: 'input' }>,
  t: number,
): number {
  const { baseValue, growthType, growthValue } = factor
  switch (growthType) {
    case 'compound':
      return baseValue * Math.pow(1 + growthValue / 100, t - 1)
    case 'linear':
      return baseValue + growthValue * (t - 1)
    case 'none':
      return baseValue
  }
}

function formatPeriodLabel(type: PeriodConfig['type'], t: number): string {
  switch (type) {
    case 'daily':
      return `D${t}`
    case 'weekly':
      return `W${t}`
    case 'monthly':
      return `M${t}`
  }
}

export interface ComputeResult {
  results: PeriodResult[]
  errors: ProjectionError[]
}

export function computeProjection(
  factors: Factor[],
  config: PeriodConfig,
): ComputeResult {
  // 1. Topological sort + 사이클/미정의 참조 검사
  const { sorted, errors } = topologicalSort(factors)

  if (errors.length > 0) {
    return { results: [], errors }
  }

  const results: PeriodResult[] = []
  const computeErrors: ProjectionError[] = []

  // 2. 각 기간에 대해 계산
  for (let t = 1; t <= config.count; t++) {
    const scope: Record<string, number> = {}

    for (const factor of sorted) {
      if (factor.type === 'input') {
        scope[factor.name] = computeInputValue(factor, t)
      } else {
        // Formula Factor
        try {
          const result = math.evaluate(factor.expression, { ...scope })
          const numResult =
            typeof result === 'object' && result !== null
              ? Number(result)
              : Number(result)
          if (isNaN(numResult)) {
            if (t === 1) {
              computeErrors.push({
                factorId: factor.id,
                factorName: factor.name,
                message: `수식 계산 결과가 NaN입니다: "${factor.expression}"`,
                type: 'computation_error',
              })
            }
            scope[factor.name] = 0
          } else {
            scope[factor.name] = numResult
          }
        } catch (e) {
          if (t === 1) {
            computeErrors.push({
              factorId: factor.id,
              factorName: factor.name,
              message: `수식 파싱 실패: "${factor.expression}" — ${e instanceof Error ? e.message : String(e)}`,
              type: 'parse_error',
            })
          }
          scope[factor.name] = 0
        }
      }
    }

    results.push({
      period: formatPeriodLabel(config.type, t),
      values: { ...scope },
    })
  }

  return { results, errors: computeErrors }
}
