import * as mongoose from 'mongoose'

import config from './config'

export const readyStates = ['disconnected', 'connected', 'connecting', 'disconnecting']

export const start = (): Promise<any> => {
  if (['connecting', 'connected'].includes(readyStates[mongoose.connection.readyState])) {
    throw new Error('[mongo] connection already existing')
  }

  console.info('[mongo] connecting to mongo database ...')

  return new Promise((resolve, reject) => {
    mongoose.connect(config.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useUnifiedTopology: true
    })

    mongoose.connection.on('disconnected', () => console.info('[mongo] disconnected from mongo database'))
    mongoose.connection.on('error', (error) => console.error(`[mongo] ${error}`))

    mongoose.connection.once('error', reject)
    mongoose.connection.once('open', () => {
      // start succeeded no need to reject unnecessarily
      mongoose.connection.removeListener('error', reject)

      console.info('[mongo][in] connected to mongo database')

      resolve(mongoose.connection)
    })
  })
}

export const stop = async (): Promise<any> => {
  if (['disconnecting', 'disconnected'].includes(readyStates[mongoose.connection.readyState])) {
    throw new Error('[mongo] no active connection')
  }

  return new Promise((resolve) => {
    mongoose.connection.once('disconnected', resolve)
    mongoose.connection.close()
  })
}
