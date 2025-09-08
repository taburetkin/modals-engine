import modals from "../../index.js";
import { buildModalHtml } from "../jquery.modal.js";
import $ from 'jquery'

describe('promise', () => {

	let resolveWith;
	let rejectWith;

	beforeEach(() => {
		resolveWith = undefined;
		rejectWith = undefined;
	});

	it('should destroy and resolve when promise resolved', async () => {

		resolveWith = { some: 'value' };
		const ctx = buildModalHtml('mod', resolveWith, rejectWith);
		const { attach, destroy, isExternalElement, promise } = ctx;

		const options = {
			id: ctx.id,
			destroyOnEsc: true,
			isExternalElement,
			promise,
			attach, destroy,
		};


		const mpromise = modals.show(options);
		const btn = $(ctx.buttonSelector);

		btn.trigger('click');

		const result = await mpromise;

		expect(result.ok).to.be.true;
		expect(result.value).to.be.equal(resolveWith);

	});

	it('should destroy and resolve when promise rejected', async () => {

		rejectWith = { some: 'value-reject' };
		const ctx = buildModalHtml('mod', resolveWith, rejectWith);
		const { attach, destroy, isExternalElement, promise } = ctx;

		const options = {
			id: ctx.id,
			destroyOnEsc: true,
			isExternalElement,
			promise,
			attach, destroy,
		};


		const mpromise = modals.show(options);

		const btn = $(ctx.buttonSelector);

		btn.trigger('click');

		const result = await mpromise;

		expect(result.ok).to.be.false;
		expect(result.value).to.be.equal(rejectWith);

	});


});