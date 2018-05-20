<template>
  <div class="hello">
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
  </div>
</template>

<script>
import Caro from '../core/caro';
import '../svg/x';
import '../svg/o';

const socket = io("http://localhost:3000")

let tick = 'x';

export default {
  name: 'HelloWorld',
  components: {
  },
  data () {

    socket.on("updateTick", (data) => {
      if (!data) return;

      const elem = this.$refs[data.cell];

      if (elem && elem[0]) {
        this.tick(elem[0])
      }
    });

    const rowNo = 20;
    const colNo = 20;

    this.caro = new Caro({
      rowNo,
      colNo
    });

    return {
      rowNo,
      colNo,
      cells: this.caro.cells
    }
  },
  methods: {
    tick(e) {
      const elem = e.nodeType == 1 ? e : e.currentTarget;
      const cell = elem.getAttribute('data-cell');
      const hasTicked = this.$data.cells[cell].type;

      if (hasTicked) return;

      const result = this.caro.setTick(tick, cell)
      this.$data.cells[cell].type = tick

      if (result.isWin) {
        for (const cellId of result.winPath) {
          this.$data.cells[cellId].isWin = true
        }
      }

      socket.emit("setTick", {
        tick,
        cell
      })

      if (tick === 'x') tick = 'o'
      else tick = 'x'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
