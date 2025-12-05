document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("usuarioLogado");
  let user = null;

  try {
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("usuarioLogado inválido no localStorage:", raw);
    localStorage.removeItem("usuarioLogado");
    user = null;
  }

  const menu = document.getElementById("menu-links");
  
  if (!menu) {
    console.warn("Elemento #menu-links não encontrado. Verifique o HTML da navbar.");
    return;
  }

  // Remove item de usuário anterior se existir
  const prevUserInfo = menu.querySelector(".user-info-item");
  if (prevUserInfo) prevUserInfo.remove();

  // Se o usuário estiver logado
  if (user) {
    // Remove o link de login
    const loginAnchor = menu.querySelector('a[href="login.html"]');
    if (loginAnchor) {
      const parentLi = loginAnchor.closest("li");
      if (parentLi) parentLi.remove();
    }

    // Cria item com nome do usuário + botão de sair
    const li = document.createElement("li");
    li.className = "nav-item user-info-item d-flex align-items-center";
    li.style.gap = "0.5rem";
    
    li.innerHTML = `
      <span class="nav-link text-white p-0 me-2">
        <i class="bi bi-person-circle"></i> 
        Olá, <strong>${escapeHtml(user.nome || user.login || "Usuário")}</strong>
      </span>
      <button id="logoutBtn" class="btn btn-sm btn-outline-light">
        <i class="bi bi-box-arrow-right"></i> Sair
      </button>
    `;
    
    menu.appendChild(li);

    // Adiciona evento de logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("Deseja realmente sair?")) {
          localStorage.removeItem("usuarioLogado");
          localStorage.removeItem("favoritos"); // Limpa favoritos locais
          window.location.href = "login.html";
        }
      });
    }
  } else {
    // Se não estiver logado, verifica se o link de login existe
    let loginExists = menu.querySelector('a[href="login.html"]');
    
    if (!loginExists) {
      const li = document.createElement("li");
      li.className = "nav-item";
      li.innerHTML = `
        <a class="nav-link me-4 text-white" href="login.html">
          <i class="bi bi-box-arrow-in-right"></i> Login
        </a>
      `;
      menu.appendChild(li);
    }
  }

  // Função auxiliar para escapar HTML e evitar injeção via localStorage
  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }
});