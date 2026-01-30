import type { Factor, ProjectionError } from '../types/factor'
import math from './mathSetup'

/**
 * expression에서 참조하는 factor name 목록을 추출한다.
 * mathjs AST를 순회하여 SymbolNode를 찾는다.
 */
export function extractDependencies(
  expression: string,
  factorNames: Set<string>,
): string[] {
  try {
    const node = math.parse(expression)
    const deps: Set<string> = new Set()
    node.traverse((n) => {
      if (n.type === 'SymbolNode' && 'name' in n && factorNames.has(n.name as string)) {
        deps.add(n.name as string)
      }
    })
    return Array.from(deps)
  } catch {
    return []
  }
}

export interface TopologicalResult {
  sorted: Factor[]
  errors: ProjectionError[]
}

/**
 * Kahn's Algorithm으로 topological sort + 사이클 감지.
 * Input Factor는 의존성이 없으므로 먼저 정렬되고,
 * Formula Factor는 의존성 순서대로 정렬된다.
 */
export function topologicalSort(factors: Factor[]): TopologicalResult {
  const errors: ProjectionError[] = []
  const factorNames = new Set(factors.map((f) => f.name))
  const nameToFactor = new Map(factors.map((f) => [f.name, f]))

  // 인접 리스트: factor name → 이 factor가 의존하는 factor name 목록
  const deps = new Map<string, string[]>()
  // 역방향: factor name → 이 factor를 참조하는 factor name 목록
  const dependents = new Map<string, string[]>()
  // in-degree
  const inDegree = new Map<string, number>()

  for (const f of factors) {
    const factorDeps =
      f.type === 'formula'
        ? extractDependencies(f.expression, factorNames)
        : []
    deps.set(f.name, factorDeps)
    inDegree.set(f.name, factorDeps.length)

    // 미정의 참조 체크
    if (f.type === 'formula') {
      for (const dep of factorDeps) {
        if (!factorNames.has(dep)) {
          errors.push({
            factorId: f.id,
            factorName: f.name,
            message: `정의되지 않은 변수 "${dep}"을 참조합니다.`,
            type: 'undefined_ref',
          })
        }
      }
    }
  }

  // 역방향 그래프 구축
  for (const f of factors) {
    dependents.set(f.name, [])
  }
  for (const [name, depList] of deps) {
    for (const dep of depList) {
      dependents.get(dep)?.push(name)
    }
  }

  // BFS
  const queue: string[] = []
  for (const [name, degree] of inDegree) {
    if (degree === 0) {
      queue.push(name)
    }
  }

  const sorted: Factor[] = []
  while (queue.length > 0) {
    const name = queue.shift()!
    const factor = nameToFactor.get(name)
    if (factor) sorted.push(factor)

    for (const dependent of dependents.get(name) ?? []) {
      const newDegree = (inDegree.get(dependent) ?? 1) - 1
      inDegree.set(dependent, newDegree)
      if (newDegree === 0) {
        queue.push(dependent)
      }
    }
  }

  // 사이클 감지
  if (sorted.length < factors.length) {
    const sortedNames = new Set(sorted.map((f) => f.name))
    for (const f of factors) {
      if (!sortedNames.has(f.name)) {
        errors.push({
          factorId: f.id,
          factorName: f.name,
          message: `순환 참조가 감지되었습니다: "${f.name}"이 순환 참조에 포함되어 있습니다.`,
          type: 'cycle',
        })
      }
    }
  }

  return { sorted, errors }
}
