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

---

## Vercel Dashboardでの設定手順

コードのデプロイ後、Vercel Dashboardで以下の設定を行います。

### Step 1: FLAGS_SECRETの設定

FLAGS_SECRETはVercel Toolbarからフラグをオーバーライドする際の暗号化/復号に使用されるシークレットキーです。
Dashboardでフラグを作成・管理する操作自体には不要ですが、Toolbarでの動作確認に必須のため最初に設定します。

1. ターミナルでシークレットキーを生成します
   ```
   node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
   ```
2. Vercel Dashboard > プロジェクト > Settings > Environment Variablesに移動します
3. 「Add New」をクリックします
4. Key: `FLAGS_SECRET`、Value: 生成した値を入力します
5. Environment: Production / Preview / Developmentの3つすべてにチェックを入れます
6. 「Save」をクリックします
7. 設定を反映するためにデプロイを実行します(GitHubにプッシュするか、Deployments > Redeploy)

### Step 2: フラグの作成

1. Vercel Dashboard > プロジェクト > 左メニューの「Flags」タブをクリックします
2. 「Create Flag」をクリックします

show-new-designフラグ(Boolean型):
- Slug: `show-new-design`
- Type: Boolean
- Description: 新デザインの表示切り替え
- 「Create」をクリックします

banner-textフラグ(String型):
- Slug: `banner-text`
- Type: String
- Variants: `spring`(Spring Campaign) / `summer`(Summer Campaign) / `none`(No Banner)
- 「Create」をクリックします

### Step 3: フラグ値の環境別設定

作成したフラグをクリックし、「Configuration」タブで各環境の値を設定します。

show-new-designの設定例:
- Production: Static Value → `false`(旧デザインを表示)
- Preview: Static Value → `true`(新デザインでテスト)
- Development: Reuse Preview Config

banner-textの設定例:
- Production: Static Value → `none`(バナーなし)
- Preview: Static Value → `spring`(春キャンペーンでテスト)
- Development: Reuse Preview Config

「Save」をクリックすると、再デプロイなしで即座に反映されます。

### Step 4: ターゲティングルールの設定(任意)

ユーザーの属性に基づいてフラグ値を切り替えたい場合:

1. フラグのConfigurationタブを開きます
2. 「Add Rule」をクリックします
3. 条件を設定します(例: メールアドレスが特定ドメインで終わる場合のみtrue)
4. マッチした場合の値とフォールバック値を設定します
5. 「Save」をクリックします

---

## 検証手順

### 手順1: デフォルト状態の確認

Production URLにアクセスし、以下を確認します。

- 「現在のフラグ値」テーブルでshow-new-designがfalse、banner-textがnoneになっている
- リスト形式の旧デザインが表示されている
- キャンペーンバナーが表示されていない

### 手順2: Vercel Toolbarからshow-new-designを切り替え

1. ページ下部に表示されているVercel Toolbarを開きます
2. Flagsアイコン(旗マーク)をクリックします
3. show-new-designをtrueに切り替えます
4. ページが再読み込みされ、カード形式の新デザインに切り替わることを確認します

ToolbarはVercelチームメンバーとしてログインしている場合のみ表示されます。

### 手順3: banner-textを切り替え

1. Vercel ToolbarのFlagsアイコンを再度クリックします
2. banner-textを `spring` に変更します
3. ピンク色の「春キャンペーン: 全品20%オフ!」バナーが表示されることを確認します
4. banner-textを `summer` に変更します
5. ブルーの「夏キャンペーン: 5,000円以上で送料無料!」バナーに切り替わることを確認します

### 手順4: Dashboardからフラグ値を変更(再デプロイなし)

1. Vercel Dashboard > プロジェクト > Flagsタブを開きます
2. show-new-designのProduction値をtrueに変更します
3. Production URLをリロードします
4. 再デプロイしていないのに、カード形式の新デザインに切り替わることを確認します
5. 値をfalseに戻すと、リスト形式に戻ることを確認します

### 手順5 (任意): ブラウザ間の独立性を確認

1. 2つの異なるブラウザ(またはシークレットウィンドウ)で同じURLを開きます
2. 片方のブラウザでのみVercel Toolbarからフラグをオーバーライドします
3. オーバーライドした側のみUIが変化し、もう片方は影響を受けないことを確認します

Toolbarのオーバーライドは各ブラウザのCookieにFLAGS_SECRETで暗号化して保存されるため、他のユーザーに影響しません。

---

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

## ソースコードの実装解説

### 1. パッケージの追加

```bash
pnpm add flags @vercel/toolbar @sveltejs/adapter-vercel
```

### 2. フラグの定義 (src/lib/flags.ts)

`flag()` でフラグを定義します。
`key` はDashboardのSlugと一致させます。
`options` はToolbarのFlags Explorerに表示される選択肢です。

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
以下の機能が有効になります:
- `/.well-known/vercel/flags` エンドポイントが自動作成されます(Flags Explorerがフラグを検出するために使用)
- ToolbarのオーバーライドCookieがFLAGS_SECRETで復号されます

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

サーバーから受け取ったフラグの値に応じてUIを切り替えます。

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

---

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

## セットアップ(ローカル開発)

```
pnpm install
pnpm dev
```

## セキュリティに関する注意事項

- FLAGS_SECRETは外部に公開しないでください。
  この値が漏洩すると、第三者がToolbar経由でフラグ値を改ざんできる可能性があります
- FLAGS_SECRETはサーバーサイドでのみ使用されます。
  クライアントサイドのコードに含めないでください
- Dashboardでのフラグ作成・管理自体にはFLAGS_SECRETは不要です。
  FLAGS_SECRETはToolbarオーバーライド機能と/.well-known/vercel/flagsエンドポイントの保護に使われます
