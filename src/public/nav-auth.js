function parseJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return null; }
}

const LOGOUT_ICON = `
<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
  <path d="M5 21q-.825 0-1.412-.587Q3 19.825 3 19V5q0-.825.588-1.412Q4.175 3 5 3h7v2H5v14h7v2Zm12-4-1.375-1.45 2.55-2.55H9v-2h9.175l-2.55-2.55L17 7l5 5Z"/>
</svg>
`;

function logout(){
  sessionStorage.removeItem("token");
  location.href = "./index.html";
}

(function initNavAuth(){
  const token = sessionStorage.getItem("token");
  const payload = token ? parseJwt(token) : null;
  const role = payload?.role;

  document.querySelectorAll(".nav-guest").forEach(el => {
    el.style.display = token ? "none" : "";
  });

  document.querySelectorAll(".nav-user").forEach(el => {
    el.style.display = token ? "" : "none";
  });

  document.querySelectorAll(".nav-admin").forEach(el => {
    el.style.display = (token && role === "ADMIN") ? "" : "none";
  });

  const btn = document.querySelector(".nav-logout");
  if (btn) {
    if (btn.classList.contains("icon-btn")) {
      btn.innerHTML = LOGOUT_ICON;
      btn.setAttribute("aria-label", "Logout");
      btn.title = "Logout";
    } else {
      btn.textContent = "Logout";
    }
    btn.style.display = token ? (btn.classList.contains("icon-btn") ? "flex" : "inline-block") : "none";
    btn.onclick = logout;
  }
})();
