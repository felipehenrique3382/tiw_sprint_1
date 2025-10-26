let promo = {}; // variável global para armazenar a promoção atual

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    await buscarPromo(id);
    apresentarDetalhesDaPromo();
});

// Função para buscar os dados da promoção no Replit
const buscarPromo = async (id) => {
    try {
        const replit = 'https://42053612-9498-4573-97e4-6b2a46d0c9dd-00-3jhhnuadv9mah.riker.replit.dev:3000/'; 
        const url = replit + id;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar dados do servidor');

        promo = await response.json();
    } catch (erro) {
        console.error("Erro ao buscar promoção:", erro);
        promo = null;
    }
};

// Função para mostrar os detalhes na tela
const apresentarDetalhesDaPromo = () => {
    const container = document.getElementById("painel-de-detalhes");

    if (promo && promo.id !== undefined) {
        container.innerHTML = `
            <div class="text-center">
              <h2 class="fw-bold mb-3">${promo.titulo}</h2>
              <p class="text-muted">${promo.categoria} - ${promo.data}</p>
              <p class="text-success fw-bold">${promo.autor}</p>
              <img src="${promo.imagem}" alt="${promo.titulo}" class="img-fluid rounded mb-4" style="max-width:400px">
              <p class="lead">${promo.conteudo}</p>
              <a href="promo.html" class="btn btn-primary mt-3">Voltar</a>
            </div>
        `;
    } else {
        container.innerHTML = `<h3 class="text-center text-danger mt-5">Promoção não encontrada!</h3>`;
    }
};
