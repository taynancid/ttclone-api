'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddNameFieldUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('name')
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddNameFieldUserSchema
