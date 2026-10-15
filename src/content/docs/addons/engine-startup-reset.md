---
title: AMSE_EngineStartupRespawnReset
description: エンジン始動が中断されたときに、始動表示と通知をリセットします。
---

## 概要

`AMSE_EngineStartupRespawnReset` は、エンジンの始動中にリスポーン・爆発・再出現が起きた場合に、始動 Animator の Bool とダイヤル表示をリセットします。設定に応じて、拡張に始動中断イベントを通知します。

## 導入手順

1. 機体内の専用 GameObject に `AMSE_EngineStartupRespawnReset` を追加します。
2. `EntityControl` に機体の SaccEntity、`ToggleEngine` に機体の DFUNC_ToggleEngine を割り当てます。
3. SaccEntity の `ExtensionUdonBehaviours` に登録します。
4. 中断通知を使う場合は `SendStartupCancelEvent` を true にします。
5. エンジン始動アニメーション中にリスポーンし、始動表示が解除されることを確認します。

## 設定項目

| 項目名 | 型 | コード初期値 | 設定内容 |
| --- | --- | --- | --- |
| `EntityControl` | SaccEntity | 未設定 | 必須。機体の拡張イベントの通知先 |
| `ToggleEngine` | DFUNC_ToggleEngine | 未設定 | 表示・Animator をリセットするエンジン DFUNC |
| `SendStartupCancelEvent` | bool | `true` | 中断時に `SFEXT_G_EngineStartupCancel` を拡張へ通知 |

専用 Prefab は参照フォルダーにありません。始動 Animator の名前などは ToggleEngine 側の設定を使うため、このアドオンで別途入力しません。

## 動作と同期

`SFEXT_G_EngineStartup` を受けると始動中と記録し、EngineOn / EngineOff / EngineStartupCancel で解除します。始動中のまま RespawnButton / Explode / ReAppear を受けたときだけ、次の処理を行います。

1. ToggleEngine 側で使用している始動 Animator Bool を false にします。
2. `Dial_Funcon` と `Dial_Funcon_Array` を非表示にします。
3. 設定されていれば、EntityControl の拡張イベントとして始動中断を通知します。

独自の同期変数や Network Event 送信はありません。`SFEXT_G_EngineStartupCancel` の「G」は SaccFlight のイベント名であり、このクラスがネットワークへ追加送信することを意味しません。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| リセットされない | 拡張登録、始動イベントの受信、ToggleEngine の参照を確認 |
| Bool が残る | ToggleEngine の DoEngineStartupAnimBool、EngineAnimator、パラメーター名を確認 |
| 音だけ残る | 中断通知を有効にし、[AMSE_SoundController](../sound-controller/) の登録・設定を確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_EngineStartupRespawnReset/Script/AMSE_EngineStartupRespawnReset.cs`。ソース確認日：2026-10-14。
