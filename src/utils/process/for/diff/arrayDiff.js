import deepEqual from '../../../deepEqual'

const arrayDiff = (arr1, arr2) => {
  const indexes = []
  for (let i = 0; i < arr1.length; i++) {
    const isEqual = deepEqual(arr1[i], arr2[i])
    if (!isEqual) {
      console.log('updated state at : ', i)
      indexes.push(i)
    }
  }

  return indexes
}

export default arrayDiff
