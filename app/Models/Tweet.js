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
    return this.hasMany(
      'App/Models/Tweet',
      'id',
      'replies_to_id'
    );
  }

  repliesTo() {
    return this.belongsTo(
      'App/Models/Tweet',
      'replies_to_id',
      'id'
    );
  }
}

module.exports = Tweet
