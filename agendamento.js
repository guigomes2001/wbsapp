// Atualiza a data e hora em tempo real no rodapé
function atualizarDataHora() {
    var dataHora = new Date();
    var dataHoraString = dataHora.toLocaleString();
    document.getElementById('data-hora').textContent = dataHoraString;
}

// Atualiza a data e hora a cada segundo
setInterval(atualizarDataHora, 1000);
atualizarDataHora();

// Manipulador de envio do formulário
document.getElementById('formAgendamento').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do formulário

    // Limpar mensagens de erro
    document.querySelectorAll('.error-message').forEach(function(element) {
        element.textContent = '';
    });

    // Obter valores dos campos
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const observacoes = document.getElementById('observacoes').value;
    const barbeariaNome = sessionStorage.getItem('barbeariaNome');
    const barbeariaWhatsapp = sessionStorage.getItem('barbeariaWhatsapp');

    let valido = true;

    // Validação dos campos
    if (nome.trim() === '') {
        document.getElementById('errorNome').textContent = 'Por favor, insira seu nome.';
        valido = false;
    }

    if (telefone.trim() === '' || !/^\d{10,15}$/.test(telefone)) {
        document.getElementById('errorTelefone').textContent = 'Por favor, insira um telefone válido.';
        valido = false;
    }

    if (!data) {
        document.getElementById('errorData').textContent = 'Por favor, escolha uma data.';
        valido = false;
    }

    if (!hora) {
        document.getElementById('errorHora').textContent = 'Por favor, escolha uma hora.';
        valido = false;
    }

    if (valido) {
        // Enviar o formulário via AJAX
        fetch('/wbs/agendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(new FormData(document.getElementById('formAgendamento')))
        })
        .then(response => response.text()) // Recebe a resposta como texto
        .then(result => {
            if (result.trim() === 'Sucesso') { // Verifica o texto da resposta
                const mensagem = `Olá, meu nome é ${nome}. Gostaria de agendar um serviço na ${barbeariaNome} para o dia ${data} às ${hora}. Meu WhatsApp/Telefone é ${telefone}. Observações: ${observacoes}`;
                const whatsappUrl = `https://wa.me/${barbeariaWhatsapp}?text=${encodeURIComponent(mensagem)}`;
                window.open(whatsappUrl, '_blank');

                alert('Agendamento enviado com sucesso! Você será redirecionado para o WhatsApp do local.');
                document.getElementById('formAgendamento').reset(); // Limpa o formulário
            } else {
                alert('Ocorreu um erro ao enviar o agendamento. Tente novamente');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar o agendamento. Tente novamente');
        });
    }
});
