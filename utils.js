const fs = require('fs')
const path = require('path')


function getCatalog (options) {
  let {
    dirPath,
    catalog,
    extname = ['.md'],
    ignoreDirectoryPattern,
    ignoreFilePattern
  } = options

  if(typeof catalog === 'undefined') {
    catalog = {
      dirname: '目录',
      files: [],
      children: []
    }
  }

  if(typeof dirPath === 'undefined') {
    dirPath = __dirname
  }

  try {
    const direntList = fs.readdirSync(dirPath, { withFileTypes: true })

    direntList.forEach(dirent => {
      console.log(
        extname,
        path.extname(dirent.name)
      )
      if(dirent.isDirectory() && !(ignoreDirectoryPattern && ignoreDirectoryPattern.test(dirent.name))) {
        const newCatalog = {
          dirname: dirent.name,
          files: [],
          children: []
        }
        catalog.children.push(newCatalog)
        getCatalog({
          dirPath: path.join(dirPath, dirent.name),
          catalog: newCatalog,
          ignoreDirectoryPattern,
          ignoreFilePattern,
          extname
        })
      } else if (extname.includes(path.extname(dirent.name)) && !(ignoreFilePattern && ignoreFilePattern.test(dirent.name))) {
        catalog.files.push(path.join(dirPath, dirent.name))
      }


    })

    return catalog


  } catch (err) {
    console.error(err)
  }
}


function getCatalogFileContent (options) {
  let {
    catalog,
    content = '',
    indentNum = 0,
    showExtname = true
  } = options

  
  if(catalog.dirname === '目录') {
    content = `# ${catalog.dirname}`
  } else {

    content = `\n${getNBSP(indentNum)}- 📂*${catalog.dirname}*`
  }

  if(catalog.children instanceof Array && catalog.children.length > 0) {

    catalog.children.forEach(catalogItem => {
      content += getCatalogFileContent({
        catalog: catalogItem,
        content,
        indentNum: indentNum + 1,
        showExtname
      })
    })
  }

  catalog.files.forEach(fileFullName => {

    const fileBaseName = showExtname ? path.basename(fileFullName) : path.basename(fileFullName, path.extname(fileFullName))

    if(fileBaseName !== '目录') {
      content += `\n${getNBSP(indentNum + 1)}- 📋[${fileBaseName}](${fileFullName})`
    }
  })
  

  return content
}

function getCatalogFile (options) {

  const {
    targetPath,
    extname = ['.md'],
    outputFileName = '目录.md',
    showExtname = true,
    ignoreDirectoryPattern,
    ignoreFilePattern
  } = options

  if(typeof targetPath === 'undefined') {
    throw new Error('配置项【targetPath】不能为空')
  }

  const catalog = getCatalog({
    dirPath: targetPath,
    extname,
    ignoreDirectoryPattern,
    ignoreFilePattern
  })

  const content = getCatalogFileContent({
    catalog,
    showExtname
  })

  fs.writeFileSync(outputFileName, content)

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
  getCatalogFile
}