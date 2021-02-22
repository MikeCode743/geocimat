<template>
  <div>
    <v-row class="my-5 mx-1">
      <v-chip color="secondary" label text-color="white">
        <h3>
          {{ $route.params.id }}
        </h3>
        <v-icon right> mdi-text-box-plus </v-icon>
      </v-chip>
    </v-row>
    <v-toolbar>
      <v-tabs dark background-color="primary" grow v-model="tab">
        <v-tab>Repositorio</v-tab>
        <v-tab>Galería</v-tab>
        <v-tab>Información</v-tab>
      </v-tabs>
    </v-toolbar>

    <v-col v-if="tab === 0">
      <RepositoryTreeView
        v-bind:showAlert="showAlert"
        v-bind:setGalery="setGalery"
      />
    </v-col>

    <v-card class="pa-2 mt-2" v-if="tab === 1">
      <v-btn-toggle>
        <v-btn small @click="sizeCols--">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn small @click="sizeCols++">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-row class="mt-1">
        <v-col
          v-for="picture in galeryList"
          :key="picture.id"
          class="d-flex child-flex"
          :cols="sizeColsLimit"
        >
          <v-img
            :src="picture.url"
            :lazy-src="picture.url"
            aspect-ratio="1"
            class="grey lighten-2"
            alt="picture.name"
            @click="openImage(picture)"
            :style="{ cursor: 'pointer' }"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mx-auto my-12" max-width="500" v-if="tab === 2">
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img
        height="500"
        :src="dataProject.url"
        :lazy-src="dataProject.url"
        aspect-ratio="1"
        class="grey lighten-2"
        alt="picture.name"
      ></v-img>

      <v-card-title>Nombre del Proyecto: {{ projectData }} </v-card-title>
      <v-card-text>
        <v-chip>Categoria</v-chip>
      </v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-title>Descripción</v-card-title>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="4000"
      :color="snackbar.color"
      left
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import RepositoryTreeView from "@/views/project/RepositoryTreeView";

export default {
  components: {
    RepositoryTreeView,
  },

  data() {
    return {
      snackbar: {
        show: false,
        text: "",
        color: "",
      },

      idProject: "",
      tab: 0,
      sizeCols: 2,
      galeryList: [],

      dataProject: {
        url:
          "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/-89.229461,14.187164,13.58,0/500x500?access_token=pk.eyJ1Ijoia2VybmVsNTAzIiwiYSI6ImNrZHA5cmhiYTIwamgyeXBkOTgyZmU1cmkifQ.bK_Wbz4134Uf33qBDGklKg",
      },
    };
  },

  computed: {
    sizeColsLimit() {
      if (this.sizeCols <= 1) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sizeCols = 1;
      }
      if (this.sizeCols >= 12) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sizeCols = 12;
      }
      return this.sizeCols;
    },

    projectData() {
      return (this.idProject = this.$route.params.id);
    },
  },

  created() {},

  methods: {
    showAlert(data) {
      this.snackbar = { ...data };
    },

    setGalery(list) {
      this.galeryList = [...list];
    },

    openImage({ url }) {
      window.open(url, "_blank");
    },
  },
};
</script>
