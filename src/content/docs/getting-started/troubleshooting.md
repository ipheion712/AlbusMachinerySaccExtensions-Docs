---
title: よくある問題
description: 参照、初期化、Animator、同期の問題を順番に切り分けます。
---

## 最初に確認すること

| 症状 | 確認箇所 |
| --- | --- |
| コンポーネントを追加できない | Console のコンパイルエラー、UdonSharp の導入、SDK の依存関係 |
| 何も変化しない | GameObject の有効状態、必須参照、Program Asset |
| SFEXT イベントで動く機能が反応しない | SaccEntity の登録先と、配列内の Behaviour |
| 自分だけ動く / 他人から見えない | 同期する仕様かどうか、GameObject の owner、複数人での確認 |
| メーターが動かない | Animator Controller、パラメーターの名前と型、計器の最大値 |
| 値や方向が逆 | 回転軸、符号、計器の目盛りと入力の正規化 |

## Animator の名前と型

名前は大文字・小文字を含めて一致させます。AMSE_RadarAltimeterController の標準パラメーター名は `raderAlt` です。一般的な英単語に合わせて `radarAlt` に書き換えると、既存 Controller と一致しなくなることがあります。

Float に Bool を送るなど、型が一致しない接続も確認してください。AMSE_AnimatorParameterRelay は同名・同型のパラメーターを転送します。

## コードと Prefab の初期値が違う

Inspector に表示されるのは、シーンや Prefab に保存された値です。コードの初期値を変更しても、既に保存された値が一律に更新されるとは限りません。各記事の Prefab 値を確認してください。

AMSE_BallAIController の参照 Prefab には、現行スクリプトにない旧設定がシリアライズされています。現行版の調整項目は [AMSE_BallAIController の設定一覧](../../addons/ball-ai/#設定項目)を基準にします。

## 地面や吊り荷の判定

- AMSE_RadarAltimeterController は計器オブジェクトの `-transform.up` 方向に測定します。配置の向きと LayerMask を確認します。
- AMSE_HeliGroundCyclic は GroundDetector、SaccFlight の接地状態、VTOL の角度範囲を確認します。
- AMSE_LoadGaugeController は接続状態に加えてロープの張りを判定します。荷物が地面に置かれている間は表示が 0 になる場合があります。

## ネットワーク機能の確認

1. 操縦者とアドオン GameObject の所有者を確認します。
2. 別プレイヤーから同じ表示が見えるか確認します。
3. 操縦者を交代し、更新が継続するか確認します。
4. 状態を変更した後に途中参加し、現在の状態が反映されるか確認します。

AMSE_SightView は「機体の照準器の展開状態」を共有し、「頭の前の映像」は操作したプレイヤーだけに表示します。他人の頭の前に同じ映像が出ないことは想定された動作です。

## 問題を記録する

使用したアドオン、Unity / SDK / SaccFlight のバージョン、Console の最初のエラー、設定を変更した項目、再現手順を記録すると切り分けやすくなります。
