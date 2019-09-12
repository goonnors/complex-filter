<template>
  <div>
    <search-field
      ref="searchField"
      v-click-outside="''"
      :value="query.line"
      :query-is-valid="query.isValid"
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
import Vue from 'vue'
import _ from 'lodash'
import mockApi from '../../api/mockApi'
import SearchField from './SearchField'
import DynamicOptions from './DynamicOptions'
import DynamicTable from './DynamicTable'
import FilterState from './enum/FilterState'
import Operation from './enum/Operation'
import Keyword from './enum/Keyword'
import OptionsController from './utils/OptionsController'
import QueryController from './utils/QueryController'

Vue.directive('click-outside', {
  bind (el, binding, vnode) {
    el.clickOutsideEvent = (event) => {
      const target = event.target
      if (!el.contains(target) && binding.value !== target.id) {
        vnode.context.dOptions.isVisible = false
      }
    }
    document.documentElement.addEventListener('click', el.clickOutsideEvent)
  },
  unbind (el) {
    document.documentElement.removeEventListener('click', el.clickOutsideEvent)
  }
})

export default {
  components: { SearchField, DynamicOptions, DynamicTable },
  data: () => ({
    dOptions: new OptionsController(),
    state: FilterState.initialState,
    loading: false,
    query: new QueryController(),
    table: {}
  }),
  computed: {
    tableData () {
      if (FilterState.isEntitySelection(this.state)) {
        return _.map(this.table.items, 'entity')
      }
      return _.map(this.table.headers, 'value')
    },
    dynamicKey () {
      return FilterState.isEntitySelection(this.state)
        ? 'entity'
        : 'value'
    }
  },
  mounted () {
    this.debouncedClick = _.debounce(this.onDynamicOptionClick, 50)
    this.resetFilter()
  },
  methods: {
    onInputSearchField (input) {
      if (!input) {
        this.resetFilter()
        return
      }

      const lastChars = _.trimStart(input, this.query)

      // TODO validate complex query
      this.query.isValid = this.dOptions.containsWord(lastChars, this.tableData)

      if (!this.query.isValid) {
        this.dOptions.drop()
        return
      }

      this.dOptions.filter(lastChars, this.state, this.tableData)

      if (this.dOptions.wordIsComplete(lastChars, this.state)) {
        this.debouncedClick(lastChars)
      }
    },

    validate (queryList) {
      // TODO
    },

    updateTableItems (option) {
      this.table.items = this.table.items.filter(
        item => item[this.dynamicKey] !== option
      )
    },

    resetFilter () {
      this.query.line = ''
      this.forwardFilter(FilterState.initialState)
    },

    onDynamicOptionClick (option) {
      this.dOptions.exclude(option)
      this.query.addOption(option, this.state)
      this.updateTableItems(option)
      this.forwardFilter(this.state)
    },

    forwardFilter (state) {
      this.updateState(state)
      this.updateData(state)
    },

    async updateData (state) {
      const data = await this.fetchData(state)
      this.applyData(data)
      const options = FilterState.needsUpdate(this.state) ? null : this.getDynamicOptionsByState(this.state)
      this.dOptions.update(options, this.tableData)
    },

    /** state **/
    updateState (state) {
      this.state = FilterState.getNextState(state)
    },
    downgradeState () {
      this.state = FilterState.getPreviousState(this.state)
    },

    getDynamicOptionsByState (state) {
      if (FilterState.isOperationInput(state)) {
        this.remainingColumns = this.dOptions.items
        return Operation.getList()
      } else if (FilterState.isCellValueSelection(state)) {
        return this.getCellValues()
      } else if (FilterState.isKeywordInput(state)) {
        return Keyword.getList()
      } else if (FilterState.isColumnSelection(state)) {
        return this.remainingColumns
      }
    },

    getCellValues () {
      const column = this.query.getColumn()
      return _.chain(this.table.items).map(column).uniq().value()
    },

    async fetchData (state) {
      if (!FilterState.needsUpdate(state)) {
        return null
      }
      this.loading = true
      const { data } = await this.mockRequest(state)
      this.loading = false
      return data
    },
    applyData (data) {
      if (data) {
        this.table = data
      }
    },
    mockRequest (state) {
      return FilterState.isInitialState(state)
        ? mockApi.getInitialData()
        : mockApi.getMockData()
    }
  }
}
</script>
