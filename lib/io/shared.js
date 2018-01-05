'use strict'

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const fsAccessAsync = promisify(fs.access)

const checkAccess = async ({target}) => (
  fsAccessAsync(path.resolve(target), fs.constants.R_OK)
)

module.exports = {
  checkAccess
}
