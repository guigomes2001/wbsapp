$(document).ready(function () {
    // Função para criar elementos
    function criarElemento(tipo, texto, classe) {
        const elemento = $('<' + tipo + '></' + tipo + '>');
        if (texto) {
            elemento.text(texto);
        }
        if (classe) {
            elemento.addClass(classe);
        }
        return elemento;
    }

    // Função para criar botão de agendamento
    function criarBotaoAgendamento(barbearia) {
        const botao = criarElemento('button', 'Agendar Serviço');
        botao.on('click', () => {
            sessionStorage.setItem('barbeariaNome', encodeURIComponent(barbearia.nome));
            sessionStorage.setItem('barbeariaWhatsapp', encodeURIComponent(barbearia.whatsapp));
            window.location.href = 'agendamento.html';
        });
        return botao;
    }

    // Função para exibir dados da barbearia
    function exibirDadosBarbearia(regioesSelecionadas) {
        const dadosBarbearia = $('#dadosBarbearia');
        dadosBarbearia.empty();

        const regioes = {
            '1': { titulo: 'Estrutural - DF', barbearias: [
                { nome: 'Barbearia 2 Irmão', endereco: 'Av. Principal, nº 123, Bloco A, Brasília - DF', telefone: '(61) 1234-5678', whatsapp: '61986532028' },
                { nome: 'Barbearia Corte Duplo', endereco: 'Rua dos Cajueiros, nº 321, Bloco B, Brasília - DF', telefone: '(61) 1234-4321', whatsapp: '1133333333' }
            ]},
            '2': { titulo: 'São Sebastião - DF', barbearias: [
                { nome: 'Barbearia Novo Visual', endereco: 'Rua das Palmeiras, nº 456, São Sebastião - DF', telefone: '(61) 9876-5432', whatsapp: '1144444444' },
                { nome: 'Salão 8 Pontos', endereco: 'Av. Changrilá, nº 777, Edifício ABC - Térreo, Brasília - DF', telefone: '(61) 7777-7777', whatsapp: '1155555555' }
            ]},
            '3': { titulo: 'Riacho Fundo - DF', barbearias: [
                { nome: 'Barbearia Navalha Afiada', endereco: 'Quadra 2, Conjunto 3, Lote 4, Riacho Fundo - DF', telefone: '(61) 5555-4444', whatsapp: '6199999999' },
                { nome: 'Salão Pente e Régua', endereco: 'Av. 2 Pinheiros, conjunto 1, Riacho Fundo', telefone: '(61) 5555-5555', whatsapp: '6166666666' }
            ]}
        };

        let encontrouBarbearia = false;

        regioesSelecionadas.forEach(regiaoSelecionada => {
            if (!regioes[regiaoSelecionada]) {
                console.error('Região não encontrada:', regiaoSelecionada);
                return;
            }

            const regiao = regioes[regiaoSelecionada];
            const faixaRegiao = criarElemento('div', null, 'faixa-regiao');

            faixaRegiao.append(criarElemento('h2', regiao.titulo));

            if (regiao.barbearias.length > 0) {
                regiao.barbearias.forEach(barbearia => {
                    const divBarbearia = criarElemento('div', null, 'barbearia');
                    divBarbearia.append(criarElemento('h3', barbearia.nome));
                    divBarbearia.append(criarElemento('p', `Endereço: ${barbearia.endereco}`));
                    divBarbearia.append(criarElemento('p', `Telefone: ${barbearia.telefone}`));
                    divBarbearia.append(criarBotaoAgendamento(barbearia));
                    faixaRegiao.append(divBarbearia);
                });
                encontrouBarbearia = true;
            }

            dadosBarbearia.append(faixaRegiao);
        });

        if (!encontrouBarbearia) {
            const mensagem = criarElemento('p', 'Não há barbearias na sua região', 'mensagem-erro');
            dadosBarbearia.append(mensagem);
        }

        dadosBarbearia.slideDown(300);
    }

    // Manipulador de evento para o botão de pesquisa
    $('#botaoPesquisa').on('click', () => {
        const regioesSelecionadas = $('input[name="regiao"]:checked').map(function() {
            return $(this).val();
        }).get();

        if (regioesSelecionadas.length > 0) {
            exibirDadosBarbearia(regioesSelecionadas);
        } else {
            alert('Por favor, selecione pelo menos uma região.');
        }
    });

    // Manipulador de evento para o botão de faturamento
    $('#botaoFaturamento').on('click', function () {
        $('#loginModal').show();
    });

    // Manipulador de evento para o botão de fechar o modal
    $('.close').on('click', function () {
        $('#loginModal').hide();
    });

    // Manipulador de envio do formulário de login
    $('#loginForm').on('submit', function (event) {
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        // Enviar dados de login para o servidor
        $.ajax({
            url: '/wbs/api/verificarLogin', // Certifique-se de que o caminho está correto
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (response) {
                if (response.success) {
                    window.location.href = 'faturamento.html'; // Redireciona após sucesso
                } else {
                    alert('Usuário ou senha inválidos.'); // Mensagem de erro se a autenticação falhar
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Erro na autenticação:', textStatus, errorThrown); // Log de erro para ajudar na depuração
                alert('Erro na autenticação.'); // Mensagem genérica de erro
            }
        });
    });

    // Atualiza a data e hora em tempo real no rodapé
    function atualizarDataHora() {
        const dataHoraString = new Date().toLocaleString();
        document.getElementById('data-hora').textContent = dataHoraString;
    }

    // Atualiza a data e hora a cada segundo
    setInterval(atualizarDataHora, 1000);
    atualizarDataHora();
});