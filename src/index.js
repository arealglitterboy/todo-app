'use strict';

import "./style/to-do.scss";
import Todos from "./todos";

// #region Site-Nav
const openMenu = document.getElementById('header__nav__open');
const navBar = document.getElementById('header__nav__list');

const documentClick = (e) => {
    if (e.target !== navBar) {
        navBar.classList.remove('header__nav__list--show');
        document.removeEventListener('click', documentClick);
    }
}

openMenu.addEventListener('click', (e) => {
    navBar.classList.toggle('header__nav__list--show');
    document.addEventListener('click', documentClick, true);
});

const editable = document.querySelectorAll('div[contenteditable=""]');
for (let element of editable) {
    element.addEventListener('blur', (e) => {
        if (!element.textContent.trim()) {
            element.innerHTML = '';
        }
    });
}
//#endregion

if ('content' in document.createElement('template')) {
    const search = document.getElementById('search');
    const list = new Todos(document.getElementById('active-todos'), document.getElementById('inactive-todos'), search.value);


    search.addEventListener('input', (e) => {
        list.search = e.target.value.trim();
    });

    const addTodo = document.getElementById('add-todo');

    if (!addTodo.children.title.value) {
        addTodo.children.checkbox.checked = false;
    }

    addTodo.children.title.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    addTodo.children.title.addEventListener('input', (e) => {
        if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
            e.target.textContent = e.target.textContent.trim();
        }
    });

    addTodo.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.children.title.textContent.length > 0) {
            list.addTodo(e.target.children.title.textContent, e.target.children.checkbox.checked);
            addTodo.children.title.textContent = '';
            addTodo.children.checkbox.checked = false;
        }
    });
}