const path = require('path')
const os = require('os')

const curator = require('../lib')

if (require.main === module) {
  const manifest = require(path.resolve(process.cwd(), 'manifest.js'))

  curator(
    manifest({hostname: os.hostname()})
  ).then(() => {
    console.log('Done')
  }).catch(err => {
    console.error('Fail: ', err)
    process.exit(1)
  })
}
