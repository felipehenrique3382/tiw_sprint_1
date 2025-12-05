async function carregarVisualizacaoAvancada() {
  try {
    const resposta = await fetch("http://localhost:3000/dados");
    const pacotes = await resposta.json();
    geraGraficoPizza(pacotes);
  } catch (erro) {
    console.error("Erro ao carregar visualização avançada", erro);
  }
}

function geraGraficoPizza(pacotes) {
  const contagemCategorias = {};

  pacotes.forEach(pacote => {
    let categorias = pacote.generos;
    
    if (typeof categorias === "string") {
      categorias = categorias.split(",").map(g => g.trim());
    }
    
    if (Array.isArray(categorias)) {
      categorias.forEach(categoria => {
        if (!contagemCategorias[categoria]) {
          contagemCategorias[categoria] = 0;
        }
        contagemCategorias[categoria]++;
      });
    }
  });

  const labels = Object.keys(contagemCategorias);
  const valores = Object.values(contagemCategorias);

  // Gerar cores únicas dinamicamente
  const cores = labels.map((_, i) => `hsl(${(i * 360) / labels.length}, 70%, 50%)`);

  const ctx = document.getElementById("graficoLancamentos").getContext("2d");

  // Remove gráfico antigo
  if (window.graficoPizza) window.graficoPizza.destroy();

  window.graficoPizza = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: cores,
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: {
            font: { size: 14 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || "";
              const valor = context.parsed;
              const total = context.chart._metasets[context.datasetIndex].total;
              const percentual = ((valor / total) * 100).toFixed(1);
              return `${label}: ${valor} pacotes (${percentual}%)`;
            }
          }
        },
        title: {
          display: true,
          text: "Distribuição de Pacotes por Categoria",
          font: {
            size: 20,
            weight: "bold"
          }
        }
      }
    }
  });
}

carregarVisualizacaoAvancada();