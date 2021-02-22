<template>
  <div>
    <v-toolbar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>GEOCIMAT</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" clipped floating temporary app>
      <v-list>
        <v-list-item :to="{ name: 'Home' }">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>INICIO</v-list-item-title>
        </v-list-item>

        <v-list-item :to="{ name: 'ProjectForm' }">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Crear Proyecto</v-list-item-title>
        </v-list-item>

        <v-list-group no-action v-if="listOfProjects.length">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Listado Proyectos</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            link
            v-for="project in listOfProjects"
            :key="project.id"
            :to="{
              name: 'ProjectDetail',
              params: { id: project.identificador },
            }"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-title v-bind="attrs" v-on="on">
                  {{ project.nombre }}
                </v-list-item-title>
              </template>
              <span>
                {{ project.nombre }}
              </span>
            </v-tooltip>
          </v-list-item>
        </v-list-group>

        <v-list-group no-action v-if="admin">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Administraci&oacute;n</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="list in listAdmin"
            :key="list.id"
            :to="{ name: list.path }"
          >
            <v-list-item-title>
              {{ list.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { getInfoUser } from "@/lib/toolbar";

export default {
  name: "Toolbar",

  data() {
    return {
      listOfProjects: [],
      listAdmin: [
        { id: 1, name: "Permisos", path: "ManagmentPermits" },
        { id: 2, name: "Clasificación", path: "ManagmentClassification" },
        { id: 3, name: "Estado Visita", path: "ManagmentVisitingState" },
      ],
      drawer: false,
      selectedOption: 0,
      admin: false,
      on: true,
      attrs: {},
    };
  },

  watch: {
    drawer(val) {
      if (val) {
        this.setInfoUser();
      }
    },
  },

  created() {
    this.setInfoUser();
  },

  methods: {
    setInfoUser() {
      getInfoUser()
        .then((result) => {
          this.listOfProjects = result.proyectos;
          this.admin = result.permisos[0].admin_panel;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
