const apiURL = "http://localhost:3000/dados";
const user = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!user || user.tipo !== "admin") {
  alert("Apenas administradores podem acessar a área de cadastro.");
  window.location.href = "home.html";
}

const form = document.getElementById("formCadastroItem");
const lista = document.getElementById("listaItens");
const btnAdicionarFoto = document.getElementById("btnAdicionarFoto");
const fotosContainer = document.getElementById("fotosContainer");
let editandoId = null;

// ------------------------------ 
// ADICIONAR CAMPO DE FOTO
// ------------------------------ 
btnAdicionarFoto.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("input-group", "mb-2", "foto-url-row");
  div.innerHTML = `
    <input type="url" class="form-control foto-url" placeholder="https://exemplo.com/foto.jpg" required>
    <button class="btn btn-outline-danger btn-remover-foto" type="button">Remover</button>
  `;
  div.querySelector(".btn-remover-foto").addEventListener("click", () => div.remove());
  fotosContainer.appendChild(div);
});

// ------------------------------ 
// CARREGAR LISTA
// ------------------------------ 
async function carregarItens() {
  const resp = await fetch(apiURL);
  const dados = await resp.json();
  lista.innerHTML = "";

  dados.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.titulo}</td>
      <td>${item.status}</td>
      <td>${item.dataLancamento}</td>
      <td>R$ ${item.roteiro}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarItem('${item.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="excluirItem('${item.id}')">Excluir</button>
      </td>
    `;
    lista.appendChild(tr);
  });
}

carregarItens();

// ------------------------------ 
// PEGAR VALORES DO FORM
// ------------------------------ 
function getFotosArray() {
  const campos = document.querySelectorAll(".foto-url");
  return [...campos].map((i) => i.value);
}

// ------------------------------ 
// SALVAR (CRIAR/EDITAR)
// ------------------------------ 
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novo = {
    titulo: document.getElementById("titulo").value,
    dataLancamento: document.getElementById("dataLancamento").value,
    status: document.getElementById("status").value, // Destino
    duracao: document.getElementById("duracao").value,
    generos: document.getElementById("generos").value.split(",").map((g) => g.trim()), // Categorias
    direcao: document.getElementById("direcao").value, // Preço Original
    roteiro: document.getElementById("roteiro").value, // Preço Promocional
    elenco: document.getElementById("elenco").value.split(",").map((e) => e.trim()), // Inclusos
    sinopse: document.getElementById("sinopse").value,
    capa: document.getElementById("capaUrl").value,
    fotosVinculadas: getFotosArray(),
  };

  if (editandoId) {
    await fetch(`${apiURL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...novo, id: editandoId }),
    });
    editandoId = null;
  } else {
    novo.id = Date.now().toString();
    await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });
  }

  form.reset();
  fotosContainer.innerHTML = `
    <div class="input-group mb-2 foto-url-row">
      <input type="url" class="form-control foto-url" placeholder="https://exemplo.com/foto1.jpg" required>
      <button class="btn btn-outline-danger btn-remover-foto" type="button">Remover</button>
    </div>
  `;
  
  // Re-adiciona evento ao botão remover
  fotosContainer.querySelector(".btn-remover-foto").addEventListener("click", (e) => {
    e.target.closest(".foto-url-row").remove();
  });
  
  carregarItens();
});

// ------------------------------ 
// EDITAR
// ------------------------------ 
async function editarItem(id) {
  const resp = await fetch(`${apiURL}/${id}`);
  const item = await resp.json();

  editandoId = id;
  btnSalvar.textContent = "Atualizar";

  document.getElementById("titulo").value = item.titulo;
  document.getElementById("dataLancamento").value = item.dataLancamento;
  document.getElementById("status").value = item.status;
  document.getElementById("duracao").value = item.duracao;
  document.getElementById("generos").value = item.generos.join(", ");
  document.getElementById("direcao").value = item.direcao;
  document.getElementById("roteiro").value = item.roteiro;
  document.getElementById("elenco").value = item.elenco.join(", ");
  document.getElementById("sinopse").value = item.sinopse;
  document.getElementById("capaUrl").value = item.capa;

  fotosContainer.innerHTML = "";
  item.fotosVinculadas.forEach((url) => {
    const div = document.createElement("div");
    div.classList.add("input-group", "mb-2", "foto-url-row");
    div.innerHTML = `
      <input type="url" class="form-control foto-url" value="${url}" required>
      <button class="btn btn-outline-danger btn-remover-foto" type="button">Remover</button>
    `;
    div.querySelector(".btn-remover-foto").addEventListener("click", () => div.remove());
    fotosContainer.appendChild(div);
  });
}

// ------------------------------ 
// EXCLUIR
// ------------------------------ 
async function excluirItem(id) {
  if (!confirm("Excluir este pacote de viagem?")) return;
  await fetch(`${apiURL}/${id}`, { method: "DELETE" });
  carregarItens();
}