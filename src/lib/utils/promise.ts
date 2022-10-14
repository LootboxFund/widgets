/** Used to inject a chain in the synchronous invocations of a promise array */
export const promiseChainDelay = async (promises: (Promise<any> | undefined)[], delay: number = 100) => {
  const res = []
  for (const promise of promises) {
    if (promise == undefined) {
      res.push(undefined)
      continue
    }
    const promiseResult = await promise
    res.push(promiseResult)
    await new Promise((res) => {
      setTimeout(() => {
        return res(null)
      }, delay)
    })
  }
  return res
}

/**
 *
 * @param waitCondition Boolean, if true, we await it to turn to false.
 * @param defaultTimeout Milliseconds for a timeout. If this timeout is reached before waitCondition, an error is thrown
 * @returns
 */
export const awaitPollResult = async (waitCondition: boolean, defaultTimeout: number = 1000 * 60 * 5) => {
  const isDone: boolean = await new Promise(async (res, rej) => {
    const timer = setTimeout(() => {
      res(false)
    }, defaultTimeout)
    let i = 0
    while (waitCondition) {
      i++
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve(null)
        }, 2000)
      )
    }
    clearInterval(timer)
    res(true)
  })

  if (!isDone) {
    throw new Error('Timed out waiting for Lootbox to be created')
  }
  return true
}
