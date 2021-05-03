import { showErrorOverlay } from './showErrorOverlay'

export const attachErrorOverlay = () => {

  window.onerror = (message, filename, lineno, colno, error) => {
    showErrorOverlay(/** @type {NueError}*/(error))
  }

}
