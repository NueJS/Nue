(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.nue = {}));
}(this, (function (exports) { 'use strict';

  const data = {
    /** @type Record<string, CompDef> */
    _components: {},
    _config: {
      defaultCSS: ''
    }
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

  const { _enter: _enter$2, _exit: _exit$2, _move: _move$1 } = animationAttributes;

  /**
   * return object containing enter and exit animation info
   * @param {HTMLElement} element
   * @returns {AnimationAttributes_ParseInfo}
   */
  const getAnimationAttributes = (element) => ({
    _enter: getAttr(element, _enter$2),
    _exit: getAttr(element, _exit$2),
    _move: getAttr(element, _move$1)
  });

  /**
   * return lowercase string
   * @param {string} str
   * @returns {string}
   */
  const lower = str => str.toLowerCase();

  /**
   * convert string to upperCase
   * @param {string} str
   */
  const upper = str => str.toUpperCase();

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
   * add dash at the end of string
   * @param {string} str
   * @returns {string}
   */
  const dashify = str => lower(str) + '-';

  /**
   * returns the nodeName of given compFnName
   * @param {string} str
   */
  const nodeName = str => upper(str) + '-';

  /**
   * replace component names in html with dashed names
   * @param {string} html
   * @param {Function[]} compFns
   * @returns {string}
   */
  const dashifyComponentNames = (html, compFns) =>
    compFns.reduce(
      (acc, compFn) => acc.replace(new RegExp(`<${compFn.name}|</${compFn.name}`, 'g'), dashify),
      html
    );

  /**
   * returns the map object which contains the name of child components
   * where the key is the nodeName of the child component and
   * value is the compFn name of the child component
   *
   * @param {NueComp[]} compClasses
   */
  const getChildren = (compClasses) => compClasses.reduce(
    /**
     * @param {Record<string, string>} acc
     * @param {NueComp} compClass
     * @returns {Record<string, string>}
     */
    (acc, compClass) => {
      const { name } = compClass;
      acc[nodeName(name)] = name;
      return acc
    },
    {}
  );

  /**
   * create component definition using the CompClass
   * @param {NueComp} CompClass
   */
  const createCompDef = (CompClass) => {
    const compDef = new CompClass();
    const compName = CompClass.name;

    compDef._class = CompClass;
    compDef._compName = compName;
    compDef._elName = dashify(compName);
    compDef._template = /** @type {HTMLTemplateElement}*/ (createElement('template'));
    compDef._children = compDef.components ? getChildren(compDef.components) : {};

    return compDef
  };

  /**
   * create an error object that to be shown in error-overlay and in console
   * @param {string} issue
   * @param {string} fix
   * @param {HTMLElement} [code]
   * @param {string} [compName]
   * @returns {NueError}
   */
  const createError = (issue, fix, code, compName) => {

    // get the component function
    if (compName) {
      const compDef = data._components[compName];
      console.error(compDef._class);
    }

    console.log(' ');

    const error = /** @type {NueError}*/(new Error(`\n${issue}\n\n${fix}\n`));

    if (code) error.code = code;
    error.fix = fix;
    error.issue = issue;
    error.name = compName ? `nue.error in ${compName}` : 'nue.error';

    return error
  };

  /**
   * return array of lines of codes of given component's function
   * @param {string} compName
   * @return {string[]}
   */

  const getCompClassCode = (compName) => {
    // get the component function
    const compDef = data._components[compName];
    return compDef._class.toString().split('\n')
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
   * @param {string} compName
   * @param {RegExp} errorRegex
   * @returns {HTMLElement | undefined}
   */

  const getCodeWithError = (compName, errorRegex) => {
    // get the error line index using the comp's fn
    const allCodeLines = getCompClassCode(compName);
    const matchLineIndex = getErrorLineIndex(allCodeLines, errorRegex);

    // if still can't find it - we need a better errorRegex
    if (matchLineIndex === -1) return undefined

    const code = document.createElement('code');

    /** @type {RegExpMatchArray}*/
    let regexMatch;

    for (let lineIndex = 0; lineIndex < allCodeLines.length; lineIndex++) {
      const line = allCodeLines[lineIndex];

      const errorLine = ['', '', ''];
      let hasError = false;

      if (lineIndex === matchLineIndex) {
        hasError = true;

        regexMatch = /** @type {RegExpMatchArray}*/(line.match(errorRegex));

        const startIndex = /** @type {number}*/(regexMatch.index);
        const endIndex = startIndex + regexMatch[0].length - 1;

        for (let i = 0; i < line.length; i++) {
          if (i < startIndex) errorLine[0] += line[i];
          else if (i > endIndex) errorLine[2] += line[i];
          else errorLine[1] += line[i];
        }

      }

      const lineEl = document.createElement('div');
      code.append(lineEl);
      if (!hasError) lineEl.textContent = line;
      else {
        const beforeText = document.createTextNode(errorLine[0]);
        const afterText = document.createTextNode(errorLine[2]);
        const errorText = document.createElement('span');
        errorText.className = 'error';
        errorText.textContent = errorLine[1];

        lineEl.append(beforeText);
        lineEl.append(errorText);
        lineEl.append(afterText);

        lineEl.className = 'has-error';
      }
    }

    return code
  };

  /**
   * called when a component specific attribute is added on a non-component element
   * @param {Element} node
   * @param {string} attributeName
   * @param {string} compName
   * @returns {Error}
   */

  const component_attribute_used_on_non_component = (node, attributeName, compName) => {

    const nodeName = node.nodeName;

    const issue = `\
'${attributeName}' attribute can only be used on a component,
but it is used on a non-component element ${nodeName}`;

    const fix = `\
Remove this attribute if ${nodeName} is not a component

If ${nodeName} is actually a component, make sure to declare it in the components() method
`;

    const code = getCodeWithError(compName, new RegExp(`/${attributeName}=`));

    return createError(issue, fix, code, compName)

  };

  var attributeErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    component_attribute_used_on_non_component: component_attribute_used_on_non_component
  });

  /**
   * called when onMutate is called without a second argument of dependency array
   * @param {string} compName
   */

  const missing_dependency_array_in_onMutate = (compName) => {

    const issue = `Missing dependencies in onMutate() in ${compName}`;

    const fix = `\
onMutate hook expects a dependency array as second argument.

Example:
onMutate(callbackFn, [ 'foo', 'bar.baz' ])`;

    const code = getCodeWithError(compName, /onMutate(\\w*)/);

    return createError(issue, fix, code, compName)
  };

  var eventErrors = /*#__PURE__*/Object.freeze({
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
   * @param {string} compName
   * @param {string[]} keys
   * @returns {Error}
   */

  const keys_not_unique = (compName, keys) => {

    const nonUniqueKeys = keys.filter((key, i) => {
      return keys.indexOf(key, i) !== keys.lastIndexOf(key)
    });

    const _keys = keys.map(toJSON).join(', ');
    const nonUniqueKeysJoin = nonUniqueKeys.map(toJSON).join(', ');
    const _s = nonUniqueKeys.length > 1 ? 's' : '';

    const issue = `\
non-unique key${_s} used in <${compName}>

keys used: \n${_keys}

non-unique key${_s}: ${nonUniqueKeysJoin}`;

    const fix = 'make sure that all keys are unique';

    console.log('keys: ', keys);
    console.log('non unique Keys: ', nonUniqueKeys);

    const code = getCodeWithError(compName, /\*key=/);

    // @TODO improve the regex
    return createError(issue, fix, code, compName)
  };

  // TODO: needs better regex
  /**
   * called when a key attribute is not a placeholder on a looped component
   * @param {string} loopedCompName
   * @param {string} parentCompName
   * @returns {Error}
   */
  const hardcoded_keys = (loopedCompName, parentCompName) => {

    const issue = `"*key" attribute on <${loopedCompName}> in <${parentCompName}> is hard-coded`;

    const fix = `\
make sure you are using a placeholder on "*key" attribute's value.

Example:

✔ *key='[foo]'
✖ *key='foo'`;

    const code = getCodeWithError(parentCompName, /\*key=/);
    return createError(issue, fix, code, parentCompName)
  };

  /**
   * called when key attribute is not specified on looped component
   * @param {string} loopedCompName
   * @param {string} parentCompName
   * @returns {Error}
   */
  const missing_key_attribute = (loopedCompName, parentCompName) => {

    const issue = `"*key" attribute is missing on looped component <${loopedCompName}> in <${parentCompName}>, which is required for efficient DOM updates`;

    const fix = `Add "*key" attribute on looped <${loopedCompName}> to fix this error`;

    return createError(issue, fix, undefined, parentCompName)
  };

  var loopedCompErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    keys_not_unique: keys_not_unique,
    hardcoded_keys: hardcoded_keys,
    missing_key_attribute: missing_key_attribute
  });

  /**
   * called when state placeholder is either a invalid path or a path which points to an undefined value in state
   * @param {string} compName
   * @param {string} content
   * @returns {Error}
   */
  const invalid_state_placeholder = (compName, content) => {
    const compNodeName = `<${compName}>`;
    const issue = `invalid state placeholder: [${content}] used in ${compNodeName}`;
    const fix = `Make sure that "${content}" is available in state of ${compNodeName} or it's closure`;
    const regex = content.split('').join('\\s*').replace(')', '\\)').replace('(', '\\(');
    const code = getCodeWithError(compName, new RegExp(`\\[\\w*${regex}\\w*\\]`));
    return createError(issue, fix, code, compName)
  };

  /**
   * called when state placeholder is either a invalid path or a path which points to an undefined value in state
   * @param {string} compName
   * @param {string} invalidState
   * @param {string} content
   * @returns {Error}
   */
  const invalid_fn_placeholder = (compName, invalidState, content) => {
    const compNodeName = `<${compName}>`;
    const issue = `invalid state "${invalidState}" used in fn placeholder [ ${content} ] in ${compNodeName}`;
    const fix = `Make sure that "${invalidState}" is available in state of ${compNodeName} or it's closure`;
    const regex = invalidState.split('').join('\\s*');
    const code = getCodeWithError(compName, new RegExp(`\\[.*${regex}.*\\]`));
    return createError(issue, fix, code, compName)
  };

  /**
   * called when function used in template is not defined
   * @param {string} compName
   * @param {string} fnName
   * @returns {Error}
   */
  const function_not_found = (compName, fnName) => {
    const compNodeName = `<${compName}>`;
    const issue = `invalid function "${fnName}" used in ${compNodeName}`;
    const fix = `Make sure that "${fnName}" is defined in the fn or it's parent fn`;
    const code = getCodeWithError(compName, new RegExp(fnName));
    return createError(issue, fix, code, compName)
  };

  /**
   * called when function used in template is not defined
   * @param {string} compName
   * @param {string} fnName
   * @returns {Error}
   */
  const event_handler_not_found = (compName, fnName) => {
    const compNodeName = `<${compName}>`;
    const issue = `could not find event handler "${fnName}" used in ${compNodeName}`;
    const fix = `Make sure that "${fnName}" is defined in the ${compNodeName}.fn or it's closure`;
    const code = getCodeWithError(compName, new RegExp(`=.*${fnName}`));
    return createError(issue, fix, code, compName)
  };

  /**
   * called when a placeholder is opened but not closed
   * @param {string} compName
   * @param {string} collectedString
   * @returns {Error}
   */
  const placeholder_not_closed = (compName, collectedString) => {

    const trimmed = `"${collectedString.trim()}"`;
    const ifNotPlaceholder = `if ${trimmed} is not a state placeholder: \nprefix the bracket with "!" : "![${collectedString}" `;
    const ifPlaceholder = `if ${trimmed} is a placeholder: \nInsert closing : "[${collectedString}]"`;
    const nodeName = `<${compName}>`;

    const issue = `found unclosed placeholder in ${nodeName} : "[${collectedString}"`;

    const fix = `${ifNotPlaceholder}\n\n${ifPlaceholder}`;
    const code = getCodeWithError(compName, new RegExp(`\\[${collectedString}`));

    return createError(issue, fix, code, compName)
  };

  var placeholderErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    invalid_state_placeholder: invalid_state_placeholder,
    invalid_fn_placeholder: invalid_fn_placeholder,
    function_not_found: function_not_found,
    event_handler_not_found: event_handler_not_found,
    placeholder_not_closed: placeholder_not_closed
  });

  /**
   * called when root element is not added in html
   * @param {string} elName
   * @returns {Error}
   */

  const root_not_found_in_html = (elName) => {
    const element = `<${elName}> </${elName}>`;
    const issue = `Could not find ${element} in html to render ${elName}`;
    const fix = `Add ${element} in HTML to render the ${elName}`;
    return createError(issue, fix)
  };

  var DOMErrors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    root_not_found_in_html: root_not_found_in_html
  });

  const errors = {
    ...attributeErrors,
    ...eventErrors,
    ...loopedCompErrors,
    ...placeholderErrors,
    ...DOMErrors
  };

  const attributeTypes = {
    _normal: /** @type {0}*/ (0),
    _event: /** @type {1}*/ (1),
    _state: /** @type {2}*/ (2),
    _prop: /** @type {3}*/ (3),
    _bindProp: /** @type {3}*/ (4),
    _conditional: /** @type {4}*/ (5),
    _staticState: /** @type {5}*/ (6),
    _functional: /** @type {6}*/ (7),
    _ref: /** @type {7}*/ (8)
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
   * return [target, prop] for given path in object
   * @param {Record<string, any>} obj
   * @param {StatePath} path
   * @returns {[Record<string, any>, any]}
   */

  const getTargetProp = (obj, path) => {
    const target = path.slice(0, -1).reduce((target, key) => target[key], obj);
    const prop = path[path.length - 1];
    return [target, prop]
  };

  /**
   * return true if the x is defined
   * @param {any} x
   * @returns {boolean}
   */
  const isDefined = x => x !== undefined;

  /**
    * return true if x is object
    * @param {any} x
    * @returns {boolean}
    */
  const isObject = x => typeof x === 'object' && x !== null;

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
        throw errors.function_not_found(comp._compName, fnName)
      }
      const tps = _statePaths.map(path => getTargetProp(comp.$, path));
      const values = tps.map(([t, p]) => t[p]);

      {
        values.forEach((value, i) => {
          if (!isDefined(value)) throw errors.invalid_fn_placeholder(comp._compName, args[i], _content)
        });
      }

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
          const [target, prop] = getTargetProp(comp.$, statePath);
          const value = target[prop];
          if (!isDefined(value)) throw value
          else return value
        } catch (e) {
          throw errors.invalid_state_placeholder(comp._compName, _content)
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

    if (content.includes('(') && content.includes(')')) {
      return processFnPlaceholder(content, text)
    }
    return processReactivePlaceholder(content, text)
  };

  const { _normal: _normal$1, _ref: _ref$1, _bindProp: _bindProp$1, _conditional: _conditional$1, _prop: _prop$1, _functional: _functional$1, _state: _state$1, _staticState: _staticState$1, _event: _event$1 } = attributeTypes;

  /**
   * parse attributes on element if any
   * @param {Parsed_HTMLElement} element
   * @param {string} targetCompName
   */
  const parseAttributes = (element, targetCompName) => {

    // throw error if component specific attributes are used on non-component elements
    if (!targetCompName) {
      testForCompAttributesUsage(element, targetCompName);
    }

    /** @type {Attribute_ParseInfo[] } */
    const attributes = [];
    const elementIsComp = !!targetCompName;

    for (const attributeName of element.getAttributeNames()) {
      const attributeValue = /** @type {string} */ (element.getAttribute(attributeName));
      const variableValue = isBracketed(attributeValue);

      let name = attributeName;

      /**  @type {AttributeType} */
      let type = _normal$1;
      let value;
      const firstChar = attributeName[0];

      if (attributeName === otherAttributes._ref) {
        type = _ref$1;
        value = attributeValue;
      }

      // SETTING FN OF COMPONENT
      else if (attributeName.startsWith('fn.')) {
        if (!elementIsComp) continue
        type = _functional$1;
        name = attributeName.slice(3);
        value = attributeValue;
      }

      // SETTING STATE OF COMPONENT
      else if (attributeName.startsWith('$.')) {
        if (!elementIsComp) continue
        name = attributeName.slice(2);

        if (variableValue) {
          type = _state$1;
          value = processPlaceholder(attributeValue);
        } else {
          type = _staticState$1;
          value = attributeValue;
        }
      }

      // ATTACHING EVENT OR ACTION
      else if (firstChar === '@') {
        type = _event$1;
        name = attributeName.slice(1);
        value = attributeValue;
      }

      // attributes that require variable value
      else if (variableValue) {
        // conditionally setting attribute
        if (attributeName.endsWith(':if')) {
          type = _conditional$1;
          name = attributeName.slice(0, -3);
        }

        // binding property
        else if (attributeName.startsWith('bind:')) {
          type = _bindProp$1;
          name = attributeName.slice(5);
        }

        // property
        else if (firstChar === ':') {
          type = _prop$1;
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
   * parse attributes on element if any
   * @param {Parsed_HTMLElement} element
   * @param {string} targetCompName
   */
  const testForCompAttributesUsage = (element, targetCompName) => {
    const { _if, _else, _elseIf } = conditionAttributes;
    const { _for, _key } = loopAttributes;
    const compOnlyAttributes = [_if, _else, _elseIf, _key, _for];

    compOnlyAttributes.forEach(attrName => {
      if (getAttr(element, attrName)) {
        throw errors.component_attribute_used_on_non_component(element, attrName, targetCompName)
      }
    });
  };

  /**
   * take the string text and split it into placeholders and strings
   * @param {string} text
   * @param {string} compName
   * @returns {SplitPart[]} parts
   */

  const split = (text, compName) => {

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
        throw errors.placeholder_not_closed(compName, collectedString)
      }

      parts.push(collectedString);
    }
    return parts
  };

  /**
   * parse text node
   * @param {Text} node
   * @param {Function[]} deferredParsingWork
   * @param {string} compName
   */
  const parseTextNode = (node, deferredParsingWork, compName) => {
    const text = node.textContent || '';
    const trimmedText = text.trim();

    // if the node is only empty string, it will be normalized by DOM, so remove it
    if (!trimmedText) {
      deferredParsingWork.push(() => node.remove());
      return
    }

    const parts = split(text, compName);

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
    deferredParsingWork.push(() => {
      textNodes.forEach(textNode => node.before(textNode));
      node.remove();
    });
  };

  const { _enter: _enter$1, _exit: _exit$1 } = animationAttributes;

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
    const attributesToRemove = [_enter$1, _exit$1, conditionType];

    attributesToRemove.forEach(att => removeAttr(comp, att));
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
   * @param {LoopedComp} loopedComp
   * @param {string} forAttribute
   * @param {string} parentCompName
   */

  const parseLoopedComp = (loopedComp, forAttribute, parentCompName) => {

    const [a, b, c] =
    forAttribute.replace(/\(|\)|,|(\sin\s)/g, ' ') // replace ' in ', '(', ')', ',' with space character
      .split(/\s+/) // split with space character,
      .filter(t => t); // remove empty strings

    // ['item', 'index', 'arr'] or
    // ['item', 'arr']
    const indexUsed = isDefined(c);
    const keyAttribute = getAttr(loopedComp, _key);

    if (!keyAttribute) {
      throw errors.missing_key_attribute(loopedComp._parsedInfo._compName, parentCompName)
    }

    loopedComp._parsedInfo._loopAttributes = {
      _itemArray: processPlaceholder(indexUsed ? c : b, true),
      _item: a,
      _itemIndex: indexUsed ? b : undefined,
      _key: processPlaceholder(/** @type {string}*/(keyAttribute))
    };

    loopedComp._parsedInfo._animationAttributes = getAnimationAttributes(loopedComp);

    attributesToRemove.forEach(name => removeAttr(loopedComp, name));
  };

  const { _else, _if, _elseIf } = conditionAttributes;

  /**
   * parse component node
   * @param {Comp} comp
   * @param {string} compName
   * @param {string} parentCompName
   * @param {Function[]} deferredParsingWork
   */
  const parseComp = (comp, compName, parentCompName, deferredParsingWork) => {

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
        parentCompName
      );
    }

    else {
      const typeAndValue = usesConditionalAttribute(comp);

      if (typeAndValue) {
        const [type, value] = typeAndValue;
        parseConditionComp(/** @type {ConditionalComp}*/(comp), type, value);

        if (type === _if) {
          deferredParsingWork.push(() => parseIfComp(/** @type {IfComp} */(comp)));
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
   * parse all types of nodes in context of parentComp
   * and dump the work delayed work to deferredParsingWork array
   * @param {Node} target
   * @param {CompDef} compDef
   * @param {Function[]} deferredParsingWork
   */

  const parse = (target, compDef, deferredParsingWork) => {

    // if target is component, get it's name else it will be undefined
    const targetCompName = compDef._children[target.nodeName];
    const parentCompName = compDef._compName;

    // #text
    if (target.nodeType === target.TEXT_NODE) {
      return parseTextNode(/** @type {Text}*/(target), deferredParsingWork, parentCompName)
    }

    // component
    if (targetCompName) {
      parseComp(/** @type {Comp}*/(target), targetCompName, parentCompName, deferredParsingWork);
    }

    // attributes on component or simple target
    // @ts-expect-error
    if (target.hasAttribute) {
      parseAttributes(/** @type {Parsed_HTMLElement}*/(target), targetCompName);
    }

    // child nodes of component or simple target
    if (target.hasChildNodes()) {
      target.childNodes.forEach(childNode => parse(childNode, compDef, deferredParsingWork));
    }
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
   * shorthand to insert value at index i in arr
   * @param {any[]} arr
   * @param {number} i
   * @param {any} value
   */
  const insert = (arr, i, value) => {
    arr.splice(i, 0, value);
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
   * execute all functions in array and clear array
   * @param {Function[]} arr
   */
  const flushArray = (arr) => {
    arr.forEach(fn => fn());
    arr.length = 0;
  };

  /**
   * create template and parse it
   * @param {CompDef} compDef
   */

  const createCompTemplate = (compDef) => {

    const { components, html, css, _template } = compDef;

    // replace compName with elName in html
    const dashHtml = components
      ? dashifyComponentNames(html, components)
      : html;

    // fill template innerHTML with html and css
    _template.innerHTML =
      dashHtml +
      style(data._config.defaultCSS, 'default') +
      style(css, 'scoped');

    /** @type {Function[]} */
    const deferredParsingWork = [];

    parse(_template.content, compDef, deferredParsingWork);

    flushArray(deferredParsingWork);

  };

  /**
   * returns inline style
   * @param {string|undefined} css
   * @param {string} name
   */
  const style = (css, name) => css ? `<style ${name}>${css}</style>` : '';

  const createSubTree = () => ({ [ITSELF]: new Set() });

  const modes = {
    /** when detection mode is true,
     * all key accessed in state is recorded in an array called "keyAccesses"
     */
    _detective: false,

    /** when setup mode is active,
     * setting a key in state which already exists does nothing
     * this is used so that default value of state does not override the state set by the parent component
     * via state attribute
     */
    _setup: false,

    /** when origin mode is true,
     * it returns the comp where the piece of state is coming from rather it's value
     */
    _returnComp: false
  };

  /**
   * get the origin component where the value of the state is coming from
   * @param {Comp} baseComp
   * @param {StatePath} statePath
   * @returns {Comp}
   */
  const getOrigin = (baseComp, statePath) => {
    if (statePath.length === 0) return baseComp

    let target, prop;
    [target, prop] = getTargetProp(baseComp.$, statePath);

    // @ts-ignore
    if (!target[IS_REACTIVE]) {
      [target, prop] = getTargetProp(baseComp.$, statePath.slice(0, -1));
    }

    modes._returnComp = true;
    const originCompNode = target[prop];
    modes._returnComp = false;

    return originCompNode
  };

  /**
   * higher order function that returns a new function that when called adds the cb to given batch
   * @param {Function} cb
   * @param {Batch} batch
   */
  const batchify = (cb, batch) => () => batch.add(cb);

  /**
   * subscribe to state of baseComp pointed by statePath
   * when that state is updated, onUpdate is called and is put into given batch
   *
   * @param {StatePath} statePath
   * @param {Comp} baseComp
   * @param {Function} onUpdate
   * @param {0 | 1} batch
   * @param {ParsedDOMNode} [targetNode]
   */

  const subscribe = (statePath, baseComp, onUpdate, batch, targetNode) => {
    // get the originComp where the state is coming from
    const originComp = getOrigin(baseComp, statePath);

    // if no origin is found
    if (!originComp) {
      throw errors.invalid_state_placeholder(baseComp._compName, statePath.join('.'))
    }

    // if the node is using non-local state
    if (targetNode && originComp !== baseComp) {
      baseComp._nodesUsingNonLocalState.add(targetNode);
    }

    // when addToBatch callback is called, it adds the onUpdate callback to batch so that it can be flushed
    const addToBatch = batchify(onUpdate, originComp._batches[batch]);

    // add the addToBatch callback in subscriptions
    let tree = originComp._subscriptions;

    const lastIndex = statePath.length - 1;

    statePath.forEach((key, i) => {

      // create a new subtree if does not exist
      if (!tree[key]) {
        tree[key] = createSubTree();
      }

      // go to subtree of key
      tree = tree[key];

      // if this is the last subtree in traversal, add the callback there
      if (i === lastIndex) {
        // @ts-expect-error
        tree[ITSELF].add(addToBatch);
      }
    });

    // return unsubscribe function that removes the callback from subscriptions
    // @ts-expect-error
    return () => tree[ITSELF].delete(addToBatch)
  };

  /**
   * subscribe to multiple statePaths
   *
   * @param {StatePath[]} statePaths
   * @param {[Comp, Function, 0 | 1, ParsedDOMNode? ]} rest
   * @returns {Unsubscriber}
   */

  const subscribeMultiple = (statePaths, ...rest) => {
    const unsubscribers = statePaths.map(statePath => subscribe(statePath, ...rest));
    const unsubscriber = () => unsubscribers.forEach(c => c());
    return unsubscriber
  };

  /**
   * add events api on comp
   * @param {Comp} comp
   */

  const addEvents = (comp) => {
    comp._eventCbs = {
      _onMount: [],
      _onDestroy: [],
      _beforeUpdate: [],
      _afterUpdate: []
    };

    const { _onMount, _onDestroy, _beforeUpdate, _afterUpdate } = comp._eventCbs;

    comp.events = {
      onMount: (cb) => _onMount.push(cb),
      onDestroy: (cb) => _onDestroy.push(cb),
      beforeUpdate: (cb) => _beforeUpdate.push(cb),
      afterUpdate: (cb) => _afterUpdate.push(cb),

      onMutate: (cb, slices) => {
        if (!slices.length) {
          throw errors.missing_dependency_array_in_onMutate(comp._compName)
        }

        _onMount.push(() => {
          const stateDeps = slices.map(slice => slice.split('.'));
          return subscribeMultiple(stateDeps, comp, cb, batches._beforeDOM)
        });
      }
    };
  };

  /**
   * called when comp is created (constructed)
   * @param {Comp} comp
   * @param {string} compName
   */
  const onCreate = (comp, compName) => {

    comp.refs = {};
    // comp._subscribers = []

    comp._compName = compName;
    comp._subscriptions = createSubTree();
    comp._batches = [new Set(), new Set()];
    comp._mutations = [];
    comp._deferredWork = []; // TODO: move this to hydrate

    comp._nodesUsingLocalState = new Set();
    comp._nodesUsingNonLocalState = new Set();

    if (!comp._prop$) comp._prop$ = {};
    if (!comp.fn) comp.fn = comp.parent ? Object.create(comp.parent.fn) : {};

    addEvents(comp);
  };

  /**
   * subscribe node to state so that if the state is changed, node will be updated
   * @param {ParsedDOMNode} node
   */

  const subscribeNode = (node) => {
    node._isSubscribed = true;
    node._unsubscribers = node._subscribers.map(s => s());
  };

  const devInfo = {
    errorThrown: false,
    /**
     * called when node has been updated
     * @param {Node} node
     */
    nodeUpdated: (node) => {}
  };

  /**
   * add subscriber in subscribers array
   * @param {ParsedDOMNode} node
   * @param {Subscriber} subscriber
   */

  const registerSubscriber = (node, subscriber) => {
    if (!node._subscribers) node._subscribers = [];
    node._subscribers.push(subscriber);
  };

  /**
   * keep the node in sync with comp's state
   * by calling the update callback when its deps change in state of comp
   * @param {Comp} comp
   * @param {ParsedDOMNode} node
   * @param {StatePath[]} statePaths
   * @param {Function} updateNode
   */

  const syncNode = (node, statePaths, updateNode, comp) => {

    const update = () => {
      if (node._isSubscribed) {
        updateNode();
        devInfo.nodeUpdated(node);
      }
    };

    /** @type {Subscriber} */
    const subscriber = () => {
      update();
      return subscribeMultiple(statePaths, comp, update, batches._DOM, node)
    };

    registerSubscriber(node, subscriber);
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
    syncNode(textNode, _statePaths, update, comp);
  };

  /**
   * mutate the object at given path to newValue
   * @param {Record<string, any>} obj
   * @param {StatePath} path
   * @param {any} newValue
   */
  const mutate = (obj, path, newValue) => {
    const [target, prop] = getTargetProp(obj, path);
    return Reflect.set(target, prop, newValue)
  };

  /**
   * add prop on target
   * @param {Parsed_HTMLElement} target
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */
  const hydrateProp = (target, attribute, comp) => {

    const propName = attribute._name;

    const { _getValue, _statePaths } = /** @type {Placeholder} */(attribute._placeholder);

    const update = () => {
      // @ts-expect-error
      target[propName] = _getValue(comp);
    };

    syncNode(target, _statePaths, update, comp);

    // bindProp
    if (attribute._type === attributeTypes._bindProp) {
      // TODO: add check for input type on dev

      // @ts-expect-error
      const isNumber = target.type === 'number' || target.type === 'range';

      const handler = () => {
        // @ts-expect-error
        let value = target[propName];

        value = isNumber ? Number(value) : value;

        // as this is not a functional placeholder - it will only have one state dependency - so use the first one
        mutate(comp.$, _statePaths[0], value);
      };

      target.addEventListener('input', handler);
    }
  };

  /**
   * add attribute on element element in context of comp
   * @param {Parsed_HTMLElement} element
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */

  const hydrateNormalAttribute = (element, attribute, comp) => {

    const { _placeholder, _name } = attribute;
    const { _getValue, _statePaths } = /** @type {Placeholder} */(_placeholder);

    const update = () => setAttr(element, _name, _getValue(comp));

    syncNode(element, _statePaths, update, comp);
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

    if (!fn) {
      throw errors.event_handler_not_found(comp._compName, fnName)
    }

    // call the event listener with the event and state of component which the node is child of
    /** @type {EventListener} */
    const handleEvent = (event) => fn(event, comp.$);

    /** @type {Subscriber} */
    const subscriber = () => {
      target.addEventListener(eventName, handleEvent);
      return () => target.removeEventListener(eventName, handleEvent)
    };

    registerSubscriber(target, subscriber);
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
   * add state on target passed by its parent component
   * @param {Comp} comp
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} parentComp
   */

  const hydrateState = (comp, attribute, parentComp) => {
    const { _placeholder, _name } = attribute;
    const { _getValue, _statePaths } = /** @type {Placeholder}*/(_placeholder);

    const update = () => {
      comp.$[_name] = _getValue(parentComp);
    };

    // TODO: instead of checking the _isLooped, check if the $ is created on it or not

    // if comp is looped, set the $ directly because it's $ is created already
    if (comp._isLooped) update();

    // else set the prop$
    else {
      if (!comp._prop$) comp._prop$ = {};
      comp._prop$[_name] = _getValue(parentComp);
    }

    subscribeMultiple(_statePaths, parentComp, update, batches._beforeDOM);
  };

  /**
   * add attribute on target element in context of comp
   * @param {Comp} target
   * @param {Attribute_ParseInfo} attribute
   */

  const hydrateStaticState = (target, attribute) => {
    const state = target._isLooped ? target.$ : target._prop$;
    state[attribute._name] = /** @type {string}*/(attribute._placeholder);
  };

  /**
   * add Fn on compo
   * @param {Comp} target
   * @param {Attribute_ParseInfo} attribute
   * @param {Comp} comp
   */
  const hydrateFnProp = (target, attribute, comp) => {

    // create target.fn if not already
    if (!target.fn) target.fn = Object.create(target.parent.fn);

    // add the function in target.fn
    target.fn[attribute._name] = comp.fn[/** @type {string}*/(attribute._placeholder)];

    // @Example
    // <comp fn.foo='bar'>
    // attribute._name === 'foo'
    // attribute._placeholder === 'bar'
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

    syncNode(element, placeholder._statePaths, update, comp);
  };

  const {
    _event,
    _prop,
    _normal,
    _conditional,
    _functional,
    _state,
    _staticState,
    _ref,
    _bindProp
  } = attributeTypes;

  const typeToFn = {
    [_event]: hydrateEvent,
    [_prop]: hydrateProp,
    [_bindProp]: hydrateProp,
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
   * copy .parsed properties from node's tree to cloneNode's tree
   * cloneNode is clone of node but it does not have custom .parsed properties added in node's tree
   * @param {ParsedDOMNode} node
   * @param {ParsedDOMNode} cloneNode
   */

  const copyParsed = (node, cloneNode) => {
    if (node._parsedInfo) {
      cloneNode._parsedInfo = node._parsedInfo;
    }

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
   * @template {ParsedDOMNode} T
   * @param {T} node
   * @returns {T}
   */
  const getParsedClone = (node) => {
    const clone = /** @type {T}*/(node.cloneNode(true));
    copyParsed(node, clone);
    return clone
  };

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
    subscribeMultiple(_conditionGroupStateDeps, parentComp, onGroupDepChange, batches._beforeDOM);

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
      if (comp) comp._prevOffset = getOffset(comp);
    }
  };

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
      throw errors.keys_not_unique(comp._compName, keys)
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
   * @param {LoopedComp[]} loopedCompInstances
   * @param {Array<number>} indexes
   * @param {string} moveAnimation
   */

  // @todo second arg should be comps instead of indexes
  const animateMove = (loopedCompInstances, indexes, moveAnimation) => {

    // debugger
    for (const index of indexes) {
      const comp = loopedCompInstances[index];

      // if (!comp) debugger
      if (comp && comp._prevOffset) {
        transit(comp, /** @type {Offset}  */(comp._prevOffset), /** @type {string}*/(moveAnimation));
      }
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
            const [target, prop] = getTargetProp(comp.$[_item], info._path);
            target[prop] = info._newValue;
          });
        }
      });
    };

    const handleDirtyIndexes = () => {
      const newState = getNewState(loopInfo);
      const steps = reconcile(oldState, newState, dirtyIndexes);

      // if reorder animation is to be played, record offsets before DOM is updated
      if (_move && _instanciated) {
        saveOffsets(dirtyIndexes, _loopedCompInstances);
      }

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

        if (_move && _instanciated) {
          animateMove(_loopedCompInstances, dirtyIndexes, _move);
        }
      };

      // if exit animations are specified and we have to remove some nodes, run exit animations
      // else directly call executeAndMove
      if (_exit && steps._remove.length) {
        // to get actual index valueIndex, arrayIndex need to be added
        const nodes = steps._remove.map((valueIndex, arrayIndex) => _loopedCompInstances[valueIndex + arrayIndex]);
        animateAll(nodes, _exit, executeAndMove);
      } else executeAndMove();

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
        _compName: loopedComp._compName
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

    /** @type {BatchCallBack} */
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

    subscribe(arrayPath, parentComp, onDepsChange, batches._DOM);
  };

  /**
   * return true if the given node is a component using the parsed info
   * @param {Comp} target
   */
  const isParsedComp = target => (target)._parsedInfo && (target)._parsedInfo._isComp;

  /**
   * hydrate target element using _parsedInfo in context of given comp
   * @param {ParsedDOMNode | HTMLElement | Node } target
   * @param {Comp} comp
   * @returns
   */

  const hydrate = (target, comp) => {
    const { _parsedInfo, nodeType } = /** @type {ParsedDOMNode} */(target);

    if (_parsedInfo) {

      /** @type {ParsedDOMNode}*/(target)._subscribers = [];

      comp._nodesUsingLocalState.add(/** @type {ParsedDOMNode} */(target));

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

    // do not hydrate slot of a parsed component
    // they will be hydrated when the component is constructed and connected
    if (isParsedComp(/** @type {Comp}*/(target))) return

    // hydrate all childNodes
    if (target.hasChildNodes()) {
      target.childNodes.forEach(childNode => hydrate(childNode, comp));
    }
  };

  /**
   * run all callbacks of a batch with mutations info
   * @param {Batch} batch
   * @param {Mutation[]} mutations
   */

  const flushBatch = (batch, mutations) => {
    batch.forEach(cb => cb(mutations));
    batch.clear();
  };

  /**
   * flush events and batched callbacks to outside world
   * @param {Comp} comp
   */
  const flush = (comp) => {

    const { _beforeUpdate, _afterUpdate } = comp._eventCbs;
    const { _mutations, _batches } = comp;

    // before updates
    _beforeUpdate.forEach(cb => cb(_mutations));

    // updates
    _batches.forEach(batch => flushBatch(batch, _mutations));

    // after updates
    _afterUpdate.forEach(cb => cb(_mutations));

  };

  /**
   * schedule the flush
   * @param {Comp} comp
   */
  const scheduleFlush = (comp) => {

    comp._flush_scheduled = true;

    setTimeout(() => {
      flush(comp);

      // assign a new array instead of changing the length to 0
      // so that component events api can use this mutations info
      comp._mutations = [];

      // reset flag
      comp._flush_scheduled = false;

    }, 0);

  };

  /**
   * invoke callbacks that are subscribed to given path
   * @param {Subscriptions} subscriptions
   * @param {StatePath} path
   */
  const notify = (subscriptions, path) => {
    let tree = subscriptions;

    for (let i = 0; i < path.length - 1; i++) {
      // no subscription exists for the given edge, return
      if (!tree) break

      // @ts-expect-error
      tree[ITSELF].forEach(cb => cb());

      tree = tree[path[i]];
    }

    // for the last path's tree, notify entire subtree
    if (tree) notifySubTree(tree);

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
   * when state is mutated, add the cb in batch
   * schedule flush if not already scheduled
   * @param {Comp} comp
   * @param {StatePath} path
   */
  const onMutate = (comp, path) => {
    notify(comp._subscriptions, path);
    if (!comp._flush_scheduled) scheduleFlush(comp);
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

  /**
   * create a computed state, stateName for comp component using the computeFn
   * @param {Function} computeFn
   * @param {string} stateName
   * @param {Comp} comp
   */
  const computedState = (computeFn, stateName, comp) => {
    const [initialComputedValue, usedStatePaths] = detectStateUsage(computeFn);

    const update = () => {
      comp.$[stateName] = computeFn();
    };

    // to avoid depending on a particular index of an array, depend on one level up
    // TODO: only slice if the path points to an array's item
    const statePaths = usedStatePaths.map(path => path.length === 1 ? path : path.slice(0, -1));

    subscribeMultiple(statePaths, comp, update, batches._beforeDOM);

    return initialComputedValue
  };

  /**
   * @typedef {Record<string|number|symbol, any>} ReactiveWrapper
   */

  /**
   * create a reactive state on compNode
   * @param {Comp} comp
   * @param {State} obj
   * @param {StatePath} _statePath
   * @returns {State}
   */
  const reactify = (comp, obj, _statePath = []) => {

    // can not reactify non-object
    if (!isObject(obj)) return obj

    const parent$ = comp.parent && comp.parent.$;

    // statePath may change if the obj is in an array and that array is mutated
    let statePath = _statePath;

    /** @type {ReactiveWrapper} */
    const wrapper = Array.isArray(obj) ? [] : {};

    Object.keys(obj).forEach(key => {
      wrapper[key] = reactify(comp, obj[key], [...statePath, key]);
    });

    return new Proxy(wrapper, {

      has (target, prop) {
        // return true if the prop is in target or its closure
        return prop in target || (parent$ ? prop in parent$ : false)
      },

      set (target, prop, _newValue) {

        const oldValue = target[/** @type {string}*/(prop)];

        // do nothing if newValue is same as oldValue
        if (oldValue === _newValue) return true

        if (prop === UPDATE_INDEX) {
          // update statePath as it has been moved to a different position in array

          // replace the oldIndex with newIndex in statePath
          statePath = [...statePath.slice(0, -1), _newValue];
          return true
        }

        // if the mutated prop exists in the target already
        const propInTarget = prop in target;

        let newValue = _newValue;

        // state creation mode
        if (modes._setup) {
          // do not override the state set by parent component by the default value set in this component
          if (propInTarget) return true

          if (typeof newValue === 'function') {
            newValue = computedState(newValue, /** @type {string}*/(prop), comp);
          }
        }

        // if the prop is not in target but is in it's closure state
        // then set the value in the closure state instead
        else if (!propInTarget && parent$ && prop in parent$) {
          return Reflect.set(parent$, prop, newValue)
        }

        if (isObject(newValue)) {
          // if value is not reactive, make it reactive

          if (!newValue[IS_REACTIVE]) {
            newValue = reactify(comp, newValue, [...statePath, /** @type {string}*/(prop)]);
          }
          // when a reactive value is set on some index(prop) in target array
          // we have to update that reactive object's statePath - because we are changing the index it was created at
          else if (Array.isArray(target)) newValue[UPDATE_INDEX] = prop;
        }

        // -----------------------------

        if (oldValue !== newValue) {
          /**
           * returns the current statePath of reactive object
           * @returns {StatePath}
           */
          const livePath = () => [...statePath, /** @type {string}*/(prop)];

          const mutatedPath = livePath();

          comp._mutations.push({ oldValue, newValue, path: mutatedPath, livePath });

          onMutate(comp, mutatedPath);
        }

        return Reflect.set(target, prop, newValue)

      },

      deleteProperty (target, prop) {
        onMutate(comp, [...statePath, /** @type {string}*/(prop)]);
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
        if (parent$) return Reflect.get(parent$, prop)
      }

    })

  };

  /**
   * hydrate template and add it in shadowDOM of comp
   * @param {Comp} comp
   * @param {HTMLTemplateElement} template
   */
  const buildShadowDOM = (comp, template) => {

    // create a clone of template
    // @ts-expect-error
    const fragment = getParsedClone(template.content);

    // hydrate it
    hydrate(fragment, comp);

    // complete the deferredWork
    flushArray(comp._deferredWork);

    // create shadowDOM using this template
    comp.attachShadow({ mode: 'open' }).append(fragment);

  };

  /**
   * invoke compJs with comp instance
   * @param {CompDef['js']} compJs
   * @param {Comp} comp
   */
  const invokeCompJs = (compJs, comp) => {

    modes._setup = true;

    // @ts-expect-error
    compJs(comp);

    modes._setup = false;
  };

  /**
   * this function is called when comp is connected to DOM for the first time
   * @param {Comp} comp
   * @param {CompDef} compDef
   */

  function onFirstConnect (comp, compDef) {

    // create state
    comp.$ = reactify(comp, comp._prop$ || {});

    // after everything is set up, invoke js
    if (compDef.js) invokeCompJs(compDef.js, comp);

    // manually created looped component requires hydration
    if (comp._isLooped) {
      hydrateAttributes(comp, comp._parsedInfo._attributes, comp);
    }

    // hydrate DOM (for slots)
    comp.childNodes.forEach(node => hydrate(node, comp));

    // create shadowDOM
    buildShadowDOM(comp, compDef._template);

    // keep the attributes of comp element in sync
    if (comp._subscribers) subscribeNode(comp);

  }

  /**
   * called when comp is connected to DOM
   * @param {Comp} comp
   * @param {CompDef} compDef
   * @returns
   */

  const onConnect = (comp, compDef) => {

    // do nothing if component is just moving
    if (comp._moving) return

    comp._manuallyDisconnected = false;

    const { _nodesUsingLocalState, _nodesUsingNonLocalState, _eventCbs, shadowRoot } = comp;

    // when comp is being connected for the first time
    if (!shadowRoot) {
      onFirstConnect(comp, compDef);

      // connect all nodes using local state
      _nodesUsingLocalState.forEach(subscribeNode);
    }

    else {
      // only connect nodes that were previously disconnected
      // connect all nodes using closure state
      _nodesUsingNonLocalState.forEach(subscribeNode);
    }

    // after all the connections are done, run the onMount callbacks
    _eventCbs._onMount.forEach(cb => cb());
  };

  /**
   * unsubscribe node from state, so that any change in state does not trigger updates on it
   * this is done when the node is removed from DOM and we don't want to do extra work of updating it
   * @param {ParsedDOMNode} node
   */

  const unsubscribeNode = (node) => {
    node._isSubscribed = false;
    node._unsubscribers.forEach(dc => dc());
  };

  /**
   * called when comp is disconnected
   * @param {Comp} comp
   */
  const onDisconnect = (comp) => {
    const { _eventCbs, _nodesUsingNonLocalState, _manuallyDisconnected, _moving } = comp;

    if (_manuallyDisconnected || _moving) return

    _nodesUsingNonLocalState.forEach(unsubscribeNode);

    _eventCbs._onDestroy.forEach(cb => cb());

  };

  /**
   * defines a custom element using nue.js component class
   * @param {NueComp} CompClass
   */

  const createComponent = CompClass => {
    const { _components } = data;

    // get the name of CompClass
    const compName = CompClass.name;

    // do nothing if a component by this name is already defined
    if (compName in _components) return

    const compDef = createCompDef(CompClass);

    // save the def in data
    _components[compName] = compDef;

    createCompTemplate(compDef);

    // create a custom element for this component

    class NueComp extends HTMLElement {
      /** @this {Comp} */
      constructor () {
        super();
        onCreate(this, compName);
      }

      /** @this {Comp} */
      connectedCallback () {
        onConnect(this, compDef);
      }

      /** @this {Comp} */
      disconnectedCallback () {
        onDisconnect(this);
      }
    }

    const { _elName, components } = compDef;

    // define component and then it's used child components
    customElements.define(_elName, NueComp);

    if (components) {
      components.forEach(createComponent);
    }
  };

  const errorOverlayCSS = /* css */`

:host {
    /* colors */
  --cardBg: #212529;
  --codeBg: #2A2E32;
  --highlight: #212529;
  --highlightWord: #FD413C;
  --hoverHighlight: #212529;
  --overlay: hsla(214deg, 10%, 27%, 94%);
  --primaryColor: #BDC1C6;
  --secondColor: #FD413C;
}

::selection {
  background: var(--highlightWord);
  color: white;
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

.panel {
  background: var(--overlay);
  min-height: 100vh;
  margin: 0;
  box-sizing: border-box;
}

.code {
  background: var(--codeBg);
  padding: 20px;
  color: var(--primaryColor);
  font-size: 16px;
  border-radius: 5px;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 40vh;
}

.code span.error {
  color: white;
  display: inline-block;
  background: var(--highlightWord);
  padding: 0.1em 0.3em;
  border-radius: 5px;
  margin: 0 0.2em;
}

.code span.error:focus {
  outline: none;
}

.code div {
  border-radius: 5px;
  margin-bottom: 0.2em;
}

.code div:hover {
  background: var(--hoverHighlight);
}

.code div.has-error {
  background: var(--highlight);
}

.card {
  background: var(--cardBg);
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
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.15);
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
  background: var(--cardBg);

}

/* Handle */
.card::-webkit-scrollbar-thumb {
  background: var(--codeBg);
}

/* width */
.code::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.code::-webkit-scrollbar-track {
  background: var(--codeBg);
  border-radius: 5px;
}

/* Handle */
.code::-webkit-scrollbar-thumb {
  background: var(--secondColor);
  border-radius: 5px;
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
  fill: var(--secondColor);
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
  color: var(--primaryColor);
  background: var(--cardBg);
  border: none;
  border-radius: 5px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  /* font-weight: 700; */
  color: var(--secondColor);
}

.console {
  color: var(--secondColor);
  font-size: 16px;
  margin-top: 20px;
}

.message {
  line-height: 1.5;
  font-size: 16px;
  border-radius: 5px;
  white-space: pre-wrap;
  color: var(--primaryColor);
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
    <div class='title'> </div>
    <pre class='message'> </pre>
    <pre class='code'> </pre>
  </div>
</div>

<style>${errorOverlayCSS}</style>
`;

  /**
   * show error overlay by creating a custom overlay element
   * @param {NueError} error
   */

  const showErrorOverlay = (error) => {

    // if already showing error, return
    if (devInfo.errorThrown) return

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

    // hide the .code if the no code is to be shown
    if (!error.code) {
      code.hidden = true;
    }

    if (error.issue) {
      title.textContent = error.name;
      message.textContent = `${error.issue}\n\n${error.fix}`;
      code.innerHTML = error.code.innerHTML;

      const codeError = /** @type {HTMLElement} */(code.querySelector('.error'));
      codeError.tabIndex = 0;
      codeError.focus();
    }

    else {
      title.textContent = error.constructor.name;
      message.textContent = error.message;
      code.textContent = /** @type {string}*/(error.stack);
    }

    devInfo.errorThrown = true;
  };

  const attachErrorOverlay = () => {

    window.onerror = (message, filename, lineno, colno, error) => {
      showErrorOverlay(/** @type {NueError}*/(error));
    };

  };

  /**
   * render component in place of targetElement with optional config
   * @param {NueComp} compClass
   * @param {Config} [config]
   * @returns {Comp}
   */

  const render = (compClass, config) => {

    // override config with default config
    if (config) {
      data._config = { ...data._config, ...config };

      // add devTools
      {
        const { nodeUpdated } = config;
        if (nodeUpdated) devInfo.nodeUpdated = nodeUpdated;
      }
    }

    {
      attachErrorOverlay();
    }

    createComponent(compClass);

    // replace the <component> with <component->
    const compName = compClass.name;
    const targetElement = /** @type {Element}*/(document.querySelector(compName));

    if (!targetElement) {
      throw errors.root_not_found_in_html(compName)
    }

    const customElement = /** @type {Comp}*/(createElement(dashify(compName)));
    targetElement.replaceWith(customElement);

    return customElement
  };

  exports.render = render;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
