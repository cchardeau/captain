import * as mongoose from 'mongoose'
import { createHash } from 'crypto'

const userSchema = new mongoose.Schema({
  clientIp: { type: String, required: true, unique: true },
  favoriteId: [{ type: Number }]
})

const User = mongoose.model('User', userSchema)

const userFindOrCreate = async (clientIp: string) => {
  const hashedClientIp = createHash('md5').update(clientIp).digest('hex')

  // search user with current IP in database
  let user = await User.findOne({ clientIp: hashedClientIp })

  // if user does not exist in database, we create it
  if (!user) {
    user = await User.create({ clientIp: hashedClientIp })
  }

  return user
}

export {
  User,
  userFindOrCreate
}