export type Fn<I, O> = (_: I) => O

/**
 * Create, from two function a(a) and b(x), a new function f(x) = b(a(x))
 */
export const composeFn = <A, B, C>(
  fn1: Fn<A, B>,
  fn2: Fn<B, C>
): Fn<A, C> => a => fn2(fn1(a))
