function fetchTree(path) {
  fetch(`/api/tree?path=${encodeURIComponent(path)}`)
    .then((res) => res.json())
    .then((treeData) => renderTree(treeData));
}

function createTreeElement(node) {
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
    if (node.children) {
      node.children.forEach((child) => {
        ul.appendChild(createTreeElement(child));
      });
    }
    folderHeader.addEventListener("click", () => {
      if (ul.style.display === "none") {
        ul.style.display = "block";
      } else {
        ul.style.display = "none";
      }
    });
    li.appendChild(ul);
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

function renderTree(treeData) {
  const container = document.getElementById("tree-container");
  container.innerHTML = "";
  const ul = document.createElement("ul");
  ul.classList.add("tree-list");
  treeData.forEach((node) => {
    ul.appendChild(createTreeElement(node));
  });
  container.appendChild(ul);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchTree(window.rootPath || "");
});
