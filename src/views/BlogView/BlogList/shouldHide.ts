/**
 * 判断是否应该隐藏
 * 致敬Unix
 */
export default function shouldHide(str: string) {
  return str.startsWith('.');
}
