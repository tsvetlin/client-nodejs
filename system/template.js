/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 19.
 */

export default ({ body, title, initialState }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>window.__APP_INITIAL_STATE__ = ${initialState}</script>
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/assets/index.css" />
      </head>
      
      <body>
        <header>
            <div>
                <img src="/images/Productive40_Logo.jpg"/>
                <span>Enterprise Cloud Dashboard</span>
            </div>
            <div>
                <img class="aitialogo" src="/images/aitialogo-white.png"/>
            </div>
        </header>
        <div id="root">${body}</div>
      </body>
      
      <script src="/assets/bundle.js"></script>
    </html>
  `
}
