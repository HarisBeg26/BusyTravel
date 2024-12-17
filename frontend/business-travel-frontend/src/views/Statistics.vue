<template>
  <div class="statistics">
    <h2>Expense Statistics</h2>
    <div v-if="loading">
      <p>Loading...</p> <!-- Loading message while data is being fetched -->
    </div>
    <div v-if="!expenseData.length && !loading">
      <p>No expense data available for the chart.</p>
    </div>
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController);

export default {
  setup() {
    const chartRef = ref(null); // Reference to chart canvas
    const expenseData = ref([]); // Store fetched data
    const loading = ref(true); // Loading state for API request

    const fetchExpenseStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics/expense-statistics');
        console.log('API Response:', response.data); // Debug log
        expenseData.value = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched Expense Data:', expenseData.value); // Debug log
      } catch (error) {
        console.error('Error fetching expense statistics:', error);
        alert('Failed to fetch expense statistics. Please try again.');
      } finally {
        loading.value = false; // Set loading to false after the data fetch is complete
      }
    };

    const createChart = () => {
      if (!expenseData.value.length) {
        console.warn('No expense data available for the chart');
        alert('No expense data available for the chart');
        return;
      }

      const categories = expenseData.value.map(item => `Trip ${item.trip_id}`);
      const amounts = expenseData.value.map(item => item.total_expenses);

      new ChartJS(chartRef.value, {
        type: 'bar',
        data: {
          labels: categories, // Dynamic labels
          datasets: [{
            label: 'Total Expenses',
            data: amounts, // Dynamic data
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
              text: 'Expenses by Trip'
            }
          }
        }
      });
    };

    watch(expenseData, (newData) => {
      if (newData.length) {
        createChart(); // Only create the chart when data is available
      }
    });

    onMounted(async () => {
      await fetchExpenseStatistics(); // Fetch data before creating the chart
    });

    return {chartRef, expenseData, loading};
  },
};
</script>

<style scoped>
.statistics {
  padding: 20px;
  background-color: #f4f4f9;
}

.no-data-message {
  color: #999;
  font-size: 18px;
  text-align: center;
}

.loading-message {
  font-size: 16px;
  color: #666;
  text-align: center;
}
</style>
