<template>
  <div>
    <v-row class="my-5 mx-1">

    <v-chip color="secondary" label  text-color="white">
      Estado de Visita
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
            <tr v-for="(item, index) in listState" :key="item.nombre">
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
          <span class="headline">Crear Estado de Visita</span>
        </v-card-title>
        <v-form @submit.prevent="createState">
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
          <span class="headline">Editar Estado </span>
        </v-card-title>
        <v-form @submit.prevent="editState">
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
export default {
  name: "VisitingState",
  data() {
    return {
      listState: [
        {
          id: 1,
          nombre: "Visita Posterior",
          material_color: "primary",
          visible: true,
        },
        {
          id: 2,
          nombre: "Visita Previa",
          material_color: "warning",
          visible: true,
        },
        {
          id: 3,
          nombre: "Cancelado",
          material_color: "pink",
          visible: false,
        },
        {
          id: 4,
          nombre: "Terminado",
          material_color: "success",
          visible: true,
        },
      ],
      dialog: false,
      dialogEdit: false,

      nombre: "",
      color: null,
      indexState: null,
      idState: null,
      /* Snackbar */
      snackbar: {
        state: false,
        message: "",
        color: "",
      },
      /* Tooltip */
      on: true,
      attrs: {},
    };
  },
  methods: {
    create() {
      this.settingdata();
      this.dialog = true;
    },
    changeState(valor, index) {
      this.listState[index].visible = valor;
      this.showSnackbar("Estado Actualizada", "success");
    },
    createState() {
      //Default Color
      this.color = "secondary";

      if (this.validate(this.nombre, this.color)) {
        this.listState.push({
          id: Date.now(),
          nombre: this.nombre,
          material_color: this.color,
          visible: true,
        });
        this.showSnackbar("Estado Agregado", "primary");
      }
      this.settingdata();
    },
    edit(index) {
      this.nombre = this.listState[index].nombre;
      this.color = this.listState[index].material_color;
      this.indexState = index;
      this.dialogEdit = true;
    },
    editState() {
      if (this.validate(this.nombre, this.color)) {
        this.listState[this.indexState].nombre = this.nombre;
        this.listState[
          this.indexState
        ].material_color = this.color;
        this.showSnackbar("Estado Editado", "success");
        this.settingdata();
      }
    },

    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.state = true;
    },
    settingdata() {
      this.nombre = "";
      this.color = null;
      this.indexClassification = null;
      this.idClassification = null;
    },
    validate(nombre, color) {
      if (color === null && nombre.length == 0) {
        this.showSnackbar(
          "Los campos de nombre y color estan vacios",
          "red"
        );
        return false;
      } else if (nombre.length === 0) {
        this.showSnackbar(
          "El campo del nombre del estado de la visita esta vacio",
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

