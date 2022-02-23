// @ts-check
const fs = require('fs')
const path = require('path')
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
const { Helmet } = require('react-helmet')
function queryStringToObject(query) {
  const result = query.match(/\?(.*)/)
  if (!result) return {}
  return Object.fromEntries(new URLSearchParams(result[1]))
}

async function createViteHandle({
  root = process.cwd(),
  index,
}) {

  const indexHTML = fs.readFileSync(index, 'utf-8')
  let  vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
      },
    })
 

  return async (req, res) => {
      vite.middlewares(req, res, () => {
        handleRender(req, res, {
          template: indexHTML,
          vite,
        })
      })
   
  }
}

async function handleRender(req, res, { template, vite}) {
  try {
    const url = req.url

    
      template = await vite.transformIndexHtml(url, template)
    let  render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    

    const context = {
      isSSR: true,
      query: req.query || queryStringToObject(req.url),
      url: req.originalUrl,
      req,
    }

    const { appHtml, propsData } = await render(url, context)


    const ssrDataText = JSON.stringify(propsData).replace(/\//g, '\\/')
    const helmet = Helmet.renderStatic()
    const html = template
      .replace(
        '<!--init-props-->',
        `<script id="ssr-data" type="text/json">${ssrDataText}</script>`,
      )
      .replace(`<!--app-html-->`, appHtml)
      .replace(
        `<!--init-header-->`,
        `${helmet.meta.toString()}${helmet.title.toString()}${helmet.script.toString()}`,
      )

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; utf-8')
    res.end(html)
  } catch (err) {
   console.log(err)
  }
}

module.exports = createViteHandle
