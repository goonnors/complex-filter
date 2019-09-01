import { shallowMount } from "@vue/test-utils";
import ComplexFilter from '../ComplexFilter';
import SearchField from '../SearchField';
import DynamicTable from '../DynamicTable';
import DynamicOptions from '../DynamicOptions';

describe('ComplexFilter.vue', () => {
	test('should contains SearchField and not contains DynamicOptions', () => {
		const wrapper = shallowMount(ComplexFilter);
		expect(wrapper.find(SearchField).exists()).toBeTruthy();
		expect(wrapper.find(DynamicTable).exists()).toBeTruthy();
		expect(wrapper.find(DynamicOptions).exists()).toBeFalsy();
	});
	
	test('should show DynamicOptions on focus search field', () => {
		const wrapper = shallowMount(ComplexFilter);
		expect(wrapper.find(DynamicOptions).exists()).toBeFalsy();
		wrapper.vm.onFocusSearchField();
		expect(wrapper.find(DynamicOptions).exists()).toBeTruthy();
	});
	
	test('outsite click should be handled', () => {
		const wrapper = shallowMount(ComplexFilter);
		wrapper.vm.hideDynamicOptions();
		expect(wrapper.find(DynamicOptions).exists()).toBeFalsy();
	});
	
	test('should show DynamicOptions when textarea is focused', () => {
		const wrapper = shallowMount(ComplexFilter);
		wrapper.find(SearchField).vm.$emit('focus-search-field');
		expect(wrapper.find(DynamicOptions).exists()).toBeTruthy();
	});
});
