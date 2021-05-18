import { ITSELF } from '../constants'

export const createSubTree = () => ({ [ITSELF]: new Set() })
