<script setup lang="ts">
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
const props = defineProps<{
  data: any;
  user: string;
}>();

const type = ref<"volume" | "sets">("sets");

props.data.map((t: any) => {
  console.log(t.weight, t.reps, t.weight * t.reps);
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<"line", { x: number; y: number }[]> | null = null;

const getPointRadius = (reps: number) => {
  if (reps <= 6) return 5;
  if (reps <= 8) return 7;
  if (reps <= 10) return 9;
  if (reps <= 12) return 11;
  return 13;
};

const createTopSetsChart = () => {
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

          data: props.data?.map((d: any) => d.weight),
          // data: props.data?.map((d: any) => d.weight * d.reps),
          // data:
          //   props.data?.map((d) => ({
          //     x: d.start,
          //     y: d.weight * d.reps,
          //     pointRadius: getPointRadius(d.reps),
          //   })) || [],
          backgroundColor: "#1e293b",
          borderColor: "#1e293b",
          borderWidth: 1,
          // pointRadius: 3,
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
            text: "Weigth",
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
      elements: {
        point: {
          radius: (context) => {
            const index = context.dataIndex;
            const data = props.data[index];
            return getPointRadius(data.reps);
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

const createVolumeChart = () => {
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
          backgroundColor: "#1e293b",
          borderColor: "#1e293b",
          borderWidth: 1,
          pointRadius: 5,
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
    },
  });
};

const switchChart = () => {
  if (type.value === "sets") type.value = "volume";
  else if (type.value === "volume") type.value = "sets";
};

onMounted(createTopSetsChart);

watch(type, (newVal) => {
  if (newVal === "sets") createTopSetsChart();
  else if (newVal === "volume") createVolumeChart();
});

watch(
  () => props.data,
  () => {
    createTopSetsChart();
  },
  { deep: true },
);
</script>

<template>
  <div class="sm:h-90 relative h-64 w-full">
    <button @click="switchChart"><i class="fa-solid fa-cat" /></button>
    <canvas class="min-w-full" ref="chartCanvas" />
  </div>
</template>
