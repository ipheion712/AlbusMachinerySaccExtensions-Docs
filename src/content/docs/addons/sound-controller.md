---
title: AMSE_SoundController
description: SAV_SoundController の始動音・機内外切り替え・エンジンピッチを補助します。
---

## 概要

`AMSE_SoundController` は、既存の SAV_SoundController に接続する補助機能です。始動前の音量を抑え、機内外の切り替えに対応し、ヘリコプターのエンジン出力に応じたピッチを制御します。始動中断時のフェードも設定できます。

## 導入手順

1. 機体の SAV_SoundController と AudioSource の設定を先に確認します。
2. 専用 GameObject に `AMSE_SoundController` を追加します。
3. `SoundControl` に SAV_SoundController、`SAVControl` に同じ機体の制御を割り当てます。
4. SaccEntity の `ExtensionUdonBehaviours` に登録します。
5. ヘリ用ピッチ制御を使う場合は、SoundControl 側の `IsHelicopter` を確認します。
6. 始動前、始動中、稼働後、停止、機内外の切り替えを試します。

## 設定項目

値はコード初期値です。専用 Prefab は参照フォルダーにありません。

| 項目名 | 型 | 初期値 | 設定内容 |
| --- | --- | --- | --- |
| `SoundControl` | SAV_SoundController | 未設定 | 必須。既存のサウンド制御。拡張登録から自動取得も可能 |
| `SAVControl` | UdonSharpBehaviour | 未設定 | 必須。空欄なら SoundControl.SAVControl から取得 |
| `HelicopterPlaneIdlePitchMin` | float | `1` | 機外アイドル音の低出力時ピッチ |
| `HelicopterPlaneIdlePitchMax` | float | `1.03` | 機外アイドル音の高出力時ピッチ |
| `HelicopterPlaneInsidePitchMin` | float | `1` | 機内音の低出力時ピッチ |
| `HelicopterPlaneInsidePitchMax` | float | `1.03` | 機内音の高出力時ピッチ |
| `MaxPitchFollowSpeed` | float | `8` | ピッチ追従速度の上限。正の値で調整 |
| `OutsideIdleTargetVolume` | float | `1` | 始動時の機外アイドル音量の基準 |
| `InsideIdleTargetVolume` | float | `1` | 始動時の機内アイドル音量の基準 |
| `FadeStartupSoundOnCancel` | bool | `false` | 始動中断時に始動音をフェード |
| `StartupCancelFadeDuration` | float | `1.5` 秒 | 始動音のフェード時間 |
| `StartupCancelEndPitchRatio` | float | `0.55` | 中断時ピッチに対するフェード終端ピッチの比率 |

`EntityControl` は SaccEntity から渡される非シリアライズの実行時参照です。手動設定する項目ではありません。

## 調整方法

まず元の AudioSource が聞こえる状態を作り、その後に Min / Max の差を調整します。差を大きくするとエンジン出力に応じた音の変化が大きくなります。

フェードを使う場合は、始動してすぐ中断し、音量とピッチが自然に落ちるか確認します。フェード中の再始動やリスポーンも確認します。

## 動作と同期

このアドオン自身に同期変数はありません。SaccFlight のエンジンイベントを受け、各クライアントの AudioSource を更新します。機内外は `SoundControl.AllDoorsClosed` を基準に切り替えます。

ヘリのピッチを制御している間は、元の SAV_SoundController のピッチ追従を一時的に抑えます。エンジン停止やコンポーネント無効化では制御を戻します。ほかの音制御が同じ値を変更する場合は競合を確認します。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 初期化エラー | SoundControl、SAVControl、拡張登録を確認 |
| ピッチが変わらない | エンジン状態、IsHelicopter、Min / Max の差を確認 |
| 機内外の切り替えが合わない | 元の SoundControl のドア判定・機内外 AudioSource を確認 |
| 中断で音が残る | 中断イベント、フェード設定、[AMSE_EngineStartupRespawnReset](../engine-startup-reset/) の設定を確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_SoundController/Script/AMSE_SoundController.cs`。ソース確認日：2026-10-14。
