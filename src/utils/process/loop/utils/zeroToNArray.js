/**
 * create an array of given size which consists value same as index it is on
 * @param {number} length - length of array
 * @returns {Array<number>}
 */
const zeroToNArray = (length) => {
  const arr = []
  for (let i = 0; i < length; i++) arr.push(i)
  return arr
}

export default zeroToNArray
