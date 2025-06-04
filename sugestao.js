document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formSugestao");

    emailjs.init("HJ5qyClRJVX-vwYf0"); 

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

    const botao = document.getElementById("botaoSugestao");
    botao.disabled = true;
    botao.textContent = "Aguarde...";

    setTimeout(() => {
        botao.disabled = false;
        botao.textContent = "Enviar sugestão";
    }, 300000); 

        const nome = document.getElementById("nome").value;
        const nomeBarbearia = document.getElementById("nomeBarbearia").value;
        const endereco = document.getElementById("endereco").value;
        const telefone = document.getElementById("telefone").value;
        const whatsapp = document.getElementById("whatsapp").value;
        const observacoes = document.getElementById("observacoes").value;
        const regiao = document.getElementById("regiao").value;

        const params = {
            nome: nome,
            nomeBarbearia: nomeBarbearia,
            endereco: endereco,
            telefone: telefone,
            whatsapp: whatsapp || "Não informado",
            observacoes: observacoes,
            regiao: regiao,
        };

        console.log(params);

        emailjs.send("service_5btsf5e", "template_lmpapki", params)
            .then(function (response) {
                alertaSugestaoEnviadaComSucesso();
                form.reset(); 
            })
            .catch(function (error) {
                alert("Ocorreu um erro ao enviar sua sugestão. Tente novamente.");
                console.error("Erro:", error);
            }) 

            .finally(function () {
                loadingElement.style.display = "none";
            });
            
        document.querySelectorAll('.error-message').forEach(function(element) {
            element.textContent = '';
        });

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
            return; 
        }
    });

    function alertaSugestaoEnviadaComSucesso() {
        Swal.fire({
            icon: "success",
            title: "Sugestão enviada!",
            text: "Obrigado por contribuir com a nossa comunidade.",
            confirmButtonText: "Fechar",
            confirmButtonColor: "#007bff"
        });
    }

    // Atualiza a data e hora em tempo real no rodapé
    function atualizarDataHora() {
        const dataHoraString = new Date().toLocaleString();
        document.getElementById('data-hora').textContent = dataHoraString;
    }

    // Atualiza a data e hora a cada segundo
    setInterval(atualizarDataHora, 1000);
    atualizarDataHora();
});
