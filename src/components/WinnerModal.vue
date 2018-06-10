<template>
  <div id="modal-winner" class="modal-container" v-on:click="hideModal">
    <div class="modal-background">
      <div class="modal">
        <img src="../assets/win.png" alt="You Win!!!">
        <h1>Thắng Gòi!</h1>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint no-plusplus: 0 */
/* eslint comma-dangle: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint consistent-return: 0 */
/* eslint array-callback-return: 0 */

import modal from '../core/modal';

export default {
  methods: {
    hideModal() {
      modal.hideModal('modal-winner');
    }
  }
};
</script>
