'use strict'

const Helpers = use('Helpers')

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  async show ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`))
  }
}

module.exports = ImageController
