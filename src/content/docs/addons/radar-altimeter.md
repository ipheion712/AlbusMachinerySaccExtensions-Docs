---
title: AMSE_RadarAltimeterController
description: 下向きの距離を測り、高度と Decision Height を Animator に送ります。
---

## 概要

`AMSE_RadarAltimeterController` は、計器オブジェクトの位置から **ローカルの下方向（`-transform.up`）** に Raycast を行い、高度を表示します。水平飛行時の対地距離を基本とし、機体が傾くと測定方向も傾きます。

- Prefab：`AMSE_RadarAltimeterController/RadarAltimeter.prefab`
- コンポーネント：`AMSE_RadarAltimeterController`
- SaccEntity 登録：不要

## 導入手順

1. `RadarAltimeter.prefab` を配置します。
2. 水平時に測定方向が地面へ向くように、オブジェクトの向きを設定します。
3. `gaugeAnimator` と計器 Controller の接続を確認します。
4. `layerMask` に地面の Layer を含めます。機体自身や不要な Collider を測定しない組み合わせにします。
5. 計器の目盛りに合わせて単位、最大高度、Decision Height を設定します。
6. 地上と上空で高度が変化し、DH 以下で Bool が true になることを確認します。

## 設定項目

| 項目名 | 型 | コード初期値 | 設定内容 |
| --- | --- | --- | --- |
| `gaugeAnimator` | Animator | 未設定 | 必須。計器を動かす Animator |
| `radarAltitudeParameterName` | string | `raderAlt` | 高度用 Float の名前。既存の綴りを維持 |
| `decisionHeightParameterName` | string | `decisionHeight` | DH 指針用 Float の名前 |
| `underDHParameterName` | string | `underDH` | DH 以下を表す Bool の名前 |
| `useFeetUnit` | bool | `true` | true は ft、false は m |
| `maxAltitude` | float | `2500` | 正規化の最大高度。0 より大きい値 |
| `maxRaycastDistance` | float | `2500` | 測定上限。`useFeetUnit` と同じ単位 |
| `decisionHeight` | float | `200` | DH。`useFeetUnit` と同じ単位 |
| `layerMask` | LayerMask | `0` | 測定する Layer。0 のままでは地面を検出しない |
| `smoothSpeed` | float | `5` | 指針の追従速度。正の値で調整 |
| `updateInterval` | float | `0.1` 秒 | 距離計算の間隔。正の値で調整 |

### Prefab の保存値

参照 Prefab の `layerMask` は `m_Bits: 17`（Layer 番号 0 と 4）です。対象ワールドの地面 Layer が含まれるか確認してください。他の上表の数値・文字列設定はコード初期値と一致しています。

### 出力と実行時表示

- 高度 Float：`currentAltitude / maxAltitude` を 0～1 に制限し、平滑化して送信。
- DH Float：`decisionHeight / maxAltitude` を 0～1 に制限して送信。
- DH Bool：`currentAltitude <= decisionHeight`。
- `currentAltitude` / `underDecisionHeight` は実行時の確認用です。

## 動作と同期

コンポーネント自体は同期せず、各クライアントが距離を計算します。地面に当たらない場合は **測定上限の高度** として表示します。

ft を使用する場合、Raycast 距離を m に変換して測定し、表示値を ft に戻します。例えば `2500 ft` の測定距離は約 `762 m` です。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 常に最大値 | 地面の Collider、LayerMask、測定方向、測定距離を確認 |
| 常に低い値 | 機体自身など近い Collider を拾っていないか確認 |
| 指針が動かない | Animator の Float 名が `raderAlt` と一致するか確認 |
| DH 警報が逆 / 出ない | `underDH` が Bool か、DH の単位が合うか確認 |
| バンク中に値が増える | 世界の真下ではなくローカル下向きに測定する仕様を確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_RadarAltimeterController/Script/AMSE_RadarAltimeterController.cs` と同フォルダーの Prefab。ソース確認日：2026-10-14。
