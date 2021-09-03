'use strict';

import { v4 as uuidv4 } from 'uuid';

import Storage from './storage';
import Todo from './todo';

const map = (list, callbackFn) => Object.fromEntries(Object.entries(list).map(callbackFn));

export default class Todos {
    list;
    constructor(active, inactive, searchTerm = "") {
        this.readStorage();
        this.main = {
            true: active,
            false: inactive
        };
                
        this.search = searchTerm;
        this.empty = document.getElementById('todos__empty');
        
        this.render();
    }

    // #region todos List methods
    addTodo = (title, checked) => {
        const id = uuidv4();
        this.list[checked] = { ...this.list[checked], [id]: new Todo(title, id, checked, this.todoHandle(id)) };

        this.updateStorage();
        this.render();
    }

    insertTodo = (todo) => {
        this.list = Todos.insertTodo(todo, todo.checked, this.list);
    }

    static insertTodo = (todo, checked, list = this.getList()) => {
        list[checked] = { ...list[checked], [todo.id]: todo };
        this.storeList(list);
        return list;
    };

    removeTodo = (id) => {
        this.list = Todos.removeTodo(id, this.list);
        this.render();
    }

    static removeTodo = (id, list) => {
        const { [id]: removeActive, ...restActive } = list[true];
        const { [id]: removeInactive, ...restInactive } = list[false];
        const rest = { true: restActive, false: restInactive };

        console.log(removeActive, removeInactive);
        if (removeActive || removeInactive) { // * If the todo was in the list, update storage with the changes.
            this.storeList(rest);
        }

        return rest;
    }

    todoHandle = () => ((todo, operation) => (this.todoHandler(todo, operation)));

    swapTodo = (todo) => {
        this.list = Todos.removeTodo(todo.id, this.list);
        this.insertTodo(todo, todo.checked);
        this.render();
    };

    todoHandler = (todo, operation) => {
        console.log(todo, operation);
        switch(operation) {
            case 'remove':
                this.removeTodo(todo.id);
                break;
            case 'checkbox':
                this.swapTodo(todo);
        }
    };
    // #endregion

    // #region visual methods
    render = () => {
        const html = this.getListsHTML();

        if (html.length > 0) {
            this.main[true].replaceChildren(...html[0]);
            this.main[false].replaceChildren(...html[1]);
        } else {
            this.main.replaceChildren();
        }
    };

    getListHTML = (list, search) => {
        let html = Object.values(list);
        
        if (search) {
            html = html.filter(({ title }) => title.search(search) >= 0);
        }

        return html.map((todo) => todo.getHtml(search));
    };

    getListsHTML = () => {
        return [this.getListHTML(this.list[false], this.search), this.getListHTML(this.list[true], this.search)];
    };
    
    /**
     * 
     * @param {string} searchTerm 
     */
    set search(searchTerm) {
        this.searchTerm = searchTerm;
        this.render();
    }

    get search() {
        return (this.searchTerm.length > 0) ? new RegExp(`${this.searchTerm}`, 'gi') : undefined;
    }

    // #endregion

    // #region storage
    static storeList = (list) => {
        console.log('Store List:',list);
        Storage.create('todos', JSON.stringify({ ...list }));
    };

    updateStorage = () => {
        Todos.storeList(this.list);
    };

    /**
     * Reads storage and revives the todos to have be instances of Todo.
     */
    readStorage = () => {
        const stored = Todos.getList();
        
        this.list = { true: map(stored[true], this.revive), false: map(stored[false], this.revive) };
    }

    static getList = () => {
        const stored = Storage.read('todos');
        return (stored) ? JSON.parse(stored) : { true: {}, false: {} };
    };

    static editTodo = (todo, list = this.getList()) => {
        if (list[todo.checked][todo.id]) {
            list[todo.checked][todo.id] = todo;
            this.storeList(list);
        } else if (list[!todo.checked][todo.id]) {
            this.removeTodo(todo.id, !todo.checked, list);
            this.insertTodo(todo, todo);
        }
    };

    revive = ([id, todo]) => ([id, this.fromJSON(todo)]);

    fromJSON = (todo) => Todo.fromJSON(todo, this.todoHandle());
    // #endregion
}