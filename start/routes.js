'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.get('users', 'UserController.index')
  Route.post('users', 'UserController.store')
  Route.put('users', 'UserController.update').middleware(['auth'])
  Route.post('follow/:id', 'UserController.follow').middleware(['auth'])

  Route.get('tweets', 'TweetController.index')
  Route.post('tweets', 'TweetController.store').middleware(['auth'])
  Route.delete('tweets/:id', 'TweetController.destroy').middleware(['auth'])

  Route.post('like/:tweet_id', 'LikeController.store').middleware(['auth'])
  Route.delete('like/:tweet_id', 'LikeController.destroy').middleware(['auth'])

  Route.post('login', 'SessionController.store')
}).prefix('api/v1')
