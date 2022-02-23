import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import router from './router'
import { SSRProvider } from './context'

async function loadData(url, context) {
  const routes = router.match(url.replace(/\?.*$/, ''))
  const paths = [] as string[]
  const promises = routes.map((e) => {
    paths.push(e.route.path as string)
    return (e.route.component as any).loadData
      ? (e.route.component as any).loadData({
          ...context,
          params: e.match.params,
        })
      : null
  })
  try {
    const arr = await Promise.all(promises)
    const dict = {} as Record<string, { url: string; data: any }>

    for (const i in arr) {
      dict[paths[i]] = {
        url: url,
        data: arr[i],
      }
    }
    return {
      ...dict,
      initialData: {
        data: {
          username: '小张',
        },
      },
    }
  } catch (e: any) {
   console.log(e)
  }
}

export async function render(url: string, context: any) {
  let data: any = null

  try {
    data = await loadData(url, context)
  } catch (err: any) {
    console.log(err)
    data = {
      username: '小王'
    }
  }
  const html = ReactDOMServer.renderToString(
    <SSRProvider value={data}>
      <StaticRouter location={url} context={context}>
        <App></App>
      </StaticRouter>
    </SSRProvider>,
  )

  return { appHtml: html, propsData: data }
}
