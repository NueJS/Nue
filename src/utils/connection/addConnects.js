// setup connects and disconnects array
// connectFn is function which connects the given node
export function addConnects (node, connectFn) {
  const { parsed } = node
  if (!parsed.connects) parsed.connects = []
  if (!parsed.disconnects) parsed.disconnects = []
  parsed.connects.push(connectFn)
}
