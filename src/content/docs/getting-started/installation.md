---
title: 共通の導入手順
description: インポート、配置、参照設定、登録、動作確認の共通手順。
---

## 1. 機体とアドオンを用意する

1. [対応環境](../requirements/)と、導入するアドオンの依存関係を確認します。
2. 配布元から取得したパッケージをインポートします。現行のフォルダーは `Assets/ALBUSMACHINERY/SaccExtensions/` です。
3. Console のコンパイルエラーを解消してから、配置を始めます。
4. 機体 Prefab のコピーまたは Variant で作業します。

## 2. オブジェクトを配置する

Prefab がある機能は、機体の適切な子オブジェクトとして配置します。姿勢計・電波高度計・計器セットはコックピット、照準ビューは機体内の機能用階層に置きます。

スクリプトのみの機能は、機体内に専用 GameObject を作り、対応する UdonSharp コンポーネントを追加します。`Add Component` またはスクリプトのドラッグで追加し、UdonSharp の Program Asset が正しく生成・関連付けされていることを確認します。

```text
Vehicle（既存の機体）
├ SaccEntity（既存の登録先）
├ SaccAirVehicle（機体の制御）
├ Cockpit
│ └ 計器 Prefab
└ Extensions
  └ アドオン用 GameObject
```

これは配置例です。既存の階層名を変更する必要はありません。

## 3. Inspector の参照を設定する

各記事の「導入手順」と「設定項目」に従って、機体制御、Animator、Transform、DFUNC を割り当てます。

- 別機体の `SAVControl` を割り当てないようにします。
- Animator パラメーターは、名前と型の両方を一致させます。
- Prefab 内部で設定済みの参照は、その接続を維持します。
- 空欄から自動取得できる項目と、必須項目を区別します。

表の項目名はコード上の名前です。Unity が単語を分けて表示する場合は、例えば `SAVControl` は `SAV Control`、`gaugeAnimator` は `Gauge Animator` に対応します。

スマートフォンなどの狭い画面では、設定表を横にスクロールして確認できます。

## 4. 必要な機能を SaccEntity に登録する

イベントを受ける拡張は `ExtensionUdonBehaviours` に、ダイヤル操作は `Dial_Functions_L` または `Dial_Functions_R` に登録します。

詳細は [SaccEntity・DFUNC の登録](../registration/)を参照してください。すべてのコンポーネントを一律に登録する必要はありません。

## 5. 値を機体に合わせる

距離、計器の最大値、Animator 名、回転軸、音のピッチなどを設定します。コードの初期値と Prefab の保存値が異なる場合は、Prefab の設定を出発点にします。

## 6. 動作を確認する

1. 参照が欠けていないか、Console にエラーが出ていないか確認します。
2. Unity / ClientSim で、確認できる表示と基本操作を確認します。
3. VRChat のテスト環境で、操縦・降車・リスポーンを確認します。
4. 同期する機能は、別プレイヤーからの表示、所有権の交代、途中参加を確認します。

ClientSim での確認だけでは、複数人の同期を確認したことにはなりません。

動かない場合は [よくある問題](../troubleshooting/)と、アドオン個別の「問題への対処」を参照してください。
