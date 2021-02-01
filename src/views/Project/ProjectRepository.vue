<template>
  <div>
    <v-row class="my-5 mx-1">
      <v-chip color="secondary" label text-color="white">
        <h3>
          {{ $route.params.id }}
        </h3>
        <v-icon right>
          mdi-text-box-plus
        </v-icon>
      </v-chip>
    </v-row>
    <v-toolbar>
      <v-tabs dark background-color="primary" grow v-model="tab">
        <v-tab>
          <v-badge v-if="numberOfFiles === 0" color="pink" dot>
            Mis Archivos
          </v-badge>
          <v-badge v-else color="pink" :content="numberOfFiles">
            Mis Archivos
          </v-badge>
        </v-tab>
        <v-tab>
          <v-badge v-if="listImages.length === 0" color="pink" dot>
            Galería
          </v-badge>
          <v-badge v-else color="pink" :content="listImages.length">
            Galería
          </v-badge>
        </v-tab>
        <v-tab> Información</v-tab>
      </v-tabs>
    </v-toolbar>

    <v-card class="mt-2" v-if="tab === 0">
      <!-- START TABLE -->
      <v-data-table
        :headers="headers"
        :items="fileList"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              label="Buscar archivo"
              class="mx-4 mt-8"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2"> Agregar Archivo </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.delete`]="{ item }">
          <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:[`item.download`]="{ item }">
          <v-icon @click="downloadFile(item)"> mdi-download</v-icon>
        </template>
      </v-data-table>
      <!-- END TABLE -->
    </v-card>

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
          v-for="picture in listImages"
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
            @click="downloadFile(picture)"
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

    <!-- START MODAL DELETE -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ deleteFileText }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteItemConfirm">
            Aceptar
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialogDelete = false">
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END MODAL -->
  </div>
</template>

<script>
export default {
  name: "TestContainer",

  data() {
    return {
      idProject: "",
      tab: 0,
      sizeCols: 4,
      currentFile: {},
      dialogDelete: false,
      deleteFileText: "",
      search: "",
      headers: [
        {
          text: "Nombre del archivo",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Agregado",
          value: "fecha",
          sortable: false,
          align: "start",
        },
        {
          text: "Eliminar",
          value: "delete",
          sortable: false,
          align: "start",
        },
        {
          text: "Descargar",
          value: "download",
          sortable: false,
          align: "start",
        },
      ],
      fileList: [],
      dataProject: {
        url:
          "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/-89.229461,14.187164,13.58,0/500x500?access_token=pk.eyJ1Ijoia2VybmVsNTAzIiwiYSI6ImNrZHA5cmhiYTIwamgyeXBkOTgyZmU1cmkifQ.bK_Wbz4134Uf33qBDGklKg",
      },
    };
  },

  computed: {
    numberOfFiles() {
      return this.fileList.length;
    },

    listImages() {
      return this.fileList.filter(({ url }) =>
        url.match(/.jpg|.gif|.jpg|.png$/g)
      );
    },

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

  created() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.fileList = [
        {
          id: 4,
          name: "img-2315156",
          url:
            "https://scontent.fsal3-1.fna.fbcdn.net/v/t1.0-9/p720x720/131240728_2788875551369499_2981392738860932908_o.jpg?_nc_cat=101&ccb=2&_nc_sid=8024bb&_nc_ohc=UlpT40m-K5UAX9SqK-r&_nc_ht=scontent.fsal3-1.fna&tp=6&oh=88daee9e18478c9787f91b4d66d01ce7&oe=60337C40",
          type: "application/txt",
          fecha: "14 enero",
        },
        {
          id: 1,
          name: "Lorem PDF",
          url:
            "http://sostenible.palencia.uva.es/sites/default/files/page/attach/lorem_ipsum_definicion.pdf",
          type: "application/pdf",
          fecha: "25 nov",
        },

        {
          id: 6,
          name: "img-2315156",
          url:
            "https://scontent.fsal3-1.fna.fbcdn.net/v/t1.0-9/p720x720/131026889_2788876218036099_4275757041026208604_o.jpg?_nc_cat=107&ccb=2&_nc_sid=8024bb&_nc_ohc=l13pYd-UARkAX9bTq8R&_nc_ht=scontent.fsal3-1.fna&tp=6&oh=495cc632eb81a39934b92d74c1faf682&oe=60323F46",
          type: "application/txt",
          fecha: "14 enero",
        },
        {
          id: 3,
          name: "img-232646",
          url:
            "https://upload.wikimedia.org/wikipedia/commons/3/30/Soil_sci.jpg",
          type: "application/txt",
          fecha: "14 enero",
        },
        {
          id: 2,
          name: "Lorem TXT",
          url:
            "http://sostenible.palencia.uva.es/sites/default/files/page/attach/lorem_ipsum_definicion.pdf",
          type: "application/txt",
          fecha: "1 enero",
        },
        {
          id: 5,
          name: "img-2315156",
          url:
            "https://scontent.fsal3-1.fna.fbcdn.net/v/t1.0-9/p720x720/130556123_2788875524702835_5844192377225161249_o.jpg?_nc_cat=102&ccb=2&_nc_sid=8024bb&_nc_ohc=ur3xDnYlcrIAX_QcmFs&_nc_ht=scontent.fsal3-1.fna&tp=6&oh=00861292ce887cc1176776503e04f057&oe=603433EB",
          type: "application/txt",
          fecha: "14 enero",
        },
      ];
    },

    downloadFile(i) {
      window.open(i.url, "_blank");
    },

    deleteItem(i) {
      this.dialogDelete = true;
      this.deleteFileText = `¿Desea eliminar el archivo ${i.name}?`;
      this.currentFile = i;
    },

    deleteItemConfirm() {
      console.log("se elimino", this.currentFile);
      this.dialogDelete = false;
    },
  },
};
</script>
