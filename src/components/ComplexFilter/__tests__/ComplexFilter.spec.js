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
	
	test('should handle query when input textarea', () => {
		const wrapper = shallowMount(ComplexFilter);
		wrapper.setMethods({ onInputSearchField: jest.fn() });
		wrapper.find(SearchField).vm.$emit('input-search-field');
		expect(wrapper.vm.onInputSearchField).toHaveBeenCalled();
	});
	
	test('should modify items', () => {
		const wrapper = shallowMount(ComplexFilter);
		const tableItems = wrapper.vm.tableItems;
		expect(tableItems).not.toHaveLength(0);
		wrapper.vm.onInputSearchField(tableItems[0].entity);
		expect(wrapper.vm.tableItems).toHaveLength(1);
	});
	
	test('should handle query when input textarea', () => {
		const wrapper = shallowMount(ComplexFilter);
		wrapper.setMethods({ onDynamicOptionClick: jest.fn() });
		wrapper.find(SearchField).vm.$emit('focus-search-field');
		wrapper.find(DynamicOptions).vm.$emit('dynamic-option-click');
		expect(wrapper.vm.onDynamicOptionClick).toHaveBeenCalled();
	});
	
	test('should add item to query when click by DynamicOption', () => {
		const wrapper = shallowMount(ComplexFilter);
		const item = wrapper.vm.dynamicOptions[0];
		expect(wrapper.vm.query).toBe('');
		wrapper.vm.onDynamicOptionClick(item);
		expect(wrapper.vm.query).toContain(item);
	});
	
	test('should decrease list when click by DynamicOption', () => {
		const wrapper = shallowMount(ComplexFilter);
		const item = wrapper.vm.dynamicOptions[0];
		wrapper.vm.onDynamicOptionClick(item);
		expect(wrapper.vm.dynamicOptions).not.toContain(item);
	});
});
