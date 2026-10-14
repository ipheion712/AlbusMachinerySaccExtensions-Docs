# AlbusMachinery Sacc Extensions Docs

ALBUS MACHINERY の SaccFlightAndVehicles 用アドオンの日本語マニュアルです。

- 公開先：`https://ipheion712.github.io/AlbusMachinerySaccExtensions-Docs/`
- 構成：Astro / Starlight / Pagefind、静的生成
- 本文：`src/content/docs/`
- 配布先：未確定。本体のモデル・音声・Unity アセットは含みません。

## ローカルで確認する

Node.js 24 と pnpm 11.25.0 を使用します。依存関係は lockfile に固定しています。

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm preview
```

プレビュー URL は `http://127.0.0.1:4321/AlbusMachinerySaccExtensions-Docs/` です。編集時は `pnpm dev` を使えます。検索は本番ビルド後のプレビューで確認します。

`pnpm build` は、ビルド後に内部リンク・アンカー・静的アセット、公開サブパス、日本語 HTML、UTF-8、検索出力、アドオン記事数、Inspector 設定の掲載を検査します。

## GitHub Pages を有効にする

1. このリポジトリの `main` にサイトのファイルを配置します。
2. GitHub の **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にします。
3. **Actions → Validate and deploy documentation → Run workflow** を実行します。
4. `build` と `deploy` の成功後、公開 URL を確認します。

以後は `main` の更新で検査・公開します。Pull Request は検査のみで、本番公開しません。Pages をまだ有効にしていない状態では公開ジョブが失敗することがあるため、設定後に再実行してください。

## 文書を更新する

1. `templates/addon.md` を参考に記事を追加・更新します。
2. コード初期値と Prefab 保存値を別に確認します。
3. private な SerializeField も設定表へ含め、実行時状態と区別します。
4. 本体の配布バージョン、文書確認日、導入再現・複数人テストの結果を記録します。
5. `pnpm check` と `pnpm build` を実行します。

リンクは GitHub Pages の base 内で動く相対 URL を使います。特に、記事の URL は末尾 `/` を含むため、兄弟記事は `../記事名/`、共通ガイドは `../../getting-started/…/` です。

## Unity ソースとの照合

初版は 2026-10-14 時点のソースとシリアライズされたアセットを参照しています。Unity の導入再現・実機・複数人テストは未実施です。`content/source-baseline.json` に参照ファイルの SHA-256 と設定項目の一覧を保存しています。絶対パスや本体ソースは含みません。

Unity プロジェクトが手元にある場合：

```sh
pnpm audit:sources --source-root "D:/path/to/UnityProject"
```

ソースに変更があれば失敗し、見直すファイルを表示します。記事を見直した後にのみ基準を更新します。

```sh
pnpm audit:sources --source-root "D:/path/to/UnityProject" --write
```

`scripts/source-map.mjs` の Inspector 抽出は、このプロジェクトの単純な C# フィールド宣言を対象にした補助処理です。複雑な宣言や条件コンパイルを追加した場合は、ソースを手動で見直します。基準の日付もレビュー日に合わせて更新してください。

## 関連資料

- [Starlight](https://starlight.astro.build/)
- [Astro の GitHub Pages 公開手順](https://docs.astro.build/en/guides/deploy/github/)
- [SaccFlightAndVehicles](https://github.com/Sacchan-VRC/SaccFlightAndVehicles)
- [pnpm のインストール](https://pnpm.io/installation)
