import modals from '../../index.js';

describe("options", () => {
	let attach;
	let destroy;
	let promise;
	
	beforeEach(() => {
		attach = () => {};
		destroy = () => {};
		promise = new Promise((res, rej) => {});
	});

	it('optional isExternalElement: must be undefined or function and should throw', () => {
		expect(() => modals.show({ attach, destroy, promise })).to.not.throw();
		expect(() => modals.show({ attach, destroy, promise, isExternalElement: true })).to.throw();
		expect(() => modals.show({ attach, destroy, promise, isExternalElement: () => {} })).to.not.throw();
	});

	it('attach must be a function and should throw if not', () => {
		expect(() => modals.show({ destroy, promise })).to.throw();
		expect(() => modals.show({ destroy, promise, attach: 'shmatach' })).to.throw();
		expect(() => modals.show({ destroy, promise, attach })).to.not.throw();
	});

	it('destroy must be a function and should throw if its not', () => {
		expect(() => modals.show({ attach, promise })).to.throw();
		expect(() => modals.show({ attach, promise, destroy: 'shmestroy' })).to.throw();
		expect(() => modals.show({ attach, promise, destroy })).to.not.throw();
	});

	it('promise is required, must be a promise and should throw if not', () => {
		expect(() => modals.show({ destroy, attach, })).to.throw();
		expect(() => modals.show({ destroy, attach, promise: 'shmomis' })).to.throw();
		expect(() => modals.show({ destroy, attach, promise })).to.not.throw();
	})

});