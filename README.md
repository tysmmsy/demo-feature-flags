# Feature Flagsデモアプリケーション

Vercel Feature FlagsとFlags SDKを使用したデモアプリケーションです。
フラグの値に応じてUIが動的に切り替わる仕組みを確認できます。

## 概要

このアプリケーションでは、以下の2種類のFeature Flagを使用しています。

- show-new-design (boolean): リスト形式の旧デザインとカード形式の新デザインを切り替えます
- banner-text (string): キャンペーンバナーの表示を制御します (spring / summer / none)

フラグの値はVercel ToolbarやVercel Dashboardから変更でき、再デプロイなしで即座に反映されます。

## 技術スタック

- SvelteKit
- TypeScript
- Flags SDK (flags パッケージ)
- Vercel Toolbar (@vercel/toolbar)
- Vercel Adapter (@sveltejs/adapter-vercel)

## セットアップ

### 前提条件

- Node.js (LTS版)
- pnpm

### インストール

```
pnpm install
```

### ローカル開発

```
pnpm dev
```

### ビルド

```
pnpm build
```

## 環境変数

以下の環境変数の設定が必要です。

### FLAGS_SECRET

Flags SDKがフラグ値の署名・検証に使用するシークレットキーです。
Vercelのプロジェクト設定 > Environment Variablesから設定してください。

生成方法の例:

```
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

## 検証手順

### 手順1: 本番URLにアクセスしてデフォルト状態を確認

デプロイ済みのProduction URLにアクセスします。
デフォルトの状態では以下のようになっていることを確認してください。

- show-new-designがfalse
- banner-textがnone
- リスト形式の旧デザインが表示されている
- キャンペーンバナーが表示されていない

### 手順2: Vercel Toolbarからshow-new-designを切り替え

1. ページ下部に表示されているVercel Toolbarを開きます
2. Flagsアイコンをクリックします
3. show-new-designをtrueに切り替えます
4. ページが再読み込みされ、カード形式の新デザインに切り替わることを確認します

### 手順3: banner-textを切り替え

1. Vercel ToolbarのFlagsアイコンを再度クリックします
2. banner-textを "spring" に変更します
3. ピンク色の春キャンペーンバナーが表示されることを確認します
4. banner-textを "summer" に変更します
5. ブルーの夏キャンペーンバナーに切り替わることを確認します

### 手順4: Vercel Dashboardからフラグを変更

1. Vercel DashboardでプロジェクトのFlagsタブを開きます
2. フラグの値を変更します
3. 再デプロイなしで変更が反映されることを確認します

### 手順5 (任意): ブラウザ間の独立性を確認

1. 2つの異なるブラウザ(またはシークレットウィンドウ)でページを開きます
2. 片方のブラウザでのみVercel Toolbarからフラグをオーバーライドします
3. オーバーライドした側のみUIが変化し、もう片方は影響を受けないことを確認します

## セキュリティに関する注意事項

- FLAGS_SECRETは外部に公開しないでください。
  この値が漏洩すると、第三者がフラグ値を改ざんできる可能性があります。
- FLAGS_SECRETはサーバーサイドでのみ使用されます。
  クライアントサイドのコードに含めないでください。
- Vercelの環境変数設定では、Production / Preview / Developmentの各環境に適切に設定してください。
