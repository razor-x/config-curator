'use strict'

const noop = async (pkgs = []) => {
  console.log(`Check for ${pkgs.join(', ')}`)
}

// TODO: Detect or select package manager.
module.exports = (type = 'noop') => {
  return noop
}
