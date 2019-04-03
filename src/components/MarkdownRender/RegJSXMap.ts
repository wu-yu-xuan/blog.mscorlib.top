export type IRegJSXMap = Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>;

export default function RegJSXMap(str: string, map: IRegJSXMap): JSX.Element {
  for (const [reg, func] of map) {
    const r = str.match(reg);
    if (r) {
      return func(r);
    }
  }
  return null;
}