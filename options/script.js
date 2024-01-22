function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    template: document.getElementById("template").value,
  });
}

function restoreOptions() {
  function setTemplate(result) {
    console.log(result);
    document.getElementById("template").value = result.template;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get("template");
  getting.then(setTemplate, onError);
}

function init() {
  document.getElementById("save").addEventListener("click", saveOptions);
  document.getElementById("discriptionUrl").innerText = `\${url}: ${browser.i18n.getMessage("discriptionUrl")}`;
  document.getElementById("discriptionTitle").innerText = `\${title}: ${browser.i18n.getMessage("discriptionTitle")}`;
  document.getElementById("save").innerText = browser.i18n.getMessage("save");
  restoreOptions();
}

document.addEventListener("DOMContentLoaded", init);
