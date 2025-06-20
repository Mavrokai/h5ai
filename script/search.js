document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  let resultsDiv = document.querySelector(".search-results");

  if (!resultsDiv) {
    resultsDiv = document.createElement("div");
    resultsDiv.className = "search-results";
    form.parentNode.insertBefore(resultsDiv, form.nextSibling);
  }

  resultsDiv.classList.remove("active");

  let allResults = [];
  let shownCount = 0;
  const PAGE_SIZE = 5;

  function renderResults() {
    resultsDiv.innerHTML = "";
    if (!allResults.length) {
      resultsDiv.innerHTML = "<em>Aucun résultat trouvé.</em>";
      return;
    }
    const list = document.createElement("ul");
    for (let i = 0; i < Math.min(shownCount, allResults.length); i++) {
      const item = allResults[i];
      const li = document.createElement("li");
      const icon = item.isDirectory ? "📁" : "📄";
      li.innerHTML = `${icon} <a href='/${item.path}'>${item.path}</a>`;
      list.appendChild(li);
    }
    resultsDiv.appendChild(list);
    if (shownCount < allResults.length) {
      const moreBtn = document.createElement("button");
      moreBtn.textContent = "PLUS";
      moreBtn.className = "search-more-btn";
      moreBtn.style.marginTop = "10px";
      moreBtn.onclick = function () {
        shownCount += PAGE_SIZE;
        renderResults();
      };
      resultsDiv.appendChild(moreBtn);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) {
      resultsDiv.classList.remove("active");
      return;
    }
    resultsDiv.innerHTML = "Recherche...";
    resultsDiv.classList.add("active");
    fetch(`/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        allResults = data;
        shownCount = PAGE_SIZE;
        renderResults();
        resultsDiv.classList.add("active");
      })
      .catch(() => {
        resultsDiv.innerHTML = "<em>Erreur lors de la recherche.</em>";
        resultsDiv.classList.add("active");
      });
  });

  input.addEventListener("input", function () {
    if (!input.value.trim()) {
      resultsDiv.classList.remove("active");
    }
  });
});
