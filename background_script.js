// Put all the javascript code here, that you want to execute in background.
browser.contextMenus.create(
  {
    id: "copyTemplate-selection",
    title: "test" + browser.i18n.getMessage("copyTemplateTitle"),
    contexts: ["all"],
  },
  () => void browser.runtime.lastError,
);

browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "copyTemplate-selection":
      var getting = browser.storage.sync.get("template");
      getting.then(
        (result) => {
          var template = result.template ?? "";
          var url = tab.url;
          var title = tab.title;
          var str = template.replace("${url}", url).replace("${title}", title);
          navigator.clipboard.writeText(str);
        }
      );
    break;
  }
});

