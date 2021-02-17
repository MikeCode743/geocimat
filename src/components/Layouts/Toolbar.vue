<template>
  <div>
    <!-- NAVBAR -->
    <v-toolbar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>GEOCIMAT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- DRAWER -->
    <v-navigation-drawer app v-model="drawer" temporary Left>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>MIKE H</v-list-item-title>
            <v-list-item-subtitle>Mike@email.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group>
          <!-- INICIO -->
          <v-list-item :to="{ name: 'Home' }">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>INICIO</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- FORMULARIO DE PROYECTO -->
          <v-list-item :to="{ name: 'ProjectForm' }">
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Crear Proyecto</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- LISTATO DE PROYECTOS -->

          <v-list-group :value="false" no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Listado Proyectos</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              link
              v-for="project in listOfProjects"
              :key="project.id"
              :to="{ name: 'ProjectDetail', params: { id: project.name } }"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item-title v-bind="attrs" v-on="on">
                    {{ project.name }}
                  </v-list-item-title>
                </template>
                <span>
                  {{ project.name }}
                </span>
              </v-tooltip>
            </v-list-item>
          </v-list-group>

          <!-- ADMINISTRACION -->

          <v-list-group :value="false" no-action>
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
export default {
  name: "Toolbar",
  data() {
    return {
      listOfProjects: [
        { id: 1, name: "proyecto-a1" },
        { id: 2, name: "Lorem Lorem" },
        { id: 3, name: "Praesentium accusantium" },
      ],
      listAdmin: [
        { id: 1, name: "Categoria", path: "ManagmentCategory" },
        { id: 2, name: "Clasificacion", path: "ManagmentClassification" },
        { id: 3, name: "Permisos", path: "ManagmentPermits" },
        { id: 4, name: "Estado Visita", path: "ManagmentVisitingState" },
      ],
      drawer: false,
      admin: false,
      /* Tooltip */
      on: true,
      attrs: {},
    };
  },
};
</script>
