---
title: AMSE_HeliGroundCyclic
description: VTOLOnly のヘリコプターで、接地中の前進方向の推力を補正します。
---

## 概要

`AMSE_HeliGroundCyclic` は、地面までの距離と前方サイクリック入力に応じて、機体の VTOL 推力角を補正します。離陸時には残った補正を減らし、中立角へ戻します。Version 1 の対象は **`VTOLOnly` を有効にした SaccAirVehicle** です。

## 導入手順

1. 機体内の専用 GameObject に `AMSE_HeliGroundCyclic` を追加します。
2. `SAVControl` を割り当て、SaccEntity の `ExtensionUdonBehaviours` に登録します。
3. GroundDetector の参照、地面 Layer、Raycast 距離を確認します。アドオン側の GroundDetector が空欄なら、SAVControl のものを使います。
4. SAVControl の `VTOLOnly`、`VTOLMinAngle`、`VTOLMaxAngle`、`VTOLDefaultValue` を確認します。
5. 地面までの実際の距離に合わせて FullEffect / Release を調整します。
6. 地上でエンジンを始動し、前方サイクリックで推力角が変わり、離陸後に戻ることを確認します。

## 設定項目

専用 Prefab は参照フォルダーにありません。値はコード初期値です。

| 項目名 | 型 | 初期値 | 設定内容 |
| --- | --- | --- | --- |
| `SAVControl` | SaccAirVehicle | 未設定 | 必須。制御対象の機体 |
| `GroundDetector` | Transform | 未設定 | 任意。空欄なら SAVControl から取得 |
| `GroundFullEffectDistance` | float | `0.22` m | この距離以下で距離補正が最大 |
| `GroundReleaseDistance` | float | `0.40` m | 接地中の補正が最小値に達する距離 |
| `GroundMinimumBlendBeforeTakeoff` | float | `0.30` | SaccFlight が接地中と判定する間に残す最小補正。0～1 |
| `GroundRayMissGrace` | float | `0.10` 秒 | 接地中に Raycast が一時的に外れたとき、直前値を保持する時間 |
| `TouchDownBlendInTime` | float | `0.15` 秒 | 着地後の補正追従時間。0 は即時 |
| `UseTakeOffFinalBlend` | bool | `true` | 離陸後に残る補正を徐々に解除 |
| `TakeOffReleaseTime` | float | `0.15` 秒 | 離陸後の解除時間。0 は即時 |
| `CyclicDeadzone` | float | `0.075` | 前方入力の不感帯。0 以上 1 未満 |
| `CyclicSaturationPoint` | float | `0.35` | 最大補正に達する前方入力。不感帯より大きく 1 以下 |
| `GroundMaxForwardTilt` | float | `8` 度 | 地上補正の最大角度。0 以上 |
| `CyclicForwardSign` | float | `1` | RotationInputs.x を前方入力へ変換する符号。0 不可 |
| `TiltDirectionSign` | float | `-1` | 推力角の傾ける方向。ALH316 の想定は -1。0 不可 |
| `SyncUpdateRate` | float | `0.2` 秒 | VTOL 表示角の通常送信間隔。実行時に 0.05 秒以上へ補正 |
| `SyncThreshold` | float | `0.001` | 正規化 VTOL 角の送信閾値。0 以上 |

### 必要な制約

```text
0 <= GroundFullEffectDistance
GroundFullEffectDistance < GroundReleaseDistance
GroundReleaseDistance <= SAVControl.GroundDetectorRayDistance
0 <= CyclicDeadzone < CyclicSaturationPoint <= 1
VTOLMinAngle < VTOLMaxAngle
```

GroundDetectorLayers は空にせず、地面を含めます。中立角から `TiltDirectionSign` の方向へ動かせる角度範囲が必要です。最大補正が使用可能な角度範囲を超える場合は、範囲内へ制限されます。

## 動作条件と同期

owner かつ操縦中、エンジン稼働中で動きます。死亡・破損・水上浮遊・物理入力無効・ジョイスティック無効・外部ジョイスティック上書き中は補正を適用しません。

地面判定は `-GroundDetector.up` の Raycast と SaccFlight の接地イベントを組み合わせます。遠隔クライアント向けに VTOL 表示角を Manual 同期し、所有権の交代にも対応する構成です。操縦終了、エンジン停止、爆発、再出現、リスポーン等では中立へ戻す処理があります。

### 実行時の確認項目

`Initialized`、`IsOwner`、`IsPiloting`、`HasGroundHit`、`IsSaccGrounded`、`GroundDistance`、`ForwardCyclicInput`、`GroundBlend`、`ActualVTOLAngleDegrees` などは診断用です。`EntityControl` と `SyncedVTOLAngle` は実行時に使う参照・同期状態で、導入時の入力項目ではありません。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| Initialized が false | Console の検証エラー、VTOLOnly、距離の制約、地面 Layer を確認 |
| 前方入力で反応しない | 操縦者・エンジン・接地状態、不感帯、入力の符号を確認 |
| 推力の方向が逆 | VTOL の角度定義と TiltDirectionSign を確認 |
| 機体が浮くと切り替えが急 | Release、最低補正、TakeOffReleaseTime を調整 |
| 地形の境界で表示が揺れる | 地面 Layer、Raycast 距離、GroundRayMissGrace を確認 |
| 遠隔表示が更新しない | Behaviour の owner と拡張登録を確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_HeliGroundCyclic/Script/AMSE_HeliGroundCyclic.cs`。ソース確認日：2026-10-14。
