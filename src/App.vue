<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn icon @click="drawer = !drawer">
          <v-icon class="mr-1" color=" darken-4">mdi-menu</v-icon>
        </v-btn>
        Hodimlar bilan ishlash
      </div>

      <v-spacer></v-spacer>

      <v-btn icon v-if="!$vuetify.theme.dark" @click="toggleTheme()">
        <v-icon class="mr-1" color=" darken-4">mdi-weather-night</v-icon>
      </v-btn>
      <v-btn icon v-if="$vuetify.theme.dark" @click="toggleTheme()">
        <v-icon color="yellow darken-3">mdi-white-balance-sunny</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <Navigation />
    </v-navigation-drawer>
    <v-container>
      <router-view />
    </v-container>
    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import Navigation from "./components/Navigation.vue";

export default {
  name: "App",
  data() {
    return {
      drawer: null,
    };
  },
  components: {
    HelloWorld,
    Navigation,
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
