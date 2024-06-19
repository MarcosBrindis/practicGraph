import { Node } from "./Node.mjs";
export class LinkedList {
    #count;
    #head;

    constructor() {
        this.#count = 0;
        this.#head = null;
    }

    recorrido() {
        const elements = [];
        for (let current = this.#head; current !== null; current = current.next) {
            elements.push(current.value);
        }
        return elements;
    }

    push(item) {
        const node = new Node(item);
        let current;
        if (this.#head == null) {
            this.#head = node;
        } else {
            current = this.#head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = node;
        }
        this.#count++;
    }
    
    size() {
        return this.#count;
    }

    isEmpty() {
        return this.#count === 0;
    }

    getHead() {
        return this.#head;
    }
}
