# ARFCNの地域別候補

周波数が同じでも、LTEではバンドごとにEARFCNが異なる。例えば880 MHzのDownlinkは、日本設定ではB19（6050）とB26（8900）、米国設定ではB5（2510）とB26（8900）を返す。

地域データは `src/data/regions.ts` にある。日本・米国・欧州の代表的なバンドを選ぶための手動管理のプロファイルで、各国・各事業者の免許や運用帯域を網羅するものではない。配列の順序は表示順であり、利用確率の統計ではない。最初の候補を大きく表示し、各バンドのARFCNを一覧にも表示する。地域内の実際の割当周波数まで絞り込む処理は行わない。

初期設定は日本。選択した地域はブラウザに保存し、再訪時にも利用する。「全世界」ではアプリが持つすべてのバンド定義から候補を表示する。地域内の候補がない場合、海外の候補への自動切り替えは行わない。

入力済みEARFCNはバンドを特定できるため、地域設定にかかわらず変換する。地域の候補外の場合は、その旨を表示する。NR-ARFCNは共通のグローバルラスターで変換し、地域設定はバンド候補だけに適用する。候補がなくても有効なNRの周波数・ARFCNは表示する。

## 参照資料

2026年10月22日に確認。端末の対応バンド一覧は海外対応を含むため、そのまま地域の運用バンドとは扱わず、事業者のネットワーク資料や周波数割当資料と合わせて候補を選定する。

- 日本: [ドコモの国内対応周波数帯](https://www.docomo.ne.jp/binary/pdf/support/product/band.pdf)、[MEEQの回線別バンド表](https://support.meeq.jp/hc/ja/articles/4464416372879)、[ソフトバンクの国内・海外対応周波数](https://tm.softbank.jp/content/dam/common/services/pc-lte/pdf/cidna-u9314x-s-5g-catalog.pdf)
- 米国: [T-Mobileのネットワーク周波数](https://www.t-mobile.com/support/coverage/t-mobile-network)、[AT&Tのネットワーク要件](https://iotdevices.att.com/Uploaded_Docs/radiated_performance_requirements_2_1_20251023050310567.pdf)、[Verizonの承認済みモジュールとLTEバンド](https://opendevelopment.verizonwireless.com/design-and-build/approved-modules)、[Boost Mobileのネットワーク要件](https://www.boostmobile.com/content/dam/harmony/us/en/docs/Boost_Mobile_Network_Requirements.pdf)
- 欧州: [Ofcomの移動通信周波数割当表](https://www.ofcom.org.uk/siteassets/resources/documents/manage-your-licence/mobile-wireless-and-broadband/2.3-3.4-ghz/frequency-allocations-mobile-and-broadband-below-5-ghz-june-20242.pdf)、[Orangeの4G/5G周波数](https://boutiquepro.orange.fr/mobile/forfait-data)、[EUの5G周波数帯](https://digital-strategy.ec.europa.eu/en/faqs/5g-questions-and-answers)、[Deutsche Telekomの5G展開](https://www.telekom.com/en/newsroom/latest-updates/news/2025/9/dt-as-an-innovation-leader-from-5g-standalone-to-5g-advanced)

バンドの周波数範囲とARFCNの変換定義は既存の `lteBands.ts`・`nrBands.ts` を利用する。地域データを更新した場合は、重複バンド、地域内候補なし、全世界への切り替え、Downlink/Uplink、NR共通ラスターのテストを確認する。
