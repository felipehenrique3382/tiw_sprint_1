const urlUsuarios = "http://localhost:3000/usuarios";

// ------------------------------ 
// CADASTRAR USUÁRIO
// ------------------------------ 
async function cadastrarUsuario(event) {
  const login = document.getElementById("login").value.trim();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!login || !nome || !email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  // Verifica se o email já está cadastrado
  const existe = await fetch(`${urlUsuarios}?email=${email}`).then((r) => r.json());
  
  if (existe.length > 0) {
    alert("Este e-mail já está cadastrado");
    return;
  }

  // Verifica se o login já está cadastrado
  const loginExiste = await fetch(`${urlUsuarios}?login=${login}`).then((r) => r.json());
  
  if (loginExiste.length > 0) {
    alert("Este login já está em uso");
    return;
  }

  const novoUsuario = {
    login,
    nome,
    email,
    senha
  };

  const res = await fetch(urlUsuarios, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoUsuario),
  });

  if (res.ok) {
    alert("Usuário cadastrado com sucesso! Faça login para continuar.");
    document.getElementById("formCadastro").reset();
    
    // Fecha o modal
    let modal = bootstrap.Modal.getInstance(document.getElementById("modalCadastro"));
    if (modal) {
      modal.hide();
    }
  } else {
    alert("Erro ao cadastrar usuário. Tente novamente.");
  }
}

// ------------------------------ 
// FAZER LOGIN
// ------------------------------ 
async function fazerLogin(event) {
  event.preventDefault();

  const loginDigitado = document.getElementById("loginInput").value.trim();
  const senhaDigitada = document.getElementById("senhaInput").value.trim();

  if (!loginDigitado || !senhaDigitada) {
    alert("Preencha o login e a senha!");
    return;
  }

  try {
    const usuarios = await fetch(
      `${urlUsuarios}?login=${loginDigitado}&senha=${senhaDigitada}`
    ).then((r) => r.json());

    if (usuarios.length === 1) {
      const usuario = usuarios[0];
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      alert(`Bem-vindo(a), ${usuario.nome}!`);
      window.location.href = "./home.html";
    } else {
      alert("Login ou senha incorretos!");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro ao conectar ao servidor. Tente novamente.");
  }
}

// ------------------------------ 
// EVENTOS
// ------------------------------ 
document.getElementById("btnCadastrar").addEventListener("click", cadastrarUsuario);
document.getElementById("formLogin").addEventListener("submit", fazerLogin);