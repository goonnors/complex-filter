<template>
    <div>
        <search-field
            v-click-outside="''"
            class="search-field"
            @focus-search-field="onFocusSearchField"
        />
        <dynamic-options
            v-if="showDynamicOptions"
            v-click-outside="'search-field'"
            :items="dynamicOptions"
        />
        <dynamic-table :headers="tableHeaders" :items="tableItems" />
    </div>
</template>

<script>
    import _ from 'lodash';
	import initialData from "@/assets/static/initialData";
    import SearchField from './SearchField';
    import DynamicOptions from './DynamicOptions';
    import DynamicTable from './DynamicTable';
	import Vue from 'vue'

	Vue.directive('click-outside', {
		bind: function (el, binding, vnode) {
			el.clickOutsideEvent = event => {
				const target = event.target;
				if (!el.contains(target) && binding.value !== target.className) {
                    vnode.context.hideDynamicOptions();
				}
			};
			document.documentElement.addEventListener('click', el.clickOutsideEvent)
		},
		unbind: function (el) {
			document.documentElement.removeEventListener('click', el.clickOutsideEvent)
		},
	});

	export default {
		components: { SearchField, DynamicOptions, DynamicTable },
        data: () => ({
			tableHeaders: [],
			tableItems: [],
            showDynamicOptions: false
        }),
        computed: {
			dynamicOptions() {
				return _.map(this.tableItems, 'entity');
            }
        },
        mounted() {
			this.tableHeaders = initialData.headers;
			this.tableItems = initialData.data;
        },
        methods: {
			onFocusSearchField() {
				this.showDynamicOptions = true;
            },
			hideDynamicOptions() {
				this.showDynamicOptions = false;
            }
        }
    }
</script>
