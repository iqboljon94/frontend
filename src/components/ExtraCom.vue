<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="employees"
      class="elevation-1"
      :single-expand="true"
      show-expand
      :loading="loading"
      :search="search"
      hide-default-header
      @item-expanded="getRelatives"
      :options.sync="dataTableOptions"
      :server-items-length="server_items_length"
      :disable-pagination="true"
      :footer-props="{
        itemsPerPageText: 'Sahifadagi yozuvlar soni',
        itemsPerPageOptions: [10, 50, 100],
        showFirstLastPage: true,
      }"
      @update:page="updatePage"
      @update:items-per-page="updatePerPage"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Hodimlar ro'yxati</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="filter.content"
            append-icon="mdi-magnify"
            label="Izlash"
            single-line
            hide-details
            dense
            @keyup.native.enter="getFilter()"
          ></v-text-field>

          <v-spacer></v-spacer>
          <v-col cols="12" sm="6" md="3">
            <v-menu
              ref="dateMenu"
              :close-on-content-click="false"
              :return-value.sync="filter.date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filter.date"
                  label="Kunni tanlang"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                  clearable
                  @click:clear="clearDate()"
                >
                  ></v-text-field
                >
              </template>
              <v-date-picker v-model="date" no-title scrollable locale="ru-RU">
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dateMenu.isActive = false"
                >
                  Bekor qilish
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="
                    $refs.dateMenu.save(date);
                    filter.date = date;
                    getFilter();
                  "
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-btn color="primary" dark class="mb-2" @click="dialog = true">
            <v-icon class="mr-2">mdi-account-multiple-plus </v-icon> Yangi Hodim
            qo'shish
          </v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Ismi"
                        required
                        autofocus
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.lastname"
                        label="Familiyasi"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        v-model="empSelect"
                        :items="employees"
                        item-text="lastname"
                        item-value="lastname"
                        solo
                        label="Hodimni tanlang"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Bekor qilish
                </v-btn>
                <v-btn color="primary" text @click="save"> Saqlash </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Rostdan ham ushbu hodimni o'chirmoqchimisiz?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Bekor qilish</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >O'chirish</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #item.index="{ index }">{{ index + 1 }} </template>
      <template v-slot:expanded-item="{ headers, item }">
        <v-dialog v-model="dialogRelatives" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ relativeTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="editedItem.whois"
                      :items="whois"
                      item-text="text"
                      item-value="text"
                      solo
                      label="Qarindoshliligi"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Ismi"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.lastname"
                      label="Familiyasi"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Bekor qilish
              </v-btn>
              <v-btn color="primary" text @click="saveRelative(item)">
                Saqlash
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <td :colspan="headers.length" style="padding: 0">
          <v-simple-table>
            <template v-slot:default>
              <v-btn
                color="primary"
                dark
                class="mb-2 mt-2"
                @click="dialogRelatives = true"
              >
                <v-icon class="mr-2">mdi-account-multiple-plus </v-icon>
                Qarindosh qo'shish
              </v-btn>
              <tbody>
                <tr
                  v-for="(relative, index) in relatives"
                  :key="index"
                  @dblclick="editRelatives(relative)"
                >
                  <td>{{ relative.whois }}</td>
                  <td>{{ relative.name }}</td>
                  <td>{{ relative.lastname }}</td>
                  <td>
                    <v-icon small class="mr-2" @click="editRelatives(relative)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteRelatives(relative)">
                      mdi-delete
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td></template
      >

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>

      <template v-slot:body.prepend>
        <tr>
          <td></td>
          <td>Tartib</td>
          <td>
            <v-text-field
              v-model="filter.name"
              type="text"
              label="Ismi"
              @keyup.native.enter="getFilter()"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="filter.lastname"
              type="text"
              label="Familiyasi"
              @keyup.native.enter="getFilter()"
            ></v-text-field>
          </td>
          <td>Amallar</td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="loading" width="300" hide-overlay>
      <v-card color="primary" dark>
        <v-card-text>
          Yuklanmoqda
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "ExtraCom",
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    dialogRelatives: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    empSelect: {},
    loading: false,
    employees: [],
    relatives: [],
    filter: {
      name: "",
      lastname: "",
      content: "",
      date: "",
    },
    showFilter: false,
    headers: [
      {
        text: "Tartib",
        align: "left",
        sortable: false,
        value: "index",
      },
      {
        text: "Ismi",
        align: "left",
        sortable: false,
        value: "name",
      },
      {
        text: "Familiyasi",
        align: "left",
        sortable: false,
        value: "lastname",
      },
      { text: "Amallar", value: "actions", sortable: false },
    ],
    whois: [
      {
        text: "Otasi",
        align: "start",
        value: "otasi",
      },
      { text: "Onasi", value: "onasi" },
      { text: "Xotini", value: "xotini" },
    ],
    dataTableOptions: {
      page: 1,
      itemsPerPage: 10,
    },
    page: 1,
    server_items_length: -1,
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      lastname: "",
    },
    defaultItem: {
      id: "",
      name: "",
      lastname: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Yangi Hodim" : "Hodimni o`zgartirish";
    },
    relativeTitle() {
      return this.editedIndex === -1
        ? "Yangi Qarindosh"
        : "Qarindoshni o`zgartirish";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.getList();
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.employees.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    getList() {
      this.loading = true;
      this.axios
        .post("http://localhost:8000/api/empl", {
          pagination: this.dataTableOptions,
          filter: this.filter,
        })
        .then((response) => {
          this.employees = response.data.employees.data;
          this.server_items_length = response.data.employees.total;
          this.loading = false;
        });
    },
    clearDate() {
      this.filter.date = "";
      this.getFilter();
    },
    getFilter() {
      this.showFilter = true;
      this.getList();
    },
    updatePage() {
      this.getList();
    },
    updatePerPage() {
      this.getList();
    },
    deleteItem(item) {
      this.editedIndex = this.employees.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      if (this.editedIndex > -1) {
        this.axios
          .delete(
            `http://localhost:8000/api/empl/destroy/${this.editedItem.id}`
          )
          .then((response) => {
            console.log(response);
            this.getList();
          });
      } else {
        this.axios
          .delete(
            `http://localhost:8000/api/relatives/destroy/${this.editedItem.id}`
          )
          .then((response) => {
            console.log(response);
            this.getList();
          });
        this.closeDelete();
      }
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.dialogRelatives = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.clearSelect();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.clearSelect();
    },

    save() {
      if (this.editedIndex > -1) {
        this.axios
          .put(
            `http://localhost:8000/api/empl/update/${this.editedItem.id}`,
            this.editedItem
          )
          .then((response) => {
            console.log(response);
            this.getList();
            this.clearSelect();
          });
      } else {
        this.axios
          .post("http://localhost:8000/api/empl/post", this.editedItem)
          .then((response) => {
            console.log(response);
            this.getList();
            this.clearSelect();
          });
      }
      this.close();
    },
    getRelatives({ item }) {
      this.loading = true;
      this.axios
        .get(`http://localhost:8000/api/relatives/${item.id}`)
        .then((response) => {
          this.relatives = response.data;
          this.loading = false;
        });
    },
    editRelatives(item) {
      this.editedIndex = this.relatives.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogRelatives = true;
    },
    deleteRelatives(item) {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    saveRelative(item) {
      if (this.editedIndex > -1) {
        this.axios
          .put(
            `http://localhost:8000/api/relatives/update/${this.editedItem.id}`,
            this.editedItem
          )
          .then((response) => {
            console.log(response);
            this.getList();
            this.clearSelect();
          });
      } else {
        this.axios
          .post(
            `http://localhost:8000/api/relatives/post/${item.id}`,
            this.editedItem
          )
          .then((response) => {
            console.log(response);
            this.getList();
            this.clearSelect();
          });
      }
      this.close();
    },
    clearSelect() {
      this.empSelect = 0;
    },
  },
};
</script>
