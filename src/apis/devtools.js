/**
 * @type {{ nodeUpdated: (node: import("../utils/types").parsedNode) => void, onNodeUpdate: Function | undefined }}
 */

const devtools = {
  nodeUpdated: (node) => {
    if (devtools.onNodeUpdate) {
      devtools.onNodeUpdate(node)
    }
  },
  onNodeUpdate: undefined
}

export default devtools
