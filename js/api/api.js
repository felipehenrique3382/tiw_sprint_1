const replit = "https://42053612-9498-4573-97e4-6b2a46d0c9dd-00-3jhhnuadv9mah.riker.replit.dev:3000/";
const url = replit + "promo/" + id;

export async function enviar(dados) {
  try {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      throw new Error('Erro no envio dos dados!');
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao enviar dados:', erro);
    throw erro;
  }
}

export async function buscar() {
  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error('Erro no envio dos dados!');
    }

    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao ler dados:', erro);
    throw erro;
  }
}
