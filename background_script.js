// Create parent menu
browser.contextMenus.create(
  {
    id: "copyTemplate-parent",
    title: browser.i18n.getMessage("copyTemplateTitle"),
    contexts: ["all"],
  },
  () => void browser.runtime.lastError
);

// Update context menu items when templates change
function updateContextMenus(templates) {
  // Remove all existing template menu items
  browser.contextMenus.removeAll().then(() => {
    // Recreate parent menu
    browser.contextMenus.create({
      id: "copyTemplate-parent",
      title: browser.i18n.getMessage("copyTemplateTitle"),
      contexts: ["all"],
    });

    // Create menu items for each template
    templates.forEach((template, index) => {
      browser.contextMenus.create({
        id: `copyTemplate-${index}`,
        parentId: "copyTemplate-parent",
        title: template.name,
        contexts: ["all"],
      });
    });
  });
}

// Listen for template changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.templates) {
    updateContextMenus(changes.templates.newValue || []);
  }
});

// Initialize context menus
browser.storage.sync.get("templates").then((result) => {
  updateContextMenus(result.templates || []);
});

// Handle menu item clicks
browser.contextMenus.onClicked.addListener(function (info, tab) {
  const match = info.menuItemId.match(/^copyTemplate-(\d+)$/);
  if (match) {
    const templateIndex = parseInt(match[1]);
    browser.storage.sync.get("templates").then((result) => {
      const templates = result.templates || [];
      if (templateIndex < templates.length) {
        const template = templates[templateIndex];
        const url = tab.url;
        const title = tab.title;
        const str = template.content
          .replace("${url}", url)
          .replace("${title}", title);
        navigator.clipboard.writeText(str);
      }
    });
  }
});
