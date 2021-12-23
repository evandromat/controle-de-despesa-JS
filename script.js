const transacaoUL = document.querySelector('#transactions')
const displayRenda = document.querySelector('#money-plus')
const displayDespesa = document.querySelector('#money-minus')
const displayBalanco = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransacaoNome = document.querySelector('#text')
const inputTransacaoRenda = document.querySelector('#amount')


const localStorageTransacao = JSON.parse(localStorage
    .getItem('DB_TRANSACOES'))
let transactions = localStorage
    .getItem('DB_TRANSACOES') !== null ? localStorageTransacao : []

const addTransacaoNoArray = (nomeTransacao, montanteTransacao) => {
    const transaction = {
        id: Number(gerarID()),
        nome: nomeTransacao,
        renda: Number(montanteTransacao)
    }

    transactions.push(transaction)
}

const limparInputs = () => {
    inputTransacaoRenda.value = ''
    inputTransacaoNome.value = ''
}
const tratarFormSubmit = event => {
    event.preventDefault()

    const nomeTransacao = inputTransacaoNome.value.trim()
    const montanteTransacao = inputTransacaoRenda.value.trim()
 
    addTransacaoNoArray(nomeTransacao, montanteTransacao)
    inicializar()
    updateLocalStorage()

    limparInputs()
}
const removeTransacao = ID => {
    transactions = transactions
        .filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    inicializar()
    verificaDbVazio()
}
const addTransacaoNoDOM = transaction => {


    const operador = transaction.renda < 0 ? '-' : '+'
    const CSSClass = transaction.renda < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.renda)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${transaction.nome} 
        <span>${operador} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransacao(${transaction.id})">
        x
        </button>
    `
    transacaoUL.prepend(li)

}

const getTotal = montanteTransacoes => montanteTransacoes
    .reduce((acumulator, transaction) => acumulator + transaction, 0)
    .toFixed(2)
const getRenda = montanteTransacoes => montanteTransacoes
    .filter(value => value > 0)
    .reduce((acumulator, value) => acumulator + value, 0)
    .toFixed(2)
const getDespesa = montanteTransacoes => Math.abs(montanteTransacoes
    .filter(value => value < 0)
    .reduce((acumulator, transaction) => acumulator + transaction, 0))
    .toFixed(2)

const atualizarBalancoValores = () => {
    const montanteTransacoes = transactions
        .map(transaction => transaction.renda)

    const total = getTotal(montanteTransacoes)
    const renda = getRenda(montanteTransacoes)
    const despesa = getDespesa(montanteTransacoes)

    displayBalanco.textContent = `R$ ${total}`
    displayRenda.textContent = `R$ ${renda}`
    displayDespesa.textContent = `R$ ${despesa}`
}



const inicializar = () => {

    transacaoUL.innerHTML = ''
    transactions.forEach(addTransacaoNoDOM)
    atualizarBalancoValores()



}

inicializar()

const updateLocalStorage = () => {
    localStorage.setItem('DB_TRANSACOES', JSON.stringify(transactions))
}


const gerarID = () => Math.ceil(Math.random() * 10000)

const verificaDbVazio = () => {
    if (transactions.length == 0) {
        const li = document.createElement('li')
        li.innerHTML = `<img href="info.svg" class="icon-info"/> <small class="campoVazio">Sem lançamentos!</small>`
        transacaoUL.prepend(li)
    }
}

form.addEventListener('submit', tratarFormSubmit)
window.addEventListener('load', verificaDbVazio)