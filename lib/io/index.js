'use strict'

const linux = require('./linux')
const noop = require('./noop')

const defaultType = 'noop'

const types = {
  linux,
  noop
}

module.exports = (type) => {
  const typeIsNotNil = type != null
  const typeIsCustomObject = typeIsNotNil && typeof type === 'object'
  const typeIsNotSupported = typeIsNotNil && !types.hasOwnProperty(type)

  if (typeIsCustomObject) return type

  if (typeIsNotSupported) {
    throw new Error(`I/O backend ${type} is not supported.`)
  }

  return types[type || defaultType]
}
