const Koa = require('koa')

// initialize the app
const app = new Koa()

const io = require('socket.io')(app.listen(3000))

io.on('connection', function (socket) {
  socket.emit('data', { message: 'welcome to the chat' })

  socket.on('setTick', function (data) {
    io.sockets.emit('updateTick', data)
  })
})
