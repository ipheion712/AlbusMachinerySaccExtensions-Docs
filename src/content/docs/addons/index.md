---
title: アドオン一覧
description: 10 種類の AMSE アドオンを、機能と導入方式から探します。
---

## 計器

| アドオン | 機能 | 導入の入口 |
| --- | --- | --- |
| [Ball AI / 姿勢計](./ball-ai/) | ロール・ピッチに追従する球形姿勢計 | `BallAttitudeIndicator.prefab` |
| [電波高度計](./radar-altimeter/) | 下向き Raycast による高度と Decision Height の表示 | `RadarAltimeter.prefab` |
| [吊り荷の荷重計](./load-gauge/) | Grapple の吊り荷質量を表示 | コンポーネント追加＋計器 Animator |
| [Flight Instruments Type A](./flight-instruments/) | 高度、燃料、速度、エンジン、昇降率、方位など | `FlightInstrumentsA.prefab` |

## エンジン・飛行挙動

| アドオン | 機能 | 導入の入口 |
| --- | --- | --- |
| [ローター失速](./rotor-stall/) | 高入力の継続で推力を低下させ、入力を下げると回復 | コンポーネント追加＋拡張登録 |
| [接地中のサイクリック補正](./heli-ground-cyclic/) | VTOLOnly 機体の接地中に前進方向の推力を補正 | コンポーネント追加＋拡張登録 |
| [始動中のリスポーン処理](./engine-startup-reset/) | 中断された始動アニメーションと表示をリセット | コンポーネント追加＋拡張登録 |

## 音・視界・表示

| アドオン | 機能 | 導入の入口 |
| --- | --- | --- |
| [サウンド制御](./sound-controller/) | 始動音・機内外切り替え・ヘリのエンジン音を補助 | コンポーネント追加＋拡張登録 |
| [照準ビュー](./sight-view/) | 頭に追従する照準映像と、共有される展開アニメーション | `AMSE_SightView.prefab`＋DFUNC 登録 |
| [Animator パラメーター転送](./animator-relay/) | Bool / Int / Float の値を複数 Animator に転送 | コンポーネント追加 |

## 最初に読むページ

1. [対応環境](../getting-started/requirements/)で必要なパッケージを確認します。
2. [共通の導入手順](../getting-started/installation/)を読みます。
3. 各アドオンのページで、参照先と設定値を決めます。

アドオン本体の入手については [配布について](../reference/licenses/#配布について)を参照してください。
