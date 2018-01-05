'use strict'

const pacman = async (pkgs = []) => {
  throw new Error('TODO: Not implemented.')
}

const noop = async (pkgs = []) => {
  console.log(`Check for ${pkgs.join(', ')}`)
}

const defaultType = 'noop'

const types = {
  pacman,
  noop
}

module.exports = (type) => {
  const typeIsNotNil = type != null
  const typeIsCustomFunction = typeIsNotNil && typeof type === 'function'
  const typeIsNotSupported = typeIsNotNil && !types.hasOwnProperty(type)

  if (typeIsCustomFunction) return type

  if (typeIsNotSupported) {
    throw new Error(`Package manager ${type} is not supported.`)
  }

  return types[type || defaultType]
}
