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

        let encontrouBarbearia = false;
        let requisicoes = [];

        regioesSelecionadas.forEach(regiao => {
            const req = $.ajax({
                url: `https://wbsbackendprod.onrender.com/barbearias/regiao/${regiao}`,
                method: 'GET',
                dataType: 'json'
            }).done(response => {
                if (response && response.length > 0) {
                    const faixaRegiao = criarElemento('div', null, 'faixa-regiao');
                    faixaRegiao.append(criarElemento('h2', `Região ${regiao} - DF`));

                    response.forEach(barbearia => {
                        const divBarbearia = criarElemento('div', null, 'barbearia');

                        divBarbearia.append(criarElemento('h3', barbearia.nome));
                        divBarbearia.append(criarElemento('p', `Endereço: ${barbearia.endereco}`).css('margin-top', '10px'));
                        divBarbearia.append(criarElemento('p', `Telefone: ${barbearia.telefone}`).css('margin-top', '-12px'));
                        divBarbearia.append(criarBotaoAgendamento(barbearia).css('margin-top', '15px'));

                        faixaRegiao.append(divBarbearia);
                    });

                    dadosBarbearia.append(faixaRegiao);
                    encontrouBarbearia = true;
                }
            }).fail(() => {
                console.error(`Erro ao buscar barbearias da região ${regiao}`);
            });

            requisicoes.push(req);
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
