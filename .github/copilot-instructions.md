# CopyTemplate Firefox Add-on AIエージェント指示書

このドキュメントは、CopyTemplate Firefox Add-onのコードベースで作業するAIエージェント向けの重要な情報と指針をまとめたものです。

## プロジェクト概要

CopyTemplateは、ウェブページのURLやタイトルを定義済みのテンプレート形式でクリップボードにコピーするためのFirefox拡張機能です。

### アーキテクチャと主要コンポーネント

1. **バックグラウンドスクリプト** (`background_script.js`)
   - コンテキストメニューの作成と管理
   - テンプレートの適用とクリップボードへのコピー処理
   - `browser.storage.sync`を使用した設定の取得

2. **オプションページ** (`options/`)
   - テンプレート設定のUI (`index.html`)
   - 設定の保存と復元ロジック (`script.js`)
   - スタイリング (`style.css`)

3. **国際化** (`_locales/`)
   - 英語(`en`)と日本語(`ja`)のローカライズファイル
   - `messages.json`による文字列リソース管理

### 重要なパターンと規約

1. **テンプレート変数**
   - `${url}`: 現在のタブのURL
   - `${title}`: 現在のタブのタイトル
   ```javascript
   var str = template.replace("${url}", url).replace("${title}", title);
   ```

2. **設定の保存と取得**
   ```javascript
   // 保存
   browser.storage.sync.set({
     template: value
   });
   
   // 取得
   browser.storage.sync.get("template");
   ```

3. **国際化文字列の使用**
   ```javascript
   browser.i18n.getMessage("messageKey")
   ```

### 開発ワークフロー

1. **デバッグ**
   - Firefoxのabout:debuggingページでアドオンをロード
   - コンソールログを使用したデバッグ情報の確認

2. **テスト**
   - コンテキストメニューの動作確認
   - テンプレートの保存と適用のテスト
   - 異なるロケールでの表示確認

### 重要な統合ポイント

1. **Firefoxのクリップボードアクセス**
   - `navigator.clipboard.writeText()`を使用
   - `clipboardWrite`パーミッションが必要

2. **ブラウザストレージ**
   - `browser.storage.sync`を使用した設定の同期
   - エラーハンドリングパターンの遵守

3. **コンテキストメニュー**
   - `browser.contextMenus.create()`による作成
   - `browser.contextMenus.onClicked`でのイベントハンドリング