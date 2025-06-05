$(document).ready(function () {
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

    function criarBotaoAgendamento(barbearia) {
        const botao = criarElemento('button', 'Agendar Serviço');
        botao.on('click', () => {
            sessionStorage.setItem('barbeariaNome', encodeURIComponent(barbearia.nomeBarbearia));
            sessionStorage.setItem('barbeariaWhatsapp', encodeURIComponent(barbearia.whatsapp));
            window.location.href = 'agendamento.html';
        });
        return botao;
    }

    const nomesRegioes = {
        1: 'Estrutural',
        2: 'São Sebastião',
        3: 'Riacho Fundo',
        4: 'Sudoeste',
        5: 'Guará'
    };

    function exibirDadosBarbearia(regioesSelecionadas) {
    $('#botaoPesquisa').prop('disabled', true);
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
            if (response.message === "Operação realizada com sucesso" && Array.isArray(response.data) && response.data.length > 0) {
                const faixaRegiao = criarElemento('div', null, 'faixa-regiao');
                const nomeCidade = nomesRegioes[regiao] || `Região ${regiao}`;
                faixaRegiao.append(criarElemento('h2', `${nomeCidade} - DF`));

                response.data.forEach(barbearia => {
                    const divBarbearia = criarElemento('div', null, 'barbearia');

                    divBarbearia.append(criarElemento('h3', barbearia.nomeBarbearia));
                    divBarbearia.append(criarElemento('p', `Endereço: ${barbearia.logradouro}`).css('margin-top', '10px'));
                    divBarbearia.append(criarElemento('p', `Telefone: ${barbearia.telefone}`).css('margin-top', '-12px'));
                    divBarbearia.append(criarBotaoAgendamento(barbearia).css('margin-top', '15px'));

                    faixaRegiao.append(divBarbearia);
                });

                dadosBarbearia.append(faixaRegiao);
                encontrouBarbearia = true;
            } else {
                console.warn(response.message || `Erro ao buscar barbearias na região ${regiao}`);
            }
        }).fail(() => {
            console.error(`Erro na requisição para a região ${regiao}`);
        });

        requisicoes.push(req);
    });

    $.when(...requisicoes).always(() => {
      
        if (!encontrouBarbearia) {
            const mensagem = criarElemento('p', 'Não há barbearias na sua região', 'mensagem-erro');
            dadosBarbearia.append(mensagem);
        }
        dadosBarbearia.slideDown(300);
        $('#botaoPesquisa').prop('disabled', false);
    });
}

    $('#botaoPesquisa').on('click', () => {
        const regioesSelecionadas = $('input[name="regiao"]:checked').map(function() {
            return $(this).val();
        }).get();

        if (regioesSelecionadas.length > 0) {
            exibirDadosBarbearia(regioesSelecionadas);
        } else {
            alertaSelecionarAoMenosUmaRegiao();
        }
    });

    function alertaSelecionarAoMenosUmaRegiao() {
         Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor, selecione pelo menos uma região!",
            confirmButtonText: "Entendi 💪", 
            confirmButtonColor: "#007bff"
 //         footer: '<a href="#">Why do I have this issue?</a>'
            });
    }

    $('#botaoFaturamento').on('click', function () {
        $('#loginModal').show();
    });

    $('.close').on('click', function () {
        $('#loginModal').hide();
    });

    $('#loginForm').on('submit', function (event) {
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            url: '/wbs/api/verificarLogin',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (response) {
                if (response.success) {
                    window.location.href = 'faturamento.html';
                } else {
                    alert('Usuário ou senha inválidos.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Erro na autenticação:', textStatus, errorThrown); 
                alert('Erro na autenticação.'); 
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
