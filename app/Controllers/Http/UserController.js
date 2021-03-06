'use strict'

const User = use('App/Models/User')
const Helpers = use('Helpers')
const Drive = use('Drive')
const { validateAll } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {

  async index ({ request, response }) {
    const searchText = request.input('searchText');
    let users = [];

    if (searchText) {
      users = await User.query().where('username', 'like', `%${searchText}%`).with('following').with('followers').fetch();
    } else {
      users = await User.query().with('following').with('followers').fetch();
    }

    return response.status(200).json(users);
  }

  async showUser({ auth, response }) {
    try {
      const user = await auth.getUser();
      return response.json({"user": user});
    } catch (e) {
      console.log(e);
      return response.json("error");
    }

  }


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
    const user = await User.create({
      ...data,
      photo_url: 'avatar-default.jpg',
      cover_url: 'avatar-default.jpg',
    })

    let accessToken = await auth.generate(user)

    return response.json({"user": user, "access_token": accessToken})
  }

  async update ({ auth, params, request, response }) {
    try {
      const user = await auth.getUser();
      const data = request.all();

      if(data.email) {
        const emailExists = !!(await User.findBy('email', data.email));

        if (emailExists) {
          return response.status(401).json({error: 'email already exists'});
        }
      }

      const profilePic = request.file('profile_pic', {
        types: ['image'],
        size: '10mb'
      })

      if (profilePic !== null) {
        const profilePicURL = `${Date.now()}-${profilePic.clientName}`;

        await profilePic.move(Helpers.tmpPath('uploads'),{
          name: profilePicURL,
          overwrite: true
        })

        if (!profilePic.moved()) {
          return profilePic.error()
        }
      }

      const coverPic = request.file('cover_pic', {
        types: ['image'],
        size: '10mb'
      })

      if (coverPic !== null) {
        const coverPicURL = `${Date.now()}-${coverPic.clientName}`;

        await coverPic.move(Helpers.tmpPath('uploads'),{
          name: coverPicURL,
          overwrite: true
        })

        if (!coverPic.moved()) {
          return coverPic.error()
        }
      }

      user.merge({
        ...data,
        photo_url: profilePic !== null ? profilePic.fileName : user.photo_url,
        cover_url: coverPic !== null ? coverPic.fileName : user.cover_url,
      });

      await user.save();

      return response.json({"user": user});

    } catch (error) {
      console.log(error);
      return response.send('Error')
    }
  }

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

  async unfollow({auth, params, response}) {
    const user = await auth.getUser();

    try {
      if (user.id == params.id) {
        return response.status(401).json({error: "you cannot unfollow yourself"});
      }

      const isFollowing = await user.following().where('user_id', params.id).getCount();
      if (isFollowing == 0) {
        return response.status(401).json({error: "you do not follow this user"});
      }

      await user.following().detach(params.id)
      return response.status(200).json("success");
    } catch(e) {
      console.log(e);
      return response.status(401).json({error: "you cannot follow"});
    }
  }
}

module.exports = UserController
