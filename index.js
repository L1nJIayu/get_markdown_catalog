const path = require('path')
const { getCatalogFile } = require('./utils')


getCatalogFile({
  targetPath: path.join(__dirname, './markdown'),
  extname: 'md'
})

