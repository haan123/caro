<template>
  <div id="user-config-modal" class="modal-container">
    <div class="modal-background">
      <div class="modal">
        <div class="user">
          <div class="form-group">
            <label class="user__ticker">Pick ticker:</label>
            <div class="form-check form-check-inline">
              <input id="inlineRadio1" v-bind:ref="rdX" class="form-check-input ticker-ipt" type="radio" name="ticker" value="x" checked>
              <label class="form-check-label" for="inlineRadio1"><svgicon icon="x" width="16" height="16" color="#4f4b4f"></svgicon></label>
            </div>
            <div class="form-check form-check-inline">
              <input id="inlineRadio2" v-bind:ref="rdO" class="form-check-input ticker-ipt" type="radio" name="ticker" value="o">
              <label class="form-check-label" for="inlineRadio2"><svgicon icon="o" width="16" height="16" color="#fb3e26"></svgicon></label>
            </div>
          </div>
        </div>
        <button v-on:click="start" class="btn btn-success user__start">Start</button>
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

const socket = io(window.SOCKET_URL);

export default {
  props: ['caro'],

  data() {
    return {
      rdX: 'rdX',
      rdO: 'rdO'
    };
  },

  methods: {
    start() {
      const ticker = this.$refs.rdX.checked ? 'x' : 'o';
      const gameId = new Date().getTime();

      this.caro.setup({
        ticker,
        gameId,
        isMyTurn: true
      });

      socket.emit('setupGame', {
        ticker,
        gameId
      });

      modal.hideModal('user-config-modal');
      modal.hideModal('modal-winner');
      modal.hideModal('modal-loose');
    }
  }
};
</script>

<style lang="scss">
  .user__ticker {
    vertical-align: middle;
  }

  .ticker-ipt {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
</style>
