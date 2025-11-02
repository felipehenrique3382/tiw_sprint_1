function ler() {
    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const autor = document.getElementById('autor').value.trim();

    document.getElementById('titulo').value = "";
    document.getElementById('categoria').value = "";
    document.getElementById('autor').value = "";

    if (titulo && categoria && autor)
      return { titulo, categoria, autor };
    
    return null;
}

export default ler;
