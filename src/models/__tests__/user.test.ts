import * as mongoose from 'mongoose'

import { User, userFindOrCreate } from '../user'

// mock
const ipMock = '192.168.1.1'
const userMock = {
  clientIp: '66efff4c945d3c3b87fc271b47d456db',
  favoriteId: [4, 8, 16, 32, 64]
}

describe('User', () => {

  beforeAll(async () => {
    // @ts-ignore
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('should save an instance', async () => {
    const user = new User(userMock)
    const savedUser = await user.save()

    expect(savedUser['clientIp']).toBe(userMock.clientIp)
    expect(savedUser['favoriteId'].length).toBe(5)
  })

  describe('userFindOrCreate', () => {
    it('should find an user', async () => {
      const user = await userFindOrCreate(ipMock)

      expect(user['clientIp']).toBe(userMock.clientIp)
      expect(user['favoriteId'].length).toBe(5)
    })

    it('should create an user', async () => {
      const user = await userFindOrCreate('192.168.0.1')

      expect(user['clientIp']).toBe('f0fdb4c3f58e3e3f8e77162d893d3055')
      expect(user['favoriteId'].length).toBe(0)
    })
  })
})