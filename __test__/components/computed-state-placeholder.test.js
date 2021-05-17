import { useRender } from '../utils/useRender';
import { wait } from '../utils/wait';

/**
 * a testing utility to
 * fill the placeholders with given value of count
 * @param {*} count
 * @param {*} doubleCount
 */
const fill = (count, doubleCount) => /* html */`
count is ${count} doubleCount is ${doubleCount}
<div> ${count} and ${doubleCount}  </div>\
<p> this is <span> ${count}</span> ${count} ${doubleCount}</p>`


//-----------------------------
class App {
	js({ $ }) {
		$.count = 0;
    $.doubleCount = () => $.count * 2
	}

	html = fill('[count]','[doubleCount]')
}

//-----------------------------
test('computed state placeholder is working', async () => {
	const component = useRender(/** @type {NueComp} */ (App));
	const root = /** @type {ShadowRoot} */(component.shadowRoot)

  expect(root.innerHTML).toBe(fill(0, 0))

	component.$.count++
	await wait(100)

	expect(root.innerHTML).toBe(fill(1, 2))

  component.$.count++
	await wait(100)

  expect(root.innerHTML).toBe(fill(2, 4))

});
