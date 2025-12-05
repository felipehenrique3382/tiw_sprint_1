let todosPacotes = [];
const url = "http://localhost:3000/dados";

// Função para obter usuário logado do localStorage
function getUsuarioLogadoRaw() {
  return localStorage.getItem("usuarioLogado");
}

function getUsuarioLogadoObj() {
  const raw = getUsuarioLogadoRaw();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

// Verifica se um pacote tem o usuário nos favoritos
function pacoteContemUsuarioNosFavoritos(pacote, usuarioRaw, usuarioObj) {
  if (!pacote || !Array.isArray(pacote.favoritos)) return false;
  if (usuarioRaw && pacote.favoritos.includes(usuarioRaw)) return true;

  return pacote.favoritos.some((fav) => {
    if (!fav) return false;
    if (typeof fav === "string") {
      try {
        const parsed = JSON.parse(fav);
        if (!parsed) return false;
        if (usuarioObj && parsed.id && usuarioObj.id && String(parsed.id) === String(usuarioObj.id)) return true;
        if (usuarioObj && parsed.login && usuarioObj.login && parsed.login === usuarioObj.login) return true;
        if (usuarioObj && parsed.email && usuarioObj.email && parsed.email === usuarioObj.email) return true;
      } catch {
        return false;
      }
    }
    if (typeof fav === "object") {
      if (usuarioObj && fav.id && usuarioObj.id && String(fav.id) === String(usuarioObj.id)) return true;
      if (fav.login && usuarioObj.login && fav.login === usuarioObj.login) return true;
      if (fav.email && usuarioObj.email && fav.email === usuarioObj.email) return true;
    }
    return false;
  });
}

// Carregar dados (principal)
const carregarDados = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch /dados retornou " + res.status);
    const dados = await res.json();
    todosPacotes = Array.isArray(dados) ? dados : [];
    geraCarrossel(todosPacotes);
    geraCards(todosPacotes);

    const detalhesContainer = document.getElementById("detalhes");
    if (detalhesContainer) {
      geraDetalhes(todosPacotes);
    }
  } catch (erro) {
    console.error("[carregarDados] Erro ao carregar dados:", erro);
  }
};

