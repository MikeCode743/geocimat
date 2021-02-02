<template>
  <v-container fluid>
    <v-row>
      <v-chip class="mb-5" color="secondary" label dark>
        Calendario
        <v-icon right> mdi-calendar-month </v-icon>
      </v-chip>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark @click="dialog = true">
        Crear
        <v-icon right>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-row>

<<<<<<< HEAD
    <v-chip-group mandatory active-class="mt-2 white--text elevation-10">
      <v-chip color="secondary" @click="idStatusFiltered = -1" dark>
        Mostrar Todos
      </v-chip>
=======
    <v-chip-group mandatory active-class="dark--text">
>>>>>>> 7efeba4e7c60665880cb7ad4847ac3778793aad4
      <v-chip
        v-for="statuses in visitStatuses"
        :key="statuses.id"
        :color="statuses.material_color"
        @click="idStatusFiltered = statuses.id"
        dark
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

    <!-- START MODAL CREATE -->
    <v-dialog v-model="dialog">
      <v-card>
        <v-form @submit.prevent="assignDate">
          <v-card-title>
            Asignar Fecha
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-autocomplete
                  auto-select-first
                  clearable
                  v-model="project"
                  :items="projects"
                  label="Proyecto "
                ></v-autocomplete>

                <v-select
                  v-model="idStatus"
                  :items="visitStatuses"
                  item-text="nombre"
                  item-value="id"
                  label="Estado de la visita"
                ></v-select>

                <v-textarea
                  v-model="description"
                  auto-grow
                  label="Descripcion"
                ></v-textarea>
              </v-col>
              <v-col>
                <v-chip
                  class="d-flex justify-center mb-3"
                  :color="chip.color"
                  label
                  dark
                >
                  <v-icon left> mdi-check-circle</v-icon>
                  {{ chip.info }}
                </v-chip>
                <v-date-picker full-width locale="es-sv" v-model="dates" range></v-date-picker>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">Cancelar</v-btn>
            <v-btn
              color="blue darken-1"
              text
              type="submit"
              @click="dialog = false"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- END MODAL CREATE -->
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

      dialog: false,

      projects: ["Volcan de San Miguel", "Jardin Botanico", "Boqueron", "Volcan de Santa Ana"],
      dates: [],
      project: "",
      description: "",
      idStatus: "",

      chip: {
        info: "Seleccionar la o las fechas de visita",
        color: "grey",
      },

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

      visitStatuses: [
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
    assignDate() {
      let status = this.visitStatuses.find(
        (element) => element.id == this.idStatus
      );

      if (this.dates[0] >= this.dates[1]) {
        this.dates = this.dates.reverse();
        console.log(this.dates);
      }

      this.scheduledVisits.push({
        name: this.project,
        start: this.dates[0],
        end: this.dates[1],
        id_status: this.idStatus,
        material_color: status.material_color,
      });
    },
  },
};
</script>
