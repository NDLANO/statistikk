<script>
import { Bar, mixins } from "vue-chartjs";

const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ["options"],
  mounted() {
    this.renderBarChart();
  },
  methods: {
    renderBarChart() {
      this.renderChart(this.chartData, this.options);
    }
  },
  watch: {
    options(newValue, oldValue) {
      this.renderBarChart();
    }
  }
};
</script>
