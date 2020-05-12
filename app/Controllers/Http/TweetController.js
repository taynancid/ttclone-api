'use strict'

const Tweet = use('App/Models/Tweet')
const { validateAll } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tweets
 */
class TweetController {
  /**
   * Show a list of all tweets.
   * GET tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    const tweets = await Tweet.query()
      .with('user')
      .with('replies')
      .with('repliesTo')
      .with('likedBy')
      .orderBy('created_at', 'desc').fetch();

    return response.status(200).json(tweets);
  }

  /**
   * Render a form to be used for creating a new tweet.
   * GET tweets/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async store ({ auth, request, response }) {
    const data = request.only(['text'])
    const user = await auth.getUser()

    const validation = await validateAll(data, {
      text: 'required|max:280',
    });

    if (validation.fails()) {
      return response.status(401).json({error: 'validation failed'});
    }

    const tweet = await user.tweets().create({text: data.text});

    return response.json(tweet);
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
    try {
      const user = await auth.getUser();
      const tweetId = await params.id;

      const hasTweet = await Tweet.query().where(function() {
        this
        .where('user_id', user.id)
        .where('id', tweetId)
      }).getCount();

      if (hasTweet == 0) {
        return response.status(401).json({error: 'you dont have permission to delete this tweet'});
      }

      const tweet = await Tweet.find(tweetId);

      await tweet.delete()

      return response.status(200).json("deleted")
    } catch (e) {
      return response.status(400).json({error: 'an error occurred'});
    }
  }
}

module.exports = TweetController
