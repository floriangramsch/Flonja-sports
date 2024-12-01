<script setup lang="ts">
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
const props = defineProps<{
  data: any;
  user: string;
}>();

console.log(props.data);
props.data.map((t: any) => {
  console.log(t.weight, t.reps, t.weight * t.reps);
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<"line", { x: number; y: number }[]> | null = null;

const createChart = () => {
  if (!chartCanvas.value) return;

  // Falls bereits ein Chart existiert, diesen zerstören
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Neuen Chart erstellen
  chartInstance = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels: props.data.map((_: any, index: number) => index + 1),

      datasets: [
        {
          label: props.user,

          data: props.data?.map((d: any) => d.weight * d.reps),
          // data:
          //   props.data?.map((d) => ({
          //     x: d.start,
          //     y: d.weight * d.reps,
          //   })) || [],
          backgroundColor: "#1e293b",
          borderColor: "#1e293b",
          borderWidth: 1,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          title: {
            display: true,
            text: "Index",
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Weigth * Reps",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              const data = props.data[index];
              return `Weight: ${data.weight}, Reps: ${data.reps}`;
            },
          },
        },
      },
      // plugins: {
      //   legend: {
      //     position: "top",
      //   },
      //   tooltip: {
      //     callbacks: {
      //       label: (context) =>
      //         `${context.dataset.label}: ${
      //           (context.raw as { y: number }).y || 0
      //         }`,
      //     },
      //   },
      // },
    },
  });
};

onMounted(createChart);

watch(
  () => props.data,
  () => {
    createChart();
  },
  { deep: true },
);
</script>

<template>
  <div class="sm:h-90 relative h-64 w-full">
    <canvas class="min-w-full" ref="chartCanvas" />
  </div>
</template>
