const cardBg = '#111827'
const overlay = 'rgba(17,24,39, 0.8)'
const fontColor = '#E5E7EB'
const fontColor2 = '#6B7280'

export const errorOverlayCSS = /* css */`
:host {
  position: fixed;
  top: 0;
  left: 0;
  font-family: 'MonoLisa', consolas, monospace;
  width: 100vw;
  height: 100vh;
  color: rgba(209, 213, 219);
}

.parsed-error__card {
  background: ${cardBg};
  border-radius: 5px;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  animation: fade-in 300ms ease;
  position: relative;
  box-shadow: 2px 2px 20px rgba(0,0,0,0.1);
}


@keyframes pop-out {
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}

.parsed-error__close-icon {
  background: none;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.parsed-error__close-icon svg {
  fill: ${fontColor2};
}

.parsed-error__panel {
  background: ${overlay};
  padding: 50px 20px;
  min-height: 100vh;
  margin: 0;
  box-sizing: border-box;
}

.title {
  font-size: 30px;
  margin-bottom: 20px;
  color: ${fontColor2};
}

.subtitle {
  color: ${fontColor2};
}

.message {
  line-height: 1.6;
  font-size: 16px;
  border-radius: 5px;
  white-space: pre-wrap;
  margin: 20px 0 30px 0;
  color: ${fontColor}
}

.minimize {
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  z-index: 100;
  padding: 5px 10px;
  border-radius: 4px;
}
`
