const apiURL = "http://localhost:3000/dados";

async function carregarDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    document.getElementById("detalhe-container").innerHTML =
      "<p>ID do destino não informado.</p>";
    return;
  }

  try {
    const resposta = await fetch(`${apiURL}/${encodeURIComponent(id)}`);
    if (!resposta.ok) throw new Error("Destino não encontrado");

    const destino = await resposta.json();
    const container = document.getElementById("detalhe-container");

    container.innerHTML = `
      <h1>${destino.titulo}</h1>
      <p><strong>Data de lançamento:</strong> ${destino.dataLancamento}</p>
      <p><strong>Status:</strong> ${destino.status}</p>
      <p><strong>Duração:</strong> ${destino.duracao}</p>
      <p><strong>Gêneros:</strong> ${Array.isArray(destino.generos) ? destino.generos.join(", ") : destino.generos}</p>
      <p><strong>Direção:</strong> ${destino.direcao}</p>
      <p><strong>Roteiro:</strong> ${destino.roteiro}</p>
      <p><strong>Elenco:</strong> ${Array.isArray(destino.elenco) ? destino.elenco.join(", ") : destino.elenco}</p>
      <p>${destino.sinopse}</p>
      <img src="${destino.capa}" alt="${destino.titulo}" class="img-destino">
      ${destino.fotosVinculadas && destino.fotosVinculadas.length > 0 ? 
        destino.fotosVinculadas.map(url => `<img src="${url}" alt="Foto" class="img-destino">`).join("") : 
        "<p>Sem fotos adicionais.</p>"
      }
    `;
  } catch (erro) {
    console.error("Erro ao carregar detalhe:", erro);
    document.getElementById("detalhe-container").innerHTML =
      "<p>Erro ao carregar destino.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarDetalhe);
