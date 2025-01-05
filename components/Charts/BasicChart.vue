<template>
  <canvas class="min-w-full" ref="chartCanvas" />
</template>

<!-- <template>
  <div class="overflow-x-auto">
    <canvas class="min-w-[800px]" ref="chartCanvas" />
  </div>
</template> -->

<script lang="ts" setup>
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const props = defineProps<{
  dataFlorian?: [string, number][]; // Datum und Wert für Florian
  dataSonja?: [string, number][]; // Datum und Wert für Sonja
  title?: string;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<"line", { x: number; y: number }[]> | null = null;
// for (let index = 0; index < 20; index++) {
//   props.dataFlorian?.push([
//     new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString(),
//     Math.random() * 100,
//   ]);
// }

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
      datasets: [
        {
          label: "Florian",
          data:
            props.dataFlorian?.map(([x, y]) => ({
              x: new Date(x).getTime(),
              y,
            })) || [],
          backgroundColor: "#1e293b",
          borderColor: "#1e293b",
          borderWidth: 1,
          pointRadius: 5,
        },
        {
          label: "Sonja",
          data:
            props.dataSonja?.map(([x, y]) => ({
              x: new Date(x).getTime(),
              y,
            })) || [],
          backgroundColor: "#0d9488",
          borderColor: "#0d9488",
          borderWidth: 1,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      // maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            tooltipFormat: "dd.MM.yyyy HH:mm",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: props.title,
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${
                (context.raw as { y: number }).y || 0
              }`,
          },
        },
      },
    },
  });
};

onMounted(createChart);

watch(
  () => [props.dataFlorian, props.dataSonja],
  () => {
    createChart();
  },
  { deep: true },
);
</script>
