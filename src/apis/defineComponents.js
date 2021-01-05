import globalInfo from '../utils/globalInfo'
import DEV from '../utils/dev/DEV'
import callOnlyOnce from '../utils/dev/assert'

const defineComponents = (obj) => {
  if (DEV) callOnlyOnce(defineComponents)
  globalInfo.components = obj
}

export default defineComponents
