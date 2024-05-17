export interface EventSubscriber<T extends Record<string, unknown[]>, THIS extends unknown> {
	on<E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E]) => void): void
	once<E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E]) => void): void
	off<E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E]) => void): void
}

export class EventBox<T extends Record<keyof unknown, unknown[]>, THIS extends unknown> {
	readonly #eventTarget = new EventTarget();
	readonly #fnMap = new WeakMap<(...args: any) => void, (...args: any) => void>()
	readonly #source: THIS;
	constructor(thisSource: THIS) {
		this.#source = thisSource;
	}
	dispatch<E extends keyof T>(type: E, detail: T[E]): void {
		this.#eventTarget.dispatchEvent(new CustomEvent(type as any, {detail}))
	}
	readonly subscriber: EventSubscriber<T, THIS> = {
		on: <E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E] & any[]) => void) => {
			let eventHandler = this.#fnMap.get(handler);
			if (!eventHandler) {
				eventHandler = (event: CustomEvent) => {
					handler.apply(this.#source, event.detail);
				}
				this.#fnMap.set(handler, eventHandler);
			}
			this.#eventTarget.addEventListener(eventName as any, eventHandler);
		},
		once: <E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E] & any[]) => void) => {
			let eventHandler = this.#fnMap.get(handler);
			if (!eventHandler) {
				eventHandler = (event: CustomEvent) => {
					handler.apply(this.#source, event.detail)
				}
				this.#fnMap.set(handler, eventHandler);
			}
			this.#eventTarget.addEventListener(eventName as any, eventHandler as any, {once: true});
		},
		off: <E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E] & any[]) => void) => {
			let eventHandler = this.#fnMap.get(handler);
			if (!eventHandler) return;
			this.#eventTarget.removeEventListener(eventName as any, eventHandler);
		},
	};
}