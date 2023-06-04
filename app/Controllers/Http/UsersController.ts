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
        response.status(400)
        throw new Error('Dados invalidos, insira nome, email e senha.')
      } else if (sameUser?.email === data.email) {
        response.status(400)
        throw new Error('Esse email já foi cadastrado')
      } else {
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
      }
    } catch (error) {
      return { error: error.message }
    }
  }

  // public async show({}: HttpContextContract) {}

  // public async edit({}: HttpContextContract) {}

  // public async update({}: HttpContextContract) {}

  // public async destroy({}: HttpContextContract) {}
}
