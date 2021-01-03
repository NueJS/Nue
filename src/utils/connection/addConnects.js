// setup connects and disconnects array
// connectFn is function which connects the given node
export function addConnects (node, connectFn) {
  const { sweet } = node
  if (!sweet.connects) sweet.connects = []
  if (!sweet.disconnects) sweet.disconnects = []
  sweet.connects.push(connectFn)
}
