export const errorOverlayCSS = /* css */`

:host {
    /* colors */
  --cardBg: hsl(215deg, 15%, 22%);
  --codeBg: hsl(215deg, 15%, 28%);
  --highlight: hsl(215deg, 15%, 38%);
  --highlightWord: #738397;
  --hoverHighlight: #4d5968;
  --overlay: hsla(0deg, 0%, 90%, 50%);
  --primaryColor: #d2dae2;
  --secondColor: #d2dae2;
}

::selection {
  background: var(--highlightWord);
  color: white;
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

.panel {
  background: var(--overlay);
  min-height: 100vh;
  margin: 0;
  box-sizing: border-box;
}

.code {
  background: var(--codeBg);
  padding: 20px;
  color: var(--primaryColor);
  font-size: 16px;
  border-radius: 5px;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 40vh;
}

.code span.error {
  color: white;
  display: inline-block;
  background: var(--highlightWord);
  padding: 0.1em 0.3em;
  border-radius: 5px;
  margin: 0 0.2em;
}

.code span.error:focus {
  outline: none;
}

.code div {
  border-radius: 5px;
  margin-bottom: 0.2em;
}

.code div:hover {
  background: var(--hoverHighlight);
}

.code div.has-error {
  background: var(--highlight);
}

.card {
  background: var(--cardBg);
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
  box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
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
  background: var(--cardBg);
}

/* Handle */
.card::-webkit-scrollbar-thumb {
  background: var(--codeBg);
}

/* width */
.code::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.code::-webkit-scrollbar-track {
  background: var(--codeBg);
}

/* Handle */
.code::-webkit-scrollbar-thumb {
  background: var(--highlight);
  border-radius: 5px;
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
  fill: var(--secondColor);
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
  color: var(--primaryColor);
  background: var(--cardBg);
  border: none;
  border-radius: 5px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 700;
  color: var(--secondColor);
}

.console {
  color: var(--secondColor);
  font-size: 16px;
  margin-top: 20px;
}

.message {
  line-height: 1.5;
  font-size: 16px;
  border-radius: 5px;
  white-space: pre-wrap;
  color: var(--primaryColor);
  margin: 20px 0;
}

`
