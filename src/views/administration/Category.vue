<template>
  <div>
    <v-row class="my-5 mx-1">
      <v-chip color="secondary" label text-color="white">
        <h3>
          Categoria
        </h3>
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
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in listCategory" :key="item.name">
              <td>{{ index + 1 }}</td>

              <td>{{ item.name }}</td>
              <td>
                <v-chip class="ma-2" :color="item.color" text-color="white">
                  {{ item.name }}
                </v-chip>
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
                <!-- BTN Delete -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="confirmDelete(item.id)">
                      <v-icon dark v-bind="attrs" v-on="on">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar</span>
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
          <span class="headline">Crear Categoria</span>
        </v-card-title>
        <v-form @submit.prevent="createCategory">
          <v-card-text>
            <!-- INPUT -->
            <v-text-field
              outlined
              v-model="name"
              label="Nombre *"
              name="name"
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

    <!-- START MODAL EDI -->
    <v-dialog v-model="dialogEdit" persistent max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Crear Categoria</span>
        </v-card-title>
        <v-form @submit.prevent="editCategory">
          <v-card-text>
            <!-- INPUT -->
            <v-text-field
              outlined
              v-model="name"
              label="Nombre *"
              name="name"
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

    <!-- START MODAL DELETE -->
    <v-dialog v-model="dialogDelete" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Eliminar Categoria
        </v-card-title>

        <v-card-text>
          ¿Seguro de eliminar la categoria?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="deleteCategory()">
            Eliminar
          </v-btn>
          <v-btn color="green darken-1" text @click="dialogDelete = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END MODAL DELETE -->

    <!-- START SNACBAR -->
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
  name: "category",
  data() {
    return {
      listCategory: [
        {
          id: 1,
          name: "Sin Procesar",
          color: "primary",
        },
        {
          id: 2,
          name: "Procesado",
          color: "warning",
        },
        {
          id: 3,
          name: "Bitacora",
          color: "pink",
        },
      ],
      dialog: false,
      dialogEdit: false,
      dialogDelete: false,

      name: "",
      color: null,
      indexCategory: null,
      idCategory: null,
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
    create(){
      this.settingdata()
      this.dialog =true
    },
    createCategory() {
      console.log("crear");
      this.color = "secondary";

      if (this.validate(this.name, this.color)) {
        this.listCategory.push({
          id: Date.now(),
          name: this.name,
          color: this.color,
        });

        this.showSnackbar("Categoria Agregado", "primary");
      }
      this.settingdata();
    },
    confirmDelete(id) {
      this.idCategory = id;
      this.dialogDelete = true;
    },
    deleteCategory() {
      this.dialogDelete = false;
      this.listCategory = this.listCategory.filter(
        (element) => element.id != this.idCategory
      );
      this.showSnackbar("Categoria Eliminado", "orange darken-4");
    },
    edit(index) {
      this.name = this.listCategory[index].name;
      this.color = this.listCategory[index].color;
      this.indexCategory = index;
      this.dialogEdit = true;
    },
    editCategory() {
      if (this.validate(this.name, this.color)) {
        this.listCategory[this.indexCategory].name = this.name;
        this.listCategory[this.indexCategory].color = this.color;
        this.showSnackbar("Categoria Editado", "purple darken-1");
        this.settingdata();
      }
    },

    validate(name, color) {
      let validated = true;
      if (color === null && name.length == 0) {
        this.showSnackbar(
          "Los campos de nombre y color estan vacios",
          "red darken-1"
        );
        validated = false;
      } else if (name.length === 0) {
        this.showSnackbar(
          "El campo del nombre de la categoria esta vacio",
          "red darken-1"
        );
        validated = false;
      } else if (color === null) {
        this.showSnackbar("El color esta vacio", "red darken-1");
        validated = false;
      }
      return validated;
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.state = true;
    },
    settingdata() {
      this.name = "";
      this.color = null;
      this.indexCategory = null;
      this.idCategory = null;
    },
  },
};
</script>
