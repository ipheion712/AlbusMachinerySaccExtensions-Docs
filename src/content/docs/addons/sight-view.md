---
title: AMSE_SightView
description: 頭に追従するローカル映像と、共有される照準器の展開を設定します。
---

## 概要

`AMSE_SightView` は、頭に追従する照準ビューを表示します。二つの Behaviour で構成します。

- **AMSE_SightViewController**：プレイヤーの頭に追従して RenderTexture を表示。
- **DFUNC_AMSE_SightView**：ダイヤル操作、展開 Animator、遅延と共有状態を管理。

機体上の照準器の展開状態は共有されます。頭の前の映像は操作したプレイヤーのローカル表示です。既存の照準 Camera の映像を使うため、Camera 自体や照準の計算はこの Prefab の役割ではありません。

## 導入手順

1. 機体に `AMSE_SightView/AMSE_SightView.prefab` を配置します。
2. Prefab 内の Controller と ViewOverlay の参照を維持します。Controller は ViewOverlay の外に置き、表示を隠しても Controller が動く構成にします。
3. `SightRenderTexture` に既存の照準 Camera の RenderTexture を割り当てます。Material に設定済みなら空欄でも構いません。
4. `DFUNC_AMSE_SightView.SightViewController` の接続を確認します。
5. 展開アニメーションを使用する場合は `SightAnimator` と Bool 名を設定し、アニメーションの時間に合わせて遅延を設定します。
6. DFUNC を使用する側の `Dial_Functions_L` / `Dial_Functions_R` に登録します。同じ DFUNC を拡張配列へ重複登録しません。
7. Controller を `ExtensionUdonBehaviours` に登録します。
8. ダイヤルを選択してトリガーで切り替え、降車・リスポーンで表示が解除されることを確認します。

## Controller の設定項目

| 項目名 | 型 | コード初期値 | 設定内容 |
| --- | --- | --- | --- |
| `ViewOverlay` | GameObject | 未設定 | 必須。頭に追従する表示のルート |
| `SightImage` | Renderer | 未設定 | RenderTexture を表示する Renderer |
| `Background` | GameObject | 未設定 | 任意。映像の背後の背景。表示と一緒に切り替え |
| `SightRenderTexture` | RenderTexture | 未設定 | 任意。Material に設定済みなら省略可能 |
| `OverlayDistance` | float | `1` m | 頭から前方への距離。最小 0.01 m |
| `PositionOffset` | Vector3 | `(0, 0, 0)` m | 頭のローカル座標での追加位置 |
| `RotationOffset` | Vector3 | `(0, 0, 0)` 度 | 頭の回転に加える角度 |
| `OverlayScale` | Vector3 | `(3, 3, 1)` | ViewOverlay のローカルスケール |
| `StartDisabled` | bool | `true` | Start 時に非表示で開始。EntityStart 等でも表示を解除 |

## DFUNC の設定項目

| 項目名 | 型 | コード初期値 | 設定内容 |
| --- | --- | --- | --- |
| `SightViewController` | AMSE_SightViewController | 未設定 | 必須。ローカル表示を制御する Controller |
| `Dial_Funcon` | GameObject | 未設定 | 任意。展開中のダイヤル表示 |
| `Dial_Funcon_Array` | GameObject[] | 未設定 | 任意。複数の展開表示 |
| `SightAnimator` | Animator | 未設定 | 任意。機体上の照準器を展開する Animator |
| `AnimatorBoolName` | string | `SightViewEnabled` | 展開状態の Bool 名 |
| `OverlayEnableDelay` | float | `0` 秒 | 展開開始からローカル映像表示までの待ち時間 |
| `AnimatorDisableDelay` | float | `0` 秒 | ローカル映像を隠してから収納開始までの待ち時間 |

### Prefab の保存値

参照 Prefab は、**OverlayDistance `0.5 m`、OverlayEnableDelay `2 秒`、AnimatorDisableDelay `0.5 秒`** を保存しています。SightAnimator と SightRenderTexture は未設定なので、機体に合わせて接続します。

`LeftDial`、`DialPosition`、`EntityControl`、`IsOwner`、`SightViewEnabled` は実行時の状態です。ダイヤル位置等を Inspector の手入力で設定する構成ではありません。

## 操作と状態の流れ

```text
有効化：共有展開状態 ON → 各クライアントで展開演出
                          → 遅延後、操作した本人の映像 ON

無効化：本人の映像 OFF → 遅延後、共有展開状態 OFF
                                      → 各クライアントで収納演出
```

選択中のトリガーが `0.75` を超えた立ち上がりで切り替えます。Desktop 向けは既存の入力機構から DFUNC の `KeyboardInput` を呼び出します。

## 同期・途中参加

DFUNC の owner が展開状態を Manual 同期します。Animator とダイヤル表示はその状態に追従します。操作時にはローカルプレイヤーが DFUNC の所有権を取得します。

途中参加者には共有の展開状態を反映し、その参加者のローカル映像は自動表示しません。降車、所有権喪失、リスポーン、爆発等では表示を解除します。インスタンスをまたぐ保存はありません。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 映像が出ない | RenderTexture、Camera 出力、Renderer / Material、DFUNC と Controller の参照を確認 |
| 一度隠すと動かない | Controller 自身を ViewOverlay の子にして無効化していないか確認 |
| 操作に反応しない | ダイヤル配列の登録と選択位置を確認 |
| 展開演出だけ動かない | SightAnimator の Bool 名と型を確認 |
| 映像が出るのが遅い | Prefab の OverlayEnableDelay は 2 秒。演出に合わせて調整 |
| 他人に映像が出ない | ローカル映像を共有しない仕様。機体の展開演出を確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_SightView/Script/AMSE_SightViewController.cs`、`DFUNC_AMSE_SightView.cs`、同フォルダーの Prefab と `docs/NETWORKING_RULES.md`。ソース確認日：2026-10-14。
