---
title: Animator パラメーター転送
description: 一つの Animator の Bool / Int / Float を、複数の Animator に転送します。
---

## 概要

`AMSE_AnimatorParameterRelay` は、転送元 Animator の一つのパラメーターを監視し、変更時に同名・同型の値を転送先へ書き込みます。複数の警告表示や計器を同じ値に連動させるときに使います。

対応する型は Bool / Int / Float です。Trigger は対象ではありません。一つの Behaviour で一つの名前を扱います。

## 導入手順

1. 専用 GameObject に `AMSE_AnimatorParameterRelay` を追加します。
2. `sourceAnimator` に値の取得元を設定します。
3. `parameterType` と `parameterName` を設定します。
4. `targetAnimators` に転送先を追加します。
5. 転送先のすべての Controller に、同名・同型のパラメーターがあることを確認します。
6. 転送元を変化させ、転送先の値が追従するか確認します。

SaccEntity の拡張登録は不要です。

## 設定項目

| 項目名 | 型 | コード初期値 | 設定内容 |
| --- | --- | --- | --- |
| `sourceAnimator` | Animator | 未設定 | 必須。取得元 |
| `parameterType` | AMSE_AnimatorParameterType | `Bool` | Bool / Int / Float の選択 |
| `parameterName` | string | 未設定 | 必須。取得元・転送先に共通の名前 |
| `targetAnimators` | Animator[] | 未設定 | 必須。転送先の配列 |
| `checkInterval` | float | `0` 秒 | 0 以下は毎フレーム。正の値なら指定間隔で確認 |
| `floatChangeThreshold` | float | `0.0001` | Float の転送を行う最小変化量。差がこの値を超えると更新 |
| `syncOnStart` | bool | `true` | 最初の読み取りで転送するか |

専用 Prefab は参照フォルダーにありません。値はコード初期値です。

## 動作と同期

Start で初回確認し、その後は `PostLateUpdate` で値を監視します。Bool / Int は値が変わったとき、Float は直前に転送した値との差が閾値を超えたときに転送します。

`syncOnStart` は初期値の **ローカル転送** を指定する項目です。ネットワーク同期を追加する設定ではありません。この Behaviour は独自の同期変数を持たず、取得元の共有状態は別の機能が担当します。

## 使用例

RotorStall の TargetAnimator に `IsStalling` Bool を設定し、この Relay で操縦席と助手席の警告 Animator に同じ値を転送できます。転送先にも `IsStalling` Bool を作成します。

## 問題への対処

| 症状 | 対処 |
| --- | --- |
| 反映されない | sourceAnimator、名前、型、targetAnimators の要素を確認 |
| 起動時だけ不一致 | syncOnStart を確認 |
| Float の小変化が反映されない | floatChangeThreshold と checkInterval を確認 |
| 複数の転送が競合する | 同じ転送先パラメーターへ別の Relay やスクリプトが書いていないか確認 |

## 参照元

`Assets/ALBUSMACHINERY/SaccExtensions/AMSE_AnimatorParameterRelay/Script/AMSE_AnimatorParameterRelay.cs`。ソース確認日：2026-10-14。
