// login.js

// 1. SIMULAÇÃO: Lista de 11 Credenciais de Uso Único para o Evento
// A senha única é 'Evento2025' para todos.
const credenciaisConvidado = [
    { usuario: "convidado01", senha: "Evento2025" },
    { usuario: "convidado02", senha: "Evento2025" },
    { usuario: "convidado03", senha: "Evento2025" },
    { usuario: "convidado04", senha: "Evento2025" },
    { usuario: "convidado05", senha: "Evento2025" },
    { usuario: "convidado06", senha: "Evento2025" },
    { usuario: "convidado07", senha: "Evento2025" },
    { usuario: "convidado08", senha: "Evento2025" },
    { usuario: "convidado09", senha: "Evento2025" },
    { usuario: "convidado10", senha: "Evento2025" },
    { usuario: "convidado11", senha: "Evento2025" },
    { usuario: "convidado12", senha: "Evento2025" }
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const erroElement = document.getElementById('erroLogin');

    // Limpa a mensagem de erro anterior
    erroElement.classList.add('hidden');
    
    // 2. Tenta encontrar a credencial na lista simulada
    const credencialEncontrada = credenciaisConvidado.find(cred => 
        cred.usuario === usernameInput && cred.senha === passwordInput
    );

    // --- LÓGICA DE LOGIN ---

    if (credencialEncontrada) {
        // Credencial é válida
        
        // 3. Verificação de Uso Único (Simulada com localStorage)
        const chaveUso = `LOGGED_${usernameInput}`;
        const jaFoiUsado = localStorage.getItem(chaveUso) === 'true';

        if (jaFoiUsado) {
            // Conta já utilizada! Acesso negado.
            erroElement.textContent = `A conta "${usernameInput}" já foi utilizada para acesso.`;
            erroElement.classList.remove('hidden');
            document.getElementById('password').value = ''; // Limpa o campo de senha
            
        } else {
            // Login bem-sucedido: Marca a conta como usada
            localStorage.setItem(chaveUso, 'true');
            
            // Redireciona para a página principal da aplicação
            erroElement.classList.add('hidden');
            alert(`Login de ${usernameInput} realizado com sucesso! Redirecionando...`);
            window.location.href = 'pesquisa.html';
        }
        
    } else {
        // Credencial não encontrada/inválida
        erroElement.textContent = "Usuário ou senha inválidos. Tente novamente.";
        erroElement.classList.remove('hidden');
        document.getElementById('password').value = ''; // Limpa o campo de senha
    }
});

