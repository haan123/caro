<template>
  <div class="container">
    <div class="widgets">
      <button v-on:click="newGame" class="btn btn-danger btn-lg play">
        New Game
      </button>

      <span v-if="caro.isGamePlaying()" class="turn"
        >Turn:
        <icon
          v-if="caro.turn === 'x'"
          :data="X"
          width="16"
          height="16"
          color="#4f4b4f"
        ></icon>
        <icon v-else :data="O" width="16" height="16" color="#ff0113"></icon>
      </span>
    </div>
    <div class="board">
      <table v-bind:style="{ width: `${45 * colNo}px` }">
        <tbody>
          <tr v-for="(_, row) in rowNo" :key="row">
            <td
              v-for="(_, col) in colNo"
              :key="col"
              :ref="
                (el) => {
                  cellRefs[`${row}:${col}`] = el;
                }
              "
              v-on:click="(e) => tick(e)"
              :data-cell="`${row}:${col}`"
              v-bind:class="{
                'is-win': caro.cells[`${row}:${col}`].isWin,
                'is-current': caro.cells[`${row}:${col}`].isCurrent,
              }"
              :title="`${row}:${col}`"
              style="width: 45px; height: 45px"
            >
              <icon
                v-if="caro.cells[`${row}:${col}`].type === 'x'"
                :data="X"
                width="22"
                height="18"
                color="#f1f1f1"
              >
              </icon>
              <icon
                v-if="caro.cells[`${row}:${col}`].type === 'o'"
                :data="O"
                width="22"
                height="18"
                color="#fb3e26"
              >
              </icon>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <WinnerModal></WinnerModal>
    <LooseModal></LooseModal>
    <UserConfigModal v-bind:caro="caro"></UserConfigModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeUpdate } from "vue";
import * as Ably from "ably/promises";

import Caro from "../core/caro";
import modal from "../core/modal";
import { useSocketStore } from "@/stores/socket";
import WinnerModal from "./WinnerModal.vue";
import LooseModal from "./LooseModal.vue";
import UserConfigModal from "./UserConfigModal.vue";

import X from "@/assets/svgs/x.svg";
import O from "@/assets/svgs/o.svg";

const socketStore = useSocketStore();
const connection = new Ably.Realtime.Promise({ authUrl: socketStore.url });
const channel = connection.channels.get("caro");

const rowNo = 20;
const colNo = 20;
const cellRefs = ref<Record<string, any>>({});

const caro = reactive(
  new Caro({
    rowNo,
    colNo,
  })
);

channel.subscribe("setTick", ({ data }: Record<string, any>) => {
  if (!data) return;

  const elem = cellRefs.value[data.cell];

  if (elem) {
    tick(elem, {
      theirTurn: true,
    });
  }
});

channel.subscribe("setupGame", ({ data }: Record<string, any>) => {
  if (!data || caro.gameId === data.gameId) return;

  caro.setup({
    ticker: data.ticker === "x" ? "o" : "x",
  });

  modal.hideModal("modal-winner");
  modal.hideModal("modal-loose");
});

channel.subscribe("setOtherWinningPath", ({ data }: Record<string, any>) => {
  if (!data.isOtherWin || caro.isOtherHasWinningPath) return;

  caro.setOtherWinningPath();
});

function newGame() {
  modal.showModal("user-config-modal");
}

function tick(e: any, status?: Record<string, any>) {
  const elem = e.nodeType === 1 ? e : e.currentTarget;
  const cell = elem.getAttribute("data-cell");
  const hasTicked = caro.cells[cell].type;
  let tick = caro.ticker;

  if (status && status.theirTurn) {
    tick = caro.otherTicker;
  }

  if (caro.isOver || !tick || hasTicked || (!status && !caro.myTurn)) return;

  const result = caro.setTick(tick, cell, status && status.theirTurn);
  caro.cells[cell].type = tick;

  document.title = document.title.replace(/\s-\s\w\sturn/g, "");
  document.title += ` - ${caro.turn.toUpperCase()} turn`;

  if (result.isWin) {
    for (let i = 0; i < result.winPath.length; i++) {
      const cellId = result.winPath[i];
      caro.cells[cellId].isWin = true;
    }

    if (tick === caro.ticker) {
      modal.showModal("modal-winner");
    } else {
      modal.showModal("modal-loose");
    }
  } else if (caro.isOtherHasWinningPath) {
    channel.publish("setOtherWinningPath", {
      isOtherWin: true,
    });
  }

  if (!status || !status.theirTurn) {
    channel.publish("setTick", {
      tick,
      cell,
    });
  }
}

onBeforeUpdate(() => {
  cellRefs.value = {};
});
</script>
