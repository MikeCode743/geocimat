<template>
  <v-app>
    <v-main fluid>
      <ToolbarComponent />
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import ToolbarComponent from "./components/Layouts/Toolbar";


export default {
  name: "App",

  components: {
    HelloWorld,
    ToolbarComponent,
  },

  data: () => ({
    //
  }),
};
</script>
