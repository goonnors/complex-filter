<template>
  <div>
    <search-field
      v-click-outside="''"
      :value="query"
      :query-is-valid="inputIsValid"
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
import Keyword from "./enum/Keyword";

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
    inputIsValid: null,
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
    this.debouncedClick = _.debounce(this.onDynamicOptionClick, 50);
  },
  methods: {
    onInputSearchField(query) {
      if (!query) {
        this.initStep();
        return;
      }

      // TODO сделать обработку в любом месте строки
      // TODO обработка удаления символов

      const lastChars = _.trimStart(query, this.query);
      this.inputIsValid = this.dynamicOptionsContainsChars(lastChars);

      if (!this.inputIsValid) {
        this.dropDynamicOptions();
        return;
      }

      this.filterDynamicOptions(lastChars);

      if (this.wordIsComplete(lastChars)) {
        this.debouncedClick(lastChars);
      }
    },
    dynamicOptionsContainsChars(chars) {
      return !!this.dynamicOptions.filter(
        item => ~item.toLowerCase().search(_.escapeRegExp(chars.toLowerCase()))
      ).length;
    },
    wordIsComplete(word) {
      if (FilterState.isOperationInput(this.filterState)) {
        return this.dynamicOptions.find(item => item === word);
      } else if (this.dynamicOptions.length === 1) {
        return this.dynamicOptions[0].toLowerCase() === word.toLowerCase();
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
    initStep() {
      this.query = "";
      this.inputIsValid = null;
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
    filterDynamicOptions(option) {
      if (FilterState.isOperationInput(this.filterState)) {
        // TODO
      } else {
        this.dynamicOptions = _.map(this.items, this.dynamicKey).filter(
          item =>
            ~item.toLowerCase().search(_.escapeRegExp(option.toLowerCase()))
        );
      }
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
      // console.log(FilterState.getStateById(this.filterState), FilterState.needsUpdateData(state));
      if (FilterState.needsUpdateData(state)) {
        this.fetchData();
        // debugger;
      } else if (FilterState.isOperationInput(this.filterState)) {
        this.freeColumns = this.dynamicOptions;
        this.updateDynamicOptions(Operation.getList());
      } else if (FilterState.isCellValueSelection(this.filterState)) {
        this.updateDynamicOptions(this.getCellValues());
      } else if (FilterState.isKeywordInput(this.filterState)) {
        this.updateDynamicOptions(Keyword.getList());
      } else if (FilterState.isColumnSelection(this.filterState)) {
        this.updateDynamicOptions(this.freeColumns);
      }
    },
    getCellValues() {
      return _.chain(this.tableItems).map(this.getColumn()).uniq().value();
    },
    getColumn() {
      return this.queryList[this.queryList.length-2];
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
