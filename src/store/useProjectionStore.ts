import { create } from 'zustand'
import type {
  Factor,
  PeriodConfig,
  PeriodResult,
  ProjectionError,
} from '../types/factor'
import { computeProjection } from '../engine/compute'

interface ProjectionStore {
  factors: Factor[]
  periodConfig: PeriodConfig
  selectedFactorId: string | null
  projectionResult: PeriodResult[]
  errors: ProjectionError[]

  addFactor: (factor: Factor) => void
  updateFactor: (id: string, updates: Partial<Factor>) => void
  removeFactor: (id: string) => void
  setSelectedFactor: (id: string | null) => void
  setPeriodConfig: (config: PeriodConfig) => void
  compute: () => void
}

let idCounter = 0
export function generateId(): string {
  return `f_${Date.now()}_${++idCounter}`
}

const DEFAULT_FACTORS: Factor[] = [
  {
    id: 'demo_users',
    name: 'users',
    type: 'input',
    baseValue: 1000,
    growthType: 'compound',
    growthValue: 10,
    description: '주간 사용자 수',
  },
  {
    id: 'demo_sell_limit',
    name: 'sell_limit',
    type: 'input',
    baseValue: 500,
    growthType: 'none',
    growthValue: 0,
    description: '판매 한도',
  },
  {
    id: 'demo_fee',
    name: 'fee',
    type: 'input',
    baseValue: 0.02,
    growthType: 'none',
    growthValue: 0,
    description: '수수료율',
  },
  {
    id: 'demo_activity',
    name: 'activity_index',
    type: 'formula',
    expression: 'if(sell_limit < 50, 2.0, 1.0)',
    description: '활동 지수',
  },
  {
    id: 'demo_revenue',
    name: 'revenue_weekly',
    type: 'formula',
    expression: 'users * activity_index * fee',
    description: '주간 매출',
  },
]

export const useProjectionStore = create<ProjectionStore>((set, get) => ({
  factors: DEFAULT_FACTORS,
  periodConfig: { type: 'weekly', count: 12 },
  selectedFactorId: null,
  projectionResult: [],
  errors: [],

  addFactor: (factor) => {
    set((s) => ({ factors: [...s.factors, factor] }))
    get().compute()
  },

  updateFactor: (id, updates) => {
    set((s) => ({
      factors: s.factors.map((f) =>
        f.id === id ? ({ ...f, ...updates } as Factor) : f,
      ),
    }))
    get().compute()
  },

  removeFactor: (id) => {
    set((s) => ({
      factors: s.factors.filter((f) => f.id !== id),
      selectedFactorId:
        s.selectedFactorId === id ? null : s.selectedFactorId,
    }))
    get().compute()
  },

  setSelectedFactor: (id) => set({ selectedFactorId: id }),

  setPeriodConfig: (config) => {
    set({ periodConfig: config })
    get().compute()
  },

  compute: () => {
    const { factors, periodConfig } = get()
    const { results, errors } = computeProjection(factors, periodConfig)
    set({ projectionResult: results, errors })
  },
}))
