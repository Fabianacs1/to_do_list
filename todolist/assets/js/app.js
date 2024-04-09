function validaSeExisteTarefasNoLocalStorageEMostraNaTela() {
    const localStorage = window.localStorage
    if (localStorage.getItem('lista_tarefas') != null) {
        const listaTarefas = JSON.parse(localStorage.getItem('lista_tarefas'))
        listaTarefas.forEach(tarefa => {
            const listaTarefas = document.getElementById('lista_de_tarefas')
            const novoItem = document.createElement('li')
            novoItem.innerText = tarefa.descricao
            novoItem.id = tarefa.id
            novoItem.appendChild(criaInputCheckBoxTarefa(novoItem.id, tarefa.status))
            if (tarefa.status === 'fechada') {
               novoItem.style.textDecoration =  'line-through'    
            }
            listaTarefas.appendChild(novoItem)
        });
    }
}
function adicionaTarefaNaLista() {
    const novaTarefa = document.getElementById('input_nova_tarefa').value
    criaNovoItemDaLista(novaTarefa)
}
function adicionaTarefaNaLista() {
    const novaTarefaInput = document.getElementById('input_nova_tarefa');
    const novaTarefa = novaTarefaInput.value.trim(); 
    if (novaTarefa !== '') {
        criaNovoItemDaLista(novaTarefa);
        novaTarefaInput.value = ''; 
    } else {
        alert('Por favor, insira uma tarefa válida.'); 
    }
}
function criaNovoItemDaLista(textoDaTarefa) {
    const listaTarefas = document.getElementById('lista_de_tarefas');
    let qtdTarefas = listaTarefas.children.length;

    const novoItem = document.createElement('li');
    novoItem.id = `tarefa_id_${qtdTarefas++}`;
    novoItem.setAttribute('ondblclick', 'editaTextoTarefa(this)'); 

    const spanTexto = document.createElement('span');
    spanTexto.innerText = textoDaTarefa;
    novoItem.appendChild(spanTexto);

    novoItem.appendChild(criaInputCheckBoxTarefa(novoItem.id));

    listaTarefas.appendChild(novoItem);

    const tarefa = montaTarefa(novoItem.id, textoDaTarefa, 'aberta');
    adicionaTarefaAListaLocalStorage(tarefa);
}

function editaTextoTarefa(elementoTarefa) {
    const spanTexto = elementoTarefa.querySelector('span');
    const textoAtual = spanTexto.innerText;
    
    const novoTexto = prompt('Editar Tarefa:', textoAtual);
    if (novoTexto !== null && novoTexto.trim() !== '') {
        spanTexto.innerText = novoTexto.trim();
        // Atualiza a tarefa no localStorage
        atualizaTarefaLocalStorage(elementoTarefa.id, novoTexto.trim());
    } else {
        alert('Por favor, insira um texto válido para a tarefa.');
    }
}



function criaInputCheckBoxTarefa(idTarefa, status) {
    
    const inputTarefa = document.createElement('input')
    
    inputTarefa.type = 'checkbox'
    if (status === 'fechada') {
        inputTarefa.checked = true
    }
    
    inputTarefa.setAttribute('onclick', `mudaEstadoTarefa('${idTarefa}')`)
    return inputTarefa
}

function mudaEstadoTarefa(idTarefa) {
    const tarefaSelecionada = document.getElementById(idTarefa)
    if (tarefaSelecionada.style.textDecoration == 'line-through') {
        tarefaSelecionada.style = 'text-decoration: none;'
    } else {
        tarefaSelecionada.style = 'text-decoration: line-through;'
    }
    mudaEstadoTarefaLocalStorage(idTarefa)
}

function mudaEstadoTarefaLocalStorage(idTarefa) {
    const localStorage = window.localStorage
    if (localStorage.getItem('lista_tarefas') != null) {
        const listaTarefas = JSON.parse(localStorage.getItem('lista_tarefas'))
        let contador = 0
        listaTarefas.forEach(tarefa => {
            if (tarefa.id === idTarefa) {
                if (tarefa.status === 'aberta') {
                    tarefa.status = 'fechada'
                } else {
                    tarefa.status = 'aberta'
                }
                console.log(tarefa)
            }
            localStorage.setItem('lista_tarefas', JSON.stringify(listaTarefas))
            contador++
        });

    }
}

function adicionaTarefaAListaLocalStorage(tarefa) {
    const localStorage = window.localStorage
    let listaTarefas = []
    if (localStorage.getItem('lista_tarefas') != null) {
        listaTarefas = JSON.parse(localStorage.getItem('lista_tarefas'))
    }
    listaTarefas.push(tarefa)
    localStorage.setItem('lista_tarefas', JSON.stringify(listaTarefas))
}

function montaTarefa(idTarefa, textoTarefa, status) {
    return {
        id: idTarefa,
        descricao: textoTarefa,
        status: status
    }
}
function ocultarTarefasConcluidas() {
    const listaTarefas = document.getElementById('lista_de_tarefas');
    const tarefas = listaTarefas.querySelectorAll('li');

    tarefas.forEach(tarefa => {
        const checkbox = tarefa.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            tarefa.style.display = 'none';
        }
    });

    localStorage.setItem('tarefas_ocultas', 'true');
}

function reexibirTodasTarefas() {
    const listaTarefas = document.getElementById('lista_de_tarefas');
    const tarefas = listaTarefas.querySelectorAll('li');

    tarefas.forEach(tarefa => {
        tarefa.style.display = '';
    });

    localStorage.setItem('tarefas_ocultas', 'false');
}

function verificaEstadoExibicao() {
    const estadoOcultas = localStorage.getItem('tarefas_ocultas');
    if (estadoOcultas === 'true') {
        ocultarTarefasConcluidas(); 
    }
}


window.onload = function() {
    validaSeExisteTarefasNoLocalStorageEMostraNaTela();
    verificaEstadoExibicao(); 
};
