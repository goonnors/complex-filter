<template>
  <div>
    <search-field
      v-click-outside="''"
      :value="query"
      :query-is-valid="queryIsValid"
      :key="stateKey"
      ref="searchField"
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
import Operation from "./enum/Operation";

Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = event => {
      const target = event.target;
      if (!el.contains(target) && binding.value !== target.id) {
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
    stateKey: 0,
    showDynamicOptions: false,
    query: "",
    queryList: [],
    queryIsValid: null,
    tableHeaders: [],
    tableItems: []
  }),
  computed: {
    items() {
      return FilterState.isEntitySelection(this.filterState)
        ? this.tableItems
        : this.tableHeaders;
    },
    dynamicKey() {
      return FilterState.isEntitySelection(this.filterState)
        ? "entity"
        : "value";
    }
  },
  mounted() {
    this.updateState(this.filterState);
    this.debouncedQueryHandler = _.debounce(this.handleQuery, 50);
  },
  methods: {
    onInputSearchField(query) {
      if (!query) {
        this.initStep();
        return;
      }

      query = _.trimStart(query, this.query);

      this.validateInput(query);
      if (this.queryIsValid) {
        this.debouncedQueryHandler(query);
      } else {
        this.dropDynamicOptions();
      }
    },
    validateInput(query) {
      this.filterDynamicOptions(query);
      this.queryIsValid = !!this.dynamicOptions.length;
    },
    queryIsComplete(query) {
      if (this.dynamicOptions.length === 1) {
        return this.dynamicOptions[0].toLowerCase() === query.toLowerCase();
      }
      return false;
    },
    updateQuery(option) {
      this.query += option;
      this.queryList.push(option);

      if (FilterState.isEntitySelection(this.filterState)) {
        this.query += ": ";
        this.tableItems = this.tableItems.filter(
          item => item[this.dynamicKey] !== option
        );
      } else {
        this.query += " ";
      }
    },
    handleQuery(query) {
      if (this.queryIsComplete(query)) {
        this.onDynamicOptionClick(query);
      }
    },

    initStep() {
      this.query = "";
      this.queryIsValid = null;
      this.tableItems = initialData.data;
      this.updateDynamicOptions();
      this.filterState = FilterState.initialState;
      this.stateKey++;
    },

    /*** dynamic options ***/
    onFocusSearchField() {
      this.showDynamicOptions = true;
    },
    hideDynamicOptions() {
      this.showDynamicOptions = false;
    },
    onDynamicOptionClick(option) {
      this.excludeDynamicOption(option);
      this.updateQuery(option);
      this.updateState(this.filterState);
    },
    dropDynamicOptions() {
      this.dynamicOptions = [];
    },
    updateDynamicOptions(options) {
      this.dynamicOptions = options || _.map(this.items, this.dynamicKey);
      setTimeout(() => {
        this.showDynamicOptions = true;
      });
    },
    excludeDynamicOption(option) {
      this.dynamicOptions = this.dynamicOptions.filter(item => item !== option);
    },
    filterDynamicOptions(query) {
      this.dynamicOptions = _.map(this.items, this.dynamicKey).filter(
        item => ~item.toLowerCase().search(_.escapeRegExp(query.toLowerCase()))
      );
    },
    /*******/

    filterTableItems(query) {
      this.tableItems = this.items.filter(
        item =>
          ~item[this.dynamicKey]
            .toLowerCase()
            .search(_.escapeRegExp(query.toLowerCase()))
      );
    },
    updateState(state) {
      this.filterState = FilterState.getNextState(state);
      if (FilterState.needsUpdateData(state)) {
        this.fetchData();
      } else if (FilterState.isOperationInput(this.filterState)) {
        this.updateDynamicOptions(Operation.getList());
      } else if (FilterState.isCellValueSelection(this.filterState)) {
        this.getCellValue();
        // this.updateDynamicOptions(Operation.getList());
      }
    },
    getCellValue() {
      debugger;
    },
    fetchData() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.applyData(
          FilterState.isEntitySelection(this.filterState)
            ? initialData
            : mockData
        );
      }, 500);
    },
    applyData(data) {
      this.tableHeaders = data.headers;
      this.tableItems = data.data;
      this.updateDynamicOptions();
    }
  }
};
</script>
