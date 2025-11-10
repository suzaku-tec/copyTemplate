let templates = [];
let currentTemplateIndex = -1;

function saveOptions(e) {
  e.preventDefault();
  const templateName = document.getElementById("templateName").value;
  const templateContent = document.getElementById("template").value;

  if (currentTemplateIndex >= 0) {
    templates[currentTemplateIndex] = {
      name: templateName,
      content: templateContent,
    };
  } else {
    templates.push({ name: templateName, content: templateContent });
  }

  browser.storage.sync.set({ templates });
  updateTemplateList();
  clearForm();
}

function deleteTemplate(index) {
  templates.splice(index, 1);
  browser.storage.sync.set({ templates });
  updateTemplateList();
  clearForm();
}

function editTemplate(index) {
  currentTemplateIndex = index;
  const template = templates[index];
  document.getElementById("templateName").value = template.name;
  document.getElementById("template").value = template.content;
  document.getElementById("save").innerText = browser.i18n.getMessage("update");
}

function clearForm() {
  currentTemplateIndex = -1;
  document.getElementById("templateName").value = "";
  document.getElementById("template").value = "";
  document.getElementById("save").innerText = browser.i18n.getMessage("save");
}

function updateTemplateList() {
  const select = document.getElementById("templateSelect");
  select.innerHTML =
    '<option value="" disabled selected>Select Template</option>';

  templates.forEach((template, index) => {
    const option = document.createElement("option");
    option.value = index.toString();
    option.textContent = template.name;
    select.appendChild(option);
  });

  // 現在選択中のテンプレートがある場合は選択状態を復元
  if (currentTemplateIndex >= 0 && currentTemplateIndex < templates.length) {
    select.value = currentTemplateIndex.toString();
  }
}

function restoreOptions() {
  function migrateOldTemplate(oldTemplate) {
    // 古い形式のテンプレートを新しい形式に変換
    if (oldTemplate && typeof oldTemplate === "string") {
      return [
        {
          name: browser.i18n.getMessage("defaultTemplateName"),
          content: oldTemplate,
        },
      ];
    }
    return [];
  }

  function setTemplates(result) {
    if (result.templates) {
      // 新しい形式のデータが存在する場合
      templates = result.templates;
    } else {
      // 古い形式のデータを確認
      browser.storage.sync.get("template").then((oldResult) => {
        if (oldResult.template) {
          // 古いデータを新しい形式に変換
          templates = migrateOldTemplate(oldResult.template);
          // 新しい形式で保存
          browser.storage.sync.set({ templates }).then(() => {
            // 古いデータを削除
            browser.storage.sync.remove("template");
          });
        } else {
          templates = [];
        }
        updateTemplateList();
      });
      return;
    }
    updateTemplateList();
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  browser.storage.sync.get("templates").then(setTemplates, onError);
}

function onTemplateSelect(e) {
  const index = parseInt(e.target.value);
  if (!isNaN(index) && index >= 0 && index < templates.length) {
    editTemplate(index);
  }
}

function init() {
  document.getElementById("save").addEventListener("click", saveOptions);
  document.getElementById(
    "discriptionUrl"
  ).innerText = `\${url}: ${browser.i18n.getMessage("discriptionUrl")}`;
  document.getElementById(
    "discriptionTitle"
  ).innerText = `\${title}: ${browser.i18n.getMessage("discriptionTitle")}`;
  document.getElementById("save").innerText = browser.i18n.getMessage("save");
  document.getElementById("newTemplate").innerText =
    browser.i18n.getMessage("newTemplate");
  document.getElementById("deleteTemplate").innerText =
    browser.i18n.getMessage("delete");

  document
    .getElementById("templateSelect")
    .addEventListener("change", onTemplateSelect);
  document.getElementById("newTemplate").addEventListener("click", clearForm);
  document.getElementById("deleteTemplate").addEventListener("click", () => {
    const select = document.getElementById("templateSelect");
    const index = parseInt(select.value);
    if (!isNaN(index) && index >= 0) {
      deleteTemplate(index);
    }
  });

  restoreOptions();
}

document.addEventListener("DOMContentLoaded", init);
