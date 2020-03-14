import shouldHide from '../shouldHide';
import { Blog } from '../interface';

let cache = '';

export default function getRecommend(blogSummarys: Blog[]) {
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
