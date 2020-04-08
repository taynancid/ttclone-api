'use strict'

const User = use('App/Models/User')

class SessionController {
  async store ({ auth, request, response, session }) {

    const { email, password } = request.all()

    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        let accessToken = await auth.generate(user)
        return response.json({"user":user, "access_token": accessToken})
      }
    } catch (e) {
      return response.status(401).json({error: 'session failed'})
    }
  }
}

module.exports = SessionController

