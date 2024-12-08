<template>
  <div class="statistics">
    <h2>Expense Statistics</h2>
    <canvas ref="chartRef"></canvas> <!-- Simple reference to canvas -->
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController, Chart } from 'chart.js';

// Register required components for Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController);

export default {
  setup() {
    const chartRef = ref(null);  // Chart.js reference

    const createChart = () => {
      const staticCategories = ['Food', 'Transport', 'Accommodation'];
      const staticAmounts = [150, 200, 120];

      new ChartJS(chartRef.value, {
        type: 'bar', // specify the chart type as 'bar'
        data: {
          labels: staticCategories,
          datasets: [{
            label: 'Expenses by Category',
            data: staticAmounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Expenses by Category'
            }
          }
        }
      });
    };

    onMounted(() => {
      createChart(); // Create the chart once the component is mounted
    });

    return { chartRef };
  }
};
</script>

<style scoped>
.statistics {
  padding: 20px;
  background-color: #f4f4f9;
}
h2 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
