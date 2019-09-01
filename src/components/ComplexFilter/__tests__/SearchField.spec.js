import { shallowMount } from "@vue/test-utils";
import SearchField from '../SearchField';

describe('SearchField.vue', () => {
	test('should emit focus-search-field on focus', () => {
		const wrapper = shallowMount(SearchField);
		wrapper.find('textarea').trigger('focus');
		expect(wrapper.emitted('focus-search-field')).toHaveLength(1);
	});
});
