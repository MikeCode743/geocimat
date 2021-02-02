<template>
  <v-container fluid>
    <v-chip class="mb-5" color="secondary" label text-color="white">
      Calendario
      <v-icon right> mdi-calendar-month </v-icon>
    </v-chip>

    <v-chip-group mandatory active-class="primary--text">
      <v-chip
        v-for="statuses in calendarStatuses"
        :key="statuses.id"
        :color="statuses.material_color"
        @click="idStatusFiltered = statuses.id"
      >
        {{ statuses.nombre }}
      </v-chip>
    </v-chip-group>

    <v-sheet height="1000">
      <v-calendar
        ref="calendar"
        v-model="value"
        type="month"
        :events="getScheduled"
        :event-color="getEventColor"
      ></v-calendar>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: "ProjectCalendar",

  components: {},

  created() {},

  data() {
    return {
      value: "",
      idStatusFiltered: -1,

      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],

      snackbar: {
        visible: false,
        text: "",
      },

      calendarStatuses: [
        {
          id: -1,
          nombre: "Mostrar Todos",
          material_color: "",
          visible: true,
        },
        {
          id: 1,
          nombre: "A Visitar",
          material_color: "indigo",
          visible: true,
        },
        {
          id: 2,
          nombre: "Cancelado",
          material_color: "orange",
          visible: false,
        },
        {
          id: 3,
          nombre: "Pendiente de aprobación",
          material_color: "green darken-1",
          visible: true,
        },
      ],

      scheduledVisits: [
        {
          name: "Cerro el pital",
          start: "2021-02-01",
          end: "2021-02-03",
          id_status: 1,
          material_color: "indigo",
        },
        {
          name: "Cerro el pital",
          start: new Date("Feb 5, 2021 07:22:13"),
          end: new Date("Feb 8, 2021 07:22:13"),
          id_status: 2,
          material_color: "orange",
        },
        {
          name: "Cerro el pital",
          start: "2021-02-01",
          end: "2021-02-02",
          id_status: 3,
          material_color: "green",
        },
      ],
    };
  },

  computed: {
    getScheduled() {
      if (this.idStatusFiltered === -1) {
        return this.scheduledVisits;
      }
      return this.scheduledVisits.filter(
        ({ id_status }) => id_status === this.idStatusFiltered
      );
    },
  },

  methods: {
    getEventColor(event) {
      return event.material_color;
    },
  },
};
</script>