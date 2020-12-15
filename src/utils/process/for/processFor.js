import sweetify from '../../node/sweetify.js'
import traverse from '../../node/traverse.js'
import addDep from '../../state/addDep.js'
import processNode from '../processNode.js'
import slice from '../../state/slice.js'

function processFor (forNode) {
  const forNodes = []
  const groups = []

  let $each, $of, $at, $hash

  forNode.sweet.attributes.forEach(attribute => {
    if (attribute.name === 'each') $each = attribute.placeholder
    else if (attribute.name === 'of') $of = attribute.placeholder
    else if (attribute.name === '#') $hash = attribute.placeholder
    else if (attribute.name === 'at') $at = attribute.placeholder
  })

  // collect all the forNodes inside the for node and mark them processed
  forNode.childNodes.forEach(node => {
    if (node.sweet) node.sweet.isProcessed = true
    forNodes.push(node)
  })

  const renderLoop = () => {
    // get the value of array
    const array = $of.getValue.call(this, forNode)

    // loop over array and get the value and indexes
    array.forEach((value, i) => {
      const context = {
        [$each.content]: value,
        [$at.content]: i
      }

      const group = {
        // get the value of #=[] on forNode
        hash: slice(context, $hash.path),
        deps: []
      }

      group.nodes = forNodes.map(node => {
        const cloneNode = node.cloneNode(true)
        sweetify(node, cloneNode)
        if (cloneNode.sweet) cloneNode.sweet.isProcessed = false

        // pass the context to all child forNodes
        traverse(cloneNode, (childNode) => {
          if (childNode.sweet) {
            childNode.sweet.context = context
            childNode.sweet.addDeps = fn => group.deps.push(fn)
          }
        })

        // then process
        processNode.call(this, cloneNode)

        this.delayedProcesses.push(() => {
          forNode.before(cloneNode)
        })

        return cloneNode
      })

      groups.push(group)
    })
  }

  renderLoop()
  console.log(groups)

  // when array changes, update

  console.log({ path: $of.path })

  const onArrayChange = () => {
    console.log('array changed')
  }

  addDep.call(this, $of.path, onArrayChange, 'dom')

  this.delayedProcesses.push(() => {
    forNode.remove()
  })
}

export default processFor
