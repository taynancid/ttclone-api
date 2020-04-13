'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRepliesToToTweetSchema extends Schema {
  up () {
    this.table('tweets', (table) => {
      table.integer('replies_to_id')
    })
  }

  down () {
    this.table('tweets', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddRepliesToToTweetSchema
