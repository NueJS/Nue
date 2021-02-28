import updateStateAttribute from './updateStateAttribute'

// update state of all components
const updateCompsState = (blob, indexes, attributes) => {
  const { comps, nue, getArray, getClosure } = blob
  const arr = getArray()

  indexes.forEach(i => {
    if (comps[i]) {
      attributes.forEach(attribute => {
        updateStateAttribute(nue, comps[i], attribute, getClosure(arr[i], i))
      })
    }
  })
}

export default updateCompsState
