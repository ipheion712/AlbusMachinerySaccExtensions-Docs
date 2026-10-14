---
title: Ball AI / 球形姿勢計
description: 機体のロールとピッチを球形姿勢計に表示します。
---

## 概要

`AMSE_BallAIController` は、機体の前方・上方向から姿勢を求め、外側のロール軸と内側のピッチ軸を回転させます。ロール角は連続した角度として追跡します。参照スクリプトの Basic 版は、ピッチ約 -80～80 度を想定しています。

- 配置する Prefab：`AMSE_BallAIController/BallAttitudeIndicator.prefab`
- コンポーネント：`AMSE_BallAIController`
- 必要な参照：機体 Transform、異なる二つのジンバル Transform
- SaccEntity 登録：通常は不要

## 導入手順

1. `BallAttitudeIndicator.prefab` をコックピットに配置し、サイズと向きを合わせます。
2. `AMSE_BallAIController` の `SAVControl` に、その機体の SaccAirVehicle を割り当てます。または `VehicleForwardTransform` に機体の基準 Transform を直接割り当てます。
3. Prefab 内の `RollAxis` と `PitchAxis` の参照を維持します。独自モデルでは、ロール用とピッチ用を別の Transform にし、ピッチ用をロール用の子にします。
4. Prefab の回転軸の値を出発点に、正面が水平な状態で表示を確認します。
5. 左右にバンク、機首上げ・下げを行い、表示方向が合うことを確認します。

```text
計器本体
└ ロール用 Transform（RollAxis）
  └ ピッチ用 Transform（PitchAxis）
    └ 球の表示モデル
```

これは独自モデルの構成例です。Prefab 内の実際のオブジェクト名と一致させる必要はありません。

## 設定項目

| 項目名 | 型 | コード初期値 | 設定内容 |
| --- | --- | --- | --- |
| `SAVControl` | UdonSharpBehaviour | 未設定 | `VehicleTransform` を取得する機体制御。Transform を直接設定する場合は任意 |
| `VehicleForwardTransform` | Transform | 未設定 | 姿勢の基準。未設定なら SAVControl から取得 |
| `RollAxis` | Transform | 未設定 | 必須。ロールを適用する外側ジンバル |
| `PitchAxis` | Transform | 未設定 | 必須。ピッチを適用する内側ジンバル |
| `RollAxisVector` | Vector3 | `(0, 0, 1)` | ロール軸のローカル方向。ゼロベクトル不可 |
| `PitchAxisVector` | Vector3 | `(1, 0, 0)` | ピッチ軸のローカル方向。ゼロベクトル不可 |
| `RollDirection` | float | `-1` | ロール角の倍率。通常 `-1` / `1` で方向を合わせる |
| `PitchDirection` | float | `1` | ピッチ角の倍率。通常 `-1` / `1` で方向を合わせる |

### Prefab の保存値

参照 Prefab の `RollAxisVector` は **`(1, 0, 0)`**、`PitchAxisVector` は **`(0, 0, 1)`** です。モデルに合わせた値なので、コードの初期値へ一律に戻さないでください。方向の保存値は Roll `-1`、Pitch `1` です。

### 実行時の確認項目

`Initialized` は初期化完了、`CurrentRollDegrees` は連続ロール角、`CurrentPitchDegrees` はピッチ角です。これらは状態表示で、導入時の調整対象ではありません。

## 動作と同期

姿勢表示を各クライアントで計算します。このコンポーネント自体に同期変数はありません。機体 Transform のネットワーク上の更新は、機体側の同期に依存します。

初期化時のジンバルのローカル回転を基準として保存します。ピッチが ±90 度に近づいてロールの基準が不定になる場合、最後の有効なロール値を保持します。背面飛行を含む全姿勢への対応を、この Basic 版の保証として扱わないでください。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 初期化できない | 機体 Transform、両ジンバル、非ゼロの軸ベクトルを確認 |
| 機首上げで逆に動く | `PitchDirection` の符号とモデルのローカル軸を確認 |
| バンク表示が逆 | `RollDirection` の符号を確認 |
| 見た目が競合する | 同じ Transform を別の Animator や計器スクリプトが回転させていないか確認 |

旧 Prefab に残る `EnableControlledFlip` 等の値は、参照した現行スクリプトには存在しません。現行の設定は上の表を基準にしてください。

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_BallAIController/Script/AMSE_BallAIController.cs` と同フォルダーの Prefab。ソース確認日：2026-10-14。
