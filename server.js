const http = require('http')
const path = require('path')
const createViteHandle = require('./vite-handle')


const port = +process.env.PORT || 3000
const resolve = (p) => path.resolve(__dirname, p)

createViteHandle({
    index:  resolve('index.html'),
    dist: resolve('dist'),
}).then(handle => {
    const app = http.createServer((req, res) => {
      handle(req, res) 
    })

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
})
