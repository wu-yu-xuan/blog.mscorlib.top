const path = require('path');
const paths = require('../config/paths');
const fs = require('fs-extra');
const ctypto = require('crypto');

const MD_EXT = '.md';
const UTF_8 = 'utf-8';
const MARKDOWN_FOLDER = 'markdown';

/**
 * @typedef {Object} IMarkdown
 * @property {number} birthTime 创建时间
 * @property {number} modifyTime 修改时间
 * @property {string} title 名称
 * @property {string} hash
 * @property {string[]} types 文章的类型, 由所属文件夹决定
 */

/**
 * @param {string} outputFolder 输出目录
 */
module.exports = async outputFolder => {
  const markdownListFileName = path.resolve(
    outputFolder,
    MARKDOWN_FOLDER,
    'list.json'
  );
  const markdownList = await getMarkdownList(markdownListFileName);

  const readmeStat = markdownList.find(v => v.title === 'readme');
  await checkReadme(outputFolder, readmeStat && readmeStat.hash);

  updateListJson(markdownList, markdownListFileName);
};

/**
 * @param {string} fileName
 * @returns {Promise<Array<IMarkdown>>}
 */
async function getMarkdownList(fileName) {
  try {
    const markdownList = JSON.parse(await fs.readFile(fileName, UTF_8));
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
    const markdownSourceFileName = path.resolve(
      paths.appDirectory,
      'README.md'
    );
    const readmeStr = await fs.readFile(markdownSourceFileName, UTF_8);
    const readmeHash = getHash(readmeStr);
    if (readmeHash !== hash) {
      const markdownOutputFileName = path.resolve(
        outputFolder,
        MARKDOWN_FOLDER,
        '其他',
        'projectReadme.md'
      );
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
  } catch {
    // readme.md 不存在则当啥事都没发生 233
  }
}

/**
 * 更新list.json
 * @param {IMarkdown[]} markdownList 原先的list.json的内容
 * @param {string} markdownListFileName 输出文件名
 */
async function updateListJson(markdownList, markdownListFileName) {
  /**
   * @type {IMarkdown[]} 新的list.json的内容
   */
  const results = [];

  const markdownFolderPath = path.resolve(paths.appPublic, MARKDOWN_FOLDER);
  const allFileName = await getAllFileName(markdownFolderPath, MD_EXT);
  const hashBirthTimeMap = new Map(
    markdownList.map(v => [v.hash, v.birthTime])
  );
  const hashModifyTimeMap = new Map(
    markdownList.map(v => [v.hash, v.modifyTime])
  );

  /**
   * 获取文件创建时间
   * @param {string} hash
   * @param {string} title
   * @param {number} birthTime
   * @returns {number}
   */
  function getBirthTime(hash, title, birthTime) {
    // 文件发生了移动
    if (hashBirthTimeMap.has(hash)) {
      return hashBirthTimeMap.get(hash);
    }

    // 文件发生了修改
    const index = markdownList.findIndex(v => v.title === title);
    if (index >= 0) {
      return markdownList[index].birthTime;
    }

    // 未修改的情况与其他复杂情况
    return birthTime;
  }

  /**
   * 获取文件修改时间
   * @param {string} hash
   * @param {number} modifyTime
   * @returns {number}
   */
  function getModifyTime(hash, modifyTime) {
    // 文件发生了移动
    if (hashModifyTimeMap.has(hash)) {
      return hashModifyTimeMap.get(hash);
    }

    // 未修改的情况与其他复杂情况
    return modifyTime;
  }

  for (const fullFileName of allFileName) {
    const fileContent = await fs.readFile(fullFileName, UTF_8);
    const title = path.basename(fullFileName, MD_EXT);
    const types = path
      .dirname(path.relative(markdownFolderPath, fullFileName))
      .split(path.sep)
      .filter(t => t && t !== '.');
    const fileState = await fs.stat(fullFileName);
    const hash = getHash(fileContent);
    const birthTime = getBirthTime(hash, title, fileState.birthtimeMs);
    const modifyTime = getModifyTime(hash, fileState.mtimeMs);
    results.push({
      title,
      types,
      birthTime,
      modifyTime,
      hash
    });
  }
  await fs.writeFile(markdownListFileName, JSON.stringify(results));
  console.log('markdown list done');
}

/**
 * 读取目标文件夹下所有文件的长文件名
 * @param {string} folder
 * @param {string} [ext=''] 限制后缀, 为空则读取所有文件
 * @returns {Promise<string[]>}
 */
async function getAllFileName(folder, ext = '') {
  const results = [];
  const fileList = await fs.readdir(folder);
  for (const file of fileList) {
    const fullFileName = path.resolve(folder, file);
    const fileState = await fs.stat(fullFileName);
    if (fileState.isDirectory()) {
      results.push(...(await getAllFileName(fullFileName, ext)));
    } else if (!ext || path.extname(fullFileName) === ext) {
      /**
       * 情况一: 未提供后缀名, 则所有文件都放入
       * 情况二: 提供了后缀, 则判断后缀
       */
      results.push(fullFileName);
    }
  }
  return results;
}
