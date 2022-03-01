import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
// import { router } from './routes/router.js'

import { createServer } from 'node:http'
import { Server } from 'socket.io'

try {
  const app = express()

  const httpServer = createServer(app)
  const io = new Server(httpServer)

  io.on('connection', (socket) => {
    console.log('socket.io: a user connected')

    socket.on('disconnect', () => {
      console.log('socket.io: a user disconnected')
    })
  })

  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  const baseURL = process.env.BASE_URL || '/'

  app.use(helmet())
  app.use(logger('dev'))

  // View engine set up.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))

  app.use(express.urlencoded({ extended: false }))

  app.use(express.json())

  app.use(express.static(join(directoryFullName, '..', 'public')))

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }

  // Middleware
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL

    res.io = io
    next()
  })

  // app.use('/', router)

  app.use(function (err, req, res, next) {
    if (req.originalUrl.includes('/webhooks')) {
      return res
        .status(err.status || 500)
        .end(err.message)
    }
    // Sends a Not found page.
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }

    // 500 Internal Server Error, all other send this response in production.
    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }

    // Development
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