// Carrossel
function geraCarrossel(objeto) {
  const carrosselContainer = document.getElementById("carrossel-container");
  if (!carrosselContainer) return;

  let innerHtml = "";
  objeto.forEach((pacote, posicao) => {
    const itemActiveClass = posicao === 0 ? "active" : "";
    const desconto = pacote.direcao && pacote.roteiro 
      ? Math.round(((pacote.direcao - pacote.roteiro) / pacote.direcao) * 100)
      : 0;

    innerHtml += `
      <div class="carousel-item ${itemActiveClass}">
        <div class="container py-4">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h3 class="display-5 fw-bold">${escapeHtml(pacote.titulo || "")}</h3>
              ${desconto > 0 ? `<span class="badge bg-danger fs-5 mb-3">${desconto}% OFF</span>` : ''}
              <p class="lead">${escapeHtml(pacote.status || "")}</p>
              <p>${escapeHtml(pacote.sinopse || "")}</p>
              <div class="d-flex align-items-center gap-3 mb-3">
                ${pacote.direcao ? `<span class="text-muted text-decoration-line-through">De R$ ${pacote.direcao}</span>` : ''}
                ${pacote.roteiro ? `<span class="h3 text-success mb-0">Por R$ ${pacote.roteiro}</span>` : ''}
              </div>
              <a href="detalhe.html?id=${encodeURIComponent(pacote.id)}" class="btn btn-primary btn-lg">
                <i class="bi bi-info-circle"></i> Ver Detalhes
              </a>
            </div>
            <div class="col-md-6">
              <img src="${escapeHtml(pacote.capa || "")}" 
                   class="img-fluid rounded shadow" 
                   alt="${escapeHtml(pacote.titulo || "")}" 
                   style="max-height: 400px; width: 100%; object-fit: cover;">
            </div>
          </div>
        </div>
      </div>
    `;
  });

  carrosselContainer.innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide bg-light" data-bs-ride="carousel">
      <div class="carousel-inner">
        ${innerHtml}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Próximo</span>
      </button>
    </div>
  `;
}

// Cards
function geraCards(objeto) {
  const cardsContainer = document.getElementById("cards");
  if (!cardsContainer) return;

  const usuarioRaw = getUsuarioLogadoRaw();
  const usuarioObj = getUsuarioLogadoObj();

  let cardsHtml = "";
  objeto.forEach((pacote) => {
    const isFav = pacoteContemUsuarioNosFavoritos(pacote, usuarioRaw, usuarioObj);
    const iconeFavorito = isFav
      ? `<span class="icone-favorito ms-2" data-pacote-id="${escapeHtml(pacote.id)}">
           <i class="bi bi-heart-fill text-danger" style="cursor:pointer;"></i>
         </span>`
      : `<span class="icone-favorito ms-2" data-pacote-id="${escapeHtml(pacote.id)}">
           <i class="bi bi-heart" style="cursor:pointer;"></i>
         </span>`;

    const desconto = pacote.direcao && pacote.roteiro 
      ? Math.round(((pacote.direcao - pacote.roteiro) / pacote.direcao) * 100)
      : 0;

    cardsHtml += `
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card h-100 shadow-sm">
          ${desconto > 0 ? `<div class="position-relative">
            <span class="position-absolute top-0 end-0 m-2 badge bg-danger">${desconto}% OFF</span>
          </div>` : ''}
          <img src="${escapeHtml(pacote.capa || "")}" 
               class="card-img-top" 
               alt="${escapeHtml(pacote.titulo || "")}" 
               style="height: 250px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              ${escapeHtml(pacote.titulo || "")}
              ${iconeFavorito}
            </h5>
            <p class="card-text">
              <i class="bi bi-geo-alt-fill text-primary"></i> 
              <strong>${escapeHtml(pacote.status || "")}</strong>
            </p>
            <p class="card-text small">
              <i class="bi bi-calendar3"></i> ${escapeHtml(pacote.duracao || "")}
            </p>
            <p class="card-text small">
              <i class="bi bi-tag-fill"></i> ${escapeHtml(
                Array.isArray(pacote.generos) ? pacote.generos.join(", ") : pacote.generos || ""
              )}
            </p>
            ${pacote.direcao ? `<p class="card-text small text-muted text-decoration-line-through">
              De R$ ${escapeHtml(pacote.direcao)}
            </p>` : ''}
            ${pacote.roteiro ? `<p class="card-text h5 text-success">
              R$ ${escapeHtml(pacote.roteiro)}
            </p>` : ''}
            <a href="detalhe.html?id=${encodeURIComponent(pacote.id)}" 
               class="btn btn-primary mt-auto">
              <i class="bi bi-info-circle"></i> Ver Detalhes
            </a>
          </div>
        </div>
      </div>
    `;
  });

  cardsContainer.innerHTML = cardsHtml;

  document.querySelectorAll(".icone-favorito").forEach((icone) => {
    icone.addEventListener("click", () => {
      const idPacote = icone.getAttribute("data-pacote-id");
      marcarFavorito(idPacote);
    });
  });
}

// Marcar / Desmarcar favorito
async function marcarFavorito(idPacote) {
  const usuarioRaw = getUsuarioLogadoRaw();
  if (!usuarioRaw) {
    alert("Você precisa estar logado para favoritar pacotes.");
    return;
  }

  const usuarioObj = getUsuarioLogadoObj();

  try {
    const resposta = await fetch(`${url}/${encodeURIComponent(idPacote)}`);
    if (!resposta.ok) throw new Error("Pacote não encontrado");
    const pacote = await resposta.json();

    if (!Array.isArray(pacote.favoritos)) pacote.favoritos = [];

    const jaTem = pacoteContemUsuarioNosFavoritos(pacote, usuarioRaw, usuarioObj);

    // Remove usuário
    if (jaTem) {
      pacote.favoritos = pacote.favoritos.filter((fav) => {
        if (typeof fav === "string" && usuarioRaw && fav === usuarioRaw) return false;
        if (typeof fav === "string") {
          try {
            const p = JSON.parse(fav);
            if (usuarioObj && ((p.id && usuarioObj.id && String(p.id) === String(usuarioObj.id)) ||
                (p.login && usuarioObj.login && p.login === usuarioObj.login) ||
                (p.email && usuarioObj.email && p.email === usuarioObj.email))) {
              return false;
            }
          } catch {}
        }
        if (typeof fav === "object" && usuarioObj) {
          if ((fav.id && usuarioObj.id && String(fav.id) === String(usuarioObj.id)) ||
              (fav.login && usuarioObj.login && fav.login === usuarioObj.login) ||
              (fav.email && usuarioObj.email && fav.email === usuarioObj.email)) {
            return false;
          }
        }
        return true;
      });
    } else {
      pacote.favoritos.push(usuarioRaw);
    }

    await fetch(`${url}/${idPacote}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pacote),
    });

    let listaLocal = JSON.parse(localStorage.getItem("favoritos")) || [];
    if (!jaTem) {
      listaLocal.push({
        id: pacote.id,
        titulo: pacote.titulo,
        genero: (Array.isArray(pacote.generos) ? pacote.generos[0] : pacote.generos) || "Viagem",
        poster: pacote.capa,
      });
    } else {
      listaLocal = listaLocal.filter((f) => String(f.id) !== String(pacote.id));
    }
    localStorage.setItem("favoritos", JSON.stringify(listaLocal));

    await carregarDados();
  } catch (erro) {
    console.error("[marcarFavorito] erro:", erro);
    alert("Erro ao marcar/desmarcar favorito.");
  }
}

