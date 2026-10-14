---
title: ローター失速
description: 高い入力の継続で推力を低下させ、入力を下げると回復させます。
---

## 概要

`AMSE_RotorStall` は、エンジン稼働中に高い `ThrottleInput` が続くと失速状態に入り、正規化した `RotorRPM` を低下させます。機体の `ThrottleStrength` と `ThrottleStrengthAB` に RotorRPM を掛けて、推力を弱めます。

実ローターの空力を直接計算するモデルではなく、入力の継続時間に応じた挙動です。

## 導入手順

1. 機体内の専用 GameObject に `AMSE_RotorStall` を追加します。
2. `SAVControl` に、機体の SaccAirVehicle を割り当てます。
3. SaccEntity の `ExtensionUdonBehaviours` に登録します。`EntityControl` は登録時に渡される実行時参照です。
4. 失速警告を表示する場合は、`TargetAnimator` と `BoolParameterName` を設定します。
5. 入力の発生・回復閾値と時間を設定します。
6. エンジン稼働後に高入力を維持し、推力低下、警告、低入力での回復を確認します。

## 設定項目

専用 Prefab は参照フォルダーにありません。値はコード初期値です。

| 項目名 | 型 | 初期値 | 設定内容 |
| --- | --- | --- | --- |
| `SAVControl` | UdonSharpBehaviour | 未設定 | 必須。推力とエンジン状態の取得・更新先 |
| `RotorRPM` | float | `1` | 0～1 のローター強度。実行中に変化する状態。通常は 1 で開始 |
| `StallDecayRate` | float | `0.2` /秒 | 失速中の RotorRPM の減少速度。0 以上 |
| `RotorRecoveryRate` | float | `0.2` /秒 | 回復速度。0 より大きい値 |
| `StallTriggerThrottle` | float | `0.9` | この値以上で高入力時間を加算。0 より大きく 1 以下 |
| `StallRecoveryThrottle` | float | `0.85` | この値以下で失速を解除。0 以上、発生閾値未満 |
| `MaxThrottleTime` | float | `5` 秒 | 高入力時間がここに達すると失速。正の値 |
| `OverThrottleCooldownRate` | float | `1` | 高入力でない間の蓄積時間の減少倍率。0 以上 |
| `syncInterval` | float | `0.1` 秒 | 通常の送信間隔。正の値。実行時の最小間隔は 0.02 秒 |
| `rotorRPMSyncThreshold` | float | `0.01` | RotorRPM の送信差分閾値。0 以上 |
| `overThrottleTimerSyncThreshold` | float | `0.1` 秒 | 蓄積時間の送信差分閾値。0 以上 |
| `TargetAnimator` | Animator | 未設定 | 任意。警告表示の出力先 |
| `BoolParameterName` | string | `IsStalling` | 警告用 Bool の名前 |

`IsStallingDisplay` は失速または回復中を表す確認用の状態です。`IsRecoveringDisplay` は非シリアライズの回復中状態で、Inspector の調整項目ではありません。

## 発生と回復

標準値では、入力 `0.9` 以上を累計 `5` 秒維持すると失速します。入力を下げると蓄積時間は毎秒 `1` 秒分減ります。入力 `0.85` 以下で失速を解除し、RotorRPM を毎秒 `0.2` ずつ 1 へ戻します。

警告 Bool は、失速解除後も RotorRPM が 1 に戻るまで true です。エンジン停止で失速を解除し、爆発・リスポーンでは状態、蓄積時間、推力をリセットします。

## 動作と同期

owner が状態を計算します。失速状態、RotorRPM、高入力の蓄積時間を Manual 同期し、他クライアントは警告表示を更新します。途中参加時には受信状態を表示へ反映します。

所有権を失ったクライアントは、ローカルの推力設定を初期値へ戻します。別の機能も同じ推力変数を書き換える場合は、更新の競合を確認してください。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 初期化で無効になる | SAVControl、拡張登録、閾値・正の時間・速度を確認 |
| 失速しない | エンジン稼働、入力閾値、高入力の継続時間、owner を確認 |
| 警告だけ出ない | 指定名の Bool が TargetAnimator に存在するか確認 |
| 失速解除後も警告 | RotorRPM が回復中か確認。回復完了までは想定動作 |
| 操縦交代で値が飛ぶ | 機体と Behaviour の所有権、他の推力更新スクリプトを確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_RotorStall/Script/AMSE_RotorStall.cs`。ソース確認日：2026-10-14。
