<template>
  <div>
    <v-row class="my-5 mx-1">
      <v-chip class="mb-5" color="secondary" label text-color="white">
        <h3>
          Permisos
        </h3>
        <v-icon right>
          mdi-text-box-plus
        </v-icon>
      </v-chip>
    </v-row>
    <!-- START CONTENT -->
        <template>
          <div>
            <v-data-table
              :headers="headers"
              :items="listPermits"
              item-key="item.id"
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="search"
                  label="Buscar (SÓLO MAYÚSCULAS)"
                  class="mx-4"
                  prepend-inner-icon="mdi-account-search"
                ></v-text-field>
              </template>
              <template v-slot:[`item.listado_completo`]="{ item }">
                <v-switch
                  :input-value="item.listado_completo"
                  @change="(value) => changeState(value, item.id, 1)"
                ></v-switch>
              </template>
              <template v-slot:[`item.panel_administrativo`]="{ item }">
                <v-switch
                  :input-value="item.panel_administrativo"
                  @change="(value) => changeState(value, item.id, 2)"
                ></v-switch>
              </template>
            </v-data-table>
          </div>
        </template>
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
  name: "Permits",
  data() {
    return {
      listPermits: [
        {
          id: 1,
          username: "Carol Sholl",
          listado_completo: true,
          panel_administrativo: true,
        },
        {
          id: 2,
          username: "Eydie Skully",
          listado_completo: false,
          panel_administrativo: true,
        },
        {
          id: 3,
          username: "Gabriello Gillbee",
          listado_completo: false,
          panel_administrativo: false,
        },
        {
          id: 4,
          username: "Raye Morgan",
          listado_completo: false,
          panel_administrativo: false,
        },
        {
          id: 5,
          username: "Valery Monday",
          listado_completo: true,
          panel_administrativo: false,
        },
      ],

      search: "",
      //new permits:
      permits: {},
      //Dialog
      dialog: false,
      name: "",
      state: false,
      /* Snackbar */
      snackbar: {
        state: false,
        message: "",
        color: "",
      },
      attrs: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "Usuarios",
          align: "start",
          value: "username",
        },
        {
          text: "Listados Completos",
          value: "listado_completo",
          align: "start",
          sortable: false,
        },
        {
          text: "Panel Administrativo",
          value: "panel_administrativo",
          align: "start",
          sortable: false,
        },
      ];
    },
  },
  methods: {
    changeState(value, id, opcion) {
      switch (opcion) {
        case 1:
          this.showSnackbar(
            "Permiso Actualizado - Listados Completos",
            "success"
          );
          break;
        case 2:
          this.showSnackbar(
            "Permiso Actualizado - Panel Administrativo",
            "success"
          );
          break;

        default:
          break;
      }
    },
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value
          .toString()
          .toLocaleUpperCase()
          .indexOf(search) !== -1
      );
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.state = true;
    },
  },
};
</script>
