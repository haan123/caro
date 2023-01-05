/* eslint no-plusplus: 0 */
/* eslint comma-dangle: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint consistent-return: 0 */
/* eslint array-callback-return: 0 */

import dom from './dom';

export default {
  hideModal(id: string) {
    const modalContainer = document.getElementById(id);

    if (modalContainer) {
      dom.addClass(modalContainer, 'out');
      dom.removeClass(document.body, 'modal-active');
    }
  },

  showModal(id: string) {
    const modalContainer = document.getElementById(id);

    if (modalContainer) {
      dom.removeClass(modalContainer, 'out');
      dom.removeClass(modalContainer, 'meep');
      dom.addClass(modalContainer, 'meep');
      dom.addClass(document.body, 'modal-active');
    }
  }
};
