'use strict';

export default class Storage {
    static create(key, value) {
        localStorage.setItem(key, value);
    }

    static read(key) {
        return localStorage.getItem(key);
    }
    
    static update(key, value) {
        localStorage.setItem(key, value);
    }
    
    static delete(key) {
        localStorage.removeItem(key);
    }
}