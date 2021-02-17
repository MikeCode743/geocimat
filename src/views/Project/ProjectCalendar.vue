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
        <v-chip color="secondary" @click="idStatusFiltered = -1" dark>
          Mostrar Todos
        </v-chip>
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
    </v-row>
    <v-sheet height="1000">
      <v-toolbar flat>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-toolbar-title v-if="!$refs.calendar">
          {{ mes }}
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-calendar
        ref="calendar"
        v-model="focus"
        type="month"
        :events="getScheduled"
        locale="es-sv"
        :event-color="getEventColor"
        @click:event="showProject"
        @change="changeDate"
      ></v-calendar>
      <!-- Modal details -->
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
            <v-chip class="my-3 mr-3" :color="color2" dark label>
              {{ visitInfo.classification }}
            </v-chip>
            <v-chip class="my-3" :color="color" dark label>
              {{ visitInfo.stateVisit }}
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
                  item-text="nombre"
                  item-value="identificador"
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
          <v-btn text @click="dialogDelete = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END MODAL DELETE -->
    <!-- START SNACKBAR -->
    <v-snackbar
      v-model="snackbar.state"
      :timeout="3000"
      :color="snackbar.color"
      left
    >
      {{ snackbar.message }}
      <v-btn text v-bind="attrs" @click="snackbar.state = false">
        Cerrar
      </v-btn>
    </v-snackbar>
    <!-- END SNACBAR -->
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ProjectCalendar",

  components: {},

  created() {
    this.mes = "febrero 2021";
    this.getDates();
  },
  mounted() {},

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
      color2: "",
      stateVisit: "",
      focus: "",

      visitInfo: {
        id: null,
        project: "",
        idStatus: "",
        description: "",
        dates: [],
        classification: "",
        stateVisit: "",
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
      /* Snackbar */
      snackbar: {
        state: false,
        message: "",
        color: "",
      },
      attrs: {},

      visitStatuses: [],

      scheduledVisits: [],
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

    async getDates() {
      var self = this;
      await axios
        .get("http://localhost:8000/geocimat/calendario/")
        .then(function(response) {
          self.scheduledVisits = response.data.calendario;
          self.visitStatuses = response.data.estadoVisita;
          self.projects = response.data.proyectos;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },

    async assignDate() {
      //Esto cambiará a una petición solo quedará el objeto para guardarlo
      let [startDate, endDate] = this.visitInfo.dates;

      var self = this;
      let eventAdd = false;
      let newId = null;
      await axios
        .post("http://localhost:8000/geocimat/calendario/crear", {
          identificador: self.visitInfo.project,
          id_estado: self.visitInfo.idStatus,
          fecha_inicio: startDate,
          fecha_fin: endDate || startDate,
          descripcion: self.visitInfo.description,
        })
        .then(function(response) {
          // handle success
          self.showSnackbar(response.data.message, "primary");
          newId = response.data.newDate;
        })
        .catch(function(error) {
          self.showSnackbar("ocurrio un error", "red");
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });

      if (eventAdd) {
        this.scheduledVisits.push({
          id: newId,
          name: this.visitInfo.project,
          start: startDate,
          end: endDate || startDate,
          id_status: this.visitInfo.idStatus,
          materialColor: this.visitStatuses.find(
            (element) => element.id === this.visitInfo.idStatus
          ).materialColor,
        });
      }
    },
    showProject({ event }) {
      this.visitInfo.id = event.id;
      this.visitInfo.project = event.name;
      if (event.descripcion !== null) {
        this.visitInfo.description = event.descripcion;
      } else {
        this.visitInfo.description = "¡Sin descripcion!";
      }
      this.visitInfo.idStatus = event.id_status;
      this.visitInfo.stateVisit = this.visitStatuses.find(
        (element) => element.id === event.id_status
      ).nombre;
      this.color = this.visitStatuses.find(
        (element) => element.id === event.id_status
      ).material_color;
      this.color2 = event.cla_material_color;
      this.show = true;

      this.visitInfo.classification = event.clasificacion;
    },
    async editVisit() {
      let visit = false;
      let indexVisit = null;
      var self = this;
      await axios
        .post("http://localhost:8000/geocimat/calendario/modificar", {
          id: self.visitInfo.id,
          id_estado: self.visitInfo.idStatus,
          descripcion: self.visitInfo.description,
        })
        .then(function(response) {
          self.showSnackbar(response.data.message, "primary");
          visit = true;
        })
        .catch(function(error) {
          self.showSnackbar("ocurrio un error", "red");
          console.log(error);
        });

      if (visit) {
        this.scheduledVisits.forEach((element, index) => {
          if (element.id === this.visitInfo.id) {
            indexVisit = index;
          }
        });
        this.scheduledVisits[indexVisit].id_status = this.visitInfo.idStatus;
        this.scheduledVisits[
          indexVisit
        ].materialColor = this.visitStatuses.find(
          (element) => element.id === this.visitInfo.idStatus
        ).material_color;
        this.scheduledVisits[
          indexVisit
        ].descripcion = this.visitInfo.description;
        this.visitInfo = {};
      }
    },
    showEdit() {
      this.dialogEdit = true;
      this.show = false;
    },
    async deleteVisit() {
      var self = this;
      let eventDelete = false;
      await axios
        .post("http://localhost:8000/geocimat/calendario/destruir", {
          id: self.visitInfo.id,
        })
        .then(function(response) {
          self.showSnackbar(response.data.message, "secondary");
          // handle success
          eventDelete = true;
        })
        .catch(function(error) {
          self.showSnackbar("ocurrio un error", "red");
          // handle error
          console.log(error);
        })
        .then(function() {});

      if (eventDelete) {
        self.scheduledVisits = self.scheduledVisits.filter(
          (element) => element.id != self.visitInfo.id
        );
        this.show = false;
        this.dialogDelete = false;
        this.visitInfo = {};
      }
    },
    prev() {
      this.$refs.calendar.prev();
      this.mes = "";
    },
    next() {
      this.$refs.calendar.next();
      this.mes = "";
    },
    changeDate() {
      this.$refs.calendar.checkChange();
      this.mes = "";
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.state = true;
    },
  },
};
</script>
