<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-center">UzAuto</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="item in items" :key="item.title" :to="item.link" link>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        { title: "Bosh sahifa", icon: "mdi-home-variant", link: "hello" },
        {
          title: "Hodimlar ro'yxati",
          icon: "mdi-account-group",
          link: "/",
        },
      ],
    };
  },
};
</script>
