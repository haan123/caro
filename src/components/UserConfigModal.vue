<template>
  <div id="user-config-modal" class="modal-container">
    <div class="modal-background">
      <div class="modal">
        <div class="user">
          <div class="form-group">
            <label class="user__ticker">Pick ticker:</label>
            <div class="form-check form-check-inline">
              <input
                id="inlineRadio1"
                ref="rdX"
                class="form-check-input ticker-ipt"
                type="radio"
                name="ticker"
                value="x"
                checked
              />
              <label class="form-check-label" for="inlineRadio1">
                <icon :data="X" width="16" height="16" color="#4f4b4f"></icon>
              </label>
            </div>
            <div class="form-check form-check-inline">
              <input
                id="inlineRadio2"
                ref="rdO"
                class="form-check-input ticker-ipt"
                type="radio"
                name="ticker"
                value="o"
              />
              <label class="form-check-label" for="inlineRadio2">
                <icon :data="O" width="16" height="16" color="#fb3e26"></icon>
              </label>
            </div>
          </div>
        </div>
        <button v-on:click="start" class="btn btn-success user__start">
          Start
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as Ably from "ably/promises";

import modal from "../core/modal";
import { useSocketStore } from "@/stores/socket";
import X from "@/assets/svgs/x.svg";
import O from "@/assets/svgs/o.svg";

const socketStore = useSocketStore();
const connection = new Ably.Realtime.Promise({ authUrl: socketStore.url });
const channel = connection.channels.get("caro");

const props = defineProps<{
  caro: Record<string, any>;
}>();

const rdX = ref();
const rdO = ref();

function start() {
  const ticker = rdX.value.checked ? "x" : "o";
  const gameId = new Date().getTime();

  props.caro.setup({
    ticker,
    gameId,
    isMyTurn: true,
  });

  channel.publish("setupGame", {
    ticker,
    gameId,
  });

  modal.hideModal("user-config-modal");
  modal.hideModal("modal-winner");
  modal.hideModal("modal-loose");
}
</script>

<style lang="postcss">
.user__ticker {
  vertical-align: middle;
}

.ticker-ipt {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
