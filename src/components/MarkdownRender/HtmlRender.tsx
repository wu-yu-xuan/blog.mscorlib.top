import * as React from 'react';
import { Tokens } from 'marked';
import BlockWrapper from './BlockWrapper';
import RegJSXMap, { IRegJSXMap } from './RegJSXMap';

const blockTags = ['div', 'iframe', 'p'];

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>(
  [
    [
      /^<(.+?)(\s|>)/,
      reg => {
        if (blockTags.includes(reg[1])) {
          return (
            <BlockWrapper>
              <div dangerouslySetInnerHTML={{ __html: reg.input }} />
            </BlockWrapper>
          );
        } else {
          return <span dangerouslySetInnerHTML={{ __html: reg.input }} />;
        }
      }
    ],
    [
      /[\w\W]*/,
      ({ input }) => <span dangerouslySetInnerHTML={{ __html: input }} />
    ]
  ]
);

export default React.memo(function HtmlRender({ text }: Tokens.HTML) {
  return RegJSXMap(text, map);
});
