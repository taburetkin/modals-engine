import $ from 'jquery';

export const innerTemplate = `
<header>
	<button class="close">close</button>
</header>
<article>
	<p>modal content</p>
	<button class="button">button</button>
</article>
<footer></footer>
`;

export function template(id) {
	const tmpl = `<div id="${id}" class="modal">${innerTemplate}</div>`;
	return tmpl;
}

export function buildModalHtml(id, resolveWith, rejectWith) {

	id = id + CID();
	const $modal = $(template(id));
	const $close = $modal.find('button.close');
	const closeSelector = `#${id} button.close`;
	const $button = $modal.find('button.button');
	const buttonSelector = `#${id} button.button`;
	const attach = () => $modal.appendTo(document.body);
	const destroy = () => $modal.remove();
	const isExternalElement = el => !$modal.get(0).contains(el);
	const el = $modal.get(0);

	const promise = new Promise((ok, notOk) => {
		$close.on('click', () => notOk('closed'));
		if (resolveWith) { $button.on('click', () => ok(resolveWith)); }
		if (rejectWith) { $button.on('click', () => notOk(rejectWith)); }
	});

	return {
		id, el,
		$modal, $close, $button,

		closeSelector, buttonSelector,

		attach, destroy,
		isExternalElement,
		promise,

	}
}