---
title: AMSE_LoadGaugeController
description: Grapple に接続した吊り荷の質量を、ロープの張りに応じて表示します。
---

## 概要

`AMSE_LoadGaugeController` は、Grapple の接続状態、ロープの長さ、吊り荷の `Rigidbody.mass` を使い、計器に 0～1 の値を送ります。張力そのものを物理計算する機能ではなく、ロープが張った状態で吊り荷の質量を表示する機能です。

- 導入方法：専用 GameObject にコンポーネントを追加し、計器 Animator を接続
- 依存：`DFUNC_Grapple` が `HookedRB`、`HookAttached`、`RopeBasePoint`、`HookRopePoint` を提供すること
- SaccEntity 登録：機体と所有権を連動させるため、拡張配列に登録

## 導入手順

1. 計器の表示モデルと Animator を用意します。既存の荷重計モデルを使う場合は、旧 Controller が同じ Animator を更新しない構成にします。
2. 機体の専用 GameObject に `AMSE_LoadGaugeController` を追加します。
3. `DFUNC_Grapple` と `gaugeAnimator` を割り当てます。
4. `parameterName` に計器 Animator の Float 名を入力します。
5. `maxWeight` に計器の最大表示質量を、`ropeTautLength` に実際の張り切ったロープ長を設定します。
6. `ExtensionUdonBehaviours` に登録します。
7. 荷物を接続し、ロープがたるんだ状態と持ち上げた状態の表示を比較します。

## 設定項目

| 項目名 | 型 | コード初期値 | 設定内容 |
| --- | --- | --- | --- |
| `DFUNC_Grapple` | UdonSharpBehaviour | 未設定 | 必須。フックとロープの状態の取得元 |
| `gaugeAnimator` | Animator | 未設定 | 必須。計器の Animator |
| `parameterName` | string | 未設定 | 必須。荷重を受ける Float 名 |
| `maxWeight` | float | `0` | 必須。最大表示質量。Rigidbody.mass と同じ単位で正の値 |
| `smoothSpeed` | float | `5` | 表示の補間速度 |
| `ropeTautLength` | float | `10` m | ロープが張った状態の両端間距離。正の値 |
| `slackThreshold` | float | `0.05` m | 張ったロープを「たるんだ」と判定する余裕 |
| `tautThreshold` | float | `0.02` m | たるんだロープを「張った」と判定する余裕 |
| `syncThreshold` | float | `0.001` | 正規化荷重の送信閾値。実用上は 0 より大きく設定 |

この AMSE フォルダーには、参照時点で専用 Prefab がありません。上の初期値はコンポーネント追加時の値です。`maxWeight` と `parameterName` は必ず設定します。

## ロープの判定

ロープがたるんでいる場合は、両端間距離が `ropeTautLength - tautThreshold` 以上になると張ったと判定します。一度張ると、距離が `ropeTautLength - slackThreshold` より短くなるまで状態を保持します。

`tautThreshold <= slackThreshold` にして、境界付近で表示が頻繁に切り替わることを抑えます。接続していない、ロープがたるんでいる、Rigidbody がない、最大質量が非正の場合は 0 を表示します。

## 動作と同期

アドオン GameObject の owner が荷重を計算し、正規化値を Manual 同期します。各クライアントでその値から指針を補間します。吊り荷の質量が最大表示値以上なら、出力は 1 で止まります。

例えば質量が `500`、`maxWeight` が `1000` なら、張った状態の出力は `0.5` です。Animator の目盛りをこの正規化に合わせます。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 常に 0 | 接続、Rigidbody、正の maxWeight、ロープの両端参照と長さを確認 |
| 持ち上げても 0 | `ropeTautLength` が実際より長くないか確認 |
| 地面に置いても荷重が残る | 実際の距離、たるみ閾値、ロープが張ったままか確認 |
| 操縦交代後に更新しない | GameObject の所有権が機体と一緒に移るか確認 |
| 通信が多い | `syncThreshold` が 0 になっていないか確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_LoadGaugeController/Script/AMSE_LoadGaugeController.cs`。ソース確認日：2026-10-14。
