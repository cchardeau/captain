import { Request, Response } from 'express'
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes'

import { userFindOrCreate } from '../../models/user'

const getFavorite = async (req: Request, res: Response) => {
  const { clientIp } = req

  try {
    // search user with current IP in database
    const currentUser = await userFindOrCreate(clientIp)
    return res.status(OK).json({ favoriteId: currentUser['favoriteId'] })
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      error: err.message
    })
  }
}

export default getFavorite
