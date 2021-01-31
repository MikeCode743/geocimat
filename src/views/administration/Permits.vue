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
    <v-row>
      <v-col cols="8" offset="2">
        <template>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(item, index) in listPermits"
              :key="index"
            >
              <v-expansion-panel-header>
                {{ item.username }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <!-- Listado Completo -->
                <v-switch
                  label="Listado Completo"
                  :input-value="item.listado_completo"
                  @change="(value) => changeState(value, index, 1)"
                ></v-switch>
                <!-- Panel de administracion -->
                <v-switch
                  label="Panel de administracion"
                  :input-value="item.panel_administrativo"
                  @change="(value) => changeState(value, index, 2)"
                ></v-switch>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </v-col>
    </v-row>
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
  methods: {
    changeState(value, index, opcion) {
      switch (opcion) {
        case 1:
          this.listPermits[index].listado_completo = value;
          this.showSnackbar(
            "Permiso Actualizado - Listados Completos",
            "success"
          );
          break;
        case 2:
          this.listPermits[index].panel_administrativo = value;
          this.showSnackbar(
            "Permiso Actualizado - Panel Administrativo",
            "success"
          );
          break;

        default:
          break;
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.state = true;
    },
  },
};
</script>
