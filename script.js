// Seletores principais da interface
const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const playBt = document.querySelector('.app__card-primary-button')
const title = document.querySelector('.app__title')
const imagem = document.querySelector('.app__image')
const playPauseImg =  document.querySelector('.app__card-primary-butto-icon')
const startPauseBt = document.querySelector('#start-pause')
const botoes = document.querySelectorAll('.app__card-button')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const tempoNaTela = document.querySelector('#timer')

// Sons
const musicaFocoInput = document.querySelector('#alternar-musica')
const musica = new Audio('/sons/luna-rise-part-one.mp3')
const play = new Audio('/sons/play.wav')
const pause = new Audio('/sons/pause.mp3')
const beep = new Audio('/sons/beep.mp3')

// Estado inicial do timer
let tempoDecorridoEmSegundos = 5 // 25min
let intervaloId = null

musica.loop = true

// Duracoes fixas dos modos
const duracaoFoco = 30  
const duracaoDescansoCurto = 300  
const duracaoDescansoLongo = 900  

// Alternar música de fundo
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

// Botões de contexto (foco / curto / longo)
focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoFoco
    alterarContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoDescansoCurto
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoDescansoLongo
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

// Troca o contexto visual/textual e reinicia timer
function alterarContexto (contexto) {
    mostrarTempo()
    botoes.forEach(btn => btn.classList.remove('active'))
    html.setAttribute('data-contexto', contexto)
    imagem.setAttribute('src', `/imagens/${contexto}.png`)

    switch (contexto) {
        case "foco":
            title.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break
        case "descanso-curto":
            title.innerHTML = `Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!.</strong>`
            break
        case "descanso-longo":
            title.innerHTML = `Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break
    }
}

// Decrementa timer a cada segundo
const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        beep.play()
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if(focoAtivo) {
            const evento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

// Start/pause do timer
startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar () {
    if(intervaloId) {
        pause.play()
        playPauseImg.setAttribute('src', `/imagens/play_arrow.png`)
        zerar()
        return
    }
    play.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    playPauseImg.setAttribute('src', `/imagens/pause.png`)
    iniciarOuPausarBt.textContent = "Pausar"
}

// Reseta o estado do timer
function zerar() {
    clearInterval(intervaloId)
    iniciarOuPausarBt.textContent = "Começar"
    intervaloId = null
}

// Atualiza o visor (mm:ss)
function mostrarTempo () {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {
        minute: '2-digit',
        second: '2-digit'
    })
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

// Inicializa visor
mostrarTempo()
