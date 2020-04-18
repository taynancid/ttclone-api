'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get hidden () {
    return ['password']
  }

  static get visible() {
    return ['id', 'username', 'email', 'birthday_date', 'bio', 'photo_url', 'cover_url']
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  followers() {
    return this.belongsToMany(
      'App/Models/User',
      'user_id',
      'follower_id'
    ).pivotTable('followers')
  }

  following() {
    return this.belongsToMany(
      'App/Models/User',
      'follower_id',
      'user_id'
    ).pivotTable('followers')
  }

  likes() {
    return this.belongsToMany(
      'App/Models/Tweet',
      'user_id',
      'tweet_id'
    ).pivotTable('likes')
  }

  tweets() {
    return this.hasMany('App/Models/Tweet');
  }
}

module.exports = User
