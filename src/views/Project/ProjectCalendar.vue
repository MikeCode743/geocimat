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
        <v-icon right> mdi-plus </v-icon>
      </v-btn>
    </v-row>

    <v-row class="mt-0 mb-3">
      <v-chip-group mandatory>
        <v-chip color="secondary" @click="idStatusFiltered = -1" dark outlined>
          Mostrar Todos
        </v-chip>
        <v-chip
          v-for="statuses in visitStatuses"
          :key="statuses.id"
          :color="statuses.materialColor"
          @click="idStatusFiltered = statuses.id"
          outlined
          dark
        >
          {{ statuses.nombre }}
        </v-chip>
      </v-chip-group>
    </v-row>

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
          <v-card-title> Asignar Fecha </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-autocomplete
                  auto-select-first
                  clearable
                  v-model="visitInfo.project"
                  :items="projects"
                  label="Proyecto "
                ></v-autocomplete>

                <v-select
                  v-model="visitInfo.idStatus"
                  :items="visitStatuses"
                  item-text="nombre"
                  item-value="id"
                  label="Estado de la visita"
                ></v-select>

                <v-textarea
                  v-model="visitInfo.description"
                  auto-grow
                  label="Descripcion"
                ></v-textarea>
              </v-col>
              <v-col>
                <!-- <v-chip
                  class="d-flex justify-center mb-3"
                  :color="chip.color"
                  label
                  dark
                >
                  <v-icon left> mdi-check-circle</v-icon>
                  {{ chip.info }}
                </v-chip> -->
                <v-date-picker
                  full-width
                  locale="es-sv"
                  v-model="visitInfo.dates"
                  range
                >
                </v-date-picker>
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

      projects: [
        "Volcan de San Miguel",
        "Jardin Botanico",
        "Boqueron",
        "Volcan de Santa Ana",
      ],

      visitInfo: {
        project: "",
        idStatus: "",
        description: "",
        dates: [],
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

      visitStatuses: [
        {
          id: 1,
          nombre: "A Visitar",
          materialColor: "indigo",
          visible: true,
        },
        {
          id: 2,
          nombre: "Cancelado",
          materialColor: "orange",
          visible: false,
        },
        {
          id: 3,
          nombre: "Pendiente de aprobación",
          materialColor: "green darken-1",
          visible: true,
        },
      ],

      scheduledVisits: [
        {
          name: "Cerro el pital",
          start: "2021-02-01",
          end: "2021-02-03",
          id_status: 1,
          materialColor: "indigo",
        },
        {
          name: "Cerro el pital",
          start: new Date("Feb 5, 2021 07:22:13"),
          end: new Date("Feb 8, 2021 07:22:13"),
          id_status: 2,
          materialColor: "orange",
        },
        {
          name: "Cerro el pital",
          start: "2021-02-01",
          end: "2021-02-02",
          id_status: 3,
          materialColor: "green",
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
      return event.materialColor;
    },

    assignDate() {
      //Esto cambiará a una petición solo quedará el objeto para guardarlo
      let [startDate, endDate] = this.visitInfo.dates;
      this.scheduledVisits.push({
        name: this.visitInfo.project,
        start: startDate,
        end: endDate || startDate,
        id_status: this.scheduledVisits.length + 1,
        materialColor: this.visitStatuses.find(
          (element) => element.id === this.visitInfo.idStatus
        ).materialColor,
      });
    },
  },
};
</script>
