/**
 * Chrome.tabs.tab 内部の型の一部はundefinedとのunionであるため
 * tabを渡す度に存在を確認する必要がでてくる。
 * これを無くすため、取得したタイミングで必要なプロパティを定義できる型をつくる
 */
declare type DefinedTab = {
  id: number;
  url: string;
  title: string;
};
