import { insert, swap } from '../../../others'

const getHashTable = (hashArray) => {
  const hash = {}
  hashArray.forEach((h, i) => {
    hash[h] = i
  })
  return hash
}

function reconcile (oldState, newState) {
  const steps = []

  const newHash = getHashTable(newState.hash)
  const oldHash = getHashTable(oldState.hash)

  console.log(newHash, oldHash)

  // remove, removed values
  // if the hash is not present in newHash
  for (let i = 0; i < oldState.hash.length; i++) {
    if (newHash[oldState.hash[i]] === undefined) {
      steps.push({ type: 'remove', index: i })
      oldState.hash.splice(i, 1)
      oldState.value.splice(i, 1)
      i--
    }
  }

  // insert, new values in newState.hash to arr at its position
  for (let i = 0; i < newState.hash.length; i++) {
    const hash = newState.hash[i]
    if (oldHash[hash] === undefined) {
      steps.push({ type: 'create', index: i, value: newState.value[i] })
      insert(oldState.hash, i, hash)
      insert(oldState.value, i, newState.value[i])
    }
  }

  // swap, swapped values in newState.hash in arr
  for (let i = 0; i < oldState.hash.length; i++) {
    if (oldState.hash[i] !== newState.hash[i]) {
      // find where its position in new oldState.hash
      const iShouldBe = newHash[oldState.hash[i]]
      steps.push({ type: 'swap', indexes: [i, iShouldBe] })
      swap(oldState.hash, i, iShouldBe)
      swap(oldState.value, i, iShouldBe)
      i-- // keep checking the index i until we find the value which belongs to this index
    }
  }

  return steps
}

export default reconcile
