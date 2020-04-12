'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepliesSchema extends Schema {
  up () {
    this.create('replies', (table) => {
      table.increments()
      table.integer('tweet_id').unsigned().notNullable()
      table.integer('reply_id').unsigned().notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('replies')
  }
}

module.exports = RepliesSchema
