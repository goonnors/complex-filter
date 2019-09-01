import Vue from 'vue'
import Vuetify from 'vuetify'

import DynamicTable from '../DynamicTable';
import initialData from "@/assets/static/initialData";

import { shallowMount } from "@vue/test-utils";

Vue.use(Vuetify);

describe('DynamicTable.vue', () => {
	
	const mountFunction = options => {
		return shallowMount(DynamicTable, {
			Vue,
			...options,
		})
	};
	
	test('should init data', () => {
		const { headers, data: items } = initialData;
		const wrapper = mountFunction({
			propsData: { items, headers }
		});
		expect(wrapper.vm.items).toBe(items);
		expect(wrapper.vm.headers).toBe(headers);
	});
	
	test('should render data', () => {
		const { headers, data: items } = initialData;
		const wrapper = mountFunction({
			propsData: { items, headers }
		});
		const dataTableVm = wrapper.find('v-data-table-stub').vm;
		expect(dataTableVm.headers).toBe(headers);
		expect(dataTableVm.items).toBe(items);
	});
});
