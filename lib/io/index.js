'use strict'

const noop = require('./noop')

// TODO: Detect or select package manager.
module.exports = (type = 'noop') => {
  return noop
}
