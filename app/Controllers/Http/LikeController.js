'use strict'

const Tweet = use('App/Models/Tweet')
const User = use('App/Models/User')
const { validateAll } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tweets
 */
class LikeController {
  async store ({ auth, params, response }) {
    const user = await auth.getUser();
    const tweet = await Tweet.find(params.tweet_id);

    if(!tweet) {
      return response.status(400).json({error: "tweet not found"});
    }

    const alreadyLiked = await Tweet.query()
      .whereHas('likedBy', (builder) => {
        builder
          .where('user_id', '=', user.id)
          .where('tweet_id', '=', tweet.id)
      })
      .fetch()

    if (alreadyLiked.toJSON().length > 0) {
      return response.status(400).json({error: "already liked"});
    }

    await user.likes().attach(tweet.id);

    return response.json("liked");
  }

  /**
   * Delete a tweet with id.
   * DELETE tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ auth, params, response }) {
    return response.json("disliked");
  }
}

module.exports = LikeController
