function imprimir(json){
  return `<div class="id">ID: ${json.id}</div> 
          <div class="titulo">Produto: ${json.titulo}</div> 
          <div class="categoria">categoria: ${json.categoria}</div>
          <div class="autor">autor: ${json.autor}</div>`;
}

export default imprimir;
