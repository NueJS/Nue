(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.nue = {}));
}(this, (function (exports) { 'use strict';

  const data = {
    /** @type Record<string, Function> */
    _components: {},
    _errorThrown: false,
    _config: {
      defaultStyle: ':host{display:block;}'
    },
    /** @type {Function | undefined} */
    _onNodeUpdate: undefined
  };

  // reserved attribute names

  const conditionAttributes = {
    _if: '*if',
    _else: '*else',
    _elseIf: '*else-if'
  };

  const loopAttributes = {
    _for: '*for',
    _key: '*key'
  };

  const animationAttributes = {
    _enter: '*enter',
    _exit: '*exit',
    _move: '*move'
  };

  const otherAttributes = {
    _ref: '*ref'
  };

  // symbols
  const TARGET = /*#__PURE__*/ Symbol();
  const UPDATE_INDEX = /*#__PURE__*/ Symbol();
  const IS_REACTIVE = /*#__PURE__*/ Symbol();
  const ITSELF = /*#__PURE__*/ Symbol();

  /**
   * get name attribute from element
   * @param {HTMLElement} element
   * @param {string} name
   */
  const getAttr = (element, name) => element.getAttribute(name);

  /**
   * remove name attribute from element
   * @param {HTMLElement} element
   * @param {string} name
   */
  const removeAttr = (element, name) => element.removeAttribute(name);

  /**
   * remove name attribute from element
   * @param {HTMLElement} element
   * @param {string} name
   * @param {string} value
   */
  const setAttr = (element, name, value) => element.setAttribute(name, value);

  /**
   * remove name attribute from element
   * @param {HTMLElement} element
   * @param {string} name
   * @param {boolean} [clearAnimation]
   * @param {Function} [cb]
   */
  const animate = (element, name, clearAnimation = false, cb) => {
    element.style.animation = name;
    if (clearAnimation) {
      onAnimationEnd(element, () => {
        element.style.animation = '';
        if (cb) cb();
      });
    }
  };

  /**
   * when animation ends on element run callback
   * @param {HTMLElement} element
   * @param {() => any} cb
   */
  const onAnimationEnd = (element, cb) => {
    element.addEventListener('animationend', cb, { once: true });
  };

  /**
   * returns newly created element of given tag name
   * @param {string} tagName
   * @returns {Element}
   */
  const createElement = (tagName) => document.createElement(tagName);

  /**
   * returns a comment node with given text
   * @param {string} data
   * @returns {Comment}
   */
  const createComment = (data) => document.createComment(data);

  /**
   * call disconnectedCallback and then play remove animation
   * @param {Comp} comp
   * @param {string} animation
   */
  const animatedRemove = (comp, animation) => {
    comp.disconnectedCallback();
    comp._manuallyDisconnected = true;
    animate(comp, animation, true, () => comp.remove());
  };

  /**
   * run animation on all elements, and call onAnimationEnd when last animation is completed
   * @param {HTMLElement[]} elements
   * @param {string} cssAnimation
   * @param {Function} onLastAnimationEnd
   */
  const animateAll = (elements, cssAnimation, onLastAnimationEnd) => {
    const lastIndex = elements.length - 1;
    elements.forEach((comp, i) => {
      animate(comp, cssAnimation, true, () => {
        if (i === lastIndex) onLastAnimationEnd();
      });
    });
  };

  /**
   * return object containing enter and exit animation info
   * @param {HTMLElement} element
   * @returns {AnimationAttributes_ParseInfo}
   */
  const getAnimationAttributes = (element) => ({
    _enter: getAttr(element, animationAttributes._enter),
    _exit: getAttr(element, animationAttributes._exit),
    _move: getAttr(element, animationAttributes._move)
  });

  const node = /*#__PURE__*/ document.createElement('div');

  /**
   * convert dash case to camel case
   * @param {string} name
   * @returns {string}
   */
  const dashCaseToCamelCase = (name) => {
    const attributeName = 'data-' + name;
    setAttr(node, attributeName, '');
    const camelCaseName = Object.keys(node.dataset)[0];
    removeAttr(node, attributeName);
    return camelCaseName
  };

  /**
   * call this function to show that given node is updated
   * @param {ParsedDOMElement} node
   */
  const nodeUpdated = (node) => {
    if (data._onNodeUpdate) data._onNodeUpdate(node);
  };

  /**
   * return function which when called adds the cb to given batch
   * @param {SubCallBack | Function} cb
   * @param {Batch} batch
   */
  const batchify = (cb, batch) => () => batch.add(cb);

  // @todo reduce the amount of functions in this file - they all are very similar
  /**
   *
   * @param {Batch} batch
   * @param {Mutation[]} mutations
   */
  const flushBatch = (batch, mutations) => {
    batch.forEach(cb => {

      const { _node } = /** @type {SubCallBack}*/(cb);
      // if cb is for updating a node, only call cb if node is subscribed
      if ((_node && _node._isSubscribed) || !_node) {
        cb(mutations);
        if (_node) {
          nodeUpdated(_node);
        }
      }
    });
    // once all callbacks are run clear the batch
    batch.clear();
  };

  /**
   * flush events and batched callbacks to outside world
   * @param {Comp} comp
   * @param {Mutation[]} mutations
   */
  const flush = (comp, mutations) => {

    comp._hookCbs._beforeUpdate.forEach(cb => cb(mutations));

    // run and clear batches
    comp._batches.forEach(batch => flushBatch(batch, mutations));

    comp._hookCbs._afterUpdate.forEach(cb => cb(mutations));

  };

  /**
   * schedule the flush
   * @param {Comp} comp
   */
  const scheduleFlush = (comp) => {
    // schedule flush
    setTimeout(() => {
      // do a shallow clone because comp.batchInfo will be cleared out
      const mutations = [...comp._mutations];

      flush(comp, mutations);
      // clear batch info
      comp._mutations.length = 0;
      // reset flag
      comp._flush_scheduled = false;
    }, 0);

    // start batching
    comp._flush_scheduled = true;
  };

  /**
   * notify all the callbacks that are in given subscriptions
   * @param {Subscriptions} subtree
   */
  const notifySubTree = (subtree) => {
    // @ts-expect-error
    subtree[ITSELF].forEach(cb => cb());
    for (const k in subtree) notifySubTree(subtree[k]);
  };

  /**
   * notify callbacks that are subscribed to given path that it is mutated
   * navigate inside subscriptions using the path and notify entire subtree
   * @param {Subscriptions} subscriptions
   * @param {StatePath} path
   */
  const notify = (subscriptions, path) => {
    let tree = subscriptions;
    const lastEdgeIndex = path.length - 1;

    path.forEach((edge, edgeIndex) => {
      // @ts-expect-error
      tree[ITSELF].forEach(cb => cb());
      tree = tree[edge];
      // no subscription exists for the given edge, return
      if (!tree) return
      if (edgeIndex === lastEdgeIndex) notifySubTree(tree);
    });
  };

  /**
   * when state is mutated, add the cb in batch
   * schedule flush if not already scheduled
   * @param {Comp} comp
   * @param {StatePath} path
   */
  const onMutate = (comp, path) => {
    notify(comp._subscriptions, path);
    if (!comp._flush_scheduled) scheduleFlush(comp);
  };

  const modes = {
    /** when detection mode is true,
     * all key accessed in state is recorded in an array called "keyAccesses"
     */
    _detective: false,

    /** when reactive is true
     * state mutation does not invoke onMutate function
     */
    _reactive: false,

    /** when noOverride is true,
     * setting a key in state which already exists does nothing
     * this is used so that default value of state does not override the state set by the parent component
     * via state attribute
     */
    _noOverride: false,

    /** when origin mode is true,
     * it returns the comp where the piece of state is coming from rather it's value
     */
    _returnComp: false
  };

  const attributeTypes = {
    _normal: /** @type {0}*/ (0),
    _event: /** @type {1}*/ (1),
    _state: /** @type {2}*/ (2),
    _prop: /** @type {3}*/ (3),
    _conditional: /** @type {4}*/ (4),
    _staticState: /** @type {5}*/ (5),
    _functional: /** @type {6}*/ (6),
    _ref: /** @type {7}*/ (7)
  };

  const placeholderTypes = {
    _reactive: /** @type {0}*/ (0),
    _functional: /** @type {1}*/ (1)
  };

  const batches = {
    _beforeDOM: /** @type {0}*/ (0),
    _DOM: /** @type {1}*/ (1)
  };

  /**
   * return [target, prop] for given path in object
   * @param {Record<string, any>} obj
   * @param {StatePath} path
   * @returns {[Record<string, any>, any]}
   */

  const targetProp = (obj, path) => {
    const target = path.slice(0, -1).reduce((target, key) => target[key], obj);
    const prop = path[path.length - 1];
    return [target, prop]
  };

  /**
   * get the origin component where the value of the state is coming from
   * @param {Comp} baseComp
   * @param {StatePath} statePath
   * @returns {Comp}
   */
  const origin = (baseComp, statePath) => {
    if (statePath.length === 0) return baseComp

    let target, prop;
    [target, prop] = targetProp(baseComp.$, statePath);

    // @ts-ignore
    if (!target[IS_REACTIVE]) {
      [target, prop] = targetProp(baseComp.$, statePath.slice(0, -1));
    }

    modes._returnComp = true;
    const originCompNode = target[prop];
    modes._returnComp = false;

    return originCompNode
  };

  /**
   * create an error object that to be shown in error-overlay and in console
   * @param {string} issue
   * @param {string} fix
   * @param {Comp | null} comp
   * @param {string} errorCode
   * @param {string} errorName
   * @returns {NueError}
   */
  const createError = (issue, fix, comp, errorCode, errorName) => {

    // get the component function
    if (comp) {
      const compFn = data._components[comp._compFnName];

      console.error(compFn);
      console.error(comp);
    }

    console.log(' ');

    const error = /** @type {NueError}*/(new Error(`${errorCode ? `\n\n${errorCode}\n\n` : ''}${issue}\n\n${fix}\n`));
    error.code = errorCode;
    error.fix = fix;
    error.issue = issue;
    error.name = `nue.js error : ${errorName}`;

    return error
  };

  /**
   * return array of lines of codes of given component's function
   * @param {Comp} comp
   * @return {string[]}
   */

  const getCompFnLines = (comp) => {
    // get the component function
    const compFn = data._components[comp._compFnName];
    // return array of lines of that function's code
    return compFn.toString().split('\n')
  };

  /**
   * return the index of line which is having the error
   * line which is having the error will have a match for given regex
   * @param {string[]} codeLines
   * @param {RegExp} errorRegex
   * @returns {number}
   */
  const getErrorLineIndex = (codeLines, errorRegex) => codeLines.findIndex((codeLine) => {
    const match = codeLine.match(errorRegex);
    return match !== null
  });

  /**
   * highlight word in code of given component
   * and return the portion of code surrounding code of that word
   * @param {Comp} comp
   * @param {RegExp} errorRegex
   * @returns {string}
   */

  const getCodeWithError = (comp, errorRegex) => {
    // get the error line index using the comp's fn
    let allCodeLines = getCompFnLines(comp);
    let matchLineIndex = getErrorLineIndex(allCodeLines, errorRegex);

    // if not found there, error might be in the slot or on attributes of that comp
    // in that case, error code will be in the parent of the comp
    if (matchLineIndex === -1 && comp.parent) {
      allCodeLines = getCompFnLines(comp.parent);
      matchLineIndex = getErrorLineIndex(allCodeLines, errorRegex);
    }

    // if still can't find it - we need a better errorRegex
    if (matchLineIndex === -1) return ''

    const codeLines = [];

    let startIndex = matchLineIndex - 3;
    let endIndex = matchLineIndex + 4;
    startIndex = startIndex < 1 ? 1 : startIndex;
    endIndex = endIndex > allCodeLines.length - 1 ? allCodeLines.length - 1 : endIndex;

    let matchLineIndexInPartialCode = 0;

    /** @type {RegExpMatchArray}*/
    let regexMatch;

    for (let i = startIndex; i < endIndex; i++) {
      const line = allCodeLines[i];
      codeLines.push(line);

      if (i === matchLineIndex) {
        matchLineIndexInPartialCode = codeLines.length;
        regexMatch = /** @type {RegExpMatchArray}*/(line.match(errorRegex));

        let dashLine = '';
        for (let i = 0; i < /** @type {number}*/(regexMatch.index); i++) dashLine += ' ';
        for (let i = matchLineIndex; i < matchLineIndex + regexMatch[0].length; i++) dashLine += '─';

        codeLines.push(dashLine);
      }
    }

    return codeLines.map((line, lineIndex) => {
      let num;
      if (matchLineIndexInPartialCode === lineIndex) num = '──';
      else if (lineIndex === matchLineIndexInPartialCode - 1) num = 'x';
      else if (lineIndex > matchLineIndexInPartialCode) num = lineIndex - matchLineIndexInPartialCode;
      else num = lineIndex - matchLineIndexInPartialCode + 1;

      const lineNumber = String(num);
      return lineNumber.padStart(3) + ' | ' + line
    }).join('\n')
  };

  /**
   * swap items at indexes i and j in array arr
   * @param {any[]} arr
   * @param {number} i
   * @param {number} j
   */
  const swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  /**
   * shorthand to insert value at index i in arr
   * @param {any[]} arr
   * @param {number} i
   * @param {any} value
   */
  const insert = (arr, i, value) => {
    arr.splice(i, 0, value);
  };

  // convert array to hash with hash key as item's value and hash value as item's index
  /**
   * @param {string[]} arr
   * @returns {Record<string, number>}
   */
  const arrayToHash = (arr) => {
    const init = /** @type {Record<string, number>} */({});
    return arr.reduce((hash, value, i) => {
      hash[value] = i;
      return hash
    }, init)
  };

  /**
   * return true if the x is defined
   * @param {any} x
   * @returns {boolean}
   */
  const isDefined = x => x !== undefined;

  /**
   * return lowercase string
   * @param {string} str
   * @returns {string}
   */
  const lower = (str) => str.toLowerCase();

  /**
   * convert string to upperCase
   * @param {string} str
   * @returns {string}
   */
  const upper = (str) => str.toUpperCase();

  /**
   * execute all functions in array and clear array
   * @param {Function[]} arr
   */
  const flushArray = (arr) => {
    arr.forEach(fn => fn());
    arr.length = 0;
  };

  /**
   * checks if two arrays of primitive values are equal or not
   * @param {string[]} arr1
   * @param {string[]} arr2
   * @returns {boolean}
   */
  const arraysAreShallowEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    return arr1.every((item, index) => item === arr2[index])
  };

  /**
   * return true if x is object
   * @param {any} x
   * @returns {boolean}
   */
  const isObject = x => typeof x === 'object' && x !== null;

  /**
   * returns the component name surrounded by angular brackets eg. <compName>
   * @param {Comp} comp
   * @returns {string}
   */
  const angularCompName = comp => `<${comp._compFnName}>`;

  /**
   * returns the node name surrounded by angular brackets eg. <h1>
   * @param {Element} node
   * @returns {string}
   */
  const angularNodeName = (node) => `<${lower(node.nodeName)}>`;

  /**
   * called when a component specific attribute is added on a non-component element
   * @param {Element} node
   * @param {string} attributeName
   * @param {Comp} comp
   * @returns {Error}
   */

  const component_attribute_used_on_non_component = (node, attributeName, comp) => {

    const nodeName = angularNodeName(node);

    const issue = `\
'${attributeName}' attribute can only be used on a component,
but it is used on a non-component element ${nodeName}`;

    const fix = `\
Remove this attribute if ${nodeName} is not a component

If ${nodeName} is actually a component, make sure to declare it in the components() method
`;

    const errorCode = getCodeWithError(comp, new RegExp(`/${attributeName}=`));

    return createError(issue, fix, comp, errorCode, component_attribute_used_on_non_component.name)

  };

  /**
   * called when a function placeholder is used in input attribute binding
   * @param {Comp} comp
   * @param {string} text
   * @returns {Error}
   */
  const function_placeholder_used_in_input_binding = (comp, text) => {
    const issue = 'function placeholder used on input binding';

    const fix = `\
input binding must be a state placeholder.

EXAMPLE:
✔ :input=[foo]
✖ :input=[someFn(bar)]`;

    const code = getCodeWithError(comp, new RegExp(text));

    return createError(issue, fix, comp, code, function_placeholder_used_in_input_binding.name)
  };

  var attributeErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    component_attribute_used_on_non_component: component_attribute_used_on_non_component,
    function_placeholder_used_in_input_binding: function_placeholder_used_in_input_binding
  });

  /**
   * called when onMutate is called without a second argument of dependency array
   * @param {Comp} comp
   * @returns {Error}
   */

  const missing_dependency_array_in_onMutate = (comp) => {
    const issue = `Missing dependencies in onMutate() in ${angularCompName(comp)}`;

    const fix = `\
onMutate hook expects a dependency array as second argument.

Example:
onMutate(callbackFn, [ 'foo', 'bar.baz'])`;

    const errorCode = getCodeWithError(comp, /onMutate(\\w*)/);

    return createError(issue, fix, comp, errorCode, missing_dependency_array_in_onMutate.name)
  };

  var hookErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    missing_dependency_array_in_onMutate: missing_dependency_array_in_onMutate
  });

  /**
   * convert to json
   * @param {any} v
   * @returns {string}
   */
  const toJSON = v => JSON.stringify(v, null, 2);

  /**
   * called when looped components are given non-unique key attribute
   * @param {Comp} comp
   * @param {string[]} keys
   * @returns {Error}
   */

  const keys_not_unique = (comp, keys) => {

    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    });

    const _keys = keys.map(toJSON).join(', ');
    const nonUniqueKeysJoin = nonUniqueKeys.map(toJSON).join(', ');
    const _s = nonUniqueKeys.length > 1 ? 's' : '';

    const issue = `\
non-unique key${_s} used in ${angularCompName(comp)}

keys used: \n${_keys}

non-unique key${_s}: ${nonUniqueKeysJoin}`;

    const fix = 'make sure that all keys are unique';

    console.log('keys: ', keys);
    console.log('non unique Keys: ', nonUniqueKeys);

    const errorCode = getCodeWithError(comp, /\*key=/);

    // @TODO improve the regex
    return createError(issue, fix, comp, errorCode, keys_not_unique.name)
  };

  /**
   * called when a key attribute is not a placeholder on a looped component
   * @param {Comp} comp
   * @param {Comp} parentComp
   * @returns {Error}
   */
  const hardcoded_keys = (comp, parentComp) => {

    const issue = `"*key" attribute on ${angularCompName(comp)} in ${angularCompName(parentComp)} is hard-coded`;

    const fix = `\
make sure you are using a placeholder on "*key" attribute's value.

Example:

✔ *key='[foo]'
✖ *key='foo'`;

    const errorCode = getCodeWithError(comp, /\*key=/);
    return createError(issue, fix, comp, errorCode, hardcoded_keys.name)
  };

  /**
   * called when key attribute is not specified on looped component
   * @param {Comp} comp
   * @param {Comp} parentComp
   * @returns {Error}
   */
  const missing_key_attribute = (comp, parentComp) => {

    const issue = `"*key" attribute is missing on looped component ${angularCompName(comp)} in ${angularCompName(parentComp)}`;

    const fix = '*key attribute is required on a looped component for efficient and correct updates';

    const errorCode = getCodeWithError(parentComp, new RegExp(`<${comp._compFnName}`));

    return createError(issue, fix, comp, errorCode, missing_key_attribute.name)
  };

  /**
   * called when looping attribute *for is given invalid value
   * @param {Comp} comp
   * @param {Comp} parentComp
   * @returns {Error}
   */
  const invalid_for_attribute = (comp, parentComp) => {

    const issue = `Invalid for attribute value on ${angularCompName(comp)} in ${angularCompName(parentComp)}`;

    const fix = `\
make sure you are following this pattern:
*for='(item, index) in items'
or
*for='item in items'`;

    const errorCode = getCodeWithError(parentComp, /\*for=/);

    return createError(issue, fix, comp, errorCode, invalid_for_attribute.name)
  };

  var loopedCompErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    keys_not_unique: keys_not_unique,
    hardcoded_keys: hardcoded_keys,
    missing_key_attribute: missing_key_attribute,
    invalid_for_attribute: invalid_for_attribute
  });

  /**
   * called when state placeholder is either a invalid path or a path which points to an undefined value in state
   * @param {Comp} comp
   * @param {string} content
   * @returns {Error}
   */
  const invalid_state_placeholder = (comp, content) => {
    const issue = `invalid state placeholder: [${content}] used in ${angularCompName(comp)}`;
    const fix = `Make sure that "${content}" is available in state of ${angularCompName(comp)} or it's closure`;
    const regex = content.split('').join('\\s*');
    const errorCode = getCodeWithError(comp, new RegExp(`\\[\\w*${regex}\\w*\\]`));
    return createError(issue, fix, comp, errorCode, invalid_state_placeholder.name)
  };

  /**
   * called when function used in template is not defined
   * @param {Comp} comp
   * @param {string} fnName
   * @returns {Error}
   */
  const function_not_found = (comp, fnName) => {
    const issue = `invalid function "${fnName}" used in ${angularCompName(comp)}`;
    const fix = `Make sure that "${fnName}" is defined in the fn or it's parent fn`;
    const errorCode = getCodeWithError(comp, new RegExp(`=.*${fnName}`));
    return createError(issue, fix, comp, errorCode, function_not_found.name)
  };

  /**
   * called when a placeholder is opened but not closed
   * @param {Comp} comp
   * @param {string} collectedString
   * @returns {Error}
   */
  const placeholder_not_closed = (comp, collectedString) => {

    const trimmed = `"${collectedString.trim()}"`;
    const ifNotPlaceholder = `if ${trimmed} is not a state placeholder: \nprefix the bracket with "!" -> "![${collectedString}" `;
    const ifPlaceholder = `if ${trimmed} is a placeholder: \nInsert closing -> "[${collectedString}]"`;

    const issue = `\
found unclosed placeholder in ${angularCompName(comp)} -> "[${collectedString}"`;

    const fix = `${ifNotPlaceholder}\n\n${ifPlaceholder}`;
    const errorCode = getCodeWithError(comp, new RegExp(`[${collectedString}`));

    return createError(issue, fix, comp, errorCode, placeholder_not_closed.name)
  };

  var placeholderErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invalid_state_placeholder: invalid_state_placeholder,
    function_not_found: function_not_found,
    placeholder_not_closed: placeholder_not_closed
  });

  /**
   * called when invalid argument is given to the components method in component
   * @param {Comp} comp
   * @return {NueError}
   */
  const invalid_args_given_to_components_method = (comp) => {
    const issue = 'components() method expects an array of components, but got this instead:';
    const errorCode = getCodeWithError(comp, /components\(.*\)/);
    return createError(issue, '', comp, errorCode, invalid_args_given_to_components_method.name)
  };

  /**
   * called when component is not a function
   * @param {any} compFn
   * @returns
   */
  const component_is_not_a_function = (compFn) => {
    const issue = `components must be functions, not ${typeof compFn}`;
    const fix = 'change this to a valid component function:';
    return createError(issue, fix, null, toJSON(compFn), component_is_not_a_function.name)
  };

  var otherErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invalid_args_given_to_components_method: invalid_args_given_to_components_method,
    component_is_not_a_function: component_is_not_a_function
  });

  const errors = {
    ...attributeErrors,
    ...hookErrors,
    ...loopedCompErrors,
    ...placeholderErrors,
    ...otherErrors
  };

  /**
   * subscribe to slice of state pointed by the statePath in baseNue
   * when that slice is updated, call the callback in "batch" batch
   *
   * @param {Comp} baseComp
   * @param {StatePath} statePath
   * @param {SubCallBack | Function} updateCb
   * @param {0 | 1} batch
   * @returns {Function}
   */
  const subscribe = (baseComp, statePath, updateCb, batch) => {
    // get the originComp where the state referred by statePath is coming from
    const originComp = origin(baseComp, statePath);

    // throw if no origin is found
    if (!originComp) {
      if (!data._errorThrown) throw errors.invalid_state_placeholder(baseComp, statePath.join('.'))
    }

    if (/** @type {SubCallBack}*/(updateCb)._node && originComp !== baseComp) {
      baseComp._nodesUsingClosureState.add(/** @type {SubCallBack}*/(updateCb)._node);
    }

    // get the higher order updateCb that will only call the updateCb once every batch

    const batchCb = batchify(updateCb, originComp._batches[batch]);

    // start from the root of subscriptions
    let target = originComp._subscriptions;

    // add batchCb in statePath table at appropriate location
    // map is used to unsubscribe in constant time
    const lastIndex = statePath.length - 1;
    statePath.forEach((key, i) => {
      if (!target[key]) target[key] = { [ITSELF]: new Set() };
      target = target[key];
      if (i === lastIndex) {
        // @ts-expect-error
        target[ITSELF].add(batchCb);
      }
    });

    // return unsubscribe function to remove subscription
    // @ts-expect-error
    return () => target[ITSELF].delete(batchCb)
  };

  /**
   * returns an array of removeDep functions
   *
   * @param {Comp} comp
   * @param {StatePath[]} statePaths
   * @param {SubCallBack | Function} updateCb
   * @param {0 | 1} batch
   * @returns {Function}
   */

  const subscribeMultiple = (comp, statePaths, updateCb, batch) => {
    const unsubscribeFunctions = statePaths.map(
      statePath => subscribe(comp, statePath, updateCb, batch)
    );
    // return unsubscribeMultiple
    return () => unsubscribeFunctions.forEach(c => c())
  };

  // when detection mode is enabled is records all the keys that are accessed in state
  // if state.a.b and state.c.d.e is accessed it becomes [['a', 'b'], ['c', 'd', 'e']]
  /**
   * @type {{ _paths: StatePath[]}}
   */
  const accessed = {
    _paths: []
  };

  // call the function and detect what keys it is using of this.$
  // also get the return value and send it as well
  /**
   *
   * @param {Function} fn
   * @returns {[any, StatePath[]]}
   */
  const detectStateUsage = (fn) => {

    modes._detective = true;
    const returnVal = fn();
    modes._detective = false;

    const paths = [...accessed._paths]; // shallow clone

    accessed._paths = [];
    return [returnVal, paths]
  };

  // when initializing the state, if a function is given
  // call that function, detect the state keys it depends on, get the initial value
  // update its value whenever its deps changes

  /**
   *
   * @param {Comp} comp
   * @param {Function} fn
   * @param {string} prop
   * @returns
   */
  const computedState = (comp, fn, prop) => {
    const [initValue, paths] = detectStateUsage(fn);

    /** @type {SubCallBack} */
    const compute = () => {
      const value = fn();
      comp.$[prop] = value;
    };

    const deps = paths.map(path => path.length === 1 ? path : path.slice(0, -1));
    subscribeMultiple(comp, deps, compute, batches._beforeDOM);
    return initValue
  };

  /**
   * @typedef {Record<string|number|symbol, any>} target
   */

  /**
   * create a reactive state on compNode
   * @param {Comp} comp
   * @param {State} obj
   * @param {StatePath} _statePath
   * @returns {State}
   */
  const reactify = (comp, obj, _statePath = []) => {

    const closure$ = comp.parent && comp.parent.$;

    let statePath = _statePath;
    if (!isObject(obj)) return obj

    // make the child objects reactive
    /** @type {target} */
    const target = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach(key => {
      target[key] = reactify(comp, obj[key], [...statePath, key]);
    });

    const reactive = new Proxy(target, {
      has (target, prop) {
        // return true if the prop is in target or its closure
        return prop in target || (closure$ ? prop in closure$ : false)
      },

      set (target, prop, newValue) {
        // short circuit if the set is redundant

        if (target[/** @type {string}*/(prop)] === newValue) return true

        // change the reactive object's statePath, because it has been moved to a different key
        if (prop === UPDATE_INDEX) {
          // newValue is the index at which the reactive is moved
          statePath = [...statePath.slice(0, -1), newValue];
          return true
        }

        // if the mutated prop exists in the target already
        const propInTarget = prop in target;

        let value = newValue;

        // do not override the state set by parent component by default value of the state added in component
        if (modes._noOverride) {
          // ignore set
          if (propInTarget) return true

          if (typeof value === 'function') {
            value = computedState(comp, value, /** @type {string}*/(prop));
          }
        }

        // if the prop is not in target but is in it's closure state
        // then set the value in the closure state instead
        else if (!propInTarget && closure$ && prop in closure$) {
          return Reflect.set(closure$, prop, newValue)
        }

        if (isObject(value)) {
          // if value is not reactive, make it reactive

          if (!value[IS_REACTIVE]) {
            value = reactify(comp, value, [...statePath, /** @type {string}*/(prop)]);
          }
          // when a reactive value is set on some index(prop) in target array
          // we have to update that reactive object's statePath - because we are changing the index it was created at
          else if (Array.isArray(target)) value[UPDATE_INDEX] = prop;
        }

        // -----------------------------
        const set = () => Reflect.set(target, prop, value);

        if (modes._reactive) {
          // push to BATCH_INFO and call onMutate

          const oldValue = target[/** @type {string}*/(prop)];
          const newValue = value;
          const success = set();
          if (oldValue !== newValue) {
            const livePath = () => [...statePath, /** @type {string}*/(prop)];

            const mutatedPath = /** @type {StatePath}*/(livePath());
            // statePath may have changed of reactive object, so add a getPath property to fetch the fresh statePath

            comp._mutations.push({ oldValue, newValue, path: mutatedPath, livePath });

            onMutate(comp, mutatedPath);
          }

          return success
        }

        return set()
      },

      deleteProperty (target, prop) {
        if (modes._reactive) onMutate(comp, [...statePath, /** @type {string}*/(prop)]);
        return Reflect.deleteProperty(target, prop)
      },

      get (target, prop) {
        if (prop === IS_REACTIVE) return true
        if (prop === TARGET) return target

        if (modes._detective) {

          /** @type {StatePath} */
          const fullPath = [...statePath, /** @type {string}*/(prop)];

          if (statePath.length !== 0) {
            accessed._paths[accessed._paths.length - 1] = fullPath;
          } else {
            accessed._paths.push(fullPath);
          }
        }

        // closure state API
        if (prop in target) {
          if (modes._returnComp) return comp
          return Reflect.get(target, prop)
        }
        if (closure$) return Reflect.get(closure$, prop)
      }

    });

    return reactive
  };

  /**
   * subscribe node to state
   * @param {ParsedDOMElement} node
   */

  const subscribeNode = (node) => {
    if (!node._subscribers) return
    node._unsubscribers = node._subscribers.map(s => s());
    node._isSubscribed = true;
  };

  /**
   * unsubscribe node to state
   * @param {ParsedDOMElement} node
   */

  const unsubscribeNode = (node) => {
    if (!node._unsubscribers) return
    node._unsubscribers.forEach(dc => dc());
    node._isSubscribed = false;
  };

  /**
   * unsubscribe node to state
   * @param {ParsedDOMElement} node
   * @param {Function} subscriber
   */

  const addSubscriber = (node, subscriber) => {
    if (!node._subscribers) node._subscribers = [];
    node._subscribers.push(subscriber);
  };

  // keep the dom node in sync with the state from comp
  // by calling the update callback when deps change in state of comp
  /**
   *
   * @param {Comp} comp
   * @param {ParsedDOMElement} node
   * @param {StatePath[]} deps
   * @param {SubCallBack} update
   */

  const syncNode = (comp, node, deps, update) => {
    // attach which node the update method is for so that when the update is called in batches
    // it can check whether to invoke it or not based on whether the node is subscribed or not
    update._node = node;

    // when node is subscribed, call update so that node is up-to-date with state
    // returns unsubscriber function which removes subscription from comp subscriptions to prevent unnecessary dom updates
    const subscriber = () => {
      // @ts-expect-error
      update();

      nodeUpdated(node);

      return subscribeMultiple(comp, deps, update, batches._DOM)
    };

    addSubscriber(node, subscriber);
  };

  /**
   * add dash at the end of string
   * @param {string} str
   * @returns {string}
   */
  const dashify = str => lower(str) + '-';

  /**
   * replace component names in html with dashed names
   * @param {string} html
   * @param {Function[]} components
   * @returns {string}
   */
  const dashifyComponentNames = (html, components) =>
    components.reduce(
      (acc, comp) => acc.replace(new RegExp(`<${comp.name}|</${comp.name}`, 'g'), dashify),
      html
    );

  /**
   * join strings and expressions
   * @param {string[]} strings
   * @param  {string[]} exprs
   * @returns
   */
  const joinTagArgs = (strings, exprs) => exprs.reduce(
    (acc, expr, i) => acc + strings[i] + expr, '') + strings[strings.length - 1];

  /**
   * run compFn
   * @param {Comp} comp
   * @param {Function} compFn
   * @param {boolean} parsed
   * @returns {[string, string, Function[]]}
   */
  const runComponent = (comp, compFn, parsed) => {
    /** @type {Function[]} */
    let childComponents = [];

    let htmlString = '';
    let cssString = '';

    /** @type {TaggedTemplate} */
    const html = (strings, ...exprs) => {
      if (parsed) return
      htmlString = joinTagArgs(strings, exprs);
    };

    /** @type {TaggedTemplate} */
    const css = (strings, ...exprs) => {
      if (parsed) return
      cssString = joinTagArgs(strings, exprs);
    };

    /** @param {Function[]} _childComponents */
    const components = _childComponents => {

      if (!data._errorThrown) {
        const throwError = () => {
          throw errors.invalid_args_given_to_components_method(comp)
        };
        const notArray = !Array.isArray(_childComponents);
        if (notArray) throwError();
        const notArrayOfFunctions = !_childComponents.every(item => typeof item === 'function');
        if (notArrayOfFunctions) throwError();
      }

      if (parsed) return
      childComponents = _childComponents;
    };

    modes._reactive = false;
    modes._noOverride = true;

    const { $, refs, fn, hooks } = comp;
    compFn({ $, refs, fn, ...hooks, hooks, html, components, css });

    modes._reactive = true;
    modes._noOverride = false;

    return [
      dashifyComponentNames(htmlString, childComponents),
      cssString,
      childComponents
    ]
  };

  /**
   * add lifecycle hooks to comp
   * @param {Comp} comp
   */
  const addHooks = (comp) => {
    comp._hookCbs = {
      _onMount: [],
      _onDestroy: [],
      _beforeUpdate: [],
      _afterUpdate: []
    };

    comp.hooks = {
      onMount: (cb) => comp._hookCbs._onMount.push(cb),
      onDestroy: (cb) => comp._hookCbs._onDestroy.push(cb),
      beforeUpdate: (cb) => comp._hookCbs._beforeUpdate.push(cb),
      afterUpdate: (cb) => comp._hookCbs._afterUpdate.push(cb),

      onMutate: (cb, slices) => {
        if (!slices.length) throw errors.missing_dependency_array_in_onMutate(comp)

        comp._hookCbs._onMount.push(() => {
          const stateDeps = slices.map(slice => slice.split('.'));
          return subscribeMultiple(comp, stateDeps, cb, 0)
        });
      }
    };
  };

  /**
   * copy .parsed properties from node's tree to cloneNode's tree
   * cloneNode is clone of node but it does not have custom .parsed properties added in node's tree
   * @param {ParsedDOMElement} node
   * @param {ParsedDOMElement} cloneNode
   */

  const copyParsed = (node, cloneNode) => {
    if (node._parsedInfo) cloneNode._parsedInfo = node._parsedInfo;

    if (node.hasChildNodes()) {
      node.childNodes.forEach((childNode, i) => {
        copyParsed(
          // @ts-expect-error
          childNode,
          cloneNode.childNodes[i]);
      });
    }
  };

  /**
   * clone the node and add the parsed prop
   * @template {ParsedDOMElement} T
   * @param {T} node
   * @returns {T}
   */
  const getParsedClone = (node) => {
    const clone = /** @type {T}*/(node.cloneNode(true));
    copyParsed(node, clone);
    return clone
  };

  /**
   * process the text node
   * @param {Parsed_Text} textNode
   * @param {Comp} comp
   */
  const hydrateText = (textNode, comp) => {
    const parsed = textNode._parsedInfo;
    const { _getValue, _statePaths } = parsed._placeholder;
    const update = () => {
      textNode.textContent = _getValue(comp);
    };
    syncNode(comp, textNode, _statePaths, update);
  };

  /**
   * mutate the object at given path to newValue
   * @param {Record<string, any>} obj
   * @param {StatePath} path
   * @param {any} newValue
   * @returns
   */
  const mutate = (obj, path, newValue) => {
    const [target, prop] = targetProp(obj, path);
    return Reflect.set(target, prop, newValue)
  };

  /**
   * add prop on target
   * @param {Parsed_HTMLElement} target
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */
  const hydrateProp = (target, attribute, comp) => {
    // [{ getValue, deps, type, content }, propName]
    const propName = attribute._name;
    const { _getValue, _type, _content, _statePaths, _text } = /** @type {Placeholder} */(attribute._placeholder);
    const setProp = () => {
      // @ts-expect-error
      target[propName] = _getValue(comp);
    };

    if (target.matches('input, textarea')) {
      // TODO: move this error to parsing phase
      if (_type === placeholderTypes._functional) throw errors.function_placeholder_used_in_input_binding(comp, _text)

      // @ts-expect-error
      const isNumber = target.type === 'number' || target.type === 'range';

      const handler = () => {
        // @ts-expect-error
        let value = target[propName];
        value = isNumber ? Number(value) : value;
        mutate(comp.$, _statePaths[0], value);
      };

      target.addEventListener('input', handler);
    }

    syncNode(comp, target, _statePaths, setProp);
  };

  /**
   * add attribute on target element in context of comp
   * @param {Parsed_HTMLElement} target
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */

  const hydrateNormalAttribute = (target, attribute, comp) => {
    const placeholder = /** @type {Placeholder} */(attribute._placeholder);
    const update = () => setAttr(target, attribute._name, placeholder._getValue(comp));
    syncNode(comp, target, placeholder._statePaths, update);
  };

  /**
   * add event on target target
   * @param {Parsed_HTMLElement} target
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */
  const hydrateEvent = (target, attribute, comp) => {
    const fnName = /** @type {string}*/ (attribute._placeholder);
    const eventName = attribute._name;
    const fn = comp.fn[fnName];

    if (!fn) throw errors.function_not_found(comp, fnName)

    /** @type {EventListener} */
    const handleEvent = (e) => fn(e, comp.$);

    const subscriber = () => {
      target.addEventListener(eventName, handleEvent);
      return () => target.removeEventListener(eventName, handleEvent)
    };

    addSubscriber(target, subscriber);
  };

  /**
   * add reference to element on comp.refs
   * @param {Parsed_HTMLElement} element
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */
  const hydrateRef = (element, attribute, comp) => {
    const refName = /** @type {string}*/(attribute._placeholder);
    comp.refs[refName] = element;
  };

  /**
   * add state on target
   * @param {Comp} target
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */

  const hydrateState = (target, attribute, comp) => {
    const { _placeholder, _name } = attribute;
    const { _getValue, _statePaths } = /** @type {Placeholder}*/(_placeholder);

    const update = () => {
      target.$[_name] = _getValue(comp);
    };

    if (target === comp) update();
    else {
      if (!target._prop$) target._prop$ = {};
      target._prop$[_name] = _getValue(comp);
    }

    subscribeMultiple(comp, _statePaths, update, batches._beforeDOM);
  };

  /**
   * add attribute on target element in context of comp
   * @param {Comp} target
   * @param {Attribute_ParseInfo} attribute
   */

  const hydrateStaticState = (target, attribute) => {
    target._prop$[attribute._name] = /** @type {string}*/(attribute._placeholder);
  };

  /**
   * add Fn on compo
   * @param {Comp} target
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */
  const hydrateFnProp = (target, attribute, comp) => {
    const propName = attribute._name;
    const sourceFnName = /** @type {string}*/(attribute._placeholder);
    // if (!target.fn) target.fn = Object.create(comp.fn)
    target.fn[propName] = comp.fn[sourceFnName];
  };

  /**
   * add or remove attribute based on given condition
   * @param {Parsed_HTMLElement} element
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */
  const hydrateConditionalAttribute = (element, attribute, comp) => {
    const placeholder = /** @type {Placeholder} */(attribute._placeholder);
    const name = attribute._name;

    const update = () => placeholder._getValue(comp)
      ? setAttr(comp, name, '')
      : removeAttr(element, name);

    syncNode(comp, element, placeholder._statePaths, update);
  };

  const {
    _event,
    _prop,
    _normal,
    _conditional,
    _functional,
    _state,
    _staticState,
    _ref
  } = attributeTypes;

  const typeToFn = {
    [_event]: hydrateEvent,
    [_prop]: hydrateProp,
    [_normal]: hydrateNormalAttribute,
    [_conditional]: hydrateConditionalAttribute,
    [_functional]: hydrateFnProp,
    [_state]: hydrateState,
    [_staticState]: hydrateStaticState,
    [_ref]: hydrateRef
  };

  /**
   * hydrate all attributes of given target in context of comp
   * @param {Parsed_HTMLElement | Comp} target
   * @param {Attribute_ParseInfo[]} attributes
   * @param {Comp} comp
   */
  const hydrateAttributes = (target, attributes, comp) => {
    attributes.forEach(attribute => {
      const type = attribute._type;
      const fn = typeToFn[type];
      if (fn) {
        fn(
          // @ts-expect-error
          target,
          attribute,
          comp
        );
      }
    });
  };

  /**
   * add conditional rendering
   * @param {IfComp} ifComp
   * @param {Comp} parentComp
   */
  const hydrateIfComp = (ifComp, parentComp) => {
    const parsed = ifComp._parsedInfo;

    /** @type {ConditionalComp[]} */
    const group = [ifComp];

    if (parsed._conditionGroup) {
      parsed._conditionGroup.forEach(node => {
        group.push(
          getParsedClone(node)
        );
      });
    }

    ifComp._isProcessed = true;

    const { _conditionGroupStateDeps } = parsed;

    const anchorNode = /** @type {Comment} */(ifComp.previousSibling);

    // group that is currently rendered
    /** @type {ConditionalComp} */
    let active;

    /** @type {boolean} */
    let initialized;

    const onGroupDepChange = () => {
      // if a group's condition is foundSatisfied, this becomes true
      let foundSatisfied = false;

      group.forEach(conditionNode => {
        const { _isProcessed, isConnected } = conditionNode;
        const {
          _conditionAttribute,
          _animationAttributes
        } = /** @type {IfComp | ElseIfComp}*/(conditionNode)._parsedInfo;

        const { _enter, _exit } = _animationAttributes;

        const satisfied = _conditionAttribute ? _conditionAttribute._getValue(parentComp) : true;

        // if this component should be mounted
        if (!foundSatisfied && satisfied) {
          foundSatisfied = true;

          // if this node is not mounted, already
          if (!isConnected) {
            // if this node is not processed
            if (!_isProcessed) {
              hydrate(conditionNode, parentComp);
              conditionNode._isProcessed = true;
            }

            const mount = () => {
              anchorNode.after(conditionNode);
              if (_enter && initialized) animate(conditionNode, _enter, true);
            };

            // if it should wait for active component's animation to end
            const waitForAnimationEnd = active && active._parsedInfo._animationAttributes._exit && conditionNode !== active;

            // wait if needed, else mount it right now
            waitForAnimationEnd ? onAnimationEnd(active, mount) : mount();

            active = conditionNode;
          }
        }

        // if the group should be removed
        else if (isConnected) {
          if (_exit) animatedRemove(conditionNode, _exit);
          else conditionNode.remove();
        }
      });
    };

    // since this modifies the DOM, it should be done in dom batches
    subscribeMultiple(
      parentComp,
      _conditionGroupStateDeps,
      onGroupDepChange, batches._beforeDOM
    );

    parentComp._deferredWork.push(() => {
      ifComp.remove();
      onGroupDepChange();
      initialized = true;
    });
  };

  /**
   * get the left and top offset
   * @param {LoopedComp} comp
   * @returns {Offset}
   */
  const getOffset = (comp) => ({
    _left: comp.offsetLeft,
    _top: comp.offsetTop
  });

  /**
   * save offsets for all loopedComponents
   * @param {number[]} indexes
   * @param {LoopedComp[]} loopedComponents
   */
  const saveOffsets = (indexes, loopedComponents) => {
    for (const index of indexes) {
      const comp = loopedComponents[index];
      comp._prevOffset = getOffset(comp);
    }
  };

  // import { CREATE, REMOVE, SWAP } from '../../../constants'

  /**
   * return steps to reconcile oldState to newState
   * @param {ReconcileState} oldState
   * @param {ReconcileState} newState
   * @param {Array<number>} indexes
   * @returns {ReconcileSteps}
   */

  const reconcile = (oldState, newState, indexes) => {

    /** @type {ReconcileSteps} */
    const steps = {
      _remove: [],
      _add: [],
      _swap: []
    };

    // remove, removed items from oldState O(indexes)
    for (const di of indexes) {

      // keep checking for di if we keep finding that di was removed
      // @todo use x-- method instead of using while loop
      while (true) {

        const keyInOld = oldState._keys[di];

        // if the key can not be found it means that this key is a new key
        if (!isDefined(keyInOld)) break

        // if the key was present in the oldState, but not in newState, then this key was removed
        if (!(keyInOld in newState._keyHash)) {
          steps._remove.push(di);
          oldState._keys.splice(di, 1);
          oldState._values.splice(di, 1);
        }

        else {
          break
        }

      }

    }

    // insert, new items from oldState O(n)
    for (const di of indexes) {

      const key = newState._keys[di];

      // if the key is not present in the newState it means it was removed
      if (!isDefined(key)) continue

      // if the key does not exist in oldState, it's a newly added item
      if (!(key in oldState._keyHash)) {
        steps._add.push([di, newState._values[di]]);
        insert(oldState._keys, di, key);
        insert(oldState._values, di, newState._values[di]);
      }

    }

    // swap, swapped values in newState.keys in arr
    for (const di of indexes) {

      const key = oldState._keys[di];

      if (key !== newState._keys[di]) {
        // find where its position in new oldState.keys
        const iShouldBe = newState._keyHash[key];

        steps._swap.push([di, iShouldBe]);
        swap(oldState._keys, di, iShouldBe);
        swap(oldState._values, di, iShouldBe);

        // x-- // keep checking current index, till we set correct item it this index
      }

    }

    // calculate the keyHash again from the modified keys
    oldState._keyHash = arrayToHash(oldState._keys);

    return steps
  };

  /**
   * create an instance of loopedComp
   * @param {LoopInfo} loopInfo
   * @param {any} value
   * @param {number} index
   * @returns {LoopedComp}
   */

  const createLoopedCompInstance = (loopInfo, value, index) => {
    const { _loopedComp, _parentComp, _getClosure } = loopInfo;

    const loopedCompInstance = getParsedClone(_loopedComp);

    loopedCompInstance._isLooped = true;
    loopedCompInstance.parent = _parentComp;
    loopedCompInstance._prop$ = _getClosure(value, index);

    return loopedCompInstance
  };

  /**
   * create component instances using the give reconcileInfo
   * @param {[number, any]} reconcileInfo
   * @param {LoopInfo} loopInfo
   */
  const executeCreate = (reconcileInfo, loopInfo) => {
    const [index, value] = reconcileInfo;
    const { _loopedCompInstances, _anchor, _animation, _instanciated } = loopInfo;

    // create newComp and add to DOM
    const newComp = createLoopedCompInstance(loopInfo, value, index);
    if (index === 0) _anchor.after(newComp);
    else _loopedCompInstances[index - 1].after(newComp);

    // update comps array
    _loopedCompInstances.splice(index, 0, newComp);

    // add enter animation if specified
    if (_animation._enter && _instanciated) animate(newComp, _animation._enter, true);
  };

  /**
   * remove loopedComponent at given index in loopedCompInstances array
   * @param {number} index
   * @param {LoopedComp[]} loopedCompInstances
   */

  const executeRemove = (index, loopedCompInstances) => {
    loopedCompInstances[index].remove();
    loopedCompInstances.splice(index, 1);
  };

  // const swapNodes = (node1, node2) => {
  //   let type = 'before'
  //   let anchor = node2.nextSibling
  //   if (!anchor) {
  //     anchor = node2.previousSibling
  //     type = 'after'
  //   }
  //   node1.replaceWith(node2)
  //   anchor[type](node1)
  // }

  // @TODO update this with upper one

  /**
   * swap component a and b
   * @param {LoopedComp} a
   * @param {LoopedComp} b
   */

  // @TODO: shorten this
  const swapLoopedComps = (a, b) => {
    a._moving = true;
    b._moving = true;

    const aParent = /** @type {HTMLElement}*/(a.parentNode);
    const bParent = /** @type {HTMLElement}*/(b.parentNode);

    const aHolder = createElement('div');
    const bHolder = createElement('div');

    aParent.replaceChild(aHolder, a);

    bParent.replaceChild(bHolder, b);

    aParent.replaceChild(b, aHolder);

    bParent.replaceChild(a, bHolder);

    a._moving = false;
    b._moving = false;
  };

  /**
   * swap ith and jth compNodes
   * @param {[number, number,]} step
   * @param {LoopedComp[]} loopedCompInstances
   */
  const executeSwap = (step, loopedCompInstances) => {
    const [i, j] = step;
    swapLoopedComps(loopedCompInstances[i], loopedCompInstances[j]);
    swap(loopedCompInstances, i, j);
  };

  /**
   * get the steps from reconcile and perform them in DOM
   * @param {ReconcileSteps} steps
   * @param {LoopInfo} loopInfo
   */
  const executeSteps = (steps, loopInfo) => {
    const { _remove, _add, _swap } = steps;
    const { _loopedCompInstances } = loopInfo;
    _remove.forEach(removeStep => executeRemove(removeStep, _loopedCompInstances));
    _add.forEach(addStep => executeCreate(addStep, loopInfo));
    _swap.forEach(swapStep => executeSwap(swapStep, _loopedCompInstances));
  };

  /**
   * DEV ONLY: check if all the keys are unique, else throw error
   * @param {string[]} keys
   * @param {Comp} comp
   */
  const checkUniquenessOfKeys = (keys, comp) => {
    if (new Set(keys).size !== keys.length) {
      throw errors.keys_not_unique(comp, keys)
    }
  };

  /**
   * create new loopState using current array value
   * @param {LoopInfo} loopInfo
   * @returns {ReconcileState}
   */
  const getNewState = (loopInfo) => {
    const { _parentComp, _getArray, _getKeys } = loopInfo;

    const keys = _getKeys();

    checkUniquenessOfKeys(keys, _parentComp);

    return {
      _keys: keys,
      _values: _getArray(),
      _keyHash: arrayToHash(keys)
    }
  };

  /**
   * transit comp from one prevOffset to currentOffset with cssTransition
   * @param {LoopedComp} comp
   * @param {Offset} prevOffset
   * @param {string} cssTransition
   */
  const transit = (comp, prevOffset, cssTransition) => {
    const currentOffset = getOffset(comp);
    const deltaX = prevOffset._left - currentOffset._left;
    const deltaY = prevOffset._top - currentOffset._top;

    requestAnimationFrame(() => {
      // apply a "inverse" transform to place the comp in prev position
      comp.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      // remove transition so that transform applied above is not smoothly transitioned, it should be instant
      comp.style.transition = '';

      // for the next repaint
      requestAnimationFrame(() => {
        // remove the "inverse" transform to put the comp back in current position
        comp.style.transform = '';
        // set transform transition to smoothly transit from old to new position
        comp.style.transition = `transform ${cssTransition}`;
      });
    });
  };

  /**
   * animateMove comps at indexes
   * @param {LoopInfo} loopInfo
   * @param {Array<number>} indexes
   */

  // @todo second arg should be comps instead of indexes
  const animateMove = (loopInfo, indexes) => {
    const moveAnimation = loopInfo._animation._move;
    const loopedCompInstances = loopInfo._loopedCompInstances;

    for (const index of indexes) {
      const comp = loopedCompInstances[index];

      transit(
        comp,
        /** @type {Offset}  */(comp._prevOffset),
        /** @type {string}*/(moveAnimation)
      );
    }
  };

  /**
   * update dom to reflect the array mutation
   * @param {LoopInfo} loopInfo
   * @param {number[]} dirtyIndexes
   * @param {UpdatedSlices} updatedSlices
   * @param {ReconcileState} oldState
   */
  const handleArrayChange = (loopInfo, dirtyIndexes, updatedSlices, oldState) => {
    const { _loopedCompInstances, _instanciated, _animation, _loopAttributes } = loopInfo;
    const { _move, _exit } = _animation;
    const { _item, _itemIndex } = _loopAttributes;
    const updatedStateKeys = Object.keys(updatedSlices);

    const updateStates = () => {
      if (!updatedStateKeys.length) return
      updatedStateKeys.forEach(index => {
        const i = Number(index);
        const comp = _loopedCompInstances[i];
        if (comp) {
          updatedSlices[i].forEach(info => {
            const [target, prop] = targetProp(comp.$[_item], info._path);
            target[prop] = info._newValue;
          });
        }
      });
    };

    const handleDirtyIndexes = () => {
      const newState = getNewState(loopInfo);
      const steps = reconcile(oldState, newState, dirtyIndexes);

      // if reorder animation is to be played, record offsets before DOM is updated
      if (_move && _instanciated) saveOffsets(dirtyIndexes, _loopedCompInstances);

      const updateIndexes = () => {
        // if index is used, only then update the indexes
        if (_itemIndex) {
          dirtyIndexes.forEach(i => {
            if (_loopedCompInstances[i]) _loopedCompInstances[i].$[_itemIndex] = i;
          });
        }
      };

      const executeAndMove = () => {
        // Note: update states must happen after executeSteps

        // update DOM
        executeSteps(steps, loopInfo);

        if (_instanciated) {
          updateIndexes();
          updateStates();
        }

        if (_move) animateMove(loopInfo, dirtyIndexes);
      };

      // if exit animations are specified and we have to remove some nodes, run exit animations
      // else directly call executeAndMove
      if (_exit && steps._remove.length) {
        // to get actual index valueIndex, arrayIndex need to be added
        const nodes = steps._remove.map((valueIndex, arrayIndex) => _loopedCompInstances[valueIndex + arrayIndex]);
        animateAll(nodes, _exit, executeAndMove);
      } else executeAndMove();
      // ---------------------

      // save newState as oldState
      oldState._values = [...newState._values]; // only shallow clone required because we only care about indexes of oldState, not the deeply nested value
      oldState._keys = newState._keys;
      oldState._keyHash = newState._keyHash;
    };

    dirtyIndexes.length ? handleDirtyIndexes() : updateStates();
  };

  /**
   * go through mutations and filter out info that is relevant for updating the looped components
   * @param {Mutation[]} mutations
   * @param {string} arrayPathString
   * @param {StatePath} arrayPath
   * @returns {[number[], UpdatedSlices]}
   */

  const getArrayMutationInfo = (mutations, arrayPathString, arrayPath) => {
    /**
     *  set of indexes, where the items are either moved, removed or added
     *  @type {Set<number>}
     * */
    const dirtyIndexesSet = new Set();

    /**
     * object containing information about what parts of state has been mutated
     * @type {UpdatedSlices}
     * */
    const stateUpdates = {};

    const arrayPathLength = arrayPath.length;

    mutations.forEach(mutation => {
      const { newValue, oldValue, livePath } = mutation;

      // get the fresh path
      const path = livePath();

      // if the mutation path startsWith same path as of array's path
      // it means the array is the target, array mutated
      const arrayMutated = path.join('.').startsWith(arrayPathString);

      // if the mutation updates the array
      if (arrayMutated) {
        // from index 0 to arrayPathLength - 1, arrayPath matches
        // at index: arrayPathLength, we get the key at which mutation happened
        const key = path[arrayPathLength];

        // if mutation path's length is just 1 more than array's path,
        // it means that it is assigning a newVale to key
        const pathEndsWithKey = path.length === arrayPathLength + 1;

        // if a new item is assigned at key
        // ex: users[2] = someUser or users.length = 4
        if (pathEndsWithKey) {
          if (key === 'length') {
            // when length is set, it means that it was manually set to shorten the array from length oldValue to newValue
            // and newValue < oldValue
            // if newValue becomes the new length, last item in array would be at index newValue - 1
            // which means that items it index newValue, newValue + 1, ... oldValue - 1 are removed
            // add the removed indexes in dirtyIndexes
            for (let i = newValue; i < oldValue; i++) dirtyIndexesSet.add(i);
          }
          else dirtyIndexesSet.add(Number(key));
        }

        // if the mutation path does not end with index, but goes deeper than that
        // means that item itself was mutated
        // ex: users[2].name = 'Manan'
        else {
          const info = {
            _path: path.slice(arrayPathLength + 1),
            _newValue: newValue
          };
          if (key in stateUpdates) stateUpdates[key].push(info);
          else stateUpdates[key] = [info];
        }
      }
    });

    // convert dirtyIndexesSet to array and then sort
    const dirtyIndexes = [...dirtyIndexesSet].sort((a, b) => a - b);

    return [dirtyIndexes, stateUpdates]
  };

  /**
   * create an array of given size which consists value same as index it is on
   * @param {number} length - length of array
   * @returns {Array<number>}
   */
  const zeroToNArray = (length) => {
    const arr = [];
    for (let i = 0; i < length; i++) arr.push(i);
    return arr
  };

  /** @typedef {(value: any, index: number) => Record<string, any>} getClosure */
  /** @typedef {(value: any, index: number) => any } getKey */

  /**
   * hydrate looped comp
   * @param {LoopedComp} loopedComp
   * @param {Comp} parentComp
   */
  const hydrateLoopedComp = (loopedComp, parentComp) => {
    const parsed = loopedComp._parsedInfo;
    const loopAttributes = parsed._loopAttributes;
    const { _itemArray, _itemIndex, _item, _key } = loopAttributes;

    const arrayPath = _itemArray._statePaths[0];
    const arrayPathString = arrayPath.join('.');
    const anchor = createComment('loop/');

    const oldState = {
      _values: [],
      _keys: [],
      _keyHash: {}
    };

    /** @type {getClosure} */
    const getClosure = (value, index) => {
      const closure = {
        [_item]: value
      };

      if (_itemIndex) closure[_itemIndex] = index;
      return closure
    };

    /** @returns {Array<any>} */
    const getArray = () => _itemArray._getValue(parentComp);

    // @todo current key can only be from closure, add support for state too
    /** @type {getKey} */
    const getKey = (value, index) => {
      const pseudoComp = {
        $: getClosure(value, index),
        _compFnName: loopedComp._compFnName
      };

      return _key._getValue(
        // @ts-expect-error
        pseudoComp
      )
    };

    const getKeys = () => getArray().map(getKey);

    /** @type {LoopInfo} */
    const loopInfo = {
      _loopedCompInstances: [],
      _anchor: anchor,
      _loopedComp: loopedComp,
      _getArray: getArray,
      _getClosure: getClosure,
      _getKeys: getKeys,
      _parentComp: parentComp,
      _instanciated: false,
      _loopAttributes: loopAttributes,
      _animation: parsed._animationAttributes
    };

    const fullReconcile = () => {
      const n = getArray().length;
      handleArrayChange(loopInfo, zeroToNArray(n), {}, oldState);
    };

    parentComp._deferredWork.push(() => {
      loopedComp.before(anchor);
      loopedComp.before(createComment('/loop'));
      loopedComp.remove();
      fullReconcile();
      loopInfo._instanciated = true;
    });

    /** @type {SubCallBack} */
    const onDepsChange = (mutations) => {
      // if some mutation in batch assigned a new array
      const newArrayAssigned = mutations.some(batchInfo => arraysAreShallowEqual(batchInfo.path, arrayPath));

      if (newArrayAssigned) fullReconcile();

      else {
        // partial reconciliation
        const [dirtyIndexes, stateUpdatePaths] = getArrayMutationInfo(mutations, arrayPathString, arrayPath);
        handleArrayChange(loopInfo, dirtyIndexes, stateUpdatePaths, oldState);
      }

    };

    subscribe(parentComp, arrayPath, onDepsChange, batches._DOM);
  };

  /**
   * @param {Node} target
   */
  const isComp = target =>
    /** @type {ParsedDOMElement}*/(target)._parsedInfo &&
    /** @type {Comp}*/(target)._parsedInfo._isComp;

  // hydration

  /**
   * hydrate target element using _parsedInfo in context of given comp
   * @param {ParsedDOMElement | HTMLElement | Node } target
   * @param {Comp} comp
   * @returns
   */
  const hydrate = (target, comp) => {
    const { _parsedInfo, nodeType } = /** @type {ParsedDOMElement} */(target);

    if (_parsedInfo) {

      comp._nodesUsingLocalState.add(/** @type {ParsedDOMElement} */(target));

      // if target is a comp
      if (/** @type {Comp_ParseInfo} */(_parsedInfo)._isComp) {

        /** @type {Comp}*/(target).parent = comp;
        /** @type {Comp}*/(target)._prop$ = {};

        // if target is looped comp
        if (/** @type {LoopedComp_ParseInfo}*/(_parsedInfo)._loopAttributes) {
          return hydrateLoopedComp(/** @type {LoopedComp}*/(target), comp)
        }

        // if target is condition comp
        // else if used because a looped comp can not be conditional comp too
        else if (/** @type {ConditionalComp_ParseInfo}*/(_parsedInfo)._conditionType === conditionAttributes._if) {
          hydrateIfComp(/** @type {IfComp} */(target), comp);
        }
      }

      // if target is text node
      else if (nodeType === target.TEXT_NODE) {
        return hydrateText(/** @type {Parsed_Text}*/(target), comp)
      }

      // if the target has _attributes
      if (/** @type {HTMLElement_ParseInfo} */(_parsedInfo)._attributes) {
        hydrateAttributes(
          /** @type {Parsed_HTMLElement}*/(target),
          /** @type {HTMLElement_ParseInfo} */(_parsedInfo)._attributes,
          comp
        );
      }
    }

    // if target is a component, do not hydrate it's childNodes
    if (isComp(target)) return

    // else if it has childNodes hydrate all childNodes
    if (target.hasChildNodes()) {
      target.childNodes.forEach(
        childNode => hydrate(childNode, comp)
      );
    }
  };

  /**
   * hydrate templateElement and add it in shadowDOM of comp
   * @param {Comp} comp
   * @param {HTMLTemplateElement} templateElement
   */
  const buildShadowDOM = (comp, templateElement) => {

    // @ts-expect-error
    const fragment = getParsedClone(templateElement.content);

    hydrate(fragment, comp);

    flushArray(comp._deferredWork);

    comp.attachShadow({ mode: 'open' }).append(fragment);

  };

  /**
   * remove first and last character
   * @param {string} str
   * @returns {string}
   */
  const unBracket = str => str.slice(1, -1);

  /**
   * check if the string has brackets at the ends
   * @param {string} str
   * @returns {boolean}
   */
  const isBracketed = str => str[0] === '[' && str.endsWith(']');

  /**
   * process fn placeholder
   * @param {string} _content
   * @param {string} _text
   * @returns {Placeholder}
   */
  const processFnPlaceholder = (_content, _text) => {
    // 'foo(bar.baz, fizz, buzz)'

    // 'foo(bar.baz, fizz, buzz'
    const closeParenRemoved = _content.slice(0, -1);

    // [ 'foo', 'bar.baz, fizz, buzz' ]
    const [fnName, argsStr] = closeParenRemoved.split('(');

    // [ 'bar.baz', 'fizz', 'buzz' ]
    const args = argsStr.split(',');

    // [ ['bar', 'baz'], ['fizz'], ['buzz'] ]
    const _statePaths = args.map(a => a.split('.'));

    /**
     * get the value of function placeholder
     * @param {Comp} comp
     * @returns {any}
     */
    const _getValue = (comp) => {
      const fn = comp.fn[fnName];
      // @todo move this to errors
      if (!fn) {
        throw errors.function_not_found(comp, fnName)
      }
      const tps = _statePaths.map(path => targetProp(comp.$, path));
      const values = tps.map(([t, p]) => t[p]);
      return fn(...values)
    };

    return {
      _type: placeholderTypes._functional,
      _statePaths,
      _getValue,
      _content,
      _text
    }
  };

  /**
   * process reactive placeholder
   * @param {string} _content
   * @param {string} _text
   * @returns {Placeholder}
   */

  const processReactivePlaceholder = (_content, _text) => {
    const statePath = _content.split('.');

    /**
     * return the value of state placeholder in context of given component
     * @param {Comp} comp
     */
    const _getValue = (comp) => {
      {
        try {
          const [target, prop] = targetProp(comp.$, statePath);
          const value = target[prop];
          if (!isDefined(value)) throw value
          else return value
        } catch (e) {
          if (!data._errorThrown) throw errors.invalid_state_placeholder(comp, _content)
        }
      }
    };

    return {
      _type: placeholderTypes._reactive,
      _getValue,
      _statePaths: [statePath],
      _content,
      _text
    }
  };

  /**
   * if functional placeholder's function name is not valid, make it not a placeholder
   * @param {string} text
   * @param {boolean} [noBrackets]
   * @returns {Placeholder}
   */
  const processPlaceholder = (text, noBrackets = false) => {
    // if the text has bracket, remove it
    const bracketsRemoved = noBrackets ? text : unBracket(text);
    // remove all spaces
    const content = bracketsRemoved.replace(/ /g, '');

    if (content.includes('(')) {
      return processFnPlaceholder(content, text)
    }
    return processReactivePlaceholder(content, text)
  };

  /**
   * parse attributes on element if any
   * @param {Parsed_HTMLElement} element
   * @param {string} compName
   * @param {Comp} comp
   */
  const parseAttributes = (element, compName, comp) => {
    // if component specific attributes are used on non-component elements
    if (!compName) {
      // DEV ONLy
      const { _if, _else, _elseIf } = conditionAttributes;
      const { _for, _key } = loopAttributes;
      const compOnlyAttributes = [_if, _else, _elseIf, _key, _for];

      compOnlyAttributes.forEach(attrName => {
        if (getAttr(element, attrName)) {
          throw errors.component_attribute_used_on_non_component(element, attrName, comp)
        }
      });
    }

    /** @type {Attribute_ParseInfo[] } */
    const attributes = [];
    const elementIsComp = !!compName;

    for (const attributeName of element.getAttributeNames()) {
      const attributeValue = /** @type {string} */ (element.getAttribute(attributeName));
      const variableValue = isBracketed(attributeValue);

      let name = attributeName;

      /**  @type {AttributeType} */
      let type = attributeTypes._normal;
      let value;
      const firstChar = attributeName[0];

      if (attributeName === otherAttributes._ref) {
        type = attributeTypes._ref;
        value = attributeValue;
      }

      // SETTING FN OF COMPONENT
      else if (attributeName.startsWith('fn.')) {
        if (!elementIsComp) continue
        type = attributeTypes._functional;
        name = attributeName.slice(3);
        value = attributeValue;
      }

      // SETTING STATE OF COMPONENT
      else if (attributeName.startsWith('$.')) {
        if (!elementIsComp) continue
        name = attributeName.slice(2);

        if (variableValue) {
          type = attributeTypes._state;
          value = processPlaceholder(attributeValue);
        } else {
          type = attributeTypes._staticState;
          value = attributeValue;
        }
      }

      // ATTACHING EVENT OR ACTION
      else if (firstChar === '@') {
        type = attributeTypes._event;
        name = attributeName.slice(1);
        value = attributeValue;
      }

      // attributes that require variable value
      else if (variableValue) {
        // conditionally setting attribute
        if (attributeName.endsWith(':if')) {
          type = attributeTypes._conditional;
          name = attributeName.slice(0, -3);
        }

        // binding property
        else if (firstChar === ':') {
          type = attributeTypes._prop;
          name = attributeName.slice(1);
        }

        value = processPlaceholder(attributeValue);
      }

      if (value) {
        let camelCaseName = name;

        if (name.includes('-')) camelCaseName = dashCaseToCamelCase(name);
        // saving to array instead of object for better minification

        attributes.push({
          _name: camelCaseName,
          _placeholder: value,
          _type: type
        });
        removeAttr(element, attributeName);
      }
    }

    // if value attributes found
    if (attributes.length) {
      if (!element._parsedInfo) {
        // @ts-expect-error
        element._parsedInfo = {};
      }
      element._parsedInfo._attributes = attributes;
    }
  };

  /**
   * take the string text and split it into placeholders and strings
   * @param {Comp} comp
   * @param {string} text
   * @returns {SplitPart[]} parts
   */

  const split = (comp, text) => {

    /** @type {SplitPart[]} */
    const parts = [];

    let collectingVar = false;
    let collectedString = '';
    let i = -1;

    /** @param {boolean} cv */
    const reset = (cv) => {
      collectedString = '';
      collectingVar = cv;
    };

    while (++i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];

      // if current char is ! and next [, ignore ! and don't make the
      if (char === '!' && nextChar === '[') {
        collectedString += '[';
        i += 1;
      }

      else if (char === '[') {
        // save current collected string (if any)
        if (collectedString) parts.push(collectedString);
        reset(true);
      }

      else if (collectingVar && char === ']') {
        // process collected variable and save it in parts
        const part = processPlaceholder(collectedString, true);
        parts.push(part);
        reset(false);
      }

      // keep collecting
      else collectedString += char;
    }

    // add the remaining text
    if (collectedString) {
      if (collectingVar) {
        throw errors.placeholder_not_closed(comp, collectedString)
      }

      parts.push(collectedString);
    }
    return parts
  };

  /**
   * parse text node
   * @param {Text} node
   * @param {Function[]} deferred
   * @param {Comp} comp
   */
  const parseTextNode = (node, deferred, comp) => {
    const text = node.textContent || '';
    const trimmedText = text.trim();

    // if the node is only empty string, it will be normalized by DOM, so remove it
    if (!trimmedText) {
      deferred.push(() => node.remove());
      return
    }

    const parts = split(comp, text);

    /** @type {Parsed_Text[]} */
    const textNodes = [];

    // for each part create a text node
    // if it's not TEXT type, save the part info in parsed.placeholder
    parts.forEach(part => {

      let textNode;
      if (typeof part === 'string') {
        textNode = document.createTextNode(part);
      } else {
        const temp = `[${part._content}]`;
        textNode = document.createTextNode(temp);
        /** @type {Parsed_Text} */(textNode)._parsedInfo = {
          _placeholder: part
        };
      }

      // @ts-expect-error
      textNodes.push(textNode);
    });

    // replace the original node with new textNodes
    deferred.push(() => {
      textNodes.forEach(textNode => node.before(textNode));
      node.remove();
    });
  };

  /**
   * parsed conditional component
   * @param {ConditionalComp} comp
   * @param {ConditionAttribute} conditionType
   * @param {string} attributeValue
   */
  const parseConditionComp = (comp, conditionType, attributeValue) => {

    comp._parsedInfo = {
      ...comp._parsedInfo,
      _conditionType: conditionType,
      _animationAttributes: getAnimationAttributes(comp)
    };

    if (conditionType !== conditionAttributes._else) {
      /** @type {IfComp}*/
      (comp)._parsedInfo._conditionAttribute = processPlaceholder(attributeValue);
    }
    [animationAttributes._enter, animationAttributes._exit, conditionType]
      .forEach(att => removeAttr(comp, att));
  };

  /**
   * parse if condition comp
   * @param {IfComp} ifComp
   */
  const parseIfComp = (ifComp) => {
    /** @type {ConditionalComp[]}} */
    const conditionGroup = [];

    let node = /** @type {ConditionalComp | Node } */(ifComp.nextElementSibling);

    // create a starting marker which will be used to add conditional nodes to DOM
    const anchorNode = createComment('if');
    ifComp.before(anchorNode);

    // keep checking the next node
    while (true) {
      // get the conditionType of the node

      // @ts-expect-error
      const conditionType = node && node._parsedInfo && node._parsedInfo._conditionType;

      // if the node is not a condition comp or is a part of separate condition,
      // break the loop
      if (
        !conditionType ||
        (conditionType === conditionAttributes._if)
      ) break

      conditionGroup.push(/** @type {ConditionalComp } */(node));

      // @ts-expect-error
      node = node.nextElementSibling;
    }

    // add a end if marker after the last node in conditionGroup
    // if ifComp is alone, add after it
    (conditionGroup[conditionGroup.length - 1] || ifComp).after(createComment('/if'));

    // remove other nodes from template
    conditionGroup.forEach(n => n.remove());

    let conditionGroupStateDeps = [...ifComp._parsedInfo._conditionAttribute._statePaths];

    conditionGroup.forEach(node => {
      if (node._parsedInfo._conditionType !== conditionAttributes._else) {

        const deps = /** @type {IfComp | ElseIfComp }*/(node)._parsedInfo._conditionAttribute._statePaths;

        conditionGroupStateDeps = [...conditionGroupStateDeps, ...deps];
      }
    });

    ifComp._parsedInfo = {
      ...ifComp._parsedInfo,
      _conditionGroup: conditionGroup,
      _conditionGroupStateDeps: conditionGroupStateDeps,
      _conditionGroupAnchor: anchorNode
    };
  };

  const { _enter, _exit, _move } = animationAttributes;
  const { _for, _key } = loopAttributes;

  const attributesToRemove = [
    _enter, _exit, _move,
    _for, _key
  ];

  /**
   * parse looped component
   * @param {LoopedComp} comp
   * @param {string} forAttribute
   * @param {Comp} parentComp
   */

  const parseLoopedComp = (comp, forAttribute, parentComp) => {

    const [a, b, c] =
    forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ') // replace ' in ', '(', ')', ',' with space character
      .split(/\s+/) // split with space character,
      .filter(t => t); // remove empty strings

    // ['item', 'index', 'arr'] or
    // ['item', 'arr']
    const indexUsed = isDefined(c);
    const keyAttribute = getAttr(comp, _key);

    if (!keyAttribute) {
      throw errors.missing_key_attribute(comp, parentComp)
    }

    comp._parsedInfo._loopAttributes = {
      _itemArray: processPlaceholder(indexUsed ? c : b, true),
      _item: a,
      _itemIndex: indexUsed ? b : undefined,
      _key: processPlaceholder(/** @type {string}*/(keyAttribute))
    };

    comp._parsedInfo._animationAttributes = getAnimationAttributes(comp);

    attributesToRemove.forEach(name => removeAttr(comp, name));
  };

  const { _else, _if, _elseIf } = conditionAttributes;

  /**
   * parse component node
   * @param {Comp} comp
   * @param {string} compName
   * @param {Comp} parentComp
   * @param {Function[]} deferred
   */
  const parseComp = (comp, compName, parentComp, deferred) => {

    comp._parsedInfo = {
      _isComp: true,
      _compName: compName,
      _attributes: []
    };

    const forAttribute = getAttr(comp, loopAttributes._for);

    // if the component has FOR_ATTRIBUTE on it, it is looped component
    if (forAttribute) {
      parseLoopedComp(
        /** @type {LoopedComp} */(comp),
        forAttribute,
        parentComp
      );
    }

    else {
      const typeAndValue = usesConditionalAttribute(comp);

      if (typeAndValue) {
        const [type, value] = typeAndValue;
        parseConditionComp(/** @type {ConditionalComp}*/(comp), type, value);

        if (type === _if) {
          deferred.push(
            () => parseIfComp(/** @type {IfComp} */(comp))
          );
        }
      }
    }
  };

  /**
   * if the comp has conditional Attribute, return [attributeName, value] else false
   * @param {Comp} conditionComp
   * @returns {[ConditionAttribute, string] | false}
   */
  const usesConditionalAttribute = conditionComp => {
    const conditionalAttributes = /** @type {ConditionAttribute[]}*/(
      [_else, _if, _elseIf]
    );

    for (const attributeName of conditionalAttributes) {
      const value = getAttr(conditionComp, attributeName);
      if (value !== null) return [attributeName, value]
    }

    return false
  };

  /**
   * parse all types of nodes
   * @param {Node} target
   * @param {Record<string, string>} childCompNodeNames
   * @param {Function[]} deferred
   * @param {Comp} parentComp
   */

  const parse = (target, childCompNodeNames, deferred, parentComp) => {

    // if target is component, get it's name else it will be undefined
    const compName = childCompNodeNames[target.nodeName];

    // #text
    if (target.nodeType === target.TEXT_NODE) {
      return parseTextNode(
        /** @type {Text}*/(target),
        deferred,
        parentComp
      )
    }

    // component
    if (compName) {
      parseComp(
        /** @type {Comp}*/(target),
        compName,
        parentComp,
        deferred
      );
    }

    // attributes on component or simple target
    // @ts-expect-error
    if (target.hasAttribute) {
      parseAttributes(/** @type {Parsed_HTMLElement}*/(target), compName, parentComp);
    }

    // child nodes of component or simple target
    if (target.hasChildNodes()) {
      target.childNodes.forEach(
        childNode => parse(childNode, childCompNodeNames, deferred, parentComp)
      );
    }
  };

  // import processAttributes from '../process/attributes/processAttributes.js'

  /**
   * defines a custom element using the compFn function
   * @param {Function} compFn
   */
  const defineCustomElement = (compFn) => {

    if (typeof compFn !== 'function') {
      throw errors.component_is_not_a_function(compFn)
    }

    const { _components, _config } = data;
    const compFnName = compFn.name;

    // return if already defined
    if (compFnName in _components) return
    _components[compFnName] = compFn;

    /** @type {HTMLTemplateElement}*/
    let componentTemplateElement;

    class NueComp extends HTMLElement {
      constructor () {
        super();
        /** @type {Comp} */
        // @ts-expect-error
        const comp = this;

        comp._compFnName = compFnName;

        // refs of child nodes with *ref='ref-name' attribute
        comp.refs = {};

        // subscription tree which contains the callbacks stored at various dependency paths
        comp._subscriptions = { [ITSELF]: new Set() };

        comp._batches = /** @type {[Set<SubCallBack>, Set<SubCallBack>]}*/([new Set(), new Set()]);

        // Array of mutation info that happened in a batch
        comp._mutations = [];

        // array of callbacks that should be run after some process is done
        comp._deferredWork = [];

        // nodes that are using the state
        comp._nodesUsingLocalState = new Set();

        // nodes that are using the closure state
        comp._nodesUsingClosureState = new Set();

        comp.fn = comp.parent ? Object.create(comp.parent.fn) : {};

        if (!comp._prop$) comp._prop$ = {};

        addHooks(comp);
      }

      connectedCallback () {
        /** @type {Comp} */
        // @ts-expect-error
        const comp = this;

        if (comp._moving) return

        comp._manuallyDisconnected = false;

        // when compFn is being connected for the first time
        if (!comp.shadowRoot) {

          // create $
          comp.$ = reactify(comp, comp._prop$ || {}, []);

          if (comp._isLooped) {
            // debugger
            hydrateAttributes(comp, comp._parsedInfo._attributes, comp);
          }

          const [templateString, cssString, childComponents] = runComponent(comp, compFn, !!componentTemplateElement);

          // do this only once per compFn ------------------
          if (!componentTemplateElement) {
            /** @type {Record<string, string>} */
            let childCompNodeNames = {};
            if (childComponents) {
              childCompNodeNames = childComponents.reduce(
                /**
                 * use the upper case dashed name of child function as key and save the original name
                 * @param {Record<string, string>} acc
                 * @param {Function} child
                 * @returns {Record<string, string>}
                 */
                (acc, child) => {
                  const { name } = child;
                  acc[upper(dashify(name))] = name;
                  return acc
                }, {});
            }

            // create componentTemplateElement using template, style, and defaultStyle
            componentTemplateElement = /** @type {HTMLTemplateElement}*/(createElement('template'));
            componentTemplateElement.innerHTML =
            templateString +
            `<style default> ${_config.defaultStyle} </style>` +
            '<style scoped >' + cssString + '</style>';

            // parse the template and create componentTemplateElement which has all the parsed info

            /** @type {Function[]} */
            const deferred = [];
            parse(componentTemplateElement.content, childCompNodeNames, deferred, comp);
            flushArray(deferred);

            // define all child components
            childComponents.forEach(defineCustomElement);
          }

          // hydrate DOM and shadow DOM
          // TODO: process should be able to take the fragment node
          comp.childNodes.forEach(node => hydrate(node, comp));
          buildShadowDOM(comp, componentTemplateElement);

          // connect all nodes using local state
          comp._nodesUsingLocalState.forEach(subscribeNode);

          // subscribe node, so that it's attributes are in sync
          subscribeNode(comp);
        }

        // only connect nodes that were previously disconnected (nodes using closure state)
        else {
          comp._nodesUsingClosureState.forEach(subscribeNode);
        }

        comp._hookCbs._onMount.forEach(cb => cb());
      }

      disconnectedCallback () {
        /** @type {Comp} */
        // @ts-expect-error
        const comp = this;

        if (comp._manuallyDisconnected) return
        if (comp._moving) return

        comp._hookCbs._onDestroy.forEach(cb => cb());

        // only disconnect nodes that are using closure, no need to disconnect nodes that use local state only
        comp._nodesUsingClosureState.forEach(unsubscribeNode);

        // unsubscribeNode(comp) (not needed ?)
      }
    }

    // define current compFn and then it's children
    customElements.define(dashify(compFnName), NueComp);
  };

  const cardBg = '#222831';
  const codeBg = '#333C49';
  const overlay = 'rgba(51, 60, 73, 0.5)';
  const fontColor = '#dddddd';
  const fontColor2 = '#f05454';

  const errorOverlayCSS = /* css */`

.panel {
  background: ${overlay};
  backdrop-filter: blur(5px);
  min-height: 100vh;
  margin: 0;
  box-sizing: border-box;
}

:host {
  position: fixed;
  top: 0;
  left: 0;
  font-family: monospace;
  width: 100vw;
  height: 100vh;
  color: rgba(209, 213, 219);
}

:host * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.code {
  background: ${codeBg};
  padding: 20px;
  color: ${fontColor};
  font-size: 16px;
  border-radius: 5px;
  line-height: 1.5;
  overflow-x: auto;
}

.card {
  background: ${cardBg};
  border-radius: 5px;
  padding: 30px;
  max-width: 850px;
  width: calc(100% - 40px);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 auto;
  animation: fade-in 300ms ease;
  position: relative;
  box-shadow: 2px 2px 20px rgba(0,0,0,0.1);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* width */
.card::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.card::-webkit-scrollbar-track {
  background: ${cardBg};
}

/* Handle */
.card::-webkit-scrollbar-thumb {
  background: ${codeBg};
}

.close-icon {
  background: none;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.close-icon svg {
  fill: ${fontColor2};
}

.code-container {
  position: relative;
}

.code-switcher {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  font-size: 14px;
  color: ${fontColor};
  background: ${cardBg};
  border: none;
  border-radius: 5px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: ${fontColor2};
}

.console {
  color: ${fontColor2};
  font-size: 16px;
  margin-top: 20px;
}

.message {
  line-height: 1.5;
  font-size: 16px;
  border-radius: 5px;
  white-space: pre-wrap;
  color: ${fontColor};
  margin: 20px 0;
}

`;

  const closeIcon = /* html */`
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
  <path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
</svg>`;

  const errorOverlayHTML = /* html */`
<div class='panel'>
  <div class='card'>
    <button class='close-icon'> ${closeIcon} </button>
    <div class='title'> ERROR </div>
    <pre class='message'>  </pre>
    <pre class='code'>  </pre>
    <div class='console'> open console to see stack trace </div>
  </div>
</div>

<style>${errorOverlayCSS}</style>
`;

  /**
   * show error overlay by creating a custom overlay element
   * @param {NueError} error
   * @param {{ filename: string, lineno: string, colno: string }} location
   */

  const showErrorOverlay = (error, location) => {

    // if already showing error, return
    if (data._errorThrown) return

    window.customElements.define('nue-error-overlay', class extends HTMLElement {
      constructor () {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = errorOverlayHTML;
      }

      connectedCallback () {
        const shadowRoot = /** @type {ShadowRoot}*/(this.shadowRoot);

        const closeButton = /** @type {Element} */(shadowRoot.querySelector('.close-icon'));
        closeButton.addEventListener('click', () => {
          this.remove();
        });
      }
    });

    const overlay = /** @type {HTMLElement} */(createElement('nue-error-overlay'));
    document.body.append(overlay);

    const root = /** @type {ShadowRoot}*/ (overlay.shadowRoot);
    const message = /** @type {HTMLElement}*/(root.querySelector('.message'));
    const code = /** @type {HTMLElement}*/(root.querySelector('.code'));
    const title = /** @type {HTMLElement}*/(root.querySelector('.title'));

    if (error.issue) {
      title.textContent = error.name;
      message.textContent = `${error.issue}\n\n${error.fix}`;
      code.textContent = error.code;
    }

    else {
      title.textContent = error.constructor.name;
      message.textContent = error.message;
      code.textContent = /** @type {string}*/(error.stack);
    }

    data._errorThrown = true;
  };

  /**
   * define the custom targetElement of given name
   * @param {Function} component
   * @param {HTMLElement} targetElement
   * @param {Config} [config]
   */

  const render = (component, targetElement, config) => {

    // attach error-overlay
    {
      // @ts-expect-error
      window.data = data;
      window.onerror = (message, filename, lineno, colno, error) => {

        // @ts-ignore
        showErrorOverlay(error);
      };

    }

    // override config with default config
    if (config) data._config = { ...data._config, ...config };

    defineCustomElement(component);

    // replace the targetElement with customElement
    const customElement = document.createElement(dashify(component.name));
    targetElement.replaceWith(customElement);
  };

  exports.render = render;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
