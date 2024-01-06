const fs = require('fs')
const path = require('path')


function getCatalog (options) {
  let {
    dirPath,
    catalog,
    extname
  } = options

  if(typeof catalog === 'undefined') {
    catalog = {
      dirname: '目录',
      mdFiles: [],
      children: []
    }
  }

  if(typeof dirPath === 'undefined') {
    dirPath = __dirname
  }

  try {
    const direntList = fs.readdirSync(dirPath, { withFileTypes: true })

    direntList.forEach(dirent => {

      if(dirent.isDirectory()) {
        const newCatalog = {
          dirname: dirent.name,
          mdFiles: [],
          children: []
        }
        catalog.children.push(newCatalog)
        getCatalog({
          dirPath: path.join(dirPath, dirent.name),
          catalog: newCatalog,
          extname
        })
      } else if (path.extname(dirent.name) === `.${extname}`) {
        catalog.mdFiles.push(path.join(dirPath, dirent.name))
      }


    })

    return catalog


  } catch (err) {
    console.error(err)
  }
}


function getCatalogFileContent (catalog, content, indentNum) {

  if(typeof content === 'undefined') {
    content = ''
  }
  if(typeof indentNum === 'undefined') {
    indentNum = 0
  }
  
  if(catalog.dirname === '目录') {
    content = `# ${catalog.dirname}`
  } else {

    content = `\n${getNBSP(indentNum)}- *${catalog.dirname}*`
  }

  if(catalog.children instanceof Array && catalog.children.length > 0) {

    catalog.children.forEach(catalogItem => {
      content += getCatalogFileContent(catalogItem, content, indentNum + 1)
    })
  }

  catalog.mdFiles.forEach(fileFullName => {
    const fileBaseName = path.basename(fileFullName, '.md')
    if(fileBaseName !== '目录') {
      content += `\n${getNBSP(indentNum + 1)}- [${fileBaseName}](${fileFullName})`
    }
  })
  

  return content
}

function getCatalogFile (options) {

  const {
    targetPath,
    extname = 'md'
  } = options

  const catalog = getCatalog({
    dirPath: targetPath,
    extname
  })

  const content = getCatalogFileContent(catalog)

  fs.writeFileSync('目录.md', content)

}


function getNBSP(num) {
  let result = ''
  while(num > 0) {
    result += '  '
    num--
  }
  return result
}

module.exports = {
  getCatalog,
  getCatalogFileContent,
  getCatalogFile
}