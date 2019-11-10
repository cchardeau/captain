import { Request, Response } from 'express'
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes'

import { userFindOrCreate } from '../../models/user'

const addFavorite = async (req: Request, res: Response) => {
  const { body: { favoriteId }, clientIp } = req

  try {
    if (!favoriteId || isNaN(favoriteId)) {
      throw new Error('invalid favoriteId')
    }

    // get current user in database
    const currentUser = await userFindOrCreate(clientIp)

    if (currentUser['favoriteId'].includes(favoriteId)) {
      // remove current favoriteId from the current user
      await currentUser.update({ $pull: { favoriteId } })
    } else {
      // add favoriteId to the current user
      await currentUser.update({ $addToSet: { favoriteId } })
    }

    return res.status(OK).json({ favoriteId: currentUser['favoriteId'] })
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      err: err.message
    })
  }
}

export default addFavorite
