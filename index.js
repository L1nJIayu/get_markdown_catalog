require('./utils').getCatalogFile({
  targetPath: 'E:\\BaiduSyncdisk\\学习笔记',
  extname: ['.md', '.txt'],
  outputFileName: '目录.md',
  showExtname: true,
  ignoreDirectoryPattern: /\.assets$/
})

