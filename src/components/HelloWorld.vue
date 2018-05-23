<template>
  <div class="hello">
    <button v-on:click="newGame" class="btn btn-danger btn-lg play">New Game</button>
    <table>
      <tbody>
        <tr v-for="(_, row) in rowNo" :key="row">
          <td v-for="(_, col) in colNo" :key="col" v-bind:ref="`${row}:${col}`" v-on:click="tick" :data-cell="`${row}:${col}`" v-bind:class="{ 'is-win': cells[`${row}:${col}`].isWin }" :title="`${row}:${col}`">
            <svgicon v-if="cells[`${row}:${col}`].type === 'x'" icon="x" width="22" height="18" color=""></svgicon>
            <svgicon v-if="cells[`${row}:${col}`].type === 'o'" icon="o" width="22" height="18" color="#E8104A"></svgicon>
          </td>
        </tr>
      </tbody>
    </table>

    <WinnerModal></WinnerModal>
    <LooseModal></LooseModal>
    <UserConfigModal v-bind:caro="caro"></UserConfigModal>
  </div>
</template>

<script>
import Caro from '../core/caro'
import WinnerModal from './WinnerModal'
import LooseModal from './LooseModal'
import UserConfigModal from './UserConfigModal'
import modal from '../core/modal'

import '../svg/x'
import '../svg/o'

const socket = io(window.SOCKET_URL)

export default {
  name: 'HelloWorld',
  components: {
    WinnerModal,
    UserConfigModal,
    LooseModal
  },

  data () {
    socket.on('updateTick', (data) => {
      if (!data) return

      const elem = this.$refs[data.cell]

      if (elem && elem[0]) {
        this.tick(elem[0], {
          theirTurn: true
        })
      }
    })

    socket.on('setupGame', (data) => {
      if (!data || this.caro.isPlaying()) return

      this.caro.setup({
        ticker: data.ticker === 'x' ? 'o' : 'x'
      })
    })

    const rowNo = 20
    const colNo = 20

    this.caro = new Caro({
      rowNo,
      colNo
    })

    return {
      caro: this.caro,
      rowNo,
      colNo,
      cells: this.caro.cells
    }
  },
  methods: {
    newGame () {
      if (this.caro.isPlaying()) return

      modal.showModal('user-config-modal')
    },

    tick (e, status) {
      const elem = e.nodeType === 1 ? e : e.currentTarget
      const cell = elem.getAttribute('data-cell')
      const hasTicked = this.$data.cells[cell].type
      let tick = this.caro.ticker

      if (status && status.theirTurn) {
        tick = this.caro.otherTicker
      }

      if (this.caro.isOver || !tick || hasTicked || (!status && !this.caro.myTurn)) return

      const result = this.caro.setTick(tick, cell, status && status.theirTurn)
      this.$data.cells[cell].type = tick

      if (result.isWin) {
        for (const cellId of result.winPath) {
          this.$data.cells[cellId].isWin = true
        }

        if (tick === this.caro.ticker) {
          modal.showModal('modal-winner')
        } else {
          modal.showModal('modal-loose')
        }
      }

      if (!status || !status.theirTurn) {
        socket.emit('setTick', {
          tick,
          cell
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
table {
  border-collapse: collapse;
  margin: 0 auto;
  font-size: 25px;
  color: #E8104A;
}

tr, td {
  margin: 0;
  padding: 0;
}

td {
  border: 2px solid #333;
  height: 40px;
  width: 40px;
  cursor: pointer;
}
.svg-icon {
  vertical-align: middle;
}

.user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.user__ticker {
  margin-right: 5px;
}

.play {
  margin-bottom: 16px;
}

.modal-container {
  position:fixed;
  display:table;
  height:100%;
  width:100%;
  top:0;
  left:0;
  transform:scale(0);
  z-index:1;

  &.meep {
    transform:scale(1);
    .modal-background {
      background:rgba(0,0,0,.0);
      animation: fadeIn .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
      .modal {
        transform:translateX(-1500px);
        animation: roadRunnerIn .3s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
      }
    }
    &.out {
      animation: quickScaleDown 0s .5s linear forwards;
      .modal-background {
        animation: fadeOut .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
        .modal {
          animation: roadRunnerOut .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
        }
      }
    }
  }
  .modal-background {
    display:table-cell;
    background:rgba(0,0,0,.8);
    text-align:center;
    vertical-align:middle;
    .modal {
      background:white;
      padding:16px;
      display:inline-block;
      border-radius:3px;
      font-weight:300;
      position:relative;
      h2 {
        font-size:25px;
        line-height:25px;
        margin-bottom:15px;
      }
      p {
        font-size:18px;
        line-height:22px;
      }
      .modal-svg {
        position:absolute;
        top:0;
        left:0;
        height:100%;
        width:100%;
        border-radius:3px;
        rect {
          stroke: #fff;
          stroke-width: 2px;
          stroke-dasharray: 778;
          stroke-dashoffset: 778;
        }
      }
    }
  }
}

@keyframes fadeIn {
  0% {
    background:rgba(0,0,0,.0);
  }
  100% {
    background:rgba(0,0,0,.7);
  }
}

@keyframes fadeOut {
  0% {
    background:rgba(0,0,0,.7);
  }
  100% {
    background:rgba(0,0,0,.0);
  }
}

@keyframes roadRunnerIn {
  0% {
    transform:translateX(-1500px) skewX(30deg) scaleX(1.3);
  }
  70% {
    transform:translateX(30px) skewX(0deg) scaleX(.9);
  }
  100% {
    transform:translateX(0px) skewX(0deg) scaleX(1);
  }
}

@keyframes roadRunnerOut {
  0% {
    transform:translateX(0px) skewX(0deg) scaleX(1);
  }
  30% {
    transform:translateX(-30px) skewX(-5deg) scaleX(.9);
  }
  100% {
    transform:translateX(1500px) skewX(30deg) scaleX(1.3);
  }
}

@keyframes quickScaleDown {
  0% {
    transform:scale(1);
  }
  99.9% {
    transform:scale(1);
  }
  100% {
    transform:scale(0);
  }
}
</style>
