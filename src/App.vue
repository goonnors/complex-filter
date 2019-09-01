<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">filter like JQL</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>
        <span class="mr-2">piu-piu</span>
      </v-btn>
    </v-app-bar>

    <v-content>
        <complex-filter />
    </v-content>
  </v-app>
</template>

<script>
import ComplexFilter from './components/ComplexFilter/ComplexFilter.vue';

export default {
  name: 'App',
  components: {
    ComplexFilter,
  },
  data: () => ({
    //
  }),
};
</script>
