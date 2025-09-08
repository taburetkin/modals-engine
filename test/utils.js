export const fakeOptions = (msg, add) => {
	add = add || {};
	const o = {
		id: msg,
		destroy: () => {},
		attach: () => {},
		promise: new Promise((res, rej) => {}),
		...add
	}
	return o;
}