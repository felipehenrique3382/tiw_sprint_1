// Carrega ao abrir a página
document.addEventListener("DOMContentLoaded", carregarFavoritos);

function carregarFavoritos() {
  try {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    exibirFavoritos(favoritos);
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
}

// Função para exibir favoritos
function exibirFavoritos(favoritos) {
  const lista = document.getElementById("listaFavoritos");
  
  if (!lista) {
    console.error("Elemento #listaFavoritos não encontrado no HTML.");
    return;
  }

  lista.innerHTML = "";

  if (favoritos.length === 0) {
    lista.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-heart" style="font-size: 4rem; color: #ddd;"></i>
        <p class="text-muted fs-4 mt-3">Você ainda não possui pacotes favoritos.</p>
        <a href="home.html" class="btn btn-primary mt-3">
          <i class="bi bi-search"></i> Explorar Pacotes
        </a>
      </div>
    `;
    return;
  }

  favoritos.forEach(item => {
    lista.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${item.poster}" class="card-img-top" alt="${item.titulo}" style="height: 250px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${item.titulo}</h5>
            <p class="card-text">
              <i class="bi bi-tag-fill text-primary"></i> ${item.genero}
            </p>
            <button class="btn btn-danger w-100" onclick="removerFavorito('${item.id}')">
              <i class="bi bi-heartbreak"></i> Remover dos Favoritos
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// Função para remover favorito
async function removerFavorito(id) {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (!usuarioLogado) return;

  try {
    const resposta = await fetch(`http://localhost:3000/dados/${id}`);
    const pacote = await resposta.json();

    // Remove o usuário da lista de favoritos do pacote
    if (pacote.favoritos && pacote.favoritos.includes(usuarioLogado)) {
      pacote.favoritos = pacote.favoritos.filter(u => u !== usuarioLogado);

      // Atualiza no servidor
      await fetch(`http://localhost:3000/dados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacote)
      });

      // Atualiza o localStorage
      let listaLocal = JSON.parse(localStorage.getItem("favoritos")) || [];
      listaLocal = listaLocal.filter(f => f.id !== id);
      localStorage.setItem("favoritos", JSON.stringify(listaLocal));

      // Recarrega a página de favoritos
      carregarFavoritos();
    }
  } catch (erro) {
    console.error("Erro ao remover favorito:", erro);
    alert("Erro ao remover pacote dos favoritos. Tente novamente.");
  }
}