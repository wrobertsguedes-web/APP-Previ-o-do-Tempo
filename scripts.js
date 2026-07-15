let chaveIA = "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"
async function cliqueiNoBotao() {
    let cidade = document.querySelector(".input-cidade").value
    let caixa = document.querySelector(".caixa-media")

    let chave = "d95874c3a1b18cfd25a084ac61d4497d"
    let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`
    
    let respostaServidor = await fetch(endereco)
    let dadosJson = await respostaServidor.json()
    console.log(dadosJson)
    
    caixa.innerHTML = `
    <h2 class="cidade">${dadosJson.name}</h2>
    <p class="tempo">${Math.floor(dadosJson.main.temp)} °C</p>
    <img  class="icone" src="https://openweathermap.org/payload/api/media/file/${dadosJson.weather[0].icon}.png">
    <p class="umidade">Umidade: ${dadosJson.main.humidity}%</p>
    <button class="botao-ia" onclick="pedirSugestaoRoupa()">Sugestão de Roupa</button>
    <p class="resposta-ia">Resposta da IA</p>
    `
}

function detectaVoz(){
    let reconhecimento = new window.webkitSpeechRecognition()
    reconhecimento.lang = "pt-br"
    reconhecimento.start()

    reconhecimento.onresult = function(evento){
        let textoTranscrito = evento.results[0][0].transcript
        document.querySelector(".input-cidade").value = textoTranscrito
        cliqueiNoBotao()
    }
}

async function pedirSugestaoRoupa(){
    let temperatura = document.querySelector(".tempo").textContent
    let umidade = document.querySelector(".umidade").textContent
    let cidade = document.querySelector(".cidade").textContent
    


    let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + chaveIA
        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    "role": "user",
                    "content": `Me dê uma sugestão de qual roupa usar hoje. 
                    Estou na cidade de: ${cidade}, a temperatura atual é: ${temperatura},
                    e a umidade está em: ${umidade}.
                    Me dê sugestões em 2 frases curtas.
                    `
            }]
        })
    })

    let dados = await resposta.json()
    document.querySelector(".resposta-ia").innerHTML = dados.choices[0].message.content
    console.log(dados)
}