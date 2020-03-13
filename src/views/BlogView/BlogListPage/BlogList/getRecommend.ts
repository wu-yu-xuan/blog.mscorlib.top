import { BlogItemProps } from '../BlogItem';
import shouldHide from '../shouldHide';

let cache = '';

export default function getRecommend(blogSummarys: BlogItemProps[]) {
  if (cache) {
    return cache;
  }
  const notHidden = blogSummarys.filter(
    blog => !blog.types.some(type => shouldHide(type))
  );
  const lucky = notHidden[Math.floor(Math.random() * notHidden.length)];
  cache = [
    lucky.types[Math.floor(Math.random() * lucky.types.length)],
    lucky.title
  ].join(' ');
  return cache;
}
