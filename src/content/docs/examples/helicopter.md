---
title: ヘリコプターへの組み込み例
description: 計器、ローター失速、サウンド、地上補正を順番に組み込みます。
---

## 基本構成

動作する SaccFlight のヘリコプターを出発点に、次の順番で追加すると、問題が起きた箇所を確認しやすくなります。

| 順番 | 追加する機能 | 確認すること |
| --- | --- | --- |
| 1 | [Ball AI](../../addons/ball-ai/) | 水平姿勢、バンク、機首上げ・下げ |
| 2 | [Flight Instruments Type A](../../addons/flight-instruments/) | 機体参照、目盛り、高度・燃料・速度 |
| 3 | [電波高度計](../../addons/radar-altimeter/) | 地面 Layer、測定方向、DH |
| 4 | [サウンド制御](../../addons/sound-controller/) | 始動前、機内外、停止、中断 |
| 5 | [始動中のリスポーン処理](../../addons/engine-startup-reset/) | 始動途中のリスポーン |
| 6 | [ローター失速](../../addons/rotor-stall/) | 発生と回復、推力変化、操縦交代 |
| 7 | [地上サイクリック補正](../../addons/heli-ground-cyclic/) | 接地中の推力方向、離陸・着地 |

吊り荷機能がある場合は [荷重計](../../addons/load-gauge/)、既存の照準 Camera がある場合は [照準ビュー](../../addons/sight-view/)を追加します。

## 警告を複数箇所へ表示する

1. RotorStall の `TargetAnimator` と `IsStalling` Bool を設定します。
2. [AnimatorParameterRelay](../../addons/animator-relay/) の転送元に、その Animator を設定します。
3. 転送先に警告灯用 Animator を追加します。
4. 転送先にも `IsStalling` Bool を用意します。
5. 失速中と回復中に警告が表示され、回復完了で消えることを確認します。

## 競合を確認する箇所

RotorStall は推力変数を、地上サイクリック補正は VTOL 角を更新します。ほかの拡張が同じ値を書き換える場合は、同時使用時の挙動を確認します。

計器と Relay を同じ Animator に接続する場合は、異なる用途で同じパラメーター名を使わないようにします。

## 動作確認の順番

1. 地上で参照と Console を確認。
2. 一人で各機能を動作確認。
3. 始動中・飛行中・失速中にリスポーンを確認。
4. 二人以上で外からの音・表示を確認。
5. 操縦者を交代して更新を確認。
6. 機能が動作中のインスタンスへ途中参加して確認。

このページはソース構成からの組み込み例です。特定の機体に対する導入再現や複数人テスト済みの構成ではありません。
