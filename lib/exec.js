import { exec } from 'child_process'

export default (cmd = 'echo') =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(err)
      if (stderr) return reject(stderr)
      resolve(stdout)
    })
  })
