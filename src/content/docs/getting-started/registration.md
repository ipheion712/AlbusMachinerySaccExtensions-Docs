---
title: SaccEntity・DFUNC の登録
description: ExtensionUdonBehaviours と左右のダイヤル配列の使い分け。
---

## 登録する場所

機体の `SaccEntity` には、拡張用の `ExtensionUdonBehaviours` と、左右のダイヤル用の `Dial_Functions_L` / `Dial_Functions_R` があります。登録すると SaccFlight の初期化・搭乗・所有権・リスポーンなどのイベントを受け取れます。

| コンポーネント | 登録方針 |
| --- | --- |
| `AMSE_RotorStall` | `ExtensionUdonBehaviours` に登録 |
| `AMSE_HeliGroundCyclic` | `ExtensionUdonBehaviours` に登録 |
| `AMSE_EngineStartupRespawnReset` | `ExtensionUdonBehaviours` に登録 |
| `AMSE_SoundController` | `ExtensionUdonBehaviours` に登録 |
| `AMSE_LoadGaugeController` | `ExtensionUdonBehaviours` に登録し、機体と所有権を連動 |
| `DFUNC_AMSE_SightView` | 使用する側のダイヤル配列に登録 |
| `AMSE_SightViewController` | `ExtensionUdonBehaviours` に登録し、降車等でローカル表示を解除 |
| `AMSE_BallAIController` | 通常は不要。`Start` でも初期化される |
| `AMSE_RadarAltimeterController` / `SaccGaugeController` | 通常は不要。`Start` / `Update` 等で更新 |
| `AMSE_AnimatorParameterRelay` | 不要。Animator の値をローカルで監視 |

## 拡張を追加する

1. 機体の `SaccEntity` を選択します。
2. `Extension Udon Behaviours` 配列を一つ増やします。
3. 新しい要素に、アドオンの UdonSharp Behaviour を割り当てます。
4. 既存要素が削除・上書きされていないことを確認します。

SaccEntity は登録された Behaviour に `EntityControl` を設定します。例えば AMSE_RotorStall の `EntityControl` は非シリアライズの実行時参照で、Inspector で手動設定する項目ではありません。

## ダイヤル機能を追加する

1. 左側なら `Dial Functions L`、右側なら `Dial Functions R` を選びます。
2. 機体のダイヤル構成に合わせた要素に、`DFUNC_AMSE_SightView` を割り当てます。
3. アイコンや選択位置は、既存機体のダイヤル構成に合わせて設定します。
4. 機体にある Desktop 入力の仕組みから、必要に応じて `KeyboardInput` を呼び出します。

`KeyboardInput` は呼び出し口です。AMSE_SightView 自体がキーボードの特定キーを監視するわけではありません。

## 同じ Behaviour を重複登録しない

参照した SaccEntity は、拡張配列と両方のダイヤル配列にイベントを送ります。ダイヤルに入れた DFUNC は拡張配列へ重複追加せず、同じイベントを二度受けない構成にします。AMSE_SightView の Controller は別の Behaviour なので、拡張配列への登録対象です。

## 所有権の確認

同期する機能では、機体の操縦者が変わるときにアドオンの GameObject の所有権も追従することを確認します。AMSE_LoadGaugeController は、自身の GameObject の owner だけが荷重を計算・送信します。

[共通の導入手順へ戻る](../installation/)
