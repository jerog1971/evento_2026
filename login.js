// login.js

// Credenciais Únicas e Fixas para todos os convidados
const USUARIO_FIXO = "convidado";
const SENHA_FIXA = "25112025";

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const erroElement = document.getElementById('erroLogin');

    // Limpa a mensagem de erro anterior
    erroElement.classList.add('hidden');
    
    // --- NOVA LÓGICA DE LOGIN SIMPLES ---

    // 1. Verifica se as credenciais digitadas correspondem às credenciais fixas
    if (usernameInput === USUARIO_FIXO && passwordInput === SENHA_FIXA) {
        
        // Login bem-sucedido
        erroElement.classList.add('hidden');
        alert(`Bem-vindo, ${usernameInput}! Redirecionando...`);
        
        // Redireciona para a página principal da aplicação
        window.location.href = 'pesquisa.html';
        
    } else {
        // Credencial não encontrada/inválida
        erroElement.textContent = "Usuário ou senha inválidos. Tente novamente.";
        erroElement.classList.remove('hidden');
        document.getElementById('password').value = ''; // Limpa o campo de senha
    }
});
