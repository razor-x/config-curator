const path = require('path')

const curator = require('../lib')

if (require.main === module) {
  const manifest = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(process.cwd(), 'manifest.js')

  curator(require(manifest)).then(() => {
    console.log('Done')
    process.exit()
  }).catch(err => {
    console.error(err)
    process.exit(1)
  })
}
