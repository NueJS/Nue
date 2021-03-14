import { PARSED } from '../constants'

/**
 * @param {import('../types').parsedNode} node
 */
const isComp = node => node[PARSED] && node[PARSED].isComp

export default isComp
