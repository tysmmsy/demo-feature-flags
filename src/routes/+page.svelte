<!-- Feature Flags demo page: shows different UI based on flag values -->
<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Banner text mapping
	const bannerMessages: Record<string, string> = {
		spring: '春キャンペーン: 全品20%オフ!',
		summer: '夏キャンペーン: 5,000円以上で送料無料!',
		none: ''
	};

	const bannerMessage = $derived(bannerMessages[data.bannerText] || '');
</script>

<svelte:head>
	<title>Feature Flagsデモ</title>
</svelte:head>

{#if bannerMessage}
	<div class="banner" class:spring={data.bannerText === 'spring'} class:summer={data.bannerText === 'summer'}>
		{bannerMessage}
	</div>
{/if}

<main>
	<h1>Feature Flagsデモ</h1>
	<p>Vercel Flags SDKを使ったFeature Flagsのデモアプリケーションです。</p>

	<!-- Current flag status -->
	<section class="flag-status">
		<h2>現在のフラグ値</h2>
		<table>
			<thead>
				<tr>
					<th>フラグ名</th>
					<th>値</th>
					<th>効果</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>show-new-design</code></td>
					<td class="value">{data.showNewDesign ? 'true' : 'false'}</td>
					<td>{data.showNewDesign ? '新デザインを表示中' : '旧デザインを表示中'}</td>
				</tr>
				<tr>
					<td><code>banner-text</code></td>
					<td class="value">{data.bannerText}</td>
					<td>{bannerMessage || 'バナー非表示'}</td>
				</tr>
			</tbody>
		</table>
	</section>

	<!-- Design section that changes based on show-new-design flag -->
	<section class="design-demo">
		<h2>デザインセクション</h2>
		{#if data.showNewDesign}
			<!-- New Design -->
			<div class="new-design">
				<div class="card-grid">
					<div class="card">
						<div class="card-icon">1</div>
						<h3>高速なパフォーマンス</h3>
						<p>カードベースのモダンなレイアウトで視認性が向上しました</p>
					</div>
					<div class="card">
						<div class="card-icon">2</div>
						<h3>レスポンシブ対応</h3>
						<p>モバイルでも快適に閲覧できるデザインです</p>
					</div>
					<div class="card">
						<div class="card-icon">3</div>
						<h3>滑らかなアニメーション</h3>
						<p>インタラクションとトランジションが改善されました</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- Old Design -->
			<div class="old-design">
				<ul>
					<li>機能1 - 基本的なリスト形式のレイアウト</li>
					<li>機能2 - 従来のシンプルな表示方式</li>
					<li>機能3 - 必要最低限の機能を提供</li>
				</ul>
			</div>
		{/if}
	</section>

	<section class="instructions">
		<h2>テスト方法</h2>
		<ol>
			<li>Vercelツールバーを開きます(Vercelデプロイ環境ではページ下部に表示されます)</li>
			<li>ツールバー内のFlagsアイコンをクリックします</li>
			<li><code>show-new-design</code>を切り替えて、デザインの変化を確認します</li>
			<li><code>banner-text</code>を変更して、キャンペーンバナーの表示を確認します</li>
			<li>変更は再デプロイなしで即座に反映されます</li>
		</ol>

		<h3>フラグ定義</h3>
		<dl>
			<dt><code>show-new-design</code> (boolean)</dt>
			<dd>旧リスト形式レイアウトと新カード形式レイアウトを切り替えます</dd>

			<dt><code>banner-text</code> (string)</dt>
			<dd>
				<ul>
					<li><code>"spring"</code> - 春キャンペーンバナー(ピンク)</li>
					<li><code>"summer"</code> - 夏キャンペーンバナー(ブルー)</li>
					<li><code>"none"</code> - バナー非表示</li>
				</ul>
			</dd>
		</dl>
	</section>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}
	h1 { border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
	section { margin: 2rem 0; }

	/* Banner styles */
	.banner {
		text-align: center;
		padding: 0.8rem;
		font-weight: bold;
		font-size: 1.1rem;
	}
	.banner.spring {
		background: linear-gradient(135deg, #fce4ec, #f8bbd0);
		color: #880e4f;
	}
	.banner.summer {
		background: linear-gradient(135deg, #e3f2fd, #bbdefb);
		color: #0d47a1;
	}

	/* Flag status table */
	table { width: 100%; border-collapse: collapse; }
	th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
	th { background: #f4f4f4; }
	.value { font-family: monospace; font-weight: bold; color: #0070f3; }

	/* Old design */
	.old-design {
		background: #f9f9f9;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid #ddd;
	}
	.old-design ul { padding-left: 1.5rem; }
	.old-design li { margin: 0.5rem 0; }

	/* New design */
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}
	.card {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}
	.card-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #0070f3;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		font-weight: bold;
		margin: 0 auto 1rem;
	}
	.card h3 { margin: 0.5rem 0; }
	.card p { color: #666; font-size: 0.9rem; margin: 0; }

	/* Instructions */
	code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.9rem; }
	dl { margin-top: 1rem; }
	dt { font-weight: bold; margin-top: 1rem; }
	dd { margin-left: 1rem; color: #666; }
	dd ul { padding-left: 1.5rem; }
</style>
