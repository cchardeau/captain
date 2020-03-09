import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as requestIp from 'request-ip'
import { Request, Response } from 'express'

import * as mongo from './database'

import addFavorite from './routes/favorite/add'
import getFavorite from './routes/favorite/get'

const app = express()

const port = process.env.PORT || 3000

// app configuration
app.use(cors())
app.use(requestIp.mw())
app.use(bodyParser.json())
app.disable('x-powered-by')

// router
app.post('/favorite', addFavorite)
app.get('/favorite', getFavorite)

// default route
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// launch app
app.listen(port, () => {
  // db connection
  mongo.start().then(() => {
    console.log(`[captain] app is listening on port ${port}`)
  })
})