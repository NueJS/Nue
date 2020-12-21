
const swap = (newArr, i, j) => {
  [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
}

function reconcile (oldArr, newArr) {
  const steps = []
  let syncArr = [...oldArr]

  // remove and swap oldArr
  // find where the old array moved to
  for (let i = 0, x = 0; i < syncArr.length; i++, x++) {
    // console.log(syncArr)
    if (syncArr[i] !== newArr[i]) {
      // node should be at index =  shouldBe
      // console.log('find : ', syncArr[i], 'in: ', newArr)
      const shouldBe = newArr.findIndex(n => n === syncArr[i])
      const shouldBeRemoved = shouldBe === -1
      // console.log({ target: syncArr[i], syncArr, newArr, shouldBe })
      // if can not find shouldBe, it means node should be removed
      if (shouldBeRemoved) {
        // console.log('should be removed')
        // syncArr[i] = undefined
        syncArr.splice(i, 1)
        steps.push({ type: 'remove', index: x })
        i--
      } else {
        // console.log('not removed, swapped', syncArr[i], newArr)
        steps.push({ type: 'swap', indexes: [i, shouldBe] })
        swap(syncArr, i, shouldBe)
      }
    }
  }

  syncArr = syncArr.filter(i => i !== undefined)
  // console.log(syncArr)

  // add syncArr
  for (let i = syncArr.length; i < newArr.length; i++) {
    // if (syncArr[i] !== newArr[i]) {
    // }
    // console.log('different : ', syncArr[i], newArr[i], i)
    steps.push({ type: 'create', index: i, value: newArr[i] })
    // syncArr.push(newArr[i])
    // console.log(syncArr)
    syncArr[i] = newArr[i]
  }

  // remove all the syncArr beyond this length
  if (syncArr.length > newArr.length) {
    // syncArr.length = newArr.length
    newArr.slice(syncArr.length - 1).forEach((_, i) => {
      steps.push({ type: 'remove', i })
    })
  }

  return [steps, syncArr]
}

// const oldArr = [10, 20, 30, 40]
// const newArr = [30, 10, 40, 20]
// const [steps, syncArr] = reconcile(oldArr, newArr)

// console.log(steps)

// console.log({ syncArr, newArr })

export default reconcile
