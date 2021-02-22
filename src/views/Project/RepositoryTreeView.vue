<template>
  <div id="inspire" v-if="showComponent">
    <v-row class="mt-2">
      <v-col col="6" lg="6" v-show="false">
        <v-file-input
          v-model="filesUpload"
          ref="image"
          class="mt-2"
          clearable
          counter
          multiple
          show-size
          truncate-length="15"
          @change="upload"
        >
        </v-file-input>
      </v-col>
      <v-col v-if="uploading">
        <v-progress-circular
          :width="3"
          color="indigo"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="indigo"
          dark
          v-bind="attrs"
          v-on="on"
          class="my-5 col-4 col-lg-2 col-md-2 col-sm-4"
        >
          Crear Carpeta
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Nueva Carpeta
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12" class="mt-3">
              <v-text-field
                label="Nombre de la carpeta"
                v-model="folderName"
                @keypress.enter="createFolder"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="dialog = false"> Cancelar </v-btn>
          <v-btn
            color="primary"
            text
            @click="createFolder"
            :disabled="!folderName"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template v-if="tree.length">
      <v-scroll-x-transition>
        <v-slide-x-transition>
          <v-btn color="red" dark class="my-5 ml-2" @click="removeItem">
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </v-slide-x-transition>
      </v-scroll-x-transition>
    </template>

    <v-treeview
      selectable
      selected-color="indigo"
      v-model="tree"
      :open="initiallyOpen"
      :items="items"
      item-key="ruta"
      activatable
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="item.mime === 'folder'">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.mime] }}
        </v-icon>
      </template>

      <template v-slot:append="{ item }">
        <v-icon @click="uploadItemClick(item)" v-if="item.mime === 'folder'">
          mdi-upload
        </v-icon>
        <v-icon @click="downloadItem(item)" v-else color="indigo">
          mdi-download
        </v-icon>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import {
  getDirectory,
  createFolder,
  deleteElement,
  uploadElement,
} from "@/lib/tree-view";

export default {
  name: "RepositoryTreeView",

  props: {
    showAlert: Function,
    setGalery: Function,
  },

  data: () => ({
    id_proyecto: "",
    uploading: false,
    showComponent: false,
    folderName: "",
    path: "",
    dialog: false,
    filesUpload: [],
    initiallyOpen: ["public"],
    files: {
      "text/html": "mdi-language-html5",
      "application/pdf": "mdi-file-pdf",
      "image/jpeg": "mdi-file-image",
      "image/png": "mdi-file-image",
      "application/javascript": "mdi-language-javascript",
      json: "mdi-code-json",
      md: "mdi-language-markdown",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel",
    },
    tree: [],
    items: [],
  }),

  created() {
    this.id_proyecto = this.$route.params.id;
    this.setItems();
  },

  watch: {
    $route(to, from) {
      // console.log(to.params.id, from.params.id);
      this.id_proyecto = to.params.id;
      this.setItems();
    },
  },

  methods: {
    setItems() {
      getDirectory(this.id_proyecto)
        .then((result) => {
          this.items = result.directorio;
          this.setGalery(result.galeria);
          this.showComponent = true;
        })
        .catch((error) => {
          this.items = [];
          this.showAlert({ show: true, text: error, color: "red" });
          this.showComponent = false;
        });
    },

    removeItem() {
      deleteElement({
        data: {
          nodo: this.id_proyecto,
          elemento: this.tree,
        },
      })
        .then((result) => {
          this.setItems();
          this.showAlert({ show: true, text: result, color: "indigo" });
          this.tree = [];
        })
        .catch((error) => {
          this.showAlert({ show: true, text: error, color: "error" });
        });
    },

    downloadItem({ url }) {
      window.open(url, "_blank");
      this.tree = [];
    },

    uploadItemClick({ ruta }) {
      this.$refs.image.$refs.input.click();
      this.path = ruta;
    },

    upload() {
      if (this.filesUpload && this.path) {
        this.uploading = true;
        const formData = this.createFormData();
        uploadElement(formData)
          .then((result) => {
            this.showAlert({ show: true, text: result, color: "indigo" });
          })
          .catch((error) => {
            this.showAlert({ show: true, text: error, color: "error" });
          })
          .then(() => {
            this.setItems();
            this.filesUpload = [];
            this.path = "";
            this.uploading = false;
          });
      }
    },

    createFormData() {
      let formData = new FormData();
      formData.append("id", this.id_proyecto);
      formData.append("directorio", this.path);
      this.filesUpload.forEach((file) => {
        formData.append("archivos[]", file);
      });
      return formData;
    },

    createFolder() {
      if (this.folderName) {
        createFolder({
          nodoPadre: this.id_proyecto,
          folder: this.folderName,
        })
          .then((result) => {
            this.setItems();
            this.showAlert({ show: true, text: result, color: "indigo" });
            this.folderName = "";
            this.dialog = false;
          })
          .catch((error) => {
            this.showAlert({ show: true, text: error, color: "error" });
          });
      }
    },
  },
};
</script>