'use strict'

const os = require('os')

const linux = require('./linux')
const noop = require('./noop')

const types = {
  linux,
  darwin: linux,
  macos: linux,
  noop
}

const getDefaultType = () => {
  if (['Linux', 'Darwin'].includes(os.type())) return 'linux'
  return 'noop'
}

module.exports = (type) => {
  const typeIsNotNil = type != null
  const typeIsCustomObject = typeIsNotNil && typeof type === 'object'
  const typeIsNotSupported = typeIsNotNil && !types.hasOwnProperty(type)

  if (typeIsCustomObject) return type

  if (typeIsNotSupported) {
    throw new Error(`I/O backend ${type} is not supported.`)
  }

  return types[type || getDefaultType()]
}
