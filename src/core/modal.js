import dom from './dom'

export default {
  hideModal (id) {
    const modalContainer = document.getElementById(id)

    dom.addClass(modalContainer, 'out')
    dom.removeClass(document.body, 'modal-active')
  },

  showModal (id) {
    const modalContainer = document.getElementById(id)

    dom.removeClass(modalContainer, 'out')
    dom.removeClass(modalContainer, 'meep')
    dom.addClass(modalContainer, 'meep')
    dom.addClass(document.body, 'modal-active')
  }
}
