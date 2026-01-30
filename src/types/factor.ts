export type GrowthType = 'compound' | 'linear' | 'none'
export type FactorType = 'input' | 'formula'
export type PeriodType = 'daily' | 'weekly' | 'monthly'

export interface InputFactor {
  id: string
  name: string
  type: 'input'
  unit?: string
  description?: string
  baseValue: number
  growthType: GrowthType
  growthValue: number
}

export interface FormulaFactor {
  id: string
  name: string
  type: 'formula'
  unit?: string
  description?: string
  expression: string
}

export type Factor = InputFactor | FormulaFactor

export interface PeriodConfig {
  type: PeriodType
  count: number
}

export interface PeriodResult {
  period: string
  values: Record<string, number>
}

export interface ProjectionError {
  factorId: string
  factorName: string
  message: string
  type: 'cycle' | 'undefined_ref' | 'parse_error' | 'computation_error'
}
