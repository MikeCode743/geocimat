<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-autocomplete
          v-model="formData.colorSelected"
          :items="materialColorAvailable"
          chips
          label="Seleccionar Color"
        >
          <template v-slot:selection="data">
            <v-chip :color="data.item" dark>
              {{ data.item }}
            </v-chip>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MaterialColorPicker",

  props: {
    formData: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    materialColorAvailable: [
      "red",
      "pink",
      "purple",
      "indigo",
      "blue",
      "deep-purple",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey",
      "grey",
    ],
  }),
};
</script>
