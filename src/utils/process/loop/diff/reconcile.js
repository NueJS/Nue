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

  const newHash = getHashTable(newState.keys)
  const oldHash = getHashTable(oldState.keys)

  console.log(newHash, oldHash)

  // remove, removed values
  // if the hash is not present in newHash
  for (let i = 0; i < oldState.keys.length; i++) {
    if (newHash[oldState.keys[i]] === undefined) {
      steps.push({ type: 'remove', index: i })
      oldState.keys.splice(i, 1)
      oldState.value.splice(i, 1)
      i--
    }
  }

  // insert, new values in newState.keys to arr at its position
  for (let i = 0; i < newState.keys.length; i++) {
    const hash = newState.keys[i]
    if (oldHash[hash] === undefined) {
      steps.push({ type: 'create', index: i, value: newState.value[i] })
      insert(oldState.keys, i, hash)
      insert(oldState.value, i, newState.value[i])
    }
  }

  // swap, swapped values in newState.keys in arr
  for (let i = 0; i < oldState.keys.length; i++) {
    if (oldState.keys[i] !== newState.keys[i]) {
      // find where its position in new oldState.keys
      const iShouldBe = newHash[oldState.keys[i]]
      steps.push({ type: 'swap', indexes: [i, iShouldBe] })
      swap(oldState.keys, i, iShouldBe)
      swap(oldState.value, i, iShouldBe)
      i-- // keep checking the index i until we find the value which belongs to this index
    }
  }

  return steps
}

export default reconcile
