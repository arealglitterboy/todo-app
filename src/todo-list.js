'use strict';

class TodoList {
    #todoList = {};
    constructor() {
        const jstring = Storage.read('todoList');

        if (jstring) {
            this.#getFromStorage(jstring);
        }

        this.filter = {
            term: '',
            showCompleted: document.getElementById('config-view__show-completed').checked
        };
    }

    deleteToDo(key) {
        const {[key]: deleted, ...remainingKeys } = this.#todoList; // * Destructure todo list object, seperating the desired key from the remaining
        this.#todoList = remainingKeys;

        this.#sendToStorage();
        screen.render(screen.main);
    }

    /**
     * **addToDo**: Sets a key-value pair in the todo list to the given values, if a key is passed in, then the associated value will be edited.
     * @param {*} title 
     * @param {*} completed 
     * @param {*} key 
     */
    addToDo (title, completed = false, key = uuidv4()) {
        this.#todoList[key] = { title, completed, key };

        this.#sendToStorage();
        screen.render(screen.main);
    }

    setCompleted = (id, completed) => {
        this.#todoList[id].completed = completed;

        this.#sendToStorage();
        screen.render(screen.main);
    }

    setTodoComplted = (title, completed) => {
        this.#todoList.find((todo) => (todo.title.localeCompare(title) === 0)).completed = completed;
        
        this.#sendToStorage();
        screen.render(screen.main);
    }

    setShowCompleted = (showCompleted) => {this.filter = { ...this.filter, showCompleted }};

    setSearchTerm = (term) => {this.filter = { ...this.filter, term: term.toLowerCase() }};

    get numberRemaining() { return Object.values(this.#todoList).filter((todo) => (!todo.completed)).length; };

    get length() { return Object.values(this.#todoList).length; }

    get visible() {
        return Object.values(this.#todoList).filter((todo) => (
            (this.filter.showCompleted || !todo.completed)
            && (todo.title.toLowerCase().includes(this.filter.term)))
        );
    }

    get incomplete() {
        return Object.values(this.#todoList).filter((todo) => (
            (this.filter.showCompleted || !todo.completed)
            && (todo.title.toLowerCase().includes(this.filter.term)))
        );
    }

    get complete() {
        return Object.values(this.#todoList).filter((todo) => (
            (todo.completed)
            && (todo.title.toLowerCase().includes(this.filter.term)))
        );
    }

    static getList(jstring = Storage.read('todoList')) {
        try {
            return (jstring) ? JSON.parse(jstring) : {};
        } catch(e) {
            console.log(e);
            return {};
        }
    }

    #getFromStorage = (jstring = Storage.read('todoList')) => (this.#todoList = TodoList.getList(jstring));

    #sendToStorage = () => (Storage.update('todoList', JSON.stringify({ ...this.#todoList })));
}