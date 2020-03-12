import React from 'react';
import { Tokens } from 'marked';
import BlockWrapper from '../BlockWrapper';
import style from './style.scss';
import RegJSXMap from '../RegJSXMap';
import languageMap from './languages';
import other from './languages/other';

export default React.memo(function CodeRender({ text, lang }: Tokens.Code) {
  return (
    <BlockWrapper>
      <pre className={style.pre}>
        <code className={style.code} lang={lang}>
          {RegJSXMap(text, getRegJSXMap(lang))}
        </code>
      </pre>
    </BlockWrapper>
  );
});

function getRegJSXMap(lang?: string) {
  if (!lang) {
    return other[1];
  }
  for (const [isLang, regJSXMap] of languageMap) {
    if (isLang(lang)) {
      return regJSXMap;
    }
  }
  return other[1];
}
