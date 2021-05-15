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
import ToolbarComponent from "./components/Toolbar";

export default {
  name: "App",
  components: {
    ToolbarComponent,
  },
};
</script>
