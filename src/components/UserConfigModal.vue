<template>
  <div id="user-config-modal" class="modal-container">
    <div class="modal-background">
      <div class="modal">
        <div class="user">
          <div class="form-group">
            <label class="user__ticker">Pick ticker:</label>
            <div class="form-check form-check-inline">
              <input id="inlineRadio1" v-bind:ref="rdX" class="form-check-input ticker-ipt" type="radio" name="ticker" value="x" checked>
              <label class="form-check-label" for="inlineRadio1"><svgicon icon="x" width="16" height="16" color=""></svgicon></label>
            </div>
            <div class="form-check form-check-inline">
              <input id="inlineRadio2" v-bind:ref="rdO" class="form-check-input ticker-ipt" type="radio" name="ticker" value="o">
              <label class="form-check-label" for="inlineRadio2"><svgicon icon="o" width="16" height="16" color="#E8104A"></svgicon></label>
            </div>
          </div>
        </div>
        <button v-on:click="start" class="btn btn-success user__start">Start</button>
      </div>
    </div>
  </div>
</template>

<script>
import modal from '../core/modal'

const socket = io(window.SOCKET_URL)

export default {
  props: ['caro'],

  data() {
    return {
      rdX: 'rdX',
      rdO: 'rdO'
    }
  },

  methods: {
    start (e) {
      const ticker = this.$refs['rdX'].checked ? 'x' : 'o';
      const gameId = new Date().getTime()

      this.caro.setup({
        ticker,
        gameId,
        isMyTurn: true
      })

      socket.emit('setupGame', {
        ticker,
        gameId
      })

      modal.hideModal('user-config-modal')
      modal.hideModal('modal-winner')
      modal.hideModal('modal-loose')
    }
  }
}
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
