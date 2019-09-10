<template>
  <div class="dynamic-options">
    <v-card
      class="mx-auto"
      max-width="300"
      elevation="6"
      tile
    >
      <v-list>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="onItemClick(item)"
          >{{ item }}</v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "DynamicOptions",
  props: ["items"],
  data: () => ({
    item: ''
  }),
  methods: {
    onItemClick(item) {
      this.$emit("dynamic-option-click", item);
    }
  }
};
</script>

<style>
  .dynamic-options {
    position: absolute;
    left: 40px;
    z-index: 1;
    width: 300px;
  }
</style>
