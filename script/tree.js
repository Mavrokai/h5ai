function fetchTree(path) {
  return fetch(`/api/tree?path=${encodeURIComponent(path)}`).then((res) =>
    res.json()
  );
}

function getOpenFolders() {
  try {
    return JSON.parse(localStorage.getItem("openTreeFolders") || "[]");
  } catch {
    return [];
  }
}

function setOpenFolders(list) {
  localStorage.setItem("openTreeFolders", JSON.stringify(list));
}

function isFolderOpen(path) {
  return getOpenFolders().includes(path);
}

function toggleFolderOpen(path, open) {
  let list = getOpenFolders();
  if (open) {
    if (!list.includes(path)) list.push(path);
  } else {
    list = list.filter((p) => p !== path);
  }
  setOpenFolders(list);
}

function createTreeElement(node, parentPath = "") {
  const li = document.createElement("li");
  li.classList.add("tree-item");

  if (node.isDirectory) {
    const folderHeader = document.createElement("div");
    folderHeader.style.display = "flex";
    folderHeader.style.alignItems = "center";
    folderHeader.style.gap = "4px";
    folderHeader.style.cursor = "pointer";

    const icon = document.createElement("span");
    icon.classList.add("tree-icon", "tree-folder");
    icon.textContent = "📁";
    folderHeader.appendChild(icon);

    const span = document.createElement("span");
    span.textContent = node.name;
    folderHeader.appendChild(span);

    li.appendChild(folderHeader);

    const ul = document.createElement("ul");
    ul.classList.add("tree-children");
    ul.style.display = "none";
    li.appendChild(ul);

    let loaded = false;
    const fullPath = parentPath ? parentPath + "/" + node.name : node.name;

    async function openFolder() {
      ul.style.display = "block";
      toggleFolderOpen(fullPath, true);
      if (!loaded) {
        ul.innerHTML = '<li class="tree-item">Chargement...</li>';
        const children = await fetchTree(fullPath);
        ul.innerHTML = "";
        if (Array.isArray(children)) {
          children.forEach((child) => {
            ul.appendChild(createTreeElement(child, fullPath));
          });
        }
        loaded = true;

        getOpenFolders().forEach((openPath) => {
          if (openPath.startsWith(fullPath + "/")) {
            const subFolder = openPath.slice(fullPath.length + 1).split("/")[0];
            const subLi = Array.from(ul.children).find(
              (el) =>
                el.querySelector &&
                el.querySelector(".tree-folder") &&
                el.querySelector(".tree-folder").nextSibling.textContent ===
                  subFolder
            );
            if (subLi) {
              const clickEvent = new Event("click");
              subLi.querySelector("div").dispatchEvent(clickEvent);
            }
          }
        });
      }
    }

    folderHeader.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (ul.style.display === "none") {
        await openFolder();
      } else {
        ul.style.display = "none";
        toggleFolderOpen(fullPath, false);
      }
    });

    if (isFolderOpen(fullPath)) {
      setTimeout(() => openFolder(), 0);
    }
  } else {
    const icon = document.createElement("span");
    icon.classList.add("tree-icon", "tree-file");
    icon.textContent = "📄";
    li.appendChild(icon);

    const span = document.createElement("span");
    span.textContent = node.name;
    li.appendChild(span);
  }
  return li;
}

function renderTree(treeData, parentPath = "") {
  const container = document.getElementById("tree-container");
  container.innerHTML = "";
  const ul = document.createElement("ul");
  ul.classList.add("tree-list");
  for (let i = 0; i < treeData.length; i++) {
    ul.appendChild(createTreeElement(treeData[i], parentPath));
  }
  container.appendChild(ul);
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tree-container");
  container.innerHTML =
    '<div style="padding:10px; color:#888;">Chargement...</div>';
  const treeData = await fetchTree("");
  renderTree(treeData, "");
});
