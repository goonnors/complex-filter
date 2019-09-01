import { shallowMount } from "@vue/test-utils";
import DynamicTable from '../DynamicTable';
import initialData from "@/assets/static/initialData";

describe('DynamicTable.vue', () => {
	test('should init data', () => {
		const { headers, data: items } = initialData;
		const wrapper = shallowMount(DynamicTable, {
			propsData: { items, headers }
		});
		expect(wrapper.vm.items).toBe(items);
		expect(wrapper.vm.headers).toBe(headers);
	});
	
	test('should render data', () => {
		const { headers, data: items } = initialData;
		const wrapper = shallowMount(DynamicTable, {
			propsData: { items, headers }
		});
		expect(wrapper.findAll('table td')).toHaveLength(items.length);
	});
});
