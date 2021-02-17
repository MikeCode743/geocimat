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
        <v-tab>Información</v-tab>
        <v-tab>Repositorio</v-tab>
      </v-tabs>
    </v-toolbar>

    <v-card class="mt-2" v-if="tab === 0">
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
            <v-file-input
              class="mt-8"
              clearable
              counter
              multiple
              show-size
              truncate-length="15"
              v-model="files"
              @change="fileUpload"
            >
            </v-file-input>
          </v-toolbar>
        </template>
        <template v-slot:[`item.delete`]="{ item }">
          <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:[`item.download`]="{ item }">
          <v-icon @click="downloadFile(item)"> mdi-download</v-icon>
        </template>
      </v-data-table>
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

    <v-row class="mx-auto" v-if="tab === 3">
      <v-col>
        <RepositoryTreeView v-bind:showAlert="showAlert" />
      </v-col>
    </v-row>

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
import RepositoryTreeView from "@/views/Project/RepositoryTreeView";

async function fetchFiles() {
  const response = await fetch(
    "https://aldebaran-wallet.herokuapp.com/aldebaran/bucket"
  );
  const files = await response.json();
  return files;
}
export default {
  name: "TestContainer",

  components: {
    RepositoryTreeView,
  },

  data() {
    return {
      files: [],
      snackbar: {
        show: false,
        text: "",
        color: "",
      },
      idProject: "",
      tab: 3,
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
        url.match(/.jpg|.gif|.jpeg|.png$/g)
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
      fetchFiles().then((files) => (this.fileList = files));
    },

    showAlert(data) {
      this.snackbar = { ...data };
    },

    fileUpload() {
      if (this.files.length) {
        let formData = new FormData();
        for (let file of this.files) {
          formData.append("uploadFile", file, file.name);
        }
        fetch("https://aldebaran-wallet.herokuapp.com/aldebaran/bucket", {
          method: "POST",
          body: formData,
        }).then((response) => {
          if (response.ok) {
            this.snackbar = {
              show: true,
              text: `Se ha subido ${this.files.length} elemento.`,
              color: "",
            };
            fetchFiles().then((files) => (this.fileList = files));
          } else {
            this.snackbar = {
              visible: true,
              text: "Ocurrio un error inesperado!",
              color: "red darken-1",
            };
          }
          this.files = [];
        });
      }
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
      console.log("se eliminó", this.currentFile);
      fetch("https://aldebaran-wallet.herokuapp.com/aldebaran/bucket", {
        method: "DELETE",
        headers: { deletefile: this.currentFile.name },
      }).then((response) => {
        if (response.ok) {
          this.snackbar = {
            show: true,
            text: "Elemento eliminado.",
            color: "",
          };
          fetchFiles().then((files) => (this.fileList = files));
        } else {
          this.snackbar = {
            show: true,
            text: "Ocurrio un error inesperado!",
            color: "red darken-1",
          };
        }
        this.files = [];
      });
      this.dialogDelete = false;
    },
  },
};
</script>
