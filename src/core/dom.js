const dom = {}

/**
 * Get closest node that match selector
 * @param {Node} el
 * @param {String|Node} selector
 * @return {Node}
 */

const docElem = document.documentElement
const matches = docElem.matches ||
  docElem.webkitMatchesSelector ||
  docElem.mozMatchesSelector ||
  docElem.oMatchesSelector ||
  docElem.msMatchesSelector

function traverse (el, selector, method) {
  let cur = el
  const matcher = function (elem) {
    return selector.nodeType === 1 ? (selector === elem) : matches.call(elem, selector)
  }

  for (; cur; cur = cur[method]) {
    // using native matches, this function return true or false
    // when selector matched
    // supporting IE9+
    if (cur.nodeType === 1 && matcher(cur)) {
      return cur
    }
  }
}

dom.closest = function (el, selector) {
  return traverse(el, selector, 'parentNode')
}

dom.children = function (el, selector) {
  return traverse(el.firstChild, selector, 'nextSibling')
}

/**
 * Loop through parent nodes of current el and call `callback` function
 * @param {Node} el
 * @param {Function} callback
 * @return {Node} cur
 */
dom.parents = function (el, callback) {
  let cur = el

  do {
    if (callback.call(el, cur)) break
    cur = cur.parentNode
  } while (cur && cur.nodeType === 1)

  return cur
}

/**
 * Add element's class
 * @param {Node} elem
 * @return {String} newClass
 */
dom.addClass = function (elem, value) {
  if (elem.className.indexOf(value) !== -1) return

  const current = `${elem.className} ${value}`

  return (elem.className = current.trim())
}

/**
 * Remove element's class
 * @param {Node} elem
 * @return {String} newClass
 */
dom.removeClass = function (elem, value) {
  const rclass = new RegExp(` ${value} `, 'g')
  const current = ` ${elem.className.trim()} `.replace(rclass, ' ')

  return (elem.className = current.trim())
}

const rspace = /[\t\r\n\f]/g

dom.hasClass = function (elem, value) {
  const className = ` ${value} `

  if (elem.nodeType === 1 && (` ${elem.className} `).replace(rspace, ' ')
    .indexOf(className) > -1) {
    return true
  }

  return false
}

export default dom
