import jwt from 'jsonwebtoken'
import prisma from './prisma'

export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // const { TRAX_ACCESS_TOKEN: token } = req.cookie
    const token = req.cookie.TRAX_ACCESS_TOKEN

    if (token) {
      let user

      try {
        const { id } = jwt.verify(token, 'hello')
        user = await prisma.user.findUnique({
          where: { id },
        })

        if (!user) {
          throw new Error('Not real user')
        }
      } catch (err) {
        res.status(401)
        res.json({ error: 'Not Authorized' })
        return
      }

      return hander(req, res, user)
    }

    res.status(401)
    res.json({ error: 'Not Authorized' })
  }
}
