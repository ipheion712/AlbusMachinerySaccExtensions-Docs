---
title: 対応環境
description: 文書の参照環境と、アドオンごとの依存関係。
---

## 文書の参照環境

| 項目 | 参照したバージョン | 確認元 |
| --- | --- | --- |
| Unity | 2022.3.22f1 | `ProjectSettings/ProjectVersion.txt` |
| VRChat SDK Worlds | 3.10.4 | `Packages/vpm-manifest.json` |
| SaccFlightAndVehicles | 1.8.1 | `Assets/SaccFlightAndVehicles/package.json` |
| UdonSharp | 参照プロジェクト内の UdonSharp | `Assets/UdonSharp` |

この表はソースの参照環境です。動作確認済みのバージョン範囲や PC / Android の対応範囲は、まだ確定していません。異なる環境では、配布元の案内とコンパイル結果を確認してください。

## 機能ごとの依存関係

| 機能 | 必要なもの |
| --- | --- |
| Ball AI | 機体の Transform。または `VehicleTransform` を公開する SAVControl |
| 電波高度計 | 計器 Animator、地面の Collider と Layer |
| 荷重計 | `DFUNC_Grapple`、吊り荷 Rigidbody、計器 Animator |
| Flight Instruments Type A | SaccFlight の `SaccGaugeController` と SAVControl |
| RotorStall / HeliGroundCyclic | SaccAirVehicle と SaccEntity。後者は `VTOLOnly` が必要 |
| EngineStartupRespawnReset | SaccEntity と `DFUNC_ToggleEngine` |
| SoundController | `SAV_SoundController` と SAVControl |
| SightView | 既存の照準 Camera / RenderTexture。展開演出には Animator |
| AnimatorParameterRelay | 転送元・転送先の Animator Controller |

照準ビューは `VRC.SDK3.UdonNetworkCalling` を使用しています。これを提供しない SDK ではコンパイルできません。対応する最小 SDK バージョンは、この初版では確定していません。

## 準備

- VCC で作成した Worlds プロジェクトに、SaccFlightAndVehicles を導入します。
- 機体が、アドオンなしの状態で動作することを確認します。
- 配布パッケージの依存アセットを含めてインポートします。
- 機体 Prefab の作業用コピーまたは Variant を用意します。

既存の機体だけが必要とするシェーダーや他のツールは、このサイトの全アドオン共通依存ではありません。

[共通の導入手順へ](../installation/)
