import typescript from './typescript';
import other from './other';
import { IRegJSXMap } from '../../RegJSXMap';
import bash from './bash';
import shell from './shell';
import css from './css';

const languageMap = new Map<(lang: string) => boolean, IRegJSXMap>([
  typescript,
  bash,
  shell,
  css,
  other
]);

export default languageMap;
