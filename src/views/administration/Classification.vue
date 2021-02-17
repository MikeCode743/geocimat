<template>
  <div>
    <v-row class="my-5 mx-1">
      <v-chip color="secondary" label text-color="white">
        Clasificacion
        <v-icon right>
          mdi-text-box-plus
        </v-icon>
      </v-chip>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark @click="create()">
        Crear
        <v-icon right>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-row>

    <!-- START TABLE -->
    <template>
      <v-simple-table>
        <template>
          <thead>
            <tr>
              <th class="text-left">
                No.
              </th>
              <th class="text-left">
                Nombre
              </th>
              <th class="text-left">
                Color
              </th>
              <th class="text-left">
                Visible
              </th>
              <th class="text-left">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in listClassification" :key="item.nombre">
              <td>{{ index + 1 }}</td>

              <td>{{ item.nombre }}</td>
              <td>
                <v-chip
                  class="ma-2"
                  :color="item.material_color"
                  text-color="white"
                >
                  {{ item.nombre }}
                </v-chip>
              </td>
              <td>
                <v-switch
                  :input-value="item.visible"
                  @change="(value) => changeState(value, index)"
                ></v-switch>
              </td>
              <td>
                <!-- BTN Edit -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="edit(index)">
                      <v-icon dark v-bind="attrs" v-on="on">
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
    <!-- END TABLE -->
    <!-- START MODAL CREATE -->
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Crear Clasificacion</span>
        </v-card-title>
        <v-form @submit.prevent="createClassification">
          <v-card-text>
            <!-- INPUT -->
            <v-text-field
              outlined
              v-model="nombre"
              label="Nombre *"
              name="nombre"
              autofocus
              required
            ></v-text-field>

            <!-- COMPONENT  -->
            <MaterialColorPicker
              v-bind:formData="formData"
            ></MaterialColorPicker>
            <!-- COMPONENT -->

            <small>* indica un campo obligatorio</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
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
    <v-dialog v-model="dialogEdit" persistent max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Clasificacion</span>
        </v-card-title>
        <v-form @submit.prevent="editClassification">
          <v-card-text>
            <!-- INPUT -->
            <v-text-field
              outlined
              v-model="nombre"
              label="Nombre *"
              name="nombre"
              autofocus
              required
            ></v-text-field>

            <!-- COMPONENT  -->
            <MaterialColorPicker
              v-bind:formData="formData"
            ></MaterialColorPicker>
            <!-- COMPONENT -->

            <small>* indica un campo obligatorio</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogEdit = false">
              Cancelar
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              type="submit"
              @click="dialogEdit = false"
            >
              Editar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- END MODAL EDIT -->

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
  </div>
</template>

<script>
import MaterialColorPicker from "@/components/MaterialColorPicker";
import axios from "axios";

export default {
  name: "Classification",

  components: {
    MaterialColorPicker,
  },

  data() {
    return {
      listClassification: [],

      formData: {
        otroAtributo: true,
        colorSelected: "blue",
      },

      dialog: false,
      dialogEdit: false,

      nombre: "",
      color: null,
      indexClassification: null,
      idClassification: null,
      /* Snackbar */
      snackbar: {
        state: false,
        message: "",
        color: "",
      },
      /* Tooltip */
      on: true,
      attrs: {},

      location: location.host,

      // host: location.host,
      host:"https://geocimat.herokuapp.com",
      // host: "http://localhost:8000",
    };
  },
  created() {
    this.getClassification();
  },

  methods: {
    async getClassification() {
      var self = this;
      await axios
        .get(`${this.host}/geocimat/clasificacion`)
        .then(function(response) {
          // handle success
          console.log(response.data.clasificaciones);
          self.listClassification = response.data.clasificaciones;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },

    create() {
      this.settingdata();
      this.dialog = true;
    },
    async changeState(valor, index) {
      this.idClassification = this.listClassification[index].id;
      var self = this;
      await axios
        .post(`${this.host}/geocimat/clasificacion/visible`, {
          id: self.idClassification,
          visible: valor,
        })
        .then(function(response) {
          self.showSnackbar(response.data.message, "primary");
          // handle success
        })
        .catch(function(error) {
          // handle error
          self.listClassification[index].visible = !valor;
          console.log(error);
          self.showSnackbar("Ocurrio un error", "red");
        })
        .then(function() {
          // always executed
        });
    },
    async createClassification() {
      if (this.validate(this.nombre, this.formData.colorSelected)) {
        var self = this;
        await axios
          .post(`${this.host}/geocimat/clasificacion/crear`, {
            nombre: self.nombre,
            material_color: self.formData.colorSelected,
            visible: true,
          })
          .then(function(response) {
            self.showSnackbar("Clasificación Agregado", "primary");
            // handle success
            self.listClassification.push({
              id: response.data.clasificacion.id,
              nombre: response.data.clasificacion.nombre,
              material_color: response.data.clasificacion.material_color,
              visible: response.data.clasificacion.visible,
            });
          })
          .catch(function(error) {
            // handle error
            console.log(error);
            self.showSnackbar("Ocurrio un error", "red");
          })
          .then(function() {
            // always executed
          });
      }
      this.settingdata();
    },
    edit(index) {
      this.nombre = this.listClassification[index].nombre;
      this.formData.colorSelected = this.listClassification[
        index
      ].material_color;
      this.indexClassification = index;
      this.idClassification = this.listClassification[index].id;
      this.dialogEdit = true;
    },
    async editClassification() {
      if (this.validate(this.nombre, this.formData.colorSelected)) {
        var self = this;
        await axios
          .post(`${this.host}/geocimat/clasificacion/modificar`, {
            id: self.idClassification,
            nombre: self.nombre,
            material_color: self.formData.colorSelected,
          })
          .then(function(response) {
            self.showSnackbar(response.data.message, "primary");
            self.listClassification[self.indexClassification].nombre =
              self.nombre;
            self.listClassification[self.indexClassification].material_color =
              self.formData.colorSelected;

            // handle success
          })
          .catch(function(error) {
            // handle error
            console.log(error);
            self.showSnackbar("Ocurrio un error", "red");
          })
          .then(function() {
            // always executed
          });
      }
    },

    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.state = true;
    },
    settingdata() {
      this.nombre = "";
      this.indexClassification = null;
      this.idClassification = null;
      this.formData.colorSelected = "blue";
    },
    validate(nombre, color) {
      if (color === null && nombre.length == 0) {
        this.showSnackbar("Los campos de nombre y color estan vacios", "red");
        return false;
      } else if (nombre.length === 0) {
        this.showSnackbar(
          "El campo del nombre de la Clasificación esta vacio",
          "red"
        );
        return false;
      } else if (color === null) {
        this.showSnackbar("El color esta vacio", "red");
        return false;
      }
      return true;
    },
  },
};
</script>
