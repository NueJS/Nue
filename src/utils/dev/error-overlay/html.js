import style from './style.js'

const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'

export default /* html */`
<div class='sweet-error__panel'>
  <div class='sweet-error__card'>
    <button class='sweet-error__close-icon'> ${closeIcon} </button>
    <div class='title'> ERROR </div>
    <pre class='message'>  </pre>
    <div class='component-name'>  </div>
    <div class='subtitle'> open console for more information </div>
  </div>
</div>

${style}
`
