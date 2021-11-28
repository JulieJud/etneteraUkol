const change = document.querySelector("#theme-switch-toggle")
change.addEventListener("click", toggleTheme)

function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  document.body.className = themeName;
}

function toggleTheme() {
  if (localStorage.getItem("theme") === "dark-theme") {
  setTheme ("light-theme");
} else  {
  setTheme ("dark-theme");
}
}

(function () {
  if (localStorage.getItem("theme") === "dark-theme") {
    setTheme("dark-theme");
    document.getElementById("theme-switch-toggle").checked = true;
  } else {
    setTheme("light-theme");
  }
})();