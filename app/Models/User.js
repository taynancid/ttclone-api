'use strict'

const Model = use('Model')
const Hash = use('Hash')
const Env = use('Env')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get hidden() {
    return ['password']
  }

  static get computed() {
    return ['avatar_url', 'full_cover_url']
  }

  static get visible() {
    return ['id', 'username', 'email', 'birthday_date', 'bio', 'full_cover_url', 'avatar_url', 'name', 'created_at']
  }

  getAvatarUrl({photo_url}) {
    return `${Env.get('APP_URL')}/images/${photo_url}`
  }

  getFullCoverUrl({cover_url}) {
    return `${Env.get('APP_URL')}/images/${cover_url}`
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
