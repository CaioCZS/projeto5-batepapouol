

const autoScroll = msg =>{
    document.querySelector('.a100').scrollIntoView();
}

const addReservadamente = (dest) =>{
    const txtmsgPriv = document.querySelectorAll('.private_message .txtPriv');
    const destMsg = document.querySelectorAll('.private_message .destinoMsg');
    txtmsgPriv.forEach(texto =>{
        texto.innerHTML+='reservadamente'
    })
    destMsg.forEach(msg =>{
        if(nomeUsuario.name !== msg.innerHTML){
            msg.parentNode.parentNode.classList.add('escondido')
        }
    })
}
let mainMsg= document.querySelector('main')
const exibirMensagens = resposta =>{
    //console.log('buscou certo as msgs')
    //console.log(resposta.data);
    mainMsg.innerHTML = "";
    let nome,paraQuem,textoMsg,typeMsg;
    let idMsg=0
    resposta.data.forEach(mensagemCriada => {
        nome = mensagemCriada.from;
        paraQuem = mensagemCriada.to;
        textoMsg = mensagemCriada.text;
        typeMsg = mensagemCriada.type;
        tempo = mensagemCriada.time;
        idMsg++
        const template = `<div data-test="message" class="mensagem ${typeMsg} a${idMsg}">
        <div class="contMensagem">
        <span class="hora">(${tempo})</span>
        <span class="nomeIdent">${nome}</span> <span class="txtPriv"></span> para 
        <span class="nomeIdent destinoMsg">${paraQuem}</span>:
        ${textoMsg}</div>
    </div>`
        mainMsg.innerHTML += template
    });
    addReservadamente(paraQuem);
    autoScroll();
}

const erroNaBusca = erro =>{
    console.log('deu erro')
}

const buscarMensagens= () =>{
const promisseBuscaMsg=axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

promisseBuscaMsg.then(exibirMensagens).catch(erroNaBusca)

}

const online = resposta =>{
   // console.log('to online')
}
const offline = erro =>{
    console.log('to off')
}

const verificarConec= () => {
    const promisseConec = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeUsuario);
    promisseConec.then(online).catch(offline)
}

const deuCerto = resposta =>{
    buscarMensagens()
    setInterval(buscarMensagens , 3000)
    setInterval(verificarConec , 5000)
}

const deuErrado = erro =>{  
    console.log(erro)
    alert('Esse nome de usuário já esta online, por favor digite outro')
    perguntarNome()  
}

let nomeUsuario;
const perguntarNome = () =>{
    nomeUsuario={name: prompt('Qual o seu nome?')};
    const promisseNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' ,nomeUsuario);
    promisseNome.then(deuCerto);
    promisseNome.catch(deuErrado);
}
perguntarNome()

const sendMsg = () =>{
const campoEnviar = document.querySelector('input')

const attPagina = erro =>{
    console.log(erro)
    if(erro.request.status != 400){
    alert('ocorreu um erro,por favor digite novamente seu nome')
    setTimeout( window.location.reload(true) , 1000)
} 
}

const corpoMsg={
    from:nomeUsuario.name,
    to:"Todos",
    text:campoEnviar.value,
    type:"message",
}
const promisseMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages' , corpoMsg);

promisseMsg.then(buscarMensagens).catch(attPagina);
}







