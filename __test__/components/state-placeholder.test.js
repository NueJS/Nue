import { useRender } from '../utils/useRender';
import { wait } from '../utils/wait';

/**
 * a testing utility to
 * fill the placeholders with given value of count
 * @param {*} count
 */
const fill = (count) => /* html */`
count is ${count}
<div> ${count}    </div>\
<p> this is <span> ${count}</span> ${count}</p>`


// component
class App {
	js({ $ }) {
		$.count = 0;
	}

	html = fill('[count]')
}

test('state placeholder is working', async () => {
	const component = useRender(/** @type {NueComp} */ (App));
	const root = /** @type {ShadowRoot} */(component.shadowRoot)

  expect(root.innerHTML).toBe(fill(0))

	component.$.count++

	await wait(100)

	expect(root.innerHTML).toBe(fill(1))

});
