import { List } from "immutable"
import { chunkList, unchunkLists } from "./lists"

/**
 * A simple function that returns a Promise.
 *
 * We provide different mechanisms for running multiple async operations at the
 * same time. If we would write those mechanisms directly on Promise objects,
 * all the async processes would already be started, regardless of the type
 * parallelism that we chose. Therefore we wrote all these parallel controllers
 * as functions from List<PromiseProvider<A>> to PromiseProvider<List<A>>,
 * instead of List<Promise<A>> to Promise<List<A>>.
 */
export type PromiseProvider<A> = () => Promise<A>

/**
 * Parallel controller that runs the Promises consecutively
 *
 * This function waits for the first Promise to resolve and after that starts
 * the next promise. It will resolve its output Promise only after all input
 * Promises are resolved.
 *
 * @param promiseProviders List<PromiseProvider<A>>
 * @return PromiseProvider<List<A>>
 */
export const consecutivePromises = <A>(
  promiseProviders: List<PromiseProvider<A>>
): PromiseProvider<List<A>> => () =>
  promiseProviders.reduce<Promise<List<A>>>(
    (
      memo: Promise<List<A>>,
      promiseProvider: () => Promise<A>
    ): Promise<List<A>> =>
      memo.then<List<A>>((values: List<A>) =>
        promiseProvider().then<List<A>>((value: A) => values.concat([value]))
      ),
    Promise.resolve<List<A>>(List<A>())
  )

/**
 * Parallel controller that runs the Promises at the same time
 *
 * This function calls all PromiseProviders after each other and then waits
 * until all Promises are resolved. It will resolve its output Promise only
 * after all input Promises are resolved.
 *
 * @param promiseProviders List<PromiseProvider<A>>
 * @return PromiseProvider<List<A>>
 */
export const allPromises = <A>(
  list: List<PromiseProvider<A>>
): PromiseProvider<List<A>> => () =>
  Promise.all<A>(
    list
      .map(
        (promiseProvider: PromiseProvider<A>): Promise<A> => promiseProvider()
      )
      .toArray()
  ).then<List<A>>(l => List<A>(l))

/**
 * Parallel controller that runs the Promises at the same time
 *
 * This function is a mix between allPromises and consecutivePromises. It
 * chunks the list of PromiseProviders, and then consecutively handles the
 * chunks. Within the chunk all PromiseProviders are called after each other,
 * without waiting.
 *
 * Internally, the conversion is like this.
 *  * It starts with List<PromiseProvider<A>>
 *  * chunkList (see lists helpers) converts this to
 *    List<List<PromiseProvider<A>>>
 *  * Using allPromises, this is converted to List<PromiseProvider<List<A>>>
 *  * Using consecutivePromises, this is converted to
 *    PromiseProvider<List<List<A>>>
 *  * Using unchunkLists, this is converted to PromiseProvider<List<List<A>>
 *
 * @param promiseProviders List<PromiseProvider<A>>
 * @param chunkSize number
 * @return PromiseProvider<List<A>>
 */
export const chunkedPromises = <A>(
  promiseProviders: List<PromiseProvider<A>>,
  chunkSize: number = 1
): PromiseProvider<List<A>> => () =>
  consecutivePromises<List<A>>(
    chunkList<PromiseProvider<A>>(promiseProviders, chunkSize).map(allPromises)
  )().then(unchunkLists)
