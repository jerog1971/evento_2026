// login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const erroElement = document.getElementById('erroLogin');

    // --- SIMULAÇÃO DE VALIDAÇÃO (NÃO USE ISSO EM PRODUÇÃO) ---
    // Em produção, você enviaria 'usernameInput' e 'passwordInput' para um servidor (API)
    // para que ele verificasse contra um banco de dados seguro.

    const USUARIO_CORRETO = "convidado"; // Exemplo
    const SENHA_CORRETA = "25112025"; // Exemplo

    if (usernameInput === USUARIO_CORRETO && passwordInput === SENHA_CORRETA) {
        // Login bem-sucedido
        erroElement.classList.add('hidden');
        
        // Redireciona para a página principal da aplicação
        alert("Login realizado com sucesso! Redirecionando...");
        window.location.href = 'pesquisa.html'; // Assumindo que sua aplicação principal é 'pesquisa.html'
        
    } else {
        // Login falhou
        erroElement.textContent = "Usuário ou senha inválidos. Tente novamente.";
        erroElement.classList.remove('hidden');
        passwordInput.value = ''; // Limpa o campo de senha
    }

});
