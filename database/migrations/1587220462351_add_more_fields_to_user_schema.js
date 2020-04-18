'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddMoreFieldsToUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('photo_url')
      table.string('cover_url')
      table.string('bio', 500)
      table.timestamp('birthday_date')
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddMoreFieldsToUserSchema
