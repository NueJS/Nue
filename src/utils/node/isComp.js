import { PARSED } from '../constants'

const isComp = node => node[PARSED] && node[PARSED].isComp

export default isComp
