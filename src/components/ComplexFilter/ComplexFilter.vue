<template>
  <div>
    <search-field
      v-click-outside="''"
      class="search-field"
      :value="query"
      @focus-search-field="onFocusSearchField"
      @input-search-field="onInputSearchField"
    />
    <dynamic-options
      v-if="showDynamicOptions"
      v-click-outside="'search-field'"
      :items="dynamicOptions"
      @dynamic-option-click="onDynamicOptionClick"
    />
    <dynamic-table
      :headers="tableHeaders"
      :items="tableItems"
      :loading="loading"
    />
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import initialData from "@/assets/static/initialData";
import mockData from "@/assets/static/mockData";
import SearchField from "./SearchField";
import DynamicOptions from "./DynamicOptions";
import DynamicTable from "./DynamicTable";
import FilterState from "./enum/FilterState";
import Operation from "./enum/Operation"

Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = event => {
      const target = event.target;
      if (!el.contains(target) && binding.value !== target.className) {
        vnode.context.hideDynamicOptions();
      }
    };
    document.documentElement.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function(el) {
    document.documentElement.removeEventListener("click", el.clickOutsideEvent);
  }
});

export default {
  components: { SearchField, DynamicOptions, DynamicTable },
  data: () => ({
    dynamicOptions: [],
    filterState: FilterState.initialState,
    loading: false,
    showDynamicOptions: false,
    query: "",
    tableHeaders: [],
    tableItems: []
  }),
  computed: {
    dynamicKey() {
      return FilterState.isEntitySelection(this.filterState)
        ? "entity"
        : "value";
    }
  },
  mounted() {
    this.updateState(this.filterState);
  },
  methods: {
    onFocusSearchField() {
      this.showDynamicOptions = true;
    },
    onInputSearchField(query) {
      this.query = query;
      this.tableItems = this.filterTableItems(query);
    },
    filterTableItems(query) {
      return this.tableItems.filter(
        item =>
          ~item[this.dynamicKey]
            .toLowerCase()
            .search(_.escapeRegExp(query.toLowerCase()))
      );
    },
    hideDynamicOptions() {
      this.showDynamicOptions = false;
    },
    onDynamicOptionClick(option) {
      this.reduceDynamicOptions(option);
      this.updateQuery(option);
      this.updateState(this.filterState);
    },
    updateQuery(option) {
      this.query += option;

      if (!FilterState.isEntitySelection(this.filterState)) {
        this.query += ' ';
      } else {
        this.query += ': ';
        this.tableItems = this.tableItems.filter(
          item => item[this.dynamicKey] !== option
        );
      }
    },
    async updateState(state) {
      this.filterState = FilterState.getNextState(state);
      if (FilterState.needsUpdateData(state)) {
        await this.fetchData();
      }
    },
    updateDynamicOptions() {
      if (this.filterState === 0 || this.filterState === 1)
      this.dynamicOptions = FilterState.isEntitySelection(this.filterState)
        ? _.map(this.tableItems, this.dynamicKey)
        : _.map(this.tableHeaders, this.dynamicKey);
    },
    reduceDynamicOptions(option) {
      this.dynamicOptions = this.dynamicOptions.filter(
        item => item !== option
      );
    },
    async fetchData() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.applyData(FilterState.isEntitySelection(this.filterState) ? initialData : mockData);
      }, 500);
    },
    applyData(data) {
      this.tableHeaders = data.headers;
      this.tableItems = data.data;
      this.updateDynamicOptions();
      this.showDynamicOptions = true;
    },
  }
};
</script>
