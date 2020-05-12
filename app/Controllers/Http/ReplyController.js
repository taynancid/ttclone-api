'use strict'

const Tweet = use('App/Models/Tweet')
const { validateAll } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with replies
 */
class ReplyController {

  async index ({ params, response, auth }) {
    const tweetId = await params.tweet_id;
    const user = await auth.getUser();

    const tweetExists = await Tweet.find(tweetId)

    if (!tweetExists) {
      return response.status(400).json({error: 'tweet doesnt exists'});
    }

    const tweetReplies = await tweetExists.replies().with('user').fetch();

    return response.json(tweetReplies);


  }

  /**
   * Render a form to be used for creating a new reply.
   * GET replies/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new reply.
   * POST replies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const data = await request.only(['text', 'tweet_id'])
    const user = await auth.getUser()

    const validation = await validateAll(data, {
      text: 'required|max:280',
      tweet_id: 'required',
    });

    const tweetExists = await Tweet.find(data.tweet_id)

    if (!tweetExists) {
      return response.status(400).json({error: 'tweet doesnt exists'});
    }

    if (validation.fails()) {
      return response.status(401).json({error: 'validation failed'});
    }

    const tweet = await user.tweets().create({text: data.text, replies_to_id: data.tweet_id});

    return response.json(tweet);
  }

  /**
   * Display a single reply.
   * GET replies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing reply.
   * GET replies/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update reply details.
   * PUT or PATCH replies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a reply with id.
   * DELETE replies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ReplyController