// SOBRE O CRIADOR
function geraSobreCriador() {
  const container = document.getElementById("sobreCriador");
  if (!container) return;

  const html = `
    <div class="container py-5">
      <div class="row align-items-center">
        <div class="col-lg-4 col-md-6 mb-4 mb-lg-0 text-center">
          <i class="bi bi-airplane-engines-fill text-primary" style="font-size: 120px;"></i>
          <h3 class="h4 mt-3">Pontuor</h3>
          <p class="text-muted small">Sua Agência de Confiança</p>
        </div>
        <div class="col-lg-8 col-md-6">
          <h4 class="fw-bold mb-4">Sobre a Pontuor</h4>
          <p class="lead mb-3">Há mais de 10 anos realizando sonhos de viagem! A <strong>Pontuor</strong> é especializada em criar experiências inesquecíveis para nossos clientes.</p>
          <p>Oferecemos os melhores destinos nacionais e internacionais com preços competitivos e atendimento personalizado. Nossa equipe está sempre pronta para te ajudar a planejar a viagem perfeita!</p>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = html;
}

geraSobreCriador();

// DETALHES
function geraDetalhes(objeto) {
  const container = document.getElementById("detalhes");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");

  if (!idParam) {
    container.innerHTML = "<h2 class='text-center py-5'>ID não informado na URL</h2>";
    return;
  }

  const detalhe = objeto.find((elem) => {
    if (!elem) return false;
    return String(elem.id) === String(idParam) || elem.id == idParam;
  });

  if (!detalhe) {
    container.innerHTML = "<h2 class='text-center py-5'>Pacote não encontrado</h2>";
    return;
  }

  let dadosFotos = "";
  const fotosArray = Array.isArray(detalhe.fotosVinculadas) ? detalhe.fotosVinculadas : [];
  
  fotosArray.forEach((item) => {
    const urlFoto = typeof item === "string" ? item : item && (item.foto || item.url || "");
    if (!urlFoto) return;

    dadosFotos += `
      <div class="col-md-6 col-sm-12 mb-3">
        <img src="${escapeHtml(urlFoto)}" 
             class="img-fluid rounded shadow" 
             alt="Foto do pacote" 
             style="width: 100%; height: 300px; object-fit: cover;">
      </div>
    `;
  });

  const desconto = detalhe.direcao && detalhe.roteiro 
    ? Math.round(((detalhe.direcao - detalhe.roteiro) / detalhe.direcao) * 100)
    : 0;

  container.innerHTML = `
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-md-5">
            <img src="${escapeHtml(detalhe.capa || "")}" 
                 alt="${escapeHtml(detalhe.titulo || "")}" 
                 class="img-fluid rounded shadow"
                 style="width:100%; height:400px; object-fit:cover;">
            ${desconto > 0 ? `
              <div class="alert alert-danger mt-3 text-center">
                <h4 class="mb-0">🔥 ${desconto}% de Desconto!</h4>
              </div>
            ` : ''}
          </div>
          <div class="col-md-7">
            <h1 class="fw-bold mb-3">${escapeHtml(detalhe.titulo || "")}</h1>
            <p class="lead mb-4">${escapeHtml(detalhe.sinopse || "")}</p>
            
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title"><i class="bi bi-info-circle-fill text-primary"></i> Informações do Pacote</h5>
                <ul class="list-unstyled mb-0">
                  <li class="mb-2"><strong><i class="bi bi-geo-alt-fill"></i> Destino:</strong> ${escapeHtml(detalhe.status || "-")}</li>
                  <li class="mb-2"><strong><i class="bi bi-calendar3"></i> Data de Partida:</strong> ${escapeHtml(detalhe.dataLancamento || "-")}</li>
                  <li class="mb-2"><strong><i class="bi bi-clock"></i> Duração:</strong> ${escapeHtml(detalhe.duracao || "-")}</li>
                  <li class="mb-2"><strong><i class="bi bi-tag-fill"></i> Categorias:</strong> ${escapeHtml(
                    Array.isArray(detalhe.generos) ? detalhe.generos.join(", ") : detalhe.generos || "-"
                  )}</li>
                </ul>
              </div>
            </div>

            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title"><i class="bi bi-check-circle-fill text-success"></i> O que está incluso</h5>
                <ul class="mb-0">
                  ${escapeHtml(
                    Array.isArray(detalhe.elenco) ? detalhe.elenco.map(i => `<li>${i}</li>`).join("") : detalhe.elenco || "-"
                  )}
                </ul>
              </div>
            </div>

            <div class="card bg-success text-white">
              <div class="card-body text-center">
                ${detalhe.direcao ? `
                  <p class="mb-2"><del>De R$ ${escapeHtml(detalhe.direcao)}</del></p>
                ` : ''}
                ${detalhe.roteiro ? `
                  <h2 class="mb-2">Por apenas R$ ${escapeHtml(detalhe.roteiro)}</h2>
                  <p class="mb-0">por pessoa</p>
                ` : ''}
                <button class="btn btn-light btn-lg mt-3">
                  <i class="bi bi-whatsapp"></i> Reservar Agora
                </button>
              </div>
            </div>
          </div>
        </div>

        ${dadosFotos ? `
          <div class="row mt-5">
            <div class="col-12">
              <h3 class="mb-4"><i class="bi bi-images"></i> Galeria de Fotos</h3>
            </div>
            ${dadosFotos}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

// BUSCA
function filtrarPorTitulo(termo) {
  if (!termo) {
    geraCards(todosPacotes);
    return;
  }

  const pacotesFiltrados = todosPacotes.filter((pacote) => {
    return (pacote.titulo || "").toLowerCase().includes(termo.toLowerCase()) ||
           (pacote.status || "").toLowerCase().includes(termo.toLowerCase());
  });

  geraCards(pacotesFiltrados);
}

const inputBusca = document.getElementById("inputBusca");
if (inputBusca) {
  inputBusca.addEventListener("input", (e) => filtrarPorTitulo(e.target.value));
}

const formBusca = document.getElementById("formBusca");
if (formBusca) {
  formBusca.addEventListener("submit", (ev) => {
    ev.preventDefault();
    filtrarPorTitulo(inputBusca?.value || "");
  });
}

// Escape function
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

// Inicializa
carregarDados();