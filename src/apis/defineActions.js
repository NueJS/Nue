import globalInfo from '../utils/globalInfo'
import DEV from '../utils/dev/DEV'
import callOnlyOnce from '../utils/dev/assert'

const defineActions = (obj) => {
  if (DEV) callOnlyOnce(defineActions)
  globalInfo.actions = obj
}

export default defineActions
