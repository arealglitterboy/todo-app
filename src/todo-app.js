'use strict';

const isRequired = (argName) => {throw new Error(`${argName} is a required argument.`)};

const todos = new TodoList();

const getListItem = (todo) => {
    const li = Render.createElement('li', '', ['todo']);
    li.setAttribute('id', todo.key);

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', `input-${todo.key}`);
    input.checked = todo.completed;
    input.className = 'todo__title__check-box';
    input.onclick = (e) => (todos.setCompleted(todo.key, input.checked));

    const label = Render.createElement('label', todo.title, ['todo__title__label']);
    label.setAttribute('for', `input-${todo.key}`);

    const holder = Render.createElement('div', '' , ['todo__title']);
    holder.append(input, label);

    const button = Render.createElement('button', 'x', ["todo__button"], [{ name: 'click', handle: (e) => {todos.deleteToDo(todo.key)} }])

    li.appendChild(holder);
    li.appendChild(button);

    return li;
}

const newRender = (main) => {
    const remaining = todos.numberRemaining;
    main.querySelector('#remaining-todos').textContent = `${remaining} tasks${(remaining !== 1) ? 's' : ''}.`;
    main.children['todos__list'].replaceChildren(...todos.visible.map((todo) => (getListItem(todo))));
    main.querySelector('#todos__completed__number').textContent = (todos.length - remaining);
    main.querySelector('#todos__completed__list').replaceChildren(...todos.complete.map((todo) => (getListItem(todo))));
};

const oldRender = (main) => {
    const remaining = todos.numberRemaining;
    main.querySelector('#remaining-todos').textContent = `${remaining} task${(remaining !== 1) ? 's' : ''}`;
    main.children['todos__list'].replaceChildren(...todos.visible.map((todo) => (getListItem(todo))));
    main.querySelector('#todos__completed__number').textContent = (todos.length - remaining);
};

const screen = new Render(document.getElementById('todos'), newRender);

screen.assignEvent('config-view__filter', 'input', (e) => {
    e.preventDefault();
    todos.setSearchTerm(e.target.value)
});

screen.assignEvent('config-view__show-completed', 'input', (e) => {
    e.preventDefault();
    todos.setShowCompleted(e.target.checked)
});

document.getElementById('add-todo').onsubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.input;
    if (input.value) {
        todos.addToDo(input.value);
        input.value = '';
        screen.render(screen.main);
    }
};

const createToDo = new EditableDivs('todo__title__label__temp-todo', 'What do you need to do?');

document.getElementById('todo__title__label__temp-todo');