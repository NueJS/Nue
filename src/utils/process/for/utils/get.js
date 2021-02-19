export const getKeys = (blob, values) => {
  const { forInfo, comp } = blob
  const { getValue } = forInfo.key
  return values.map((value, index) => getValue(comp.$, getClosure(blob, value, index)))
}

export const getClosure = (blob, value, index) => {
  const { at, as } = blob.forInfo
  return {
    [at]: index,
    [as]: value
  }
}
