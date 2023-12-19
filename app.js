import { TodoList } from "./component/TodoList.js";
import { fetchJSON } from "./functions/api.js";
import { createElement } from "./functions/dom.js";

try {
    let todos;
    const localData = localStorage.getItem('todo')
    
    // VERIFIER SI DES DONNEES SONT DEJA STOCKEES
    if (localData) {
        todos = JSON.parse(localData)
    } else {
        // SI PAS DE DONNEES STOCKEES
        const apiData = await fetchJSON('https://jsonplaceholder.typicode.com/todos?_limit=5')

        localStorage.setItem('todo', JSON.stringify(apiData))

        todos = apiData
    }

    const list = new TodoList(todos)
    list.appendTo(document.querySelector('#todolist'))
} catch (e) {
    const alertElement = createElement('div', {
        class: 'alert alert-danger m-2',
        role: 'alert'
    })

    div.innerText = 'Impossible de charger les éléments'
    document.body.prepend(alertElement)
}