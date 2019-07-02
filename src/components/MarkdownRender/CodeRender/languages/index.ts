import typescript from './typescript';
import other from './other';
import { IRegJSXMap } from '../../RegJSXMap';
import bash from './bash';
import shell from './shell';

const languageMap = new Map<(lang: string) => boolean, IRegJSXMap>([
  typescript,
  bash,
  shell,
  other
]);

export default languageMap;
