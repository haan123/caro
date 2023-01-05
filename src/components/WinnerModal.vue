<template>
  <div id="modal-winner" class="modal-container" v-on:click="hideModal">
    <div class="modal-background">
      <div class="modal">
        <img src="@/assets/images/win.png" alt="You Win!!!">
        <h1>Thắng Gòi!</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import modal from '../core/modal';

function hideModal() {
  modal.hideModal('modal-winner');
}
</script>
