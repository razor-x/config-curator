'use strict'

const noop = async (pkgs = []) => {
  console.log(`Check for ${pkgs.join(', ')}`)
}

module.exports = () => noop
