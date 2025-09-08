import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { url: 'http://localhost' });

const window = global.window = dom.window;
const document = global.document = dom.window.document;

export function pressEsc() {
	const escapeKeyEvent = new window.KeyboardEvent('keyup', {
	key: 'Escape',
	keyCode: 27, 
	wich: 27,// Legacy keyCode for Escape
	bubbles: true, // Allow the event to bubble up the DOM tree
	cancelable: true // Allow the event to be canceled
	});
	document.dispatchEvent(escapeKeyEvent);
}

export {
	document, window
}