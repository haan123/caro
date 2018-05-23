<template>
  <div id="modal-loose" class="modal-container" v-on:click="hideModal">
    <div class="modal-background">
      <div class="modal">
        <img src="../assets/loose.png" alt="You Win!!!">
        <h1>HaHa, thua gòi nhen!!!</h1>
      </div>
    </div>
  </div>
</template>

<script>
import modal from '../core/modal'

export default {
  methods: {
    hideModal () {
      modal.hideModal('modal-loose')
    }
  }
}
</script>
