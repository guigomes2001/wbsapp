// Atualiza a data e hora no rodapé
function atualizarDataHora() {
    const dataHora = new Date();
    const dataHoraString = dataHora.toLocaleString();
    document.getElementById('data-hora').textContent = dataHoraString;
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();

document.getElementById('formAgendamento').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    document.querySelectorAll('.error-message').forEach(function(element) {
        element.textContent = '';
    });

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const observacoes = document.getElementById('observacoes').value;
    const barbeariaNome = sessionStorage.getItem('barbeariaNome');
    const barbeariaWhatsapp = sessionStorage.getItem('barbeariaWhatsapp');

    let valido = true;

    if (!nome || nome.trim() === '') {
        document.getElementById('errorNome').textContent = 'Por favor, insira seu nome.';
        valido = false;
    }

    if (!telefone || !/^\d{10,15}$/.test(telefone)) {
        document.getElementById('errorTelefone').textContent = 'Por favor, insira um telefone válido.';
        valido = false;
    }

    if (!data || isNaN(new Date(data).getTime())) {
        document.getElementById('errorData').textContent = 'Por favor, escolha uma data.';
        valido = false;
    }

    if (!hora || hora.trim() === '') {
        document.getElementById('errorHora').textContent = 'Por favor, escolha uma hora.';
        valido = false;
    }

    const aceitou = await alertaTermoECondicoes();

    if (!aceitou) {
        document.getElementById('errorTermos').textContent = 'Você precisa aceitar os termos antes de agendar.';
        return;
    } else {
        document.getElementById('errorTermos').textContent = '';
    }

    if (valido) {
        const mensagem = `Olá, meu nome é ${nome}. Gostaria de agendar um serviço na ${barbeariaNome} para o dia ${data} às ${hora}. Meu WhatsApp/Telefone é ${telefone}. Observações: ${observacoes}`;
        const whatsappUrl = `https://wa.me/${barbeariaWhatsapp}?text=${encodeURIComponent(mensagem)}`;

        window.open(whatsappUrl, '_blank');

        alert('Agendamento enviado com sucesso! Você será redirecionado para o WhatsApp do local.');
        document.getElementById('formAgendamento').reset(); 
    } else {
        alert('Ocorreu um erro ao enviar o agendamento. Corrija os erros do formulário.');
    }
});

async function alertaTermoECondicoes() {
    const { value: accept } = await Swal.fire({
        title: "Termos e Condições",
        input: "checkbox",
        inputValue: 1,
        confirmButtonColor: "#007bff",
        confirmButtonAriaLabel: "Aceitar",
        inputPlaceholder: `
            Eu concordo com os termos e condições de uso do site.
        `,
        confirmButtonText: `
            Continue&nbsp;<i class="fa fa-arrow-right"></i>
        `,
        inputValidator: (result) => {
            return !result && "Você deve aceitar os termos e condições para continuar!";
        }
    });

    if (accept) {
        await Swal.fire("Você concordou com os T&C :)");
        return true;
    }

    return false;
}
