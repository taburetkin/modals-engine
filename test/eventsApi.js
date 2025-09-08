import { document } from './dom.js';

const docAddEventListener = document.addEventListener;
const docRemoveEventListener = document.removeEventListener;

export const eventsApi = {
	handlers: new Set(),

	on(el, event, callback) {
		el.addEventListener(event, callback);
		this._add(el, event, callback);
	},

	_add(el, event, callback) {
		const c = { el, event, callback };
		this.handlers.add(c);
	},

	off(el, event, callback) {
		const arr = Array.from(this.handlers);
		arr.forEach((c, index) => {

			if (this._isMatch(el, event, callback, c)) {
				this._off(c);
				return true;
			}

		});
	},

	_off(c) {
		c.el.removeEventListener(c.event, c.callback);
		this._remove(c);
	},

	_isMatch(el, event, callback, c) {
		if (el && c.el !== el) return false;
		if (event && c.event !== event) return false;
		if (callback && c.callback !== callback) return false;
		return true;
	},

	filter(el, event, callback, firstFound) {
		const arr = [];
		for (let c of this.handlers) {
			if (this._isMatch(el, event, callback, c)) {
				if (firstFound) return c;
				arr.push(c);
			}
		}
		return arr;
	},



	_remove(c) {
		this.handlers.delete(c);
	},

	catchDoc() { 
		document.addEventListener = (event, handler) => {
			docAddEventListener.call(document, event, handler);
			this._add(document, event, handler);
		}
		document.removeEventListener = (event, handler) => {
			docRemoveEventListener.call(document, event, handler);
			const c = this.filter(document, event, handler, true);
			this._remove(c);
		}
	},

	releaseDoc() { 
		document.addEventListener = docAddEventListener;
		document.removeEventListener = docRemoveEventListener;
		this.off(document);
	},


	trigger(el, eventName, arg) {
		let event;
		if (eventName === 'click') {
			event = new window.MouseEvent('click', {
				bubbles: true 
			});
		}
		if (!event) {
			throw new Error('event undefined')
		}
		el.dispatchEvent(event);
	}

}

