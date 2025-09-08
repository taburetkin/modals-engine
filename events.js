


export const events = {
	_events: {},

	start() {
		if (this._started) { return }
		this._started = true;
		document.addEventListener('click', clickHandler);
		document.addEventListener('keyup', escapeHandler);
	},

	stop() {
		document.removeEventListener('click', clickHandler);
		document.removeEventListener('keyup', escapeHandler);
		this._started = false;
	},

	trigger(event, ...args) {
		const eventCallbacks = this._events[event];

		/* c8 ignore next */
		if (!eventCallbacks) return;

		for(let cb of eventCallbacks) {
			const result = cb.apply(null, args);
			if (result !== undefined) {
				return result;
			}
		}
	},

	on(event, callback) {
		let eventCallbacks = this._events[event];
		if (!eventCallbacks) {
			eventCallbacks = [];
			this._events[event] = eventCallbacks;
		}
		eventCallbacks.push(callback);
	},

	off(event, callback) {
		const eventCallbacks = this._events[event];

		/* c8 ignore next */
		if (!eventCallbacks || !eventCallbacks.length) return;

		if (eventCallbacks[eventCallbacks.length - 1] === callback) {
			eventCallbacks.pop();
		} else {
			const index = eventCallbacks.indexOf(callback);
			if (index >= 0) {
				eventCallbacks.splice(index, 1);
			}
		}
	}
}


function escapeHandler(event) {
	if (event.keyCode === 27) {
		events.trigger('escape');
	}
}

function clickHandler(event) {
	events.trigger('click', event.target);
}



console.warn('events', events);