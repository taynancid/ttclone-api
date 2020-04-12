'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tweet extends Model {
  user() {
    return this.belongsTo('App/Models/User')
  }

  likedBy() {
    return this.belongsToMany(
      'App/Models/User',
      'tweet_id',
      'user_id'
    ).pivotTable('likes')
  }

  replies() {
    return this.belongsToMany(
      'App/Models/Tweet',
      'tweet_id',
      'reply_id'
    ).pivotTable('replies');
  }

  repliesTo() {
    return this.belongsToMany(
      'App/Models/Tweet',
      'reply_id',
      'tweet_id'
    ).pivotTable('replies');
  }
}

module.exports = Tweet
