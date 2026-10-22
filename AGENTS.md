# 概要
LTE/NRのCell Identity(セルID)、EARFCN/NRARFCNの計算ツール

アプリ名: Mobile Network Tools

# 機能
## セルID計算ツール
LTE/NRのセルIDを計算するツール。

NRはgNodeBのビット数を24ビットをデフォルトに開始する。

## ARFCN計算ツール
LTE/NRのARFCNから周波数、周波数からARFCNを計算するツール。

推定バンドも表示する。

# デザイン
- UIはdaisyUIを使用する

- 全体的に、明るめで落ち着き、シンプルなデザインにする。

- 余計なキャプション、補足説明を書かない。

- フォントにはLINE Seedを使用し、数値等読み間違えが起きそうな場所では等幅フォントを使用する。

- 機能の切り替えはハンバーガーメニューを使用。

- LTE/NRの切り替えは、画面内のタブボタンで切り替える。

- スマートフォンでも快適に操作できるようにする。

- PWAに対応する。

# 開発について
- Cloudflare Pagesで動作できるように作る

- Vue、daisyUIスキルを使用する

- パッケージマネージャーは pnpm を使用する

# 資料
- LTEバンド一覧
    https://www.sqimway.com/lte_band.php

- NRバンド一覧
    https://www.sqimway.com/nr_band.php
