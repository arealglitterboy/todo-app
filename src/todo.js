'use strict';

class TodoNode {
    constructor(title, id, checked) {
        this.title = title;
        this.id = id;
        this.checked = checked;
    }

    get values() {
        return { title: this.title, id: this.id, checked: this.checked };
    }

    toJSON = () => ({ title: this.title, id: this.id, checked: this.checked });
}

export default class Todo extends TodoNode {
    static template = document.getElementById('todo-template').content.children[0];

    constructor(title, id, checked = false, updateHandler) {
        super(title, id, checked);

        this.todo = Todo.template.cloneNode(true);

        this.todo.check = this.todo.querySelector('.todo__check');
        this.todo.heading = this.todo.querySelector('.todo__title');
        this.todo.button = this.todo.querySelector('.todo__action');

        this.todo.check.checked = checked;
        this.todo.heading.textContent = title;

        this.todo.button.addEventListener('click', (e) => {
            updateHandler(this.values, 'remove');
        });

        this.todo.check.addEventListener('input', (e) => {
            e.preventDefault();
            this.checked = this.todo.check.checked;
            updateHandler(this, 'checkbox');
        });
    }

    getHtml = (search) => {
        this.todo.heading.innerHTML = (search) ? this.title.replace(search, `<mark>$&</mark>`) : this.title;
        return this.todo;
    }

    static fromJSON = ({ title, id, checked }, handle) => new Todo(title, id, checked, handle);
}