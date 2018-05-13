<template>
  <div class="hello">
    <table>
      <tbody>
        <tr v-for="(_, row) in rowNo" :key="row">
          <td v-for="(_, col) in colNo" :key="col" v-on:click="tick" :data-cell="`${row}:${col}`" :title="`${row}:${col}`"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Caro from '../core/caro';

export default {
  name: 'HelloWorld',
  data () {
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
      const elem = e.target;
      const cell = elem.getAttribute('data-cell');

      console.log(this.caro.setTick('x', cell))
      elem.innerHTML = 'x';
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
