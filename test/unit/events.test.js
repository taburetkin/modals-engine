import { eventsApi } from "../eventsApi.js";
import modals from '../../index.js';
import { fakeOptions } from "../utils.js";
import $ from 'jquery';
import { stack } from "../../stack.js";
import { pressEsc } from "../dom.js";
import { events } from "../../events.js";

describe('events', () => {
	describe("document events start/stop listening", () => {
		beforeEach(() => {
			eventsApi.catchDoc();
		});
		afterEach(() => {
			eventsApi.releaseDoc();
		});

		it('should settle click and keyup listeners on document after first show', () => {

			expect(eventsApi.handlers.size, 'initial state').to.be.equal(0);

			modals.show(fakeOptions(CID()));
			modals.show(fakeOptions(CID()));
			
			const clicks = eventsApi.filter(document, 'click');
			const keyups = eventsApi.filter(document, 'keyup');

			expect(clicks, 'click events').to.have.length(1);
			expect(keyups, 'keyup events').to.have.length(1);
			
		});
		
		it('modals.stopListeningDomEvents should remove all settled document event listeners', () => {

			expect(eventsApi.handlers.size).to.be.equal(0);
			modals.show(fakeOptions(CID()));

			let clicks = eventsApi.filter(document, 'click');
			let keyups = eventsApi.filter(document, 'keyup');

			expect(clicks).to.have.length(1);
			expect(keyups).to.have.length(1);

			modals.stopListeningDomEvents();

			let eventsArr = eventsApi.filter(document);
			expect(eventsArr).to.have.length(0);
		});

	});

	describe('document events behaviour', () => {
		let $btn;
		let $inp;

		beforeEach(() => {
			$btn = $('#btn');
			$inp = $('#inp');
		});

		afterEach(() => {
			$btn.off();
			$inp.off();
		});



		it('should destroy on outside click when isExternalElement function provided', async () => {

			expect(stack.modals.length, 'initial').to.be.equal(0);

			const options = fakeOptions(CID(), { isExternalElement: el => true });
			const res = modals.show(options);
			
			expect(typeof res.modal.externalElementClickCallback).to.be.equal('function');			

			
			expect(stack.modals.length, 'after add').to.be.equal(1);
			
			await res.modal.ready;
			
			const cb = sinon.spy(stack, 'destroy');

			$btn.trigger('click');

			
			expect(cb, 'stack.destroy called').be.calledOnce;

			expect(stack.modals.length, 'on check').to.be.equal(0);
		});


		it('should not immediately be destroyd when creating modal with isExternalElement by `click` dom event ', () => {

			expect(stack.modals.length).to.be.equal(0);
			
			$btn.on('click', () => modals.show(fakeOptions(CID(), { isExternalElement: () => true })))
			$btn.trigger('click');
	
			expect(stack.modals.length).to.be.equal(1);
	
		});

		it('should respect isReady flag when destroyOnEsc provided and esc pressed', async () => {
			expect(stack.modals.length, 'initial state').to.be.equal(0);

			const modal1 = modals.show(fakeOptions(CID(), { destroyOnEsc: true }));
			const modal2 = modals.show(fakeOptions(CID(), { destroyOnEsc: true }));

			pressEsc();

			expect(stack.modals.length, 'added two modals').to.be.equal(2);

			await modal1.ready;
			
			pressEsc();

			expect(stack.modals.length, 'last added modal should be destroyed').to.be.equal(1);

			expect(stack.modals[0], 'remaining modal should be the first added').to.be.equal(modal2.modal);

		});

		it ('should respect isReady flag when isExternalElement provided and click occurs', async () => {
			expect(stack.modals.length, 'initial state').to.be.equal(0);

			const modal1 = modals.show(fakeOptions(CID(), { isExternalElement: () => true }));
			const modal2 = modals.show(fakeOptions(CID(), { isExternalElement: () => true }));
			
			$inp.trigger('click');

			expect(stack.modals.length, 'modals are not ready, so click should be ignored').to.be.equal(2);

			await modal1.ready;

			$inp.trigger('click');
			
			expect(stack.modals.length, 'modal1 is ready and it must be destroyed').to.be.equal(1);
			expect(stack.modals[0]).to.be.equal(modal2.modal);

		});

	});

});