import { events } from "./events.js";
import { stack } from "./stack.js"

export default {

	destroyAll() {
		stack.destroyAll();
	},


	show(options) {
		events.start();
		const promise = stack.create(options);
		promise.modal.attach();
		return promise;
	},
	

	stopListeningDomEvents() {
		events.stop();
	}

}

