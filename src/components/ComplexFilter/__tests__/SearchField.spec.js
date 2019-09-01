import { shallowMount } from "@vue/test-utils";
import SearchField from '../SearchField';

describe('SearchField.vue', () => {
	test('should emit focus-search-field on focus', () => {
		const wrapper = shallowMount(SearchField);
		wrapper.find('textarea').trigger('focus');
		expect(wrapper.emitted('focus-search-field')).toHaveLength(1);
	});
	
	test('shout emit input-search-field when input', () => {
		const wrapper = shallowMount(SearchField);
		wrapper.find('textarea').trigger('input');
		expect(wrapper.emitted('input-search-field')).toHaveLength(1);
	});
	
	// test('shoud spy onInput method when emit input-search-field', () => {
	// 	const wrapper = shallowMount(SearchField);
	// 	// jest.spyOn(wrapper.vm, 'onInputSearchField');
	// 	wrapper.vm.onInputSearchField = jest.fn();
	// 	wrapper.find('textarea').trigger('input');
	// 	expect(wrapper.vm.onInputSearchField).toHaveBeenCalled();
	// });
});
