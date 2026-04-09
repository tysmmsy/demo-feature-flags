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

## ファイル構成と変更箇所

```
src/
  lib/
    flags.ts              # フラグ定義（新規追加）
  routes/
    +page.server.ts       # サーバーサイドでフラグ評価（新規追加）
    +page.svelte          # フラグ値に基づくUI切り替え（新規追加）
  hooks.server.ts         # Flags SDKのサーバーフック（新規追加）
vite.config.ts            # Vercel Toolbarプラグイン追加（変更）
package.json              # flags, @vercel/toolbar 追加（変更）
```

## 実装の解説

### 1. パッケージの追加 (package.json)

```bash
pnpm add flags @vercel/toolbar @sveltejs/adapter-vercel
```

### 2. フラグの定義 (src/lib/flags.ts)

`flag()` でフラグを定義します。
`key` がフラグの識別子、`options` がToolbarやFlags Explorerに表示される選択肢です。

```typescript
import { flag } from 'flags/sveltekit';

// Boolean型: 新デザインの表示切り替え
export const showNewDesign = flag<boolean>({
  key: 'show-new-design',
  description: 'Show the new design of the page',
  defaultValue: false,
  options: [
    { value: true, label: 'New Design' },
    { value: false, label: 'Old Design' }
  ],
  decide() {
    return this.defaultValue as boolean;
  }
});

// String型: バナーテキストのバリアント
export const bannerText = flag<string>({
  key: 'banner-text',
  description: 'Campaign banner text variant',
  defaultValue: 'none',
  options: [
    { value: 'spring', label: 'Spring Campaign' },
    { value: 'summer', label: 'Summer Campaign' },
    { value: 'none', label: 'No Banner' }
  ],
  decide() {
    return this.defaultValue as string;
  }
});
```

### 3. サーバーフックの設定 (src/hooks.server.ts)

`createHandle()` でFlags SDKをSvelteKitに統合します。
`/.well-known/vercel/flags` エンドポイントが自動で作成され、Flags Explorerがフラグを検出できるようになります。

```typescript
import { createHandle } from 'flags/sveltekit';
import { env } from '$env/dynamic/private';
import * as flags from '$lib/flags';

export const handle = createHandle({
  secret: env.FLAGS_SECRET ?? '',
  flags
});
```

### 4. サーバーサイドでのフラグ評価 (src/routes/+page.server.ts)

サーバーサイドのload関数でフラグを評価し、結果をクライアントに渡します。

```typescript
import { showNewDesign, bannerText } from '$lib/flags';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [isNewDesign, banner] = await Promise.all([
    showNewDesign(),
    bannerText()
  ]);

  return {
    showNewDesign: isNewDesign,
    bannerText: banner
  };
};
```

### 5. クライアントサイドでの条件分岐 (src/routes/+page.svelte)

フラグの値に応じてUIを切り替えます。

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<!-- デザインの切り替え -->
{#if data.showNewDesign}
  <!-- カード形式の新デザイン -->
{:else}
  <!-- リスト形式の旧デザイン -->
{/if}

<!-- バナーの切り替え -->
{#if data.bannerText === 'spring'}
  <div class="banner spring">春キャンペーン: 全品20%オフ!</div>
{:else if data.bannerText === 'summer'}
  <div class="banner summer">夏キャンペーン: 5,000円以上で送料無料!</div>
{/if}
```

### 6. Vite設定にToolbarプラグインを追加 (vite.config.ts)

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { vercelToolbar } from '@vercel/toolbar/plugins/vite';

export default defineConfig({
  plugins: [vercelToolbar(), sveltekit()]
});
```

## セットアップ

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

Flags SDKがToolbarオーバーライドの暗号化/復号に使用するシークレットキーです。

生成方法:

```
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

## Vercel Dashboardからの設定手順

### FLAGS_SECRETの設定

1. Vercel Dashboardでプロジェクトを開きます
2. Settings > Environment Variablesに移動します
3. 「Add New」をクリックします
4. Key: `FLAGS_SECRET`、Value: 生成したシークレット値を入力します
5. Production / Preview / Developmentの3つすべてにチェックを入れます
6. 「Save」をクリックします

設定後、デプロイを実行して反映させてください。

### フラグの作成と管理

1. Vercel Dashboardでプロジェクトを開きます
2. 左メニューの「Flags」タブをクリックします
3. 「Create Flag」をクリックします
4. フラグ情報を入力します
   - show-new-designの場合: Slug: `show-new-design`、Type: Boolean
   - banner-textの場合: Slug: `banner-text`、Type: String、Variants: `spring` / `summer` / `none`
5. 「Create」をクリックします
6. 作成したフラグをクリックし、「Configuration」タブで各環境の値を設定します
   - Production: Static Value → 任意の値
   - Preview: Static Value → テスト用の値
7. 「Save」をクリックします

フラグ値の変更は再デプロイなしで即座に反映されます。

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

## フラグの評価フロー

```
1. ユーザーがページにアクセス
   ↓
2. SvelteKitのserver load関数が実行される
   ↓
3. Flags SDKがフラグの値を評価:
   a. ToolbarのオーバーライドCookieがあるか確認
      → あればFLAGS_SECRETで復号し、その値を使用
   b. Vercel Flags Dashboardの設定を確認
      → ターゲティングルールを評価
   c. どちらもなければdecide()のデフォルト値を使用
   ↓
4. 評価された値がPageDataとしてSvelteコンポーネントに渡される
   ↓
5. コンポーネントが値に基づいて条件付きレンダリング
```

## セキュリティに関する注意事項

- FLAGS_SECRETは外部に公開しないでください。
  この値が漏洩すると、第三者がフラグ値を改ざんできる可能性があります
- FLAGS_SECRETはサーバーサイドでのみ使用されます。
  クライアントサイドのコードに含めないでください
- Vercelの環境変数設定では、Production / Preview / Developmentの各環境に適切に設定してください
