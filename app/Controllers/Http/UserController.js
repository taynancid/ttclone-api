'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    const users = await User.query().with('following').with('followers').fetch();

    return response.status(200).json(users);
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const data = request.only(['username', 'email', 'password', 'password_confirmation'])

    const validation = await validateAll(data, {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
      password_confirmation: 'required_if:password|same:password',
    })

    if (validation.fails()) {
      return response.status(401).json({error: 'validation failed'});
    }
    delete data.password_confirmation
    const user = await User.create(data)

    let accessToken = await auth.generate(user)

    return response.json({"user": user, "access_token": accessToken})
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    try {
      const user = await auth.getUser();
      const data = request.only(['username', 'email'])

      if(data.email) {
        const emailExists = !!(await User.findBy('email', data.email));

        if (emailExists) {
          return response.status(401).json({error: 'email already exists'});
        }
      }

      user.merge(data);
      await user.save();

      return response.json({"user": user});

    } catch (error) {
      console.log(error);
      return response.send('Missing or invalid jwt token')
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async follow({auth, params, response}) {
    const user = await auth.getUser();

    try {
      if (user.id == params.id) {
        return response.status(401).json({error: "you cannot follow yourself"});
      }

      const isFollowing = await user.following().where('user_id', params.id).getCount();
      if (isFollowing != 0) {
        return response.status(401).json({error: "you are already following"});
      }

      await user.following().attach(params.id)
      return response.status(200).json("success");
    } catch(e) {
      console.log(e);
      return response.status(401).json({error: "you cannot follow"});
    }



  }
}

module.exports = UserController
