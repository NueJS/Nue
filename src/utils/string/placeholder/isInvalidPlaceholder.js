// in not a valid placeholder, turn it into string
const isInvalidPlaceholder = (comp, getValue) => {
  let value
  try { value = getValue.call(comp) } catch { /**/ }
  return value === undefined
}

export default isInvalidPlaceholder
