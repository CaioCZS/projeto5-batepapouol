const exibirMensagens = resposta =>{
    console.log('buscou certo as msgs')
    console.log(resposta.data);
}

const erroNaBusca = erro =>{
    console.log('deu erro')
}

const buscarMensagens= () =>{
const promisseBuscaMsg=axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
promisseBuscaMsg.then(exibirMensagens).catch(erroNaBusca)
}

const deuCerto = resposta =>{
    buscarMensagens()
}

const deuErrado = erro =>{  
    console.log(erro)
    alert('Esse nome de usuário já esta online, por favor digite outro')
    perguntarNome()  
}


const perguntarNome = () =>{
    let nomeUsuario={name: prompt('Qual o seu nome?')};
    const promisseNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' ,nomeUsuario);
    promisseNome.then(deuCerto);
    promisseNome.catch(deuErrado);

}
perguntarNome()






