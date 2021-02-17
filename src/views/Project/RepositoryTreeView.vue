<template>
  <div id="inspire" v-if="showComponent">
    <v-row>
      <v-col col="6" lg="6">
        <v-file-input
          v-show="false"
          ref="image"
          class="mt-2"
          clearable
          counter
          multiple
          show-size
          truncate-length="15"
          v-model="filesUpload"
        >
        </v-file-input>
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
        <v-icon @click="uploadItem(item)" v-if="item.mime === 'folder'">
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
} from "../../lib/treeViewApi";

export default {
  name: "RepositoryTreeView",
  props: { showAlert: Function },
  data: () => ({
    id_proyecto: "",
    showComponent: true,
    folderName: "",
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
          this.showComponent = true;
          console.log(result);
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

    downloadItem({ ruta }) {
      window.open(
        window.location.origin + "/storage/app/public/" + ruta,
        "_blank"
      );
      this.tree = [];
    },

    uploadItem(item) {
      this.$refs.image.$refs.input.click();
      if (this.filesUpload) {
        console.log(item);
        return;
      }
      console.log("no debe subir");
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