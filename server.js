const Koa = require('koa')
const path = require('path')
const views = require('koa-nunjucks-next')
const Router = require('koa-router')
const convert = require('koa-convert')
const serveStatic = require('koa-better-static')

// initialize the app
const app = new Koa()

app.use(convert(serveStatic(path.resolve(__dirname, 'dist'), {
  maxage: 86400000
})))

app.use(views(path.resolve(__dirname, 'dist'), {
  minify: {
    minifyJS: true,
    minifyCSS: true,
    preserveLineBreaks: true,
    conservativeCollapse: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    quoteCharacter: '"'
  },
  autoescape: true,
  globals: {
    env: process.env.NODE_ENV
  }
}))

const router = new Router()

router.get('*', async (ctx, next) => {
  await ctx.render('index')
})


app.use(router.routes())

const io = require('socket.io')(app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on http://localhost:' + process.env.PORT);
}))

io.on('connection', function (socket) {
  socket.emit('data', { message: 'welcome to the chat' })

  socket.on('setTick', function (data) {
    console.log('setTick', data)
    io.sockets.emit('updateTick', data)
  })

  socket.on('setupGame', function (data) {
    console.log('setupGame', data)
    io.sockets.emit('setupGame', data)
  })
})
