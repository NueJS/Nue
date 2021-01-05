// @TODO - make this css file that can be cached

export default /* html */`
  <style>

  :host {
    position: fixed;
    top: 0;
    left: 0;
    font-family: 'Monolisa', 'Fira Code', 'Dank Mono', consolas, monospace;
    width: 100vw;
    height: 100vh;
  }

  .sweet-error__card {
    background: white;
    border-radius: 5px;
    padding: 30px 20px;
    max-width: 900px;
    margin: 0 auto;
    animation: fade-in 300ms ease;
    position: relative;
    box-shadow: 2px 2px 20px rgba(0,0,0,0.1);
  }

  .sweet-error__close-icon {
    background: red;
    border: none;
    border-radius: 50%;
    width: 40px;
    fill: white;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(40%, -40%);
    animation: spin 3s linear infinite;
  }


  button {
    cursor: pointer;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes spin {
    to {
      transform: translate(40%, -40%) rotate(1turn);
    }
  }

  .sweet-error__panel {
    background: hsl(193, 20%, 62%, 0.5);
    padding: 50px 20px;
    min-height: 100vh;
    margin: 0;
    box-sizing: border-box;
  }

  .title {
    font-size: 24px;
    margin-bottom: 16px;
    color: #e84117;
    font-weight: bold;
  }

  .subtitle {
    font-size: 16px;
    color: #303952;
  }

  .message {
    line-height: 2;
    background: hsl(193, 20%, 92%, 1);
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    white-space: pre-wrap;
    box-shadow: inset 2px 2px 4px rgba(0,0,0,0.1);
    margin: 20px 0 30px 0;
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

</style>
`
