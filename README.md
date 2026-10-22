# Mobile Network Tools

LTE / 5G NR の Cell Identity と ARFCN をブラウザ内で計算する Vue 3 製ツールです。

## 機能

- LTE ECI: eNodeB ID + Cell ID の合成／分解
- NR NCI: gNodeB ID + Cell ID の合成／分解（gNodeB ID は 24 bit が初期値）
- EARFCN / NR-ARFCN と中心周波数の相互変換
- 周波数範囲からの LTE / NR バンド候補表示
- 地域設定（日本・米国・欧州・全世界）によるバンド候補の絞り込みと設定保存
- 両機能の計算履歴（各50件・端末内保存・タップでフォーム復元）
- 設定画面からの機能別・一括履歴削除
- レスポンシブ UI、PWA オフライン動作

## 開発

```sh
pnpm install
pnpm dev
```

```sh
pnpm test
pnpm build
```

## Cloudflare Pages

- Build command: `pnpm build`
- Build output directory: `dist`
- Node.js: 20 以降

計算はすべてクライアント側で完結します。

地域別候補の選定方法と参照資料は [地域別バンド資料](docs/regional-bands.md) を参照してください。
