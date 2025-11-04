// OTIMIZAÇÃO: Debounce para evitar lentidão na busca em 4639 itens
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// ==============================================
// ESTADO GLOBAL (Os arrays serão populados após carregar o JSON)
// ==============================================
let folhaDados = []; // Array principal, populado pelo fetch
let dadosAtuais = []; // Lista filtrada ou a lista completa
let paginaAtual = 0;
const ITENS_POR_PAGINA = 50;

// Referências DOM
const buscaEntrada = document.getElementById('buscaEntrada');
const buscarBotao = document.getElementById('buscarBotao');
const dadosCorpo = document.getElementById('dadosCorpo');
const semResultadoMensagem = document.getElementById('semResultado');
const contadorLivros = document.getElementById('contadorLivros');
const paginacaoControles = document.getElementById('paginacaoControles');


// 1. FUNÇÃO: Carrega os dados de forma ASSÍNCRONA
async function inicializar() {
    // Exibe uma mensagem de "Carregando" na tabela principal
    dadosCorpo.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Carregando dados... Por favor, aguarde.</td></tr>';
    
    // Desabilita a busca e botões enquanto carrega
    buscaEntrada.disabled = true;
    buscarBotao.disabled = true;

    try {
        // Tenta carregar o arquivo JSON
        const response = await fetch('dados_livros.json'); 
        
        if (!response.ok) {
            throw new Error(`Erro de rede ao carregar dados: ${response.status} ${response.statusText}`);
        }
        
        // Povoa os arrays de dados
        folhaDados = await response.json();
        dadosAtuais = folhaDados;
        
        // Habilita a busca e botões
        buscaEntrada.disabled = false;
        buscarBotao.disabled = false;
        
        // Inicia a aplicação após o carregamento
        renderizaPagina(); 

    } catch (error) {
        console.error("Erro no carregamento inicial:", error);
        dadosCorpo.innerHTML = '<tr><td colspan="7" style="color: red; text-align: center; padding: 20px;">Falha ao carregar dados. Verifique se o arquivo JSON está correto.</td></tr>';
    }
}


// 2. FUNÇÃO: Renderiza a página atual (Paginação)
function renderizaPagina() {
    // ... (O restante da sua função renderizaPagina permanece o mesmo) ...
    dadosCorpo.innerHTML = '';
    
    const totalDados = dadosAtuais.length;
    
    if (totalDados === 0) {
        semResultadoMensagem.classList.remove('hidden');
        contadorLivros.textContent = '';
        paginacaoControles.innerHTML = '';
        return;
    } 

    semResultadoMensagem.classList.add('hidden');

    const inicio = paginaAtual * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const dadosPagina = dadosAtuais.slice(inicio, fim);
    
    dadosPagina.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.ID}</td>
            <td>${item.Nome_livro}</td>
            <td>${item.Genero_livro}</td>
            <td>${item.Quantidade}</td>
            <td>${item.Paginas}</td>
            <td>${item.Autor}</td>
            <td>${item.Ano_publicado}</td>
        `;
        dadosCorpo.appendChild(row);
    });

    atualizaControles(totalDados);
}


// 3. FUNÇÃO: Cria e gerencia os botões de paginação
function atualizaControles(totalDados) {
    // ... (Sua função atualizaControles permanece a mesma) ...
    paginacaoControles.innerHTML = '';
    
    const totalPaginas = Math.ceil(totalDados / ITENS_POR_PAGINA);
    const plural = totalDados === 1 ? 'livro' : 'livros';
    
    contadorLivros.textContent = `Página ${paginaAtual + 1} de ${totalPaginas} | ${totalDados} ${plural} encontrado(s).`;

    if (totalPaginas <= 1) {
        return;
    }

    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.disabled = paginaAtual === 0;
    btnAnterior.addEventListener('click', () => {
        paginaAtual--;
        renderizaPagina();
    });
    
    const btnProximo = document.createElement('button');
    btnProximo.textContent = 'Próximo';
    btnProximo.disabled = paginaAtual >= totalPaginas - 1;
    btnProximo.addEventListener('click', () => {
        paginaAtual++;
        renderizaPagina();
    });

    paginacaoControles.appendChild(btnAnterior);
    paginacaoControles.appendChild(btnProximo);
}


// 4. FUNÇÃO: Realiza a pesquisa (Filtra dados e RESETA a página)
function buscaDados() {
    // ... (Sua função buscaDados permanece a mesma) ...
    
    // Importante: Checa se os dados foram carregados antes de buscar
    if (folhaDados.length === 0) return;

    const buscaTermo = buscaEntrada.value.toLowerCase().trim();
    const check = (value) => String(value ?? '').toLowerCase().includes(buscaTermo);

    if (buscaTermo === '') {
        dadosAtuais = folhaDados;
    } else {
        dadosAtuais = folhaDados.filter(item => {
            return check(item.Nome_livro) ||
                   check(item.Genero_livro) ||
                   check(item.Autor) ||
                   check(item.Quantidade) ||
                   check(item.Ano_publicado) ||
                   check(item.ID) ||
                   check(item.Paginas);
        });
    }

    paginaAtual = 0;
    renderizaPagina();
}


// Cria a função de busca com o Debounce de 300ms
const debouncedBusca = debounce(buscaDados, 300);


// 5. Configuração dos Event Listeners e Inicialização
// Os listeners são configurados aqui, mas o código só é executado após o carregamento
buscarBotao.addEventListener('click', buscaDados);
buscaEntrada.addEventListener('input', debouncedBusca);
buscaEntrada.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        buscaDados();
    }
});

// 🚨 INICIA O PROCESSO DE CARREGAMENTO!
// Isso garante que o script comece a rodar assim que o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', inicializar);
