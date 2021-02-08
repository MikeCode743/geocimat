<template>
  <div id="app">
    <v-app id="inspire">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="indigo"
            dark
            v-bind="attrs"
            v-on="on"
            class="my-5 col-2"
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
            <v-btn color="primary" text @click="createFolder"> Aceptar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-treeview
        v-model="tree"
        :open="initiallyOpen"
        :items="items"
        activatable
        item-key="name"
        open-on-click
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.file">
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else>
            {{ files[item.file] }}
          </v-icon>
        </template>
      </v-treeview>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "RepositoryTreeView",

  data: () => ({
    folderName: "",
    dialog: false,
    initiallyOpen: ["public"],
    files: {
      html: "mdi-language-html5",
      js: "mdi-nodejs",
      json: "mdi-code-json",
      md: "mdi-language-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel",
      jpg: "mdi-file-image",
    },
    tree: [],
    items: [
      {
        name: ".git",
      },
      {
        name: "node_modules",
      },
      {
        name: "public",
        children: [
          {
            name: "static",
            children: [
              {
                name: "Electricidad",
                children: [
                  {
                    name: "logoGEO.png",
                    file: "png",
                  },
                ],
              },
              {
                name: "logo.png",
                file: "png",
              },
            ],
          },
          {
            name: "favicon.ico",
            file: "png",
          },
          {
            name: "index.html",
            file: "html",
          },
        ],
      },
      {
        name: ".gitignore",
        file: "txt",
      },
      {
        name: "yarn.lock",
        file: "txt",
      },
    ],
  }),

  methods: {
    createFolder() {
      if (this.folderName) {
        if (this.folderName === "imagenes") {
          this.items = [
            ...this.items,
            {
              name: "imagenes",
              children: [
                {
                  name: "image1.png",
                  file: "png",
                },
                {
                  name: "image2.jpg",
                  file: "jpg",
                },
              ],
            },
          ];
          this.folderName = "";
          this.dialog = false;
          return;
        }
        this.items = [...this.items, { name: this.folderName }];
        this.folderName = "";
        this.dialog = false;
      }
    },
  },
};
</script>