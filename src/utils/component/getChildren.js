import { nodeName } from '../string/dashify'

/**
 * returns the map object which contains the name of child components
 * where the key is the nodeName of the child component and
 * value is the compFn name of the child component
 *
 * @param {NueComp[]} compClasses
 */
export const getChildren = (compClasses) => compClasses.reduce(
  /**
   * @param {Record<string, string>} acc
   * @param {NueComp} compClass
   * @returns {Record<string, string>}
   */
  (acc, compClass) => {
    const { name } = compClass
    acc[nodeName(name)] = name
    return acc
  },
  {}
)
