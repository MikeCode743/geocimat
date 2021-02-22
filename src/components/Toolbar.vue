<template>
  <div>
    <v-toolbar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>GEOCIMAT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" temporary Left>
      <v-list>
        <v-list-item-group>
          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>INICIO</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'ProjectForm' }">
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Crear Proyecto</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group no-action>
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

          <v-list-group value="false" no-action>
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
        </v-list-item-group>
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
        { id: 2, name: "Clasificacion", path: "ManagmentClassification" },
        { id: 3, name: "Permisos", path: "ManagmentPermits" },
        { id: 4, name: "Estado Visita", path: "ManagmentVisitingState" },
      ],
      drawer: false,
      admin: false,
      on: true,
      attrs: {},
    };
  },
  created() {
    this.setInfoUser();
  },
  methods: {
    setInfoUser() {
      getInfoUser()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
