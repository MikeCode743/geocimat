<template>
  <v-container fluid>
    <v-row>
      <v-chip class="mb-5" color="secondary" label dark>
        Calendario
        <v-icon right> mdi-calendar-month </v-icon>
      </v-chip>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark @click="showAssignDate">
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
        @click:event="showProject"
      ></v-calendar>

      <v-dialog v-model="show" max-width="650">
        <v-card color="grey lighten-4">
          <v-toolbar dark>
            {{ visitInfo.project }}
            <v-spacer></v-spacer>
            <v-btn icon class="ml-5" @click="dialogDelete = true">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-chip class="my-3" :color="color" dark outlined label>
              {{ stateVisit }}
            </v-chip>
            <p>
              {{ visitInfo.description }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="show = false">
              Cancelar
            </v-btn>
            <v-btn text color="green" @click="showEdit">
              Editar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

    <!-- START MODAL EDIT -->
    <v-dialog v-model="dialogEdit" max-width="650">
      <v-card>
        <v-form @submit.prevent="editVisit">
          <v-card-title> {{ visitInfo.project }} </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
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
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogEdit = false">Cancelar</v-btn>
            <v-btn
              color="blue darken-1"
              text
              type="submit"
              @click="dialogEdit = false"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- END MODAL EDIT -->
    <!-- START MODAL DELETE -->
    <v-dialog v-model="dialogDelete" max-width="450">
      <v-card>
        <v-card-title class="headline">
          Eliminar Visita
        </v-card-title>

        <v-card-text>
          ¿Seguro de eliminar la visita a {{ visitInfo.project }}?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="deleteVisit()">
            Eliminar
          </v-btn>
          <v-btn  text @click="dialogDelete = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END MODAL DELETE -->
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
      dialogEdit: false,
      dialogDelete: false,
      show: false,

      projects: [
        "Volcan de San Miguel",
        "Jardin Botanico",
        "Boqueron",
        "Volcan de Santa Ana",
      ],

      color: "",
      stateVisit: "",

      visitInfo: {
        id: null,
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
          id: 1,
          name: "Cerro el pital",
          start: "2021-02-01",
          end: "2021-02-03",
          id_status: 1,
          materialColor: "indigo",
        },
        {
          id: 2,
          name: "Cerro el pital",
          start: new Date("Feb 5, 2021 07:22:13"),
          end: new Date("Feb 8, 2021 07:22:13"),
          id_status: 2,
          materialColor: "orange",
        },
        {
          id: 3,
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
    showAssignDate() {
      this.visitInfo = {};
      this.dialog = true;
    },

    assignDate() {
      //Esto cambiará a una petición solo quedará el objeto para guardarlo
      let [startDate, endDate] = this.visitInfo.dates;
      this.scheduledVisits.push({
        id: this.scheduledVisits.length + 1,
        name: this.visitInfo.project,
        start: startDate,
        end: endDate || startDate,
        id_status: this.visitInfo.idStatus,
        materialColor: this.visitStatuses.find(
          (element) => element.id === this.visitInfo.idStatus
        ).materialColor,
      });
    },
    showProject({ event }) {
      this.visitInfo.id = event.id;
      this.visitInfo.project = event.name;
      this.visitInfo.description =
        " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis accusantium necessitatibus non odio expedita dolor doloribus sint dicta at quidem, magni soluta labore? Itaque corrupti facere odit deleniti quasi. Nisi ";

      this.visitInfo.idStatus = this.visitStatuses.find(
        (element) => element.id === event.id_status
      ).id;

      this.stateVisit = this.visitStatuses.find(
        (element) => element.id === event.id_status
      ).nombre;
      this.color = this.visitStatuses.find(
        (element) => element.id === event.id_status
      ).materialColor;

      this.show = true;
    },
    editVisit() {
      let indexVisit;
      this.scheduledVisits.forEach((element, index) => {
        if (element.id === this.visitInfo.id) {
          indexVisit = index;
        }
      });
      this.scheduledVisits[indexVisit].id_status = this.visitInfo.idStatus;
      this.scheduledVisits[indexVisit].materialColor = this.visitStatuses.find(
        (element) => element.id === this.visitInfo.idStatus
      ).materialColor;
      // this.scheduledVisits[indexVisit].description = this.visitInfo.description
      this.visitInfo = {};
    },
    showEdit() {
      this.dialogEdit = true;
      this.show = false;
    },
    deleteVisit() {
      this.scheduledVisits = this.scheduledVisits.filter(
        (element) => element.id != this.visitInfo.id
      );
      this.show = false;
      this.dialogDelete = false;
      this.visitInfo = {};
    },
  },
};
</script>
