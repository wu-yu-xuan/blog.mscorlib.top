const path = require('path');
const paths = require('../config/paths');
const fs = require('fs-extra');
const ctypto = require('crypto');


/**
 * @typedef {Object} IMarkdown
 * @property {number} birthTime 创建时间
 * @property {number} modifyTime 修改时间
 * @property {string} title 名称
 * @property {string} hash
 */

/**
 * @param {string} outputFolder 输出目录
 */
module.exports = async outputFolder => {
  const markdownListFileName = `${outputFolder}/markdown/list.json`;
  const markdownList = await getMarkdownList(markdownListFileName);

  const readmeStat = markdownList.find(v => v.title === 'readme');
  await checkReadme(outputFolder, readmeStat.hash);

  updateListJson(markdownList, markdownListFileName);
};

/**
 * @param {string} fileName
 * @returns {Promise<Array<IMarkdown>>}
 */
async function getMarkdownList(fileName) {
  try {
    const markdownList = JSON.parse(await fs.readFile(fileName, 'utf-8'));
    return Array.isArray(markdownList) ? markdownList : [];
  } catch {
    return [];
  }
}

/**
 * 计算目标字符串的hash值
 * @param {string} str 要计算hash的字符串
 * @returns {string} hash值
 */
function getHash(str) {
  const hash = ctypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

/**
 * 检查 readme.md 是否出现更改, 如有, 则复制
 * @param {string} outputFolder
 * @param {string} [hash='']
 */
async function checkReadme(outputFolder, hash = '') {
  try {
    const markdownSourceFileName = `${await fs.realpath(
      process.cwd()
    )}/README.md`;
    const readmeStr = await fs.readFile(markdownSourceFileName, 'utf-8');
    const readmeHash = getHash(readmeStr);
    if (readmeHash !== hash) {
      const markdownOutputFileName = `${outputFolder}/markdown/readme.md`;
      await fs.writeFile(
        markdownOutputFileName,
        await fs.readFile(markdownSourceFileName)
      );
      const markdownFileStat = await fs.stat(markdownSourceFileName);
      await fs.utimes(
        markdownOutputFileName,
        markdownFileStat.atime,
        markdownFileStat.mtime
      );
    }
  } catch {}
}

/**
 * 更新list.json
 * @param {Array<IMarkdown>} markdownList 原先的list.json的内容
 * @param {string} markdownListFileName 输出文件名
 */
async function updateListJson(markdownList, markdownListFileName) {
  const markdownFolderPath = `${paths.appPublic}/markdown`;
  const fileList = await fs.readdir(markdownFolderPath);
  const resultArray = [...markdownList];
  for (const file of fileList) {
    const fullFileName = `${markdownFolderPath}/${file}`;
    const fileState = await fs.stat(fullFileName);
    if (fileState.isFile && path.extname(file) === '.md') {
      const fileContent = await fs.readFile(fullFileName, 'utf-8');
      const title = path.basename(file, '.md');
      const newHash = getHash(fileContent);
      const index = markdownList.findIndex(v => v.title === title);
      if (index < 0) {
        resultArray.push({
          birthTime: fileState.birthtimeMs,
          modifyTime: fileState.mtimeMs,
          title,
          hash: newHash
        });
      } else if (resultArray[index].hash !== newHash) {
        resultArray[index].hash = newHash;
        resultArray[index].modifyTime = fileState.mtimeMs;
      }
    }
  }
  await fs.writeFile(markdownListFileName, JSON.stringify(resultArray));
  console.log('markdown list done');
}
