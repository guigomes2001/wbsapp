document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formSugestao");

    // Inicializar o EmailJS
    emailjs.init("HJ5qyClRJVX-vwYf0"); // Substitua por seu USER_ID do EmailJS

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        // Obter valores dos campos
        const nome = document.getElementById("nome").value;
        const nomeBarbearia = document.getElementById("nomeBarbearia").value;
        const endereco = document.getElementById("endereco").value;
        const telefone = document.getElementById("telefone").value;
        const whatsapp = document.getElementById("whatsapp").value;
        const observacoes = document.getElementById("observacoes").value;
        const regiao = document.getElementById("regiao").value;

        // Configurar parâmetros para o EmailJS
        const params = {
            nome: nome,
            nomeBarbearia: nomeBarbearia,
            endereco: endereco,
            telefone: telefone,
            whatsapp: whatsapp || "Não informado",
            observacoes: observacoes,
            regiao: regiao,
        };

        // Enviar e-mail via EmailJS
        emailjs.send("service_5btsf5e", "template_lmpapki", params)
            .then(function (response) {
                alert("Sugestão enviada com sucesso! Obrigado por contribuir.");
                form.reset(); // Limpa o formulário
            })
            .catch(function (error) {
                alert("Ocorreu um erro ao enviar sua sugestão. Tente novamente.");
                console.error("Erro:", error);
            });
            
        // Limpa mensagens de erro
        document.querySelectorAll('.error-message').forEach(function(element) {
            element.textContent = '';
        });

        // Validação dos campos
        let valido = true;

        if (nome.trim() === '') {
            document.getElementById('errorNome').textContent = 'Por favor, insira seu nome.';
            valido = false;
        }

        if (nomeBarbearia.trim() === '') {
            document.getElementById('errorNomeBarbearia').textContent = 'Por favor, insira o nome da barbearia.';
            valido = false;
        }

        if (endereco.trim() === '') {
            document.getElementById('errorEndereco').textContent = 'Por favor, insira o endereço da barbearia.';
            valido = false;
        }

        if (telefone.trim() === '') {
            document.getElementById('errorTelefone').textContent = 'Por favor, insira o telefone da barbearia.';
            valido = false;
        }

        if (regiao.trim() === '') {
            document.getElementById('errorRegiao').textContent = 'Por favor, selecione a região.';
            valido = false;
        }

        if (!valido) {
            return; // Se algum campo for inválido, não envia o formulário
        }
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
