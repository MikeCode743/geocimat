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
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
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
            <v-btn text color="green" @click="showEdit"> Editar </v-btn>
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
        <v-card-title class="headline"> Eliminar Visita </v-card-title>

        <v-card-text>
          ¿Seguro de eliminar la visita a {{ visitInfo.project }}?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="deleteVisit()">
            Eliminar
          </v-btn>
          <v-btn text @click="dialogDelete = false"> Cancelar </v-btn>
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
import {
  getCalendar,
  createDate,
  editDate,
  deleteDate,
} from "@/lib/project-calendar";

export default {
  name: "ProjectCalendar",

  components: {},

  created() {
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

    getDates() {
      getCalendar()
        .then((result) => {
          this.scheduledVisits = result.calendario;
          this.visitStatuses = result.estadoVisita;
          this.projects = result.proyectos;
        })
        .catch((err) => {
          console.log(err);
          this.scheduledVisits = [];
          this.visitStatuses = [];
          this.projects = [];
        });
    },

    assignDate() {
      createDate(this.getFormData())
        .then((result) => {
          this.showSnackbar(result.message, "primary");
          this.pushVisit(result.newDate);
        })
        .catch((err) => {
          this.showSnackbar("ocurrio un error", "red");
          console.log(err);
        });
    },

    getFormData() {
      let [startDate, endDate] = this.visitInfo.dates;
      var formData = {
        identificador: this.visitInfo.project,
        id_estado: this.visitInfo.idStatus,
        fecha_inicio: startDate,
        fecha_fin: endDate || startDate,
        descripcion: this.visitInfo.description,
      };
      return formData;
    },

    pushVisit(id) {
      let [startDate, endDate] = this.visitInfo.dates;
      this.scheduledVisits.push({
        id: id,
        name: this.visitInfo.project,
        start: startDate,
        end: endDate || startDate,
        id_status: this.visitInfo.idStatus,
        materialColor: this.visitStatuses.find(
          (element) => element.id === this.visitInfo.idStatus
        ).material_color,
      });
    },

    showProject({ event }) {
      this.visitInfo.id = event.id;
      this.visitInfo.project = event.name;
      this.visitInfo.description = event.descripcion || "¡Sin descripción!";
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

    editVisit() {
      var formEdit = {
        id: this.visitInfo.id,
        id_estado: this.visitInfo.idStatus,
        descripcion: this.visitInfo.description,
      };
      editDate(formEdit)
        .then((result) => {
          this.showSnackbar(result.message, "success");

          this.editCalendar();
        })
        .catch((err) => {
          this.showSnackbar("ocurrio un error", "red");
          console.log(err);
        });
    },

    editCalendar() {
      let indexVisit = null;
      this.scheduledVisits.forEach((element, index) => {
        if (element.id === this.visitInfo.id) {
          indexVisit = index;
        }
      });
      this.scheduledVisits[indexVisit].id_status = this.visitInfo.idStatus;
      this.scheduledVisits[indexVisit].materialColor = this.visitStatuses.find(
        (element) => element.id === this.visitInfo.idStatus
      ).material_color;
      this.scheduledVisits[indexVisit].descripcion = this.visitInfo.description;
      this.visitInfo = {};
    },

    deleteVisit() {
      let deleteData = {
        id: this.visitInfo.id,
      };

      deleteDate(deleteData)
        .then((result) => {
          this.showSnackbar(result.message, "success");
          this.scheduledVisits = this.scheduledVisits.filter(
            (element) => element.id != this.visitInfo.id
          );
          this.show = false;
          this.dialogDelete = false;
          this.visitInfo = {};
        })
        .catch((err) => {
          this.showSnackbar("ocurrio un error", "red");
          console.log(err);
        });
    },

    showEdit() {
      this.dialogEdit = true;
      this.show = false;
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
