if (typeof window === 'undefined') {
  console.log('msw :: server')
  const { server } = require('./server')
  server.listen()
} else {
  console.log('msw :: browser')
  const { worker } = require('./browser')
  worker.start()
}