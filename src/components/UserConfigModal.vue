<template>
  <div id="user-config-modal" class="modal-container">
    <div class="modal-background">
      <div class="modal">
        <div class="user">
          <div class="form-group">
            <label class="user__ticker">Pick ticker:</label>
            <div class="form-check form-check-inline">
              <input id="inlineRadio1" v-on:change="pickTicker" class="form-check-input" type="radio" name="ticker" value="x">
              <label class="form-check-label" for="inlineRadio1"><svgicon icon="x" width="14" height="14" color=""></svgicon></label>
            </div>
            <div class="form-check form-check-inline">
              <input id="inlineRadio2" v-on:change="pickTicker" class="form-check-input" type="radio" name="ticker" value="o">
              <label class="form-check-label" for="inlineRadio2"><svgicon icon="o" width="14" height="14" color="#E8104A"></svgicon></label>
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

const socket = io('http://localhost:3000')
let ticker = ''

export default {
  props: ['caro'],
  methods: {
    start (e) {
      this.caro.setup({
        ticker
      })

      socket.emit('setupGame', {
        ticker
      })

      modal.hideModal('user-config-modal')
    },

    pickTicker (e) {
      ticker = e.target.value
    }
  }
}
</script>

<style lang="scss">
  .user__start {
  }
</style>
