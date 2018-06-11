<template>
  <div class="container">
    <div class="widgets">
      <button v-on:click="newGame" class="btn btn-danger btn-lg play">New Game</button>

      <span v-if="caro.isGamePlaying()" class="turn">Turn: <svgicon v-if="caro.turn === 'x'" icon="x" width="16" height="16" color="#4f4b4f"></svgicon><svgicon v-else icon="o" width="16" height="16" color="#ff0113"></svgicon></span>
    </div>
    <div class="board">
      <table v-bind:style="{ width: `${45 * colNo}px` }">
        <tbody>
          <tr v-for="(_, row) in rowNo" :key="row">
            <td v-for="(_, col) in colNo" :key="col" v-bind:ref="`${row}:${col}`" v-on:click="tick" :data-cell="`${row}:${col}`" v-bind:class="{
               'is-win': cells[`${row}:${col}`].isWin,
               'is-current': cells[`${row}:${col}`].isCurrent
            }" :title="`${row}:${col}`" style="width:45px;height:45px;">
              <svgicon v-if="cells[`${row}:${col}`].type === 'x'" icon="x" width="22" height="18" color="#f1f1f1"></svgicon>
              <svgicon v-if="cells[`${row}:${col}`].type === 'o'" icon="o" width="22" height="18" color="#fb3e26"></svgicon>
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

<script>
/* eslint no-plusplus: 0 */
/* eslint comma-dangle: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint consistent-return: 0 */
/* eslint array-callback-return: 0 */

import Caro from '../core/caro';
import WinnerModal from './WinnerModal';
import LooseModal from './LooseModal';
import UserConfigModal from './UserConfigModal';
import modal from '../core/modal';

import '../svg/x';
import '../svg/o';

const socket = io(window.SOCKET_URL);

export default {
  name: 'HelloWorld',
  components: {
    WinnerModal,
    UserConfigModal,
    LooseModal
  },

  data() {
    socket.on('updateTick', (data) => {
      if (!data) return;

      const elem = this.$refs[data.cell];

      if (elem && elem[0]) {
        this.tick(elem[0], {
          theirTurn: true
        });
      }
    });

    socket.on('setupGame', (data) => {
      if (!data || (this.caro.gameId === data.gameId)) return;

      this.caro.setup({
        ticker: data.ticker === 'x' ? 'o' : 'x'
      });

      modal.hideModal('modal-winner');
      modal.hideModal('modal-loose');
    });

    socket.on('setOtherWinningPath', (data) => {
      if (!data || (this.caro.isOtherHasWinningPath)) return;

      this.caro.setOtherWinningPath();
    });

    const rowNo = 20;
    const colNo = 20;

    this.caro = new Caro({
      rowNo,
      colNo
    });

    return {
      caro: this.caro,
      rowNo,
      colNo,
      cells: this.caro.cells
    };
  },
  methods: {
    newGame() {
      modal.showModal('user-config-modal');
    },

    tick(e, status) {
      const elem = e.nodeType === 1 ? e : e.currentTarget;
      const cell = elem.getAttribute('data-cell');
      const hasTicked = this.$data.cells[cell].type;
      let tick = this.caro.ticker;

      if (status && status.theirTurn) {
        tick = this.caro.otherTicker;
      }

      if (this.caro.isOver || !tick || hasTicked || (!status && !this.caro.myTurn)) return;

      const result = this.caro.setTick(tick, cell, status && status.theirTurn);
      this.$data.cells[cell].type = tick;

      document.title = document.title.replace(/\s-\s\w\sturn/g, '');
      document.title += ` - ${this.caro.turn.toUpperCase()} turn`;

      if (result.isWin) {
        for (let i = 0; i < result.winPath.length; i++) {
          const cellId = result.winPath[i];
          this.$data.cells[cellId].isWin = true;
        }

        if (tick === this.caro.ticker) {
          modal.showModal('modal-winner');
        } else {
          modal.showModal('modal-loose');
        }
      } else if (this.caro.isOtherHasWinningPath) {
        socket.emit('setOtherWinningPath', true);
      }

      if (!status || !status.theirTurn) {
        socket.emit('setTick', {
          tick,
          cell
        });
      }
    }
  }
};
</script>
