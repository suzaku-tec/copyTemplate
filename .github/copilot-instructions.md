# CopyTemplate Firefox Add-on AI エージェント指示書

このドキュメントは、CopyTemplate Firefox Add-on のコードベースで作業する AI エージェント向けの重要な情報と指針をまとめたものです。

## プロジェクト概要

CopyTemplate は、ウェブページの URL やタイトルを定義済みのテンプレート形式でクリップボードにコピーするための Firefox 拡張機能です。

### アーキテクチャと主要コンポーネント

1. **バックグラウンドスクリプト** (`background_script.js`)

   - コンテキストメニューの作成と管理
   - テンプレートの適用とクリップボードへのコピー処理
   - `browser.storage.sync`を使用した設定の取得

2. **オプションページ** (`options/`)

   - テンプレート設定の UI (`index.html`)
   - 設定の保存と復元ロジック (`script.js`)
   - スタイリング (`style.css`)

3. **国際化** (`_locales/`)
   - 英語(`en`)と日本語(`ja`)のローカライズファイル
   - `messages.json`による文字列リソース管理

### 重要なパターンと規約

1. **テンプレート変数**

   - `${url}`: 現在のタブの URL
   - `${title}`: 現在のタブのタイトル

   ```javascript
   var str = template.replace("${url}", url).replace("${title}", title);
   ```

2. **テンプレートの管理**

   ```javascript
   // テンプレートのデータ構造
   const templates = [{ name: "テンプレート名", content: "テンプレート内容" }];

   // 保存
   browser.storage.sync.set({ templates });

   // 取得
   browser.storage.sync.get("templates");
   ```

   - テンプレートは`name`と`content`を持つオブジェクトの配列として管理
   - 設定変更時にコンテキストメニューを自動更新
   - UI での作成、編集、削除操作をサポート

3. **国際化文字列の使用**
   ```javascript
   browser.i18n.getMessage("messageKey");
   ```

### 開発ワークフロー

1. **デバッグ**

   - Firefox の about:debugging ページでアドオンをロード
   - コンソールログを使用したデバッグ情報の確認

2. **テスト**
   - コンテキストメニューの動作確認
   - テンプレートの保存と適用のテスト
   - 異なるロケールでの表示確認

### 重要な統合ポイント

1. **Firefox のクリップボードアクセス**

   - `navigator.clipboard.writeText()`を使用
   - `clipboardWrite`パーミッションが必要

2. **ブラウザストレージ**

   - `browser.storage.sync`を使用した設定の同期
   - エラーハンドリングパターンの遵守

3. **コンテキストメニュー**
   - `browser.contextMenus.create()`による作成
   - `browser.contextMenus.onClicked`でのイベントハンドリング
