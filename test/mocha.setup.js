
import { expect } from 'chai';
import { use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiPromise from 'chai-as-promised';

import { eventsApi } from './eventsApi.js';
import modals from '../index.js';





use(chaiPromise);
use(sinonChai);


global.expect = expect;
global.sinon = sinon;


global.ITCOUNTER = 0;
global.INSIDECOUNTER = 0;
global.INSIDEID = function() {
	global.INSIDECOUNTER++;
	return global.INSIDECOUNTER;
}

global.CID = function CID(p = '') {
	return p + global.ITCOUNTER + '_' + global.INSIDEID();
}

beforeEach(() => {
	global.INSIDECOUNTER = 0;
	global.ITCOUNTER++;
	document.body.innerHTML = `
<input type="text" id="inp" />
<button id="btn"></button>
`;


});

afterEach(() => {
	sinon.restore();
	modals.stopListeningDomEvents();
	modals.destroyAll();
	eventsApi.off();
});


