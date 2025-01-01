<script setup lang="ts">
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
const props = defineProps<{
  data: any;
  user: string;
}>();

const type = ref<"volume" | "sets">("sets");

const trackDate = ref<Date>();
const trackColor = ref<boolean>(false);
const colors = ["#1e293b", "#0d9488"];

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<"line", { x: number; y: number }[]> | null = null;

const getPointRadius = (reps: number) => {
  if (reps <= 6) return 5;
  if (reps <= 8) return 7;
  if (reps <= 10) return 9;
  if (reps <= 12) return 11;
  return 13;
};

const getPointColor = (date: Date) => {
  const currentDate = new Date(date);
  if (trackDate.value) {
    if (currentDate.toDateString() !== trackDate.value.toDateString()) {
      trackColor.value = !trackColor.value;
    }
    const color = trackColor.value ? colors[1] : colors[0];
    trackDate.value = currentDate;
    return color;
  }
  trackDate.value = currentDate;
  return colors[0];
};

const createTopSetsChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels: props.data.map((_: any, index: number) => index + 1),
      datasets: [
        {
          label: props.user + " (Weight)",
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
          pointBackgroundColor: props.data.map((d: any) =>
            getPointColor(d.start),
          ),
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
            text: "",
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: false,
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
              return `Weight: ${data.weight}, Reps: ${data.reps}, Time: ${new Date(data.start).toDateString()}`;
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

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels: props.data.map((_: any, index: number) => index + 1),

      datasets: [
        {
          label: props.user + " (Weight * Reps)",
          data: props.data?.map((d: any) => d.weight * d.reps),
          backgroundColor: "#1e293b",
          borderColor: "#1e293b",
          borderWidth: 1,
          pointRadius: 5,
          pointBackgroundColor: props.data.map((d: any) =>
            getPointColor(d.start),
          ),
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
            text: "",
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: false,
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
  trackColor.value = true
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
    <button class="absolute ml-2" @click="switchChart">
      <i class="fa-solid fa-cat" />
    </button>
    <canvas class="mt-2 min-w-full" ref="chartCanvas" />
  </div>
</template>
