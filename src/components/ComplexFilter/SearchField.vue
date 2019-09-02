<template>
  <v-textarea
    id="search-field"
    class="mx-2"
    placeholder="filter like a JQL"
    rows="1"
    :value="value"
    autofocus
    @focus="$emit('focus-search-field')"
    @input="onInputSearchField"
  >
    <v-icon v-if="isValid" slot="prepend-inner" color="green">mdi-check</v-icon>
    <v-icon v-if="hasError" slot="prepend-inner" color="red">mdi-close</v-icon>
  </v-textarea>
</template>

<script>
import _ from "lodash";
export default {
  name: "SearchField",
  props: ["value", "queryIsValid"],
  data: () => ({
    query: ""
  }),
  computed: {
    isValid() {
      return _.isBoolean(this.queryIsValid) && this.queryIsValid;
    },
    hasError() {
      return _.isBoolean(this.queryIsValid) && !this.queryIsValid;
    }
  },
  methods: {
    onInputSearchField(value) {
      this.$emit("input-search-field", value);
    }
  }
};
</script>
