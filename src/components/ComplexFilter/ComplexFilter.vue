<template>
  <div>
    <search-field
      v-click-outside="''"
      :value="query.line"
      :query-is-valid="inputIsValid"
      ref="searchField"
      @focus-search-field="dOptions.isVisible = true"
      @input-search-field="onInputSearchField"
    />
    <dynamic-options
      v-if="dOptions.isVisible && !loading"
      v-click-outside="'search-field'"
      :items="dOptions.items"
      @dynamic-option-click="onDynamicOptionClick"
    />
    <dynamic-table
      :headers="table.headers"
      :items="table.items"
      :loading="loading"
    />
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import SearchField from "./SearchField";
import DynamicOptions from "./DynamicOptions";
import DynamicTable from "./DynamicTable";
import FilterState from "./enum/FilterState";
import Operation from "./enum/Operation";
import Keyword from "./enum/Keyword";
import OptionsController from "./utils/OptionsController"
import QueryController from "./utils/QueryController";
import mockApi from "../../api/mockApi";

Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = event => {
      const target = event.target;
      if (!el.contains(target) && binding.value !== target.id) {
        vnode.context.dOptions.isVisible = false;
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
    dOptions: new OptionsController(),
    state: FilterState.initialState,
    loading: false,
    query: new QueryController(),
    inputIsValid: null,
    table: {}
  }),
  computed: {
    tableData() {
      if (FilterState.isEntitySelection(this.state)) {
        return _.map(this.table.items, 'entity');
      }
      return _.map(this.table.headers, 'value');
    }
  },
  mounted() {
    this.updateStateAndData(this.state);
    this.debouncedClick = _.debounce(this.onDynamicOptionClick, 50);
  },
  methods: {
    onInputSearchField(input) {
      if (!input) {
        this.resetFilter();
        return;
      }

      const lastChars = _.trimStart(input, this.query);
      this.inputIsValid = this.dOptions.containsWord(lastChars, this.tableData);

      if (!this.inputIsValid) {
        this.dOptions.drop();
        return;
      }

      this.dOptions.filter(lastChars, this.state, this.tableData);

      if (this.dOptions.wordIsComplete(lastChars, this.state)) {
        this.debouncedClick(lastChars);
      }
    },

    updateTableItems(option) {
      this.table.items = this.table.items.filter(
        item => item[this.dynamicKey] !== option
      );
    },

    resetFilter() {
      this.query.line = '';
      this.state = FilterState.initialState;
      this.updateStateAndData(this.state);
    },

    onDynamicOptionClick(option) {
      this.dOptions.exclude(option);
      this.query.update(option, this.state);
      this.updateTableItems(option);
      this.updateStateAndData(this.state);
    },

    /*** state ***/
    updateStateAndData(state) {
      this.state = FilterState.getNextState(state);
      // console.log(FilterState.getStateById(this.state), FilterState.needsUpdateData(state));
      if (FilterState.needsUpdateData(state)) {
        this.fetchAndApplyData();
      } else {
        const options = this.getDynamicOptionsByState(this.state);
        this.dOptions.update(options, this.tableData);
      }
    },
    downgradeState() {
      this.state = FilterState.getPreviousState(this.state);
    },

    getDynamicOptionsByState(state) {
      if (FilterState.isOperationInput(state)) {
        this.remainingColumns = this.dOptions.items;
        return Operation.getList();
      } else if (FilterState.isCellValueSelection(state)) {
        return this.getCellValues();
      } else if (FilterState.isKeywordInput(state)) {
        return Keyword.getList();
      } else if (FilterState.isColumnSelection(state)) {
        return this.remainingColumns;
      }
    },

    getCellValues() {
      const column = this.query.getColumn();
      return _.chain(this.table.items).map(column).uniq().value();
    },

    async fetchAndApplyData() {
      this.loading = true;
      const { data } = await this.mockRequest();
      this.loading = false;
      this.applyData(data);
    },
    applyData(data) {
      this.table = data;
      this.dOptions.update(null, this.tableData);
    },
    mockRequest() {
      return FilterState.isEntitySelection(this.state)
        ? mockApi.getInitialData()
        : mockApi.getMockData();
    }
  }
};
</script>
