const contexto = document.getElementById('meu-grafico');

const grafico = new Chart(contexto, {
    type: 'bar',
    data: {
      labels: ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'],
      datasets: [{
        label: 'Destinos nacionais',
        data: [43, 25, 17, 7, 6],
        backgroundColor: ['Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue'],
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });