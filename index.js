const maiorValor = document.getElementById("maiorValor");
const menorValor = document.getElementById("menorValor");
const numeroElementos = document.getElementById("numeroDeElementos");

let xIs = [];
let fis;

function cadastrar() {
    let amplitudeTotal = maiorValor.value - menorValor.value;
    let K = Math.ceil(Math.sqrt(numeroElementos.value));
    let amplitudeClasse = Math.ceil(amplitudeTotal / K);

    let index = Number(menorValor.value);
    const tbody = document.querySelector("#table tbody");

    tbody.innerHTML = "";
    xIs = [];

    for (let i = 0; i < K; i++) {
        const linha = document.createElement("tr");
        linha.classList.add('tableRow');

        const tdClasse = document.createElement("td");
        tdClasse.textContent = `${index} - ${index + amplitudeClasse}`;

        const xi = (index + index + amplitudeClasse) / 2;
        const tdXi = document.createElement("td");
        tdXi.textContent = xi.toFixed(2);
        xIs.push(xi);

        const tdFreq = document.createElement("td");
        tdFreq.innerHTML = `<input type="number" class="freqAbsoluta" value="0"> `;

        const tdFreqRel = document.createElement("td");
        tdFreqRel.innerHTML = "0";

        const tdFreqRelPct = document.createElement("td");
        tdFreqRelPct.innerHTML = "0";

        const tdFreqAcum = document.createElement("td");
        tdFreqAcum.innerHTML = "0";

        const tdFreqRelAcum = document.createElement("td");
        tdFreqRelAcum.innerHTML = "0";

        const tdFreqRelAcumPct = document.createElement("td");
        tdFreqRelAcumPct.innerHTML = "0";

        const tdDesvio = document.createElement("td");
        tdDesvio.innerHTML = "0";

        linha.appendChild(tdClasse);
        linha.appendChild(tdXi);
        linha.appendChild(tdFreq);
        linha.appendChild(tdFreqRel);
        linha.appendChild(tdFreqRelPct);
        linha.appendChild(tdFreqAcum);
        linha.appendChild(tdFreqRelAcum);
        linha.appendChild(tdFreqRelAcumPct);
        linha.appendChild(tdDesvio);

        tbody.appendChild(linha);
        index += amplitudeClasse;
    }

    document.getElementById("calcular").addEventListener("click", () => atualizarAtributos(amplitudeClasse));
}

function atualizarAtributos(amplitudeClasse) {
    fis = Array.from(document.querySelectorAll(".freqAbsoluta")).map(inp => Number(inp.value) || 0);
    const linhas = document.querySelectorAll(".tableRow");

    let total = 0;
    for (let index = 0; index < fis.length; index++) {
        total += fis[index];
    }

    var somaFreq = 0;
    var somaRelat = 0;
    var somatorio = 0;
    linhas.forEach((linha, i) => {
        somaFreq += fis[i]
        var relat = (fis[i] / total).toFixed(2);
        somaRelat += Number(relat);

        const colunas = linha.querySelectorAll("td");
        colunas[3].textContent = relat;
        colunas[4].textContent = (relat * 100).toFixed(0);
        colunas[5].textContent = somaFreq;
        colunas[6].textContent = somaRelat;
        colunas[7].textContent = (somaRelat * 100).toFixed(0);
        colunas[8].textContent = (((xIs[i] - media(fis)) ** 2) * fis[i]).toFixed(2);

        somatorio += Number((((xIs[i] - media(fis)) ** 2) * fis[i]).toFixed(2));
    });

    tableValues(amplitudeClasse, somatorio);

}

function media() {
    var media = 0;
    for (let i = 0; i < fis.length; i++) {
        media += Number(fis[i] * xIs[i]);
    }

    return media / numeroElementos.value;
}


function tableValues(amplitudeClasse, somatorio) {
    const listValues = document.getElementById("list");
    listValues.innerHTML = "";

    let valores = [
        `Média: ${media()}`,
        `Mediana: ${mediana(amplitudeClasse)}`,
        `Moda: ${moda().join(", ")}`,
        `Desvio padrão: ${desvioPadrao(somatorio)}`,
        `Variância: ${variancia(somatorio)}`,
        `Coeficiente de variação: ${(variancia(somatorio)/media()).toFixed(2)*100}%`
    ]

    valores.forEach(valor => {
        const li = document.createElement("li");
        li.textContent = valor;
        listValues.appendChild(li);
    });
}


function mediana(amplitudeClasse) {
    var li = 0, h = 0, pmd = 0, fia = 0, count = 0;

    pmd = Math.round(numeroElementos.value / 2);
    h = amplitudeClasse;

    let index = 0, i = 0;
    count = xIs[0] - (amplitudeClasse / 2);
    while (index < pmd) {
        li = count;
        fia = fis[i - 1];
        count += amplitudeClasse;
        index += fis[i];

        if (index < pmd)
            i++;
    }

    return li + ((h * (pmd - fia)) / fis[i]);
}

function moda() {
    const mostAppearence = Math.max(...fis);
    let modas = [];
    for (let index = 0; index < xIs.length; index++) {
        if (fis[index] == mostAppearence)
            modas.push(xIs[index]);
    }

    return modas;
}

function desvioPadrao(sum) {
    return (sum / (numeroElementos.value - 1)).toFixed(2);
}

function variancia(somatorio) {
    return Math.sqrt(desvioPadrao(somatorio)).toFixed(2);
}