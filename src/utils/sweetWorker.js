// const createFile = (data) => {
//   const blob = new Blob([data], { type: 'application/javascript' })
//   return URL.createObjectURL(blob)
// }

// export const createWorkerFile = wrapper => {
//   const { fn, uses } = wrapper

//   const workerCode = `
// // ${fn.name}
// ${uses.map(k => `const ${k.name} = ${k}`).join('\n')}
// const fn = ${fn}
// onmessage = e => {
//   console.log('data in worker: ', e.data)
//   return postMessage(fn(...e.data))
// }`
//   return createFile(workerCode)
// }

// // usage example
// // const reconcileWorker = sweetWorker(reconcileWrapper)
// // await reconcileWorker(oldState, newState)
// const sweetWorker = wrapper => {
//   const workerURL = createWorkerFile(wrapper)
//   return (...args) => new Promise(resolve => {
//     const worker = new Worker(workerURL)
//     worker.postMessage(args)
//     worker.onmessage = (e) => {
//       worker.terminate()
//       return resolve(e.data)
//     }
//   })
// }

// export default sweetWorker
