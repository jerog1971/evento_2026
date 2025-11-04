// Simulação dos dados de uma planilha
// Em um projeto real, você poderia carregar esses dados de um arquivo JSON ou API.
//const folhaDados =
// Otimização: Debounce (para evitar lentidão na busca em 4639 itens)
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
// ESTADO GLOBAL DA APLICAÇÃO (Paginação)
// ==============================================
const ITENS_POR_PAGINA = 50; // Quantos itens serão exibidos por vez
let dadosAtuais = folhaDados; // Lista filtrada ou a lista completa
let paginaAtual = 0; // Começa na primeira página (índice 0)

// Referências DOM
const buscaEntrada = document.getElementById('buscaEntrada');
const buscarBotao = document.getElementById('buscarBotao');
const dadosCorpo = document.getElementById('dadosCorpo');
const semResultadoMensagem = document.getElementById('semResultado');
const contadorLivros = document.getElementById('contadorLivros');
const paginacaoControles = document.getElementById('paginacaoControles');


// 1. FUNÇÃO PRINCIPAL: Renderiza a página atual
function renderizaPagina() {
    dadosCorpo.innerHTML = '';
    
    const totalDados = dadosAtuais.length;
    
    if (totalDados === 0) {
        semResultadoMensagem.classList.remove('hidden');
        contadorLivros.textContent = '';
        paginacaoControles.innerHTML = '';
        return;
    } 

    semResultadoMensagem.classList.add('hidden');

    // Cálculo do slice (fatiamento) dos dados para a página atual
    const inicio = paginaAtual * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const dadosPagina = dadosAtuais.slice(inicio, fim);
    
    // Renderiza as linhas da tabela
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

    // Atualiza o contador e os controles de navegação
    atualizaControles(totalDados);
}


// 2. FUNÇÃO: Cria e gerencia os botões de paginação
function atualizaControles(totalDados) {
    paginacaoControles.innerHTML = ''; // Limpa os controles
    
    const totalPaginas = Math.ceil(totalDados / ITENS_POR_PAGINA);
    const plural = totalDados === 1 ? 'livro' : 'livros';
    
    // Atualiza o Contador
    contadorLivros.textContent = `Página ${paginaAtual + 1} de ${totalPaginas} | ${totalDados} ${plural} encontrado(s).`;

    // Se houver apenas uma página, não mostra os botões
    if (totalPaginas <= 1) {
        return;
    }

    // Cria o Botão Anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.disabled = paginaAtual === 0;
    btnAnterior.addEventListener('click', () => {
        paginaAtual--;
        renderizaPagina(); // Renderiza a página anterior
    });
    
    // Cria o Botão Próximo
    const btnProximo = document.createElement('button');
    btnProximo.textContent = 'Próximo';
    btnProximo.disabled = paginaAtual >= totalPaginas - 1;
    btnProximo.addEventListener('click', () => {
        paginaAtual++;
        renderizaPagina(); // Renderiza a próxima página
    });

    paginacaoControles.appendChild(btnAnterior);
    paginacaoControles.appendChild(btnProximo);
}


// 3. FUNÇÃO: Realiza a pesquisa (Filtra dados e RESETA a página)
function buscaDados() {
    const buscaTermo = buscaEntrada.value.toLowerCase().trim();
    
    // Função auxiliar para verificar a inclusão do termo de busca
    const check = (value) => String(value ?? '').toLowerCase().includes(buscaTermo);

    // Filtra os dados (mantendo a lista completa se a busca estiver vazia)
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

    // IMPORTANTE: Reseta para a primeira página após uma nova busca
    paginaAtual = 0;
    
    // Renderiza a primeira página dos resultados
    renderizaPagina();
}


// Cria a função de busca com o Debounce de 300ms
const debouncedBusca = debounce(buscaDados, 300);


// 4. Configuração dos Event Listeners e Inicialização
buscarBotao.addEventListener('click', buscaDados);
buscaEntrada.addEventListener('input', debouncedBusca); // Usa debounce para busca contínua
buscaEntrada.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        buscaDados(); // Enter roda imediatamente
    }
});

// Exibe a PRIMEIRA página dos dados quando a página carrega
// Isso garante um carregamento inicial instantâneo.
renderizaPagina();
