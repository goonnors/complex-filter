import { shallowMount } from "@vue/test-utils";
import ComplexFilter from '../ComplexFilter';
import SearchField from '../SearchField';
import DynamicTable from '../DynamicTable';
import DynamicOptions from '../DynamicOptions';
import initialData from "@/assets/static/initialData";

describe('DynamicOptions.vue', () => {
	test('shoud init data', () => {
		const { data: items } = initialData;
		const wrapper = shallowMount(DynamicOptions, {
			propsData: { items }
		});
		expect(wrapper.vm.items).toBe(items);
	});

	test('shoud render data', () => {
		const { data: items } = initialData;
		const wrapper = shallowMount(DynamicOptions, {
			propsData: { items }
		});
		expect(wrapper.findAll('ul li').length).toBe(items.length);
	});
});
