import modals from "../../index.js";
import { fakeOptions } from "../utils.js";

describe("issues", () => {
	it('should fulfill promise when calling promise.destroy', async () => {
		const options = fakeOptions(CID());
		const promise = modals.show(options);
		promise.destroy();
		await expect(promise).to.be.fulfilled;

	})
});