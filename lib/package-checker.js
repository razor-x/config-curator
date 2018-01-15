'use strict'

const exec = require('./exec')

const pacman = async (pkgs = []) => {
  try {
    await Promise.all(
      pkgs.map(pkg => exec(`pacman -qQ ${pkg}`))
    )
    return true
  } catch (err) {
    if (/package '.*' was not found/.test(err.message)) return false
    throw err
  }
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
