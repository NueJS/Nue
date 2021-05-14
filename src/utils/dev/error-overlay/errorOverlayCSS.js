const cardBg = '#222831'
const codeBg = '#333C49'
const overlay = 'rgba(51, 60, 73, 0.5)'
const fontColor = '#dddddd'
const fontColor2 = '#f05454'

export const errorOverlayCSS = /* css */`

.panel {
  background: ${overlay};
  backdrop-filter: blur(5px);
  min-height: 100vh;
  margin: 0;
  box-sizing: border-box;
}

:host {
  position: fixed;
  top: 0;
  left: 0;
  font-family: monospace;
  width: 100vw;
  height: 100vh;
  color: rgba(209, 213, 219);
}

:host * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.code {
  background: ${codeBg};
  padding: 20px;
  color: ${fontColor};
  font-size: 16px;
  border-radius: 5px;
  line-height: 1.5;
  overflow-x: auto;
}

.code span.error {
  color: ${fontColor2};
  display: inline-block;
  background: ${cardBg};
  padding: 0.1em 0.3em;
  border-radius: 5px;
  margin: 0 0.2em;
}

.code div {
  border-radius: 5px;
  padding: 0.2em 0.5em;
}

.code div:hover {
  background: rgba(255, 255, 255, 0.1);
}

.code div.has-error {
  background: rgba(255, 255, 255, 0.1);
}

.card {
  background: ${cardBg};
  border-radius: 5px;
  padding: 30px;
  max-width: 850px;
  width: calc(100% - 40px);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 auto;
  animation: fade-in 300ms ease;
  position: relative;
  box-shadow: 2px 2px 20px rgba(0,0,0,0.1);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* width */
.card::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.card::-webkit-scrollbar-track {
  background: ${cardBg};
}

/* Handle */
.card::-webkit-scrollbar-thumb {
  background: ${codeBg};
}

.close-icon {
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

.close-icon svg {
  fill: ${fontColor2};
}

.code-container {
  position: relative;
}

.code-switcher {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  font-size: 14px;
  color: ${fontColor};
  background: ${cardBg};
  border: none;
  border-radius: 5px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: ${fontColor2};
}

.console {
  color: ${fontColor2};
  font-size: 16px;
  margin-top: 20px;
}

.message {
  line-height: 1.5;
  font-size: 16px;
  border-radius: 5px;
  white-space: pre-wrap;
  color: ${fontColor};
  margin: 20px 0;
}

`
