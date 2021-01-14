<script>
import { Line, mixins } from "vue-chartjs";

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["options"],
  mounted() {
    console.log("this defaults = ", this);
    this.renderLineChart();
  },
  methods: {
    renderLineChart() {
      this.renderChart(this.chartData, this.options);
    }
  },
  watch: {
    options(newValue, oldValue) {
      this.renderLineChart();
    }
  }
};
</script>
