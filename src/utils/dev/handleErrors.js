function handleErrors (e) {
  document.body.innerHTML = /* html */`

  <div class='sweet-error-panel'>
  <div class='sweet-card'>
    <div class='title error'> <span id='emoji'>😰</span> Whoops ! </div>
    <pre class='msg error'> </pre>
    <a href="${e.link}" target='_blank'> Learn More </a>
  </div>

  <div class='sweet-card'>
    <div class='subtitle'> Not Fluent in supersweet ? </div>
  </div>

  </div>

  <style>

  :root {
    --dark-font-color: #334856;
    --error-font-color: #d63031;
    --sweet-light: #5352ed;
    --sweet-dark: #5B5BEE;
  }
  body {
    background:
    repeating-linear-gradient(-45deg, transparent 0 10px, var(--sweet-light) 0 20px),
    repeating-linear-gradient(45deg, var(--sweet-dark) 0 10px, var(--sweet-light) 0 20px);
    padding: 30px;
    min-height: 100vh;
    margin: 0;
    box-sizing: border-box;
  }

  @keyframes boop {
    from {
      transform: rotate(-10deg);
    } to {
      transform: rotate(10deg);
    }
  }

  #emoji {
    animation: boop 2s linear infinite alternate;
    display: inline-block;
  }

  .sweet-card {
    background: #ffffff;
    display: block;
    padding: 30px;
    line-height: 1.5;
    font-family: consolas, monospace;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    margin: 20px;
    border-radius: 5px;
    max-width: 800px;
    margin: 0 auto;
    font-size: 20px;
    position: relative;
    margin-bottom: 20px;
    color: var(--dark-font-color);
  }

  .error {
    color: var(--error-font-color);
  }

  pre {
    white-space: pre-wrap;
  }

  .title {
    font-size: 2rem;
    font-weight: bold;
  }

  .subtitle {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .sweet-card  a {
    color: #d63031;
    display: inline-block;
    text-decoration: none;
    background: #D5DFE6;
    color: #425E70;
    padding: 6px 14px;
    border-radius: 5px;
    transition: all 200ms ease;
    margin-top: 20px;
  }

  a:hover {
    background: #5352ed;
    color: white;
    transform: scale(1.1);
  }

  ::selection {
    background: #5352ed;
    color: white;
  }
  </style>
        `

  const msg = document.querySelector('.sweet-error-panel .msg')
  msg.textContent = e.message
}

export default handleErrors
