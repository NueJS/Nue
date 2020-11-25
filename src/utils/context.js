function addContextDependency (node, usage) {
  if (!node.mapArrayUsage) node.mapArrayUsage = []
  node.mapArrayUsage.push(usage)
}
export default addContextDependency
