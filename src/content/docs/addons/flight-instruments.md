---
title: Flight Instruments Type A
description: SaccGaugeController に接続する複合計器 Prefab の設定。
---

## 概要

`AMSE_FlightInstruments_TypeA/FlightInstrumentsA.prefab` は複合計器セットです。専用の AMSE スクリプトではなく、SaccFlightAndVehicles の **`SaccGaugeController`** を使用します。高度、燃料、速度、エンジン出力、横滑り、昇降率、方位の値を Animator に送ります。

- コンポーネント：SaccFlight 標準の `SaccGaugeController`
- 必須参照：SAVControl と計器 Animator
- SaccEntity 登録：通常は不要

## 導入手順

1. `FlightInstrumentsA.prefab` をコックピットへ配置します。
2. `SaccGaugeController` の `SAVControl` に、同じ機体の SaccAirVehicle を割り当てます。
3. `DialsAnimator` の接続済み Animator を維持します。
4. 必要なら `VehicleForwardTransform` を設定します。空欄なら SAVControl の `VehicleTransform` を使います。
5. Prefab の目盛りに合わせた保存値を確認し、高度・速度・昇降率の範囲を調整します。
6. 燃料、前進速度、上昇・下降、機首方位が表示に反映されることを確認します。

## 設定項目

この表の値は **参照 Prefab の保存値** です。新規 SaccGaugeController のコード初期値とは異なる項目があります。

| 項目名 | 型 | Prefab 保存値 | 設定内容 |
| --- | --- | --- | --- |
| `SAVControl` | UdonSharpBehaviour | 未設定 | 必須。機体の計器入力を取得 |
| `VehicleForwardTransform` | Transform | 未設定 | 任意。機体の前方の基準 |
| `DialsAnimator` | Animator[] | 計器 Animator 1 件 | 値の送信先 |
| `AltitudeFloatName100` | string | `altitude100` | 高度 / 100 の Float |
| `AltitudeFloatName1000` | string | `altitude1000` | 高度 / 1000 の Float |
| `AltitudeFloatName10000` | string | `altitude10000` | 高度 / 10000 の Float |
| `AltitudeConversion` | float | `0.328084` | 高度の換算係数。コード初期値は `3.28084` |
| `FuelFloatName` | string | `fuel` | 燃料割合の Float |
| `MaxSpeed` | float | `72` | 速度の正規化基準。SAV の速度に合わせる。コード初期値は約 `257.222221222` |
| `SpeedFloatName` | string | `speed` | 正規化速度の Float |
| `EngineFloatName` | string | `engine` | エンジン出力の Float |
| `SlipFloatName` | string | `slip` | 横滑りの Float |
| `MaxSlip` | float | `15` 度 | 横滑り角の表示範囲 |
| `Horizon` | Transform[] | 空配列 | 標準 Controller で回転させる水平儀。Prefab では使用しない |
| `Horizon_PitchAxis` | Vector3 | `(1, 0, 0)` | Horizon を使う場合のピッチ軸 |
| `Horizon_RollAxis` | Vector3 | `(0, -1, 0)` | Horizon を使う場合のロール軸 |
| `AscentFloatName` | string | `ascent` | 昇降率の Float |
| `MaxAscent` | float | `2000` | 最大昇降率。コード初期値は `5000` |
| `AscentConversion` | float | `3.28084` | 速度を換算して毎分の昇降率を求める係数 |
| `CompassAxis` | byte | `2` | 現行の `DoCompass` の計算では参照されない項目 |
| `CompassOffset` | float | `180` 度 | 方位オフセット。コード初期値は `0` |
| `CompassFloatName` | string | `compass` | 方位の Float |

## 表示値の計算

- 高度：`(CenterOfMass.position.y - SeaLevel) × AltitudeConversion`。電波高度計の対地距離とは異なります。
- 燃料：`Fuel / FullFuel`。
- 速度：`Speed / MaxSpeed`。
- 昇降率：`CurrentVel.y × AscentConversion × 60 / MaxAscent` を、中央 `0.5` の表示値に変換。
- 方位：機体の Y 回転と `CompassOffset` を使って 0～1 に変換。

`AltitudeConversion = 0.328084` は参照 Prefab の目盛り用設定です。ft 換算係数としてそのまま解釈せず、Controller のアニメーションと目盛りに合わせます。`MaxSpeed`、`MaxAscent`、機体側の `FullFuel` は正の値にします。

## 動作と同期

計器値は各クライアントで機体制御から取得します。SaccGaugeController 自体に同期変数はありません。途中参加時の機体状態は、SaccFlight 側の同期に依存します。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 初期化時にエラー | SAVControl と機体側の CenterOfMass を確認 |
| 全計器が動かない | DialsAnimator の配列、Controller、パラメーター名を確認 |
| 高度が地面の高さと違う | SeaLevel を基準とした高度であることを確認 |
| 目盛りが合わない | Prefab の換算係数と最大値を、アニメーションに合わせて確認 |
| 姿勢計だけ動かない | Prefab の Horizon は空。球形姿勢計は [Ball AI](../ball-ai/) を使用 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_FlightInstruments_TypeA/FlightInstrumentsA.prefab` と `Assets/SaccFlightAndVehicles/Scripts/Other/SaccGaugeController.cs`。ソース確認日：2026-10-14。
