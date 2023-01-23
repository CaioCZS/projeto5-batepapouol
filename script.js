const abrirMenu =() =>{
    document.querySelector('.menu').classList.toggle('escondido')
}
let tipoMensagem;
const selecionarTipo = tipoClicado => {
    const tipoAnterior = document.querySelector('.tipos .selecionado');
    if( tipoAnterior !== null){
        tipoAnterior.classList.remove("selecionado")
    } 
    tipoClicado.classList.add('selecionado');
    let pub=document.querySelector('.publico');
    let priv=document.querySelector('.privado');
    if(tipoClicado.querySelector('p').innerHTML === "Reservadamente"){
        tipoMensagem = "private_message"
    }else{
        tipoMensagem = "message"
    }
    console.log(tipoMensagem)
}

let destinatario;
const selecinarUsuario = usuarioClicado =>{
    const usuarioAnterior = document.querySelector('.cttsOnline .selecionado');
    if(usuarioAnterior !== null){
        usuarioAnterior.classList.remove("selecionado")
    } 
    usuarioClicado.classList.add("selecionado");
    destinatario = usuarioClicado.querySelector('.nomeUsu').innerHTML;
}
const exibirParticipantes = resposta =>{
    let usuarioName;
    resposta.data.forEach(nome =>{
        usuarioName = nome.name;
        const template=`
    <div  data-test="participant" onclick="selecinarUsuario(this)" class="opcoes">
        <ion-icon name="person-circle"></ion-icon>
        <span class="nomeUsu">${usuarioName}</span>
        <ion-icon data-test="check" class="check" name="checkmark"></ion-icon>
    </div>
    `;
        document.querySelector('.cttsOnline').innerHTML += template
    })
}

const buscarParticipante = () =>{
    const promisseParticipantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    promisseParticipantes.then(exibirParticipantes).catch(erroNaBusca)
}

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
    let nome,paraQuem,textoMsg,typeMsg,tempo;
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
    console.log(erro)
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
    document.querySelector('.tela-login').classList.add('escondido')
    buscarParticipante()
    setInterval(buscarParticipante , 10000)
    document.querySelector('.nick').innerHTML = nomeUsuario.name
}

const deuErrado = erro =>{  
    console.log(erro)
    alert('Esse nome já está online ou está em branco,por favor digite outro');
    document.querySelector('.tela-login input').classList.remove('escondido');
    document.querySelector('.tela-login button').classList.remove('escondido');
    document.querySelector('.tela-login .loading').classList.add('escondido');
}

let nomeUsuario;
const perguntarNome = () =>{
    nomeUsuario={
        name: document.querySelector('.tela-login input').value
    };
    const promisseNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' ,nomeUsuario);
        promisseNome.then(deuCerto);
        promisseNome.catch(deuErrado);
        document.querySelector('.tela-login input').classList.add('escondido');
        document.querySelector('.tela-login button').classList.add('escondido');
        document.querySelector('.tela-login .loading').classList.remove('escondido');
}

const campoEnviar = document.querySelector('.enviarMensagens input')
const sendMsg = () =>{


const corpoMsg={
    from:nomeUsuario.name,
    to:destinatario,
    text:campoEnviar.value,
    type:tipoMensagem,
}
campoEnviar.value="";
const promisseMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages' , corpoMsg);
promisseMsg.then(buscarMensagens).catch(attPagina);
}

const attPagina = erro =>{
    console.log(erro)
    if(erro.request.status !== 400){
    alert('ocorreu um erro,por favor digite novamente seu nome')
    setTimeout( window.location.reload(true) , 1000)
} 
}


document.addEventListener('keypress',function(e){
    if(e.key === "Enter"){
        const botaoSend = document.querySelector('.btnSend');
        botaoSend.click();
    }
}
)


