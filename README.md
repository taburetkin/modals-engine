# abstract modals engine

This is framework agnostic modals engine. It works on vanilla js without any dependencies.  
With this lib you can:
- show multiple modals
- destroy modals by pressing esc (optional)
- destroy modals by clicking outside the modal (optional and actualy you are the person who decided is there was clicked outside dom node or not)



## install
```
npm install modals-engine
```
## use
```js
import modals from 'modals-engine';

const modalPromise = modals.show(options); // will show your modal

```

The `modals.show(options)` method always return a promise with additional properties:  
**destroy**: function, will destroy and remove modal.  
**ready**: promise, will settle when modal became fully initialized.  
**modal**: object, modal itself.  
returned promise always resolves into object: ``` { ok: bool, value: any } ```:
example:
```js
const result = await modals.show(confirmModal);
if (result.ok) {
	// confirmed
} else {
	// canceled
}
```



## options
**destroyOnEsc**: Boolean, optional, default: true  
if true modal will be destroyed if it is the last, ready and Esc keyy presses  

**isExternalElement**: Function, optional, default: undefined, must return boolean.  
```js
const isTrue = isExternalElement(domElementClicked)
```
If provided determines should modal be destroyed if there was a click on external dom element.

**attach**: Function, required  
modals-engine does not know what framework do you use, so you have to provide your method which will attach your modal html to the dom. Its all up to you.

**destroy**: Function, required
same as attach. Provide a function which will effectively destroy your modal component and remove it from the dom.

**promise**: Promise, required
Provide a modal's lifecicle promise. It should be resolved or rejected when the modal should be destroyed. (f.e. reject on close button click or resolve on confirm button click);


## simple jquery example
```js
import modals from 'modals-engine';
import $ from 'jquery';

const $modal = $(`
	<div class="modal">
		<header>
			<button class="close">close</button>
		</header>
		<article>
			<p>Confirm</p>
			<button class="confirm">confirm</button>
			<button class="cancel">cancel</button>
		</article>
	</div>
`);

const options = {
	destroyOnEsc: true,
	isExternalElement: el => !$modal.get(0).contains(el),
	attach: () => $modal.appendTo(document.body),
	destroy: () => $modal.remove(),
	promise: new Promise((ok, notOk) => {
		$modal.find('button.close').one('click', () => notOk('skiped'));
		$modal.find('button.cancel').one('click', () => notOk('canceled'));
		$modal.find('button.confirm').one('click', () => Ok('confirmed'));
	})
}

modals.show(options);


```