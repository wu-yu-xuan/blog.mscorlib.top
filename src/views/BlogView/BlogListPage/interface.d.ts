export interface Blog {
  title: string;
  modifyTime: number;
  birthTime: number;
  hash: string;
  types: string[];
}

export interface BlogSearchResult extends Blog {
  /**
   * 搜索词匹配数
   */
  matchLength: number;
}

export interface BlogItemProps extends Blog {
  searchWords: string[];
}
