<template>
  <v-container fluid>
    <v-chip class="mb-5" color="secondary" label text-color="white">
      Crear Proyecto.
      <v-icon right> mdi-text-box-plus </v-icon>
    </v-chip>
    <v-form
      ref="form"
      v-model="validForm"
      @submit.prevent="submitForm"
      lazy-validation
    >
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.projectName"
            :rules="rules.requiredInputField"
            label="Nombre del proyecto"
            required
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="form.clasification"
            :rules="rules.requiredSelectField"
            :items="clasifications"
            item-text="nombre"
            item-value="id"
            label="Clasificación del proyecto"
            outlined
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.longitude"
            :rules="rules.numberLongitudeField"
            label="Longitud"
            append-icon="mdi-map-marker"
            required
            outlined
            @keyup="onChangeLngLat"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="form.latitude"
            :rules="rules.numberLatitudeField"
            label="Latitud"
            append-icon="mdi-map-marker"
            outlined
            @keyup="onChangeLngLat"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="d-flex" justify="center" :style="{ height: '650px' }">
        <MglMap
          :accessToken="accessToken"
          :mapStyle="mapStyle"
          :center="coordinateMap"
          :zoom="zoomMap"
          :speed="1"
          @click="setMarker"
          @load="onMapLoaded"
        >
          <MglMarker :showed="showMarker" :coordinates="coordinatePopUp" />
          <div class="mapboxgl-control-container">
            <div
              class="mapboxgl-ctrl-top-left"
              :style="{
                width: '45%',
              }"
            >
              <div
                class="mapboxgl-ctrl mapboxgl-ctrl-group"
                :style="{
                  width: '100%',
                }"
              >
                <v-autocomplete
                  v-model="selectedPlace"
                  :search-input.sync="search"
                  :items="places"
                  :loading="isLoading"
                  item-text="place_name"
                  item-value="id"
                  class="pa-3"
                  flat
                  hide-details
                  label="Buscar"
                  clearable
                ></v-autocomplete>
              </div>
            </div>
          </div>
        </MglMap>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="12" sm="12">
          <v-textarea
            @keyup.prevent
            :rules="rules.textAreaField"
            v-model="form.description"
            label="Descripción del proyecto"
            rows="2"
            value=""
            counter
            maxlength="25"
            outlined
          ></v-textarea>
        </v-col>
      </v-row>

      <v-btn color="grey lighten-2" @click="cleanForm" class="mr-4">
        Limpiar Formulario
      </v-btn>
      <v-btn color="indigo" class="mr-4" @click="submitForm" dark>
        Registrar Proyecto
      </v-btn>
    </v-form>
    <v-snackbar
      v-model="snackbar.visible"
      :timeout="3000"
      :color="snackbar.color"
      left
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.visible = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import "../../assets/mapbox-gl.css";
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker, MglNavigationControl } from "vue-mapbox";

import axios from "axios";

const defaultForm = Object.freeze({
  projectName: "",
  clasification: "",
  longitude: "",
  latitude: "",
  description: "",
});

