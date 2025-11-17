// client.js

// Mantenha esta URL fora do código-fonte real. 
// 🚨🚨🚨 SUBSTITUA ISTO pela URL pública fornecida pelo seu host (Ex: 'https://seu-nome-de-usuario.replit.app')
const SERVER_URL = 'http://localhost:3000'; // Mude esta URL!

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const erroElement = document.getElementById('erroLogin');
    
    // Esconde a mensagem de erro anterior ao tentar novo login
    erroElement.classList.add('hidden');
    
    try {
        // Envia as credenciais para o servidor Node.js/Express
        const response = await fetch(`${SERVER_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        // Converte a resposta do servidor (JSON)
        const data = await response.json();

        if (data.success) {
            // Login bem-sucedido (o servidor validou e marcou o uso)
            alert(data.message + " Redirecionando...");
            window.location.href = 'pesquisa.html'; // Redireciona
            
        } else {
            // Login falhou (seja por credencial errada, seja por 'já em uso' centralizado)
            erroElement.textContent = data.message;
            erroElement.classList.remove('hidden');
            document.getElementById('password').value = ''; // Limpa o campo de senha
        }

    } catch (error) {
        // Erro de rede ou conexão com o servidor
        console.error('Erro de conexão:', error);
        erroElement.textContent = "Erro ao conectar com o servidor de login. Tente novamente.";
        erroElement.classList.remove('hidden');
    }
});