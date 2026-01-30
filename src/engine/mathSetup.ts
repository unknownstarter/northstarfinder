import { create, all } from 'mathjs'

const math = create(all!)

math.import?.(
  {
    // if(condition, trueValue, falseValue)
    if: (cond: boolean, a: number, b: number) => (cond ? a : b),
  },
  { override: true },
)

export default math
