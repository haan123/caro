/**
 * Get closest node that match selector
 * @param {Node} el
 * @param {String|Node} selector
 * @return {Node}
 */

const docElem = document.documentElement;
const matches = docElem.matches;
const rspace = /[\t\r\n\f]/g;

function traverse(el: HTMLElement | null, selector: string | HTMLElement, method: string) {
  let cur = el;
  const matcher =
    (elem: HTMLElement) => {
      return typeof selector === 'string' ? matches.call(elem, selector) : selector === elem
    }

  for (; cur; cur = (cur as any)[method]) {
    // using native matches, this function return true or false
    // when selector matched
    // supporting IE9+
    if (cur.nodeType === 1 && matcher(cur)) {
      return cur;
    }
  }
}

export default {
  closest: (el: HTMLElement, selector: string | HTMLElement) => traverse(el, selector, 'parentNode'),
  children: (el: HTMLElement, selector: string | HTMLElement) => traverse(el.firstChild as HTMLElement, selector, 'nextSibling'),

  /**
   * Loop through parent nodes of current el and call `callback` function
   * @param {Node} el
   * @param {Function} callback
   * @return {Node} cur
   */
  parents: (el: HTMLElement, callback: (...args: any[]) => any) => {
    let cur: HTMLElement = el;

    do {
      if (callback.call(el, cur)) break;
      cur = cur.parentNode as HTMLElement;
    } while (cur && cur.nodeType === 1);

    return cur;
  },

  /**
   * Add element's class
   * @param {Node} elem
   * @return {String} newClass
   */
  addClass: (elem: HTMLElement, value: string) => {
    if (elem.className.indexOf(value) !== -1) return;

    const current = `${elem.className} ${value}`;
    elem.className = current.trim();

    return elem.className;
  },

  /**
   * Remove element's class
   * @param {Node} elem
   * @return {String} newClass
   */
  removeClass: (elem: HTMLElement, value: string) => {
    const rclass = new RegExp(` ${value} `, 'g');
    const current = ` ${elem.className.trim()} `.replace(rclass, ' ');

    elem.className = current.trim();

    return elem.className;
  },

  hasClass: (elem: HTMLElement, value: string) => {
    const className = ` ${value} `;

    if (elem.nodeType === 1 && (` ${elem.className} `).replace(rspace, ' ')
      .indexOf(className) > -1) {
      return true;
    }

    return false;
  }
};
