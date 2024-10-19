export class EventBox {
    #eventTarget = new EventTarget();
    #fnMap = new WeakMap();
    #source;
    constructor(thisSource) {
        this.#source = thisSource;
    }
    setSource(thisSource) {
        this.#source = thisSource;
    }
    dispatch(type, detail) {
        this.#eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
    }
    clear() {
        this.#fnMap = null;
        this.#eventTarget = null;
    }
    subscriber = {
        on: (eventName, handler) => {
            let eventHandler = this.#fnMap.get(handler);
            if (!eventHandler) {
                eventHandler = (event) => {
                    handler.apply(this.#source, event.detail);
                };
                this.#fnMap.set(handler, eventHandler);
            }
            this.#eventTarget.addEventListener(eventName, eventHandler);
        },
        once: (eventName, handler) => {
            let eventHandler = this.#fnMap.get(handler);
            if (!eventHandler) {
                eventHandler = (event) => {
                    handler.apply(this.#source, event.detail);
                };
                this.#fnMap.set(handler, eventHandler);
            }
            this.#eventTarget.addEventListener(eventName, eventHandler, { once: true });
        },
        off: (eventName, handler) => {
            let eventHandler = this.#fnMap?.get(handler);
            if (!eventHandler)
                return;
            this.#eventTarget?.removeEventListener(eventName, eventHandler);
        },
    };
}
//# sourceMappingURL=EventBox.js.map