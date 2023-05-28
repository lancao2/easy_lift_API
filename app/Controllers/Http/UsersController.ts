import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class UsersController {
  // public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password', 'picture'])
    const sameUser = await User.findBy('email', data.email)
    try {
      if (!data.email || !data.password || !data.name) {
        return response
          .status(400)
          .json({ message: 'invalid data, you need to provide, name, email and password' })
      }
      if (sameUser) {
        return response.status(400).json({ message: 'this user already exists' })
      }
      const user = new User()
      user.id = uuidv4()
      user.createdAt = DateTime.local()
      user.updatedAt = DateTime.local()
      const hashedPassword = await Hash.make(data.password)
      console.log(hashedPassword)
      user.password = hashedPassword

      user.fill(data)
      user.save()
      User.create(user)

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      }
    } catch (error) {
      return { error: error }
    }
  }

  // public async show({}: HttpContextContract) {}

  // public async edit({}: HttpContextContract) {}

  // public async update({}: HttpContextContract) {}

  // public async destroy({}: HttpContextContract) {}
}
