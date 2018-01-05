'use strict'

const { exec } = require('child_process')

module.exports = (cmd = 'echo') => new Promise((resolve, reject) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) return reject(err)
    if (stderr) return reject(stderr)
    resolve(stdout)
  })
})