export default {
  name: "ProjectForm",

  components: {
    MglMap,
    MglMarker,
    MglNavigationControl,
  },

  created() {
    this.getClassification();
    this.mapbox = Mapbox;
  },

  data() {
    return {
      accessToken:
        "pk.eyJ1Ijoia2VybmVsNTAzIiwiYSI6ImNrZHA5cmhiYTIwamgyeXBkOTgyZmU1cmkifQ.bK_Wbz4134Uf33qBDGklKg",
      mapStyle: "mapbox://styles/mapbox/satellite-streets-v11",
      coordinateMap: [-88.85, 13.82],
      zoomMap: 8,

      mapbox: null,
      selectedPlace: null,
      isLoading: false,
      search: null,
      places: [],

      showMarker: false,
      coordinatePopUp: [0, 0],
      mapEvent: null,

      items: [
        { value: "Programming", id: 1 },
        { value: "Design", id: 2 },
        { value: "Vue", id: 3 },
        { value: "Vuetify", id: 4 },
      ],

      clasifications: [],

      snackbar: {
        visible: false,
        text: "",
        color:"",
      },

      validForm: true,

      form: { ...defaultForm },

      rules: {
        requiredInputField: [
          (value) => !!value || "Este campo es requerido.",
          (value) =>
            value.length <= 255 ||
            "El nombre del proyecto no puede tener más de 255 caracteres.",
        ],

        requiredSelectField: [(value) => !!value || "Este campo es requerido."],

        textAreaField: [
          (value) =>
            value.length <= 255 ||
            "El nombre del proyecto no puede tener más de 255 caracteres.",
        ],

        numberLongitudeField: [
          (value) =>
            parseFloat(value) == value || "Este campo debe ser un número.",
          (value) =>
            (parseFloat(value) <= 180 && parseFloat(value) >= -180) ||
            "Rango valido -180 a 180.",
        ],

        numberLatitudeField: [
          (value) =>
            parseFloat(value) == value || "Este campo debe ser un número.",
          (value) =>
            (parseFloat(value) <= 90 && parseFloat(value) >= -90) ||
            "Rango valido -90 a 90.",
        ],
      },
    };
  },

  watch: {
    async selectedPlace(val) {
      if (val) {
        const {
          center: [lng, lat],
        } = this.places.find((element) => {
          if (element.id === val) {
            return element;
          }
        });
        this.coordinatePopUp = [lng, lat];
        this.form.longitude = lng.toFixed(6);
        this.form.latitude = lat.toFixed(6);
        this.showMarker = true;
        const asyncActions = this.mapEvent.component.actions;
        await asyncActions.flyTo({
          center: this.coordinatePopUp,
          zoom: 15,
          speed: 0.8,
        });
      } else {
        this.showMarker = false;
      }
    },

    search(val) {
      if (val) {
        this.isLoading = true;
        const urlBase = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?limit=5&access_token=pk.eyJ1Ijoia2VybmVsNTAzIiwiYSI6ImNrZHA5cmhiYTIwamgyeXBkOTgyZmU1cmkifQ.bK_Wbz4134Uf33qBDGklKg`;
        fetch(new URL(urlBase))
          .then((res) => res.clone().json())
          .then((res) => {
            console.log(res.features);
            this.places = res.features;
          })
          .catch((err) => {
            this.places = [];
            console.log(err);
          })
          .finally(() => (this.isLoading = false));
      } else {
        this.places = [];
      }
    },
  },

  methods: {
    async getClassification() {
      var self = this;
      axios
        .get("http://localhost:8000/geocimat/clasificacion/")
        .then(function(response) {
          // handle success
          console.log(response.data.clasificaciones);
          self.clasifications = response.data.clasificaciones;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },

    cleanForm() {
      this.$refs.form.resetValidation();
      this.form = { ...defaultForm };
      this.showMarker = false;
    },

    async submitForm() {
      const validForm = this.$refs.form.validate();
      if (!validForm) {
        this.snackbar = {
          visible: true,
          text: "Debe completar el formulario.",
          color: "red"
        };
        return;
      }
      console.log(this.form);
      var self = this
      await axios
        .post("http://localhost:8000/geocimat/proyecto/crear", {
          nombre: self.form.projectName,
          id_clasificacion: self.form.clasification,
          longitud: self.form.longitude,
          latitud: self.form.latitude,
          descripcion:self.form.description
        })
        .then(function(response) {
          console.log(response);
          self.cleanForm()
          self.snackbar = {
            visible: true,
            text: response.data.message,
            color:"blue"
          }
        })
        .catch(function(error) {
          console.log(error);
          self.cleanForm()
          self.snackbar = {
            visible: true,
            text: response.data.message
          }
        });
    },

    onMapLoaded(e) {
      this.mapEvent = e;
      this.loadingMap = false;
    },

    async setMarker(e) {
      const [lng, lat] = Object.values(e.mapboxEvent.lngLat.wrap());
      this.coordinatePopUp = [lng, lat];
      this.form.longitude = lng.toFixed(6);
      this.form.latitude = lat.toFixed(6);
      this.showMarker = true;
      const asyncActions = e.component.actions;
      await asyncActions.flyTo({
        center: [lng, lat],
        zoom: 15,
        speed: 0.8,
      });
    },

    async onChangeLngLat() {
      if (+this.form.latitude && +this.form.longitude && this.validForm) {
        this.coordinatePopUp = [+this.form.longitude, +this.form.latitude];
        this.showMarker = true;
        const asyncActions = this.mapEvent.component.actions;
        await asyncActions.flyTo({
          center: this.coordinatePopUp,
          zoom: 15,
          speed: 0.8,
        });
      }

      if (!this.validForm) {
        this.showMarker = false;
      }
    },
  },
};
</script>
