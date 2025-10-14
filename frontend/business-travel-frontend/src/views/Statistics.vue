<template>
  <div class="statistics-page">
    <div class="page-hero">
      <div class="hero-content">
        <h1 class="page-title">
          <i class="pi pi-chart-bar"></i>
          {{ $t('charts') || 'Expense Statistics' }}
        </h1>
        <p class="page-subtitle">Analyze your business travel expenses and trends</p>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Summary Cards First -->
      <div class="summary-grid" v-if="expenseData.length">
        <Card class="summary-card modern-card total-card">
          <template #content>
            <div class="summary-content">
              <div class="summary-icon-wrapper total-icon">
                <i class="pi pi-dollar summary-icon"></i>
              </div>
              <div class="summary-details">
                <span class="summary-label">Total Expenses</span>
                <span class="summary-value">{{ formatCurrency(totalExpenses) }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card class="summary-card modern-card trips-card">
          <template #content>
            <div class="summary-content">
              <div class="summary-icon-wrapper trips-icon">
                <i class="pi pi-map-marker summary-icon"></i>
              </div>
              <div class="summary-details">
                <span class="summary-label">Total Trips</span>
                <span class="summary-value">{{ expenseData.length }}</span>
              </div>
            </div>
          </template>
        </Card>

        <Card class="summary-card modern-card average-card">
          <template #content>
            <div class="summary-content">
              <div class="summary-icon-wrapper average-icon">
                <i class="pi pi-chart-line summary-icon"></i>
              </div>
              <div class="summary-details">
                <span class="summary-label">Average per Trip</span>
                <span class="summary-value">{{ formatCurrency(averageExpense) }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Main Chart Card -->
      <Card class="stats-card modern-card">
        <template #header>
          <div class="card-header-modern">
            <div class="header-info">
              <i class="pi pi-chart-bar header-icon"></i>
              <span class="header-title">Expenses by Trip</span>
            </div>
          </div>
        </template>
        <template #content>
          <div class="chart-section">
            <div v-if="loading" class="loading-container">
              <ProgressSpinner />
              <p>Loading statistics...</p>
            </div>

            <div v-else-if="!expenseData.length" class="no-data-container">
              <div class="no-data-content">
                <i class="pi pi-inbox no-data-icon"></i>
                <h3>No Data Available</h3>
                <p>Start tracking your expenses to see beautiful analytics here!</p>
                <Button
                  label="Add First Expense"
                  icon="pi pi-plus"
                  @click="$router.push('/add-expense')"
                  class="gradient-button-primary"
                />
              </div>
            </div>

            <div v-else class="chart-container">
              <canvas ref="chartRef"></canvas>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js';
import axios from 'axios';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { useRouter } from 'vue-router';
import config from '../config';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController);

export default {
  components: {
    Card,
    Button,
    ProgressSpinner
  },
  setup() {
    const router = useRouter();
    const chartRef = ref(null);
    const expenseData = ref([]);
    const loading = ref(true);
    let chartInstance = null;

    const totalExpenses = computed(() => {
      return expenseData.value.reduce((sum, item) => sum + parseFloat(item.total_expenses || 0), 0);
    });

    const averageExpense = computed(() => {
      return expenseData.value.length > 0 ? totalExpenses.value / expenseData.value.length : 0;
    });

    const fetchExpenseStatistics = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/statistics/expense-statistics`);
        console.log('API Response:', response.data);
        expenseData.value = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched Expense Data:', expenseData.value);
      } catch (error) {
        console.error('Error fetching expense statistics:', error);
      } finally {
        loading.value = false;
      }
    };

    const createChart = () => {
      if (!expenseData.value.length || !chartRef.value) {
        console.warn('No expense data available for the chart');
        return;
      }

      // Destroy existing chart if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      const categories = expenseData.value.map(item => `Trip ${item.trip_id}`);
      const amounts = expenseData.value.map(item => parseFloat(item.total_expenses));

      chartInstance = new ChartJS(chartRef.value, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Total Expenses ($)',
            data: amounts,
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(118, 75, 162, 0.8)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: 'Expenses by Trip',
              font: {
                size: 18,
                weight: 'bold'
              },
              color: '#333'
            },
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return '$' + context.parsed.y.toFixed(2);
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    watch(expenseData, (newData) => {
      if (newData.length) {
        setTimeout(() => createChart(), 100);
      }
    });

    onMounted(async () => {
      await fetchExpenseStatistics();
    });

    return {
      chartRef,
      expenseData,
      loading,
      totalExpenses,
      averageExpense,
      formatCurrency,
      router
    };
  },
};
</script>

<style scoped>
.statistics-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.page-hero {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  padding: 3rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.page-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.modern-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.summary-card {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.summary-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.summary-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.summary-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
}

.summary-icon {
  font-size: 2.5rem;
  color: white;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.total-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.trips-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.average-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.summary-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.summary-label {
  color: #6b7280;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.summary-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
}

.card-header-modern {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8eeff 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 1.5rem;
  color: #4facfe;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.chart-section {
  padding: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-container p {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.no-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.no-data-content {
  text-align: center;
  max-width: 400px;
}

.no-data-icon {
  font-size: 5rem;
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.no-data-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
}

.no-data-content p {
  color: #6b7280;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.chart-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  min-height: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .content-wrapper {
    padding: 2rem 1rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .summary-content {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .summary-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .summary-icon {
    font-size: 2rem;
  }

  .summary-value {
    font-size: 2rem;
  }

  .chart-container {
    padding: 1rem;
    min-height: 350px;
  }
}

@media (max-width: 480px) {
  .summary-content {
    flex-direction: column;
    text-align: center;
  }

  .summary-details {
    align-items: center;
  }
}
</style>
