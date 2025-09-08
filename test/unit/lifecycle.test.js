import { events } from "../../events.js";
import modals from "../../index.js";
import { stack } from "../../stack.js";
import { fakeOptions } from '../utils.js';







describe("lifecycle", () => {

	it('should return promise when calling `show`', () => {
		const promise = modals.show(fakeOptions(CID()));
		expect(promise).to.be.instanceof(Promise);
	});

	it('destroyAll must remmove all modals', async () => {

		expect(stack.modals.length, '- before length should be 0').to.be.equal(0);
		modals.show(fakeOptions(CID()));
		modals.show(fakeOptions(CID()));
		expect(stack.modals.length, '- after add length should be 2').to.be.equal(2);
		modals.destroyAll();
		expect(stack.modals.length, '- after destroy length should be 0').to.be.equal(0);
		expect(events._events.click, 'click listeners should be empty').to.have.length(0);
		expect(events._events.escape, 'escape listeners should be empty').to.have.length(0);

	});

	it('should setup isReady after register', async () => {
		expect(stack.modals.length).to.be.equal(0);
		const modal = modals.show(fakeOptions('5:1'));
		expect(modal.modal.isReady).not.to.be.true;
		expect(modal.ready).to.be.instanceof(Promise);
		await modal.ready;
		expect(modal.modal.isReady).to.be.true;
	});		


	it('should allow to invoke destroy', () => {
		expect(stack.modals.length).to.be.equal(0);

		const modal = modals.show(fakeOptions(CID()));
		expect(stack.modals.length).to.be.equal(1);

		modal.destroy();

		expect(stack.modals.length).to.be.equal(0);
	});

	it('should add and remove escape listener on show', () => {
		
		let _escape = events._events.escape || [];

		expect(_escape, 'initial check').to.have.length(0);

		const options = fakeOptions(CID(), { destroyOnEsc: true, isExternalElement: () => true});
		const { modal, destroy } = modals.show(options);

		_escape = events._events.escape || [];

		expect(_escape, 'should add callback to array').to.have.length(1);
		expect(_escape[0], 'callback should be certain').to.be.equal(modal.escapePressCallback);

		destroy();

		expect(_escape, 'callback array should be empty').to.have.length(0);

	});


	it('should add and remove external click listener on show', () => {
		let _click = events._events.click || [];

		expect(_click, 'initial check').to.have.length(0);

		const options = fakeOptions(CID(), { destroyOnEsc: true, isExternalElement: () => true});
		const { modal, destroy } = modals.show(options);

		_click = events._events.click || [];

		expect(_click, 'should add callback to array').to.have.length(1);
		expect(_click[0], 'callback should be certain').to.be.equal(modal.externalElementClickCallback);
		
		destroy();

		expect(_click, 'callback array should be empty').to.have.length(0);

	});

});