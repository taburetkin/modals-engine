import { events } from "./events.js";


export const stack = {

	modals: [],

	create(options) {

		let { 
			id, 
			isExternalElement, 
			destroyOnEsc = true, 
			promise,
			destroy,
			attach

		} = options;

		if (typeof attach !== 'function') {
			throw new Error('[modals-engine]: attach function missing');
		}

		if (typeof destroy !== 'function') {
			throw new Error('[modals-engine]: destroy function missing');
		}

		if (promise instanceof Promise === false) {
			throw new Error('[modals-engine]: promise missing');
		}

		if (isExternalElement && typeof isExternalElement !== 'function') {
			//console.log('THROWING!')
			throw new Error('[modals-engine]: isExternalElement must be undefined or be a function. see docs');
		}


		const modal = {
			id,
			isExternalElement, 
			destroyOnEsc, 
			destroy,
			attach			
		}

		let modalDestroy;
		let modalPromise = new Promise(async (resolve, reject) => {

			const resolver = resolveWith => {
				resolve(okResult(resolveWith));
				this.destroy(modal, resolveWith);
			}

			const rejecter = rejectWith => {
				resolve(errResult(rejectWith));
				this.destroy(modal, rejectWith);
			}
			promise.then(resolver,rejecter);

			modalDestroy = rejecter;

			if (isExternalElement) {
				
				modal.externalElementClickCallback = (clickedElement) => {

					if (!this.isLastReady(modal)) return; 
					const isExternal = modal.isExternalElement(clickedElement);
					if (isExternal) {
						rejecter('external-click');
						return true;
					}
				}
			}

			if (destroyOnEsc) {
				modal.escapePressCallback = () => {
					if (this.isLastReady(modal)) {
						rejecter('esc-press');
						return true;
					}
				}
			}


		});

		modalPromise.modal = modal;
		modalPromise.destroy = modalDestroy;
		
		this.register(modal);
		modalPromise.ready = modal.ready;

		return modalPromise;
	},

	getLastReady() {
		let index = this.modals.length - 1;
		while(index >= 0) {
			let modal = this.modals[index];
			if (modal.isReady) {
				return modal;
			}
			index--;
		}
	},

	isLastReady(modal) {
		const last = this.getLastReady();
		return modal === last;
	},

	isLast(modal) {
		return modal === this.modals[this.modals.length - 1];
	},

	_remove(modal) {
		if (this.isLast(modal)) {
			this.modals.pop();
		} else {
			let index = this.modals.indexOf(modal);
			if (index > -1) {
				this.modals.splice(index, 1);
			}
		}

		if (modal.escapePressCallback) {
			events.off('escape', modal.escapePressCallback);
		}

		if (modal.externalElementClickCallback) {
			events.off('click', modal.externalElementClickCallback);
		}

	},


	register(modal) {
		this.modals.push(modal);

		if (modal.escapePressCallback) {
			events.on('escape', modal.escapePressCallback);
		}
		if (modal.externalElementClickCallback) {
			events.on('click', modal.externalElementClickCallback);
		}		

		modal.ready = new Promise((res) => {
			setTimeout(() => {
				modal.isReady = true;
				res(modal);
			}, 0);
		});

	},

	destroy(modal, reason = true) {
		this._remove(modal);
		modal.destroy();
	},

	destroyAll() {
		const arr = this.modals.slice(0);
		for(let m of arr) {
			this.destroy(m, true);
		}
	}
}

console.warn('stack', stack)

function errResult(error) {
	return {
		ok: false,
		value: error
	}
}

function okResult(value) {
	return {
		ok: true,
		value
	}
}

// function awaitMs(action, ms = 0) {
// 	return new Promise((res) => {
// 		setTimeout(() => {
// 			action();
// 			res();
// 		}, ms);
// 	})
// }