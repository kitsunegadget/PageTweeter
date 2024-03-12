# Sharelots

共有ボタンの無いページでも 右クリック もしくは アイコン から、
タイトルとURLを取得して共有ページを表示できる Google Chrome 拡張機能です。
Microsoft Edge でも利用できます。

## Functions

- 各SNSページへの共有 (Twitter, Bluesky, Facebook, はてなブックマーク, note)
- 共有向けのタイトルとURLのコピー
- マークダウン形式でのコピー
- タイトルのみのコピー
- パラメータを削除したURLのコピー

## Options (TODO)

機能リストのON/OFFを設定することで、使わない項目は非表示にすることができます。

## Note

この拡張機能から行うURLコピーは、`http` と `https` スキーム以外では実行できないようにしています。
オリジナルURLのコピーはアドレスバーから利用できるため、機能として追加していません。

---

## Dev Note

`release` ブランチが更新されると、自動的に `package.json` のバージョン値でタグが追加され、Release が追加されます。
