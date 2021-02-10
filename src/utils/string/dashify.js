const dashify = (name) => {
  if (name.includes('-')) return name.toLowerCase()
  return name.toLowerCase() + '-'
}
export default dashify
