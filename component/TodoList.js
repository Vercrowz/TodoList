import { createElement } from "../functions/dom.js"

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */
export class TodoList {

    /** @type {Todo[]} */
    #todos = []


    /** @type {HTMLUListElement} */
    #listElement = []



    /**
     * @param {Todo[]} todos 
     */
    constructor(todos) {
        this.#todos = todos
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    appendTo(element) {
        element.innerHTML = ` <form class="d-flex pb-4">
<input required="" class="form-control" type="text" placeholder="Acheter du saucisson..." name="title" data-com.bitwarden.browser.user-edited="yes">
<button class="btn btn-primary">Ajouter</button>
</form>
<main>
<div class="btn-group mb-4 filter" role="group">
    <button type="button" class=" btn btn-outline-primary active" data-filter="all">Toutes</button>
    <button type="button" class=" btn btn-outline-primary" data-filter="todo">A faire</button>
    <button type="button" class=" btn btn-outline-primary" data-filter="done">Fait</button>
</div>

<ul class="list-group">   
</ul>
</main> `

        this.#listElement = element.querySelector('.list-group')
        for (let todo of this.#todos) {
            const t = new TodoListItem(todo)
            this.#listElement.append(t.element)
        }
        element.querySelector('form').addEventListener('submit', e => this.#onSubmit(e))
        element.querySelectorAll('.btn-group button').forEach(button => {
            button.addEventListener('click', e => this.#toggleFilter(e))
        })
    }

    /** 
     * @param {SubmitEvent} e 
     */
    #onSubmit(e) {
        e.preventDefault()
        const form = e.currentTarget
        const title = new FormData(e.currentTarget).get('title').toString().trim()
        if (title === '') {
            return
        }

        const todo = {
            id: Date.now(),
            title: title,
            completed: false
        }

        // Récupère les données locales
        let localData = localStorage.getItem('todo')

        // Si des données locales sont trouvées
        if (localData) {
            // Convertit les données en JSON
            localData = JSON.parse(localData)

            // Ajoute le nouvelle élément todo au début du tableau
            localData.unshift(todo)

            // Sauvegarde les données mises à jour
            localStorage.setItem('todo', JSON.stringify(localData))
        }

        const item = new TodoListItem(todo)
        this.#listElement.prepend(item.element)
        form.reset()
    }

    /**
     * @param {PointerEvent} e
     */
    #toggleFilter(e) {
        e.preventDefault()
        const filter = e.currentTarget.getAttribute('data-filter')
        e.currentTarget.parentElement.querySelector('.active').classList.remove('active')
        e.currentTarget.classList.add('active')
        if (filter === 'todo') {
            this.#listElement.classList.add('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        } else if (filter === 'done') {
            this.#listElement.classList.add('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        } else {
            this.#listElement.classList.remove('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        }
    }
}

class TodoListItem {

    #element

    /** @type {Todo} */
    constructor(todo) {
        const id = `todo-${todo.id}`

        const li = createElement('li', {
            class: 'todo list-group-item d-flex align-items-center'
        })
        this.#element = li

        const checkbox = createElement('input', {
            type: 'checkbox',
            class: 'form-check-input',
            id,
            checked: todo.completed ? '' : null
        })

        const label = createElement('label', {
            class: 'ms-2 form-check-label',
            for: id
        })

        label.innerText = todo.title

        const button = createElement('button', {
            class: 'ms-auto btn btn-danger btn-sm'
        })

        button.innerHTML = '<i class="bi-trash"></i'

        li.append(checkbox)
        li.append(label)
        li.append(button)
        this.toggle(checkbox, todo.id)

        button.addEventListener('click', e => this.remove(e, todo.id))
        checkbox.addEventListener('change', e => this.toggle(e.currentTarget, todo.id))


    }

    /**
     * 
     * @return {HTMLElement} 
     */
    get element() {
        return this.#element
    }

    /**
     * @param {PointerEvent} e
     */
    remove(e, id) {
        e.preventDefault()

        // Récupère les données locales
        let localData = localStorage.getItem('todo')

        // Si des données locales sont trouvées
        if (localData) {
            // Convertit les données en JSON
            localData = JSON.parse(localData)

            // Récupère la position de l'élément à supprimer dans les données
            const index = localData.findIndex((item) => {
                return item.id === id
            })

            if (index !== -1) {
                // Supprime l'élément des données
                localData.splice(index, 1)

                // Sauvegarde les données mises à jour
                localStorage.setItem('todo', JSON.stringify(localData))
            }
        }

        this.#element.remove()
    }

    /**
     * Change l'état (à faire / fait de la tâche)
     * @param HTMLInputElement checkbox 
     */
    toggle(checkbox, id) {
        // Récupère les données locales
        let localData = localStorage.getItem('todo')

        if (checkbox.checked) {
            this.#element.classList.add('is-completed')

            // Si des données locales sont trouvées
            if (localData) {
                // Convertit les données en JSON
                localData = JSON.parse(localData)

                // Récupère la position de l'élément à supprimer dans les données
                const index = localData.findIndex((item) => {
                    return item.id === id
                })

                if (index !== -1) {
                    // Coche l'élément
                    localData[index].completed = true

                    // Sauvegarde les données mises à jour
                    localStorage.setItem('todo', JSON.stringify(localData))
                }
            }

        } else {
            this.#element.classList.remove('is-completed')

            // Si des données locales sont trouvées
            if (localData) {
                // Convertit les données en JSON
                localData = JSON.parse(localData)

                // Récupère la position de l'élément à supprimer dans les données
                const index = localData.findIndex((item) => {
                    return item.id === id
                })

                if (index !== -1) {
                    // Coche l'élément
                    localData[index].completed = false

                    // Sauvegarde les données mises à jour
                    localStorage.setItem('todo', JSON.stringify(localData))
                }
            }

        }

    }

}
