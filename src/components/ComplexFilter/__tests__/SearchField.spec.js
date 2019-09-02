import Vue from "vue";
import Vuetify from 'vuetify'

import { shallowMount } from "@vue/test-utils";
import SearchField from '../SearchField';

Vue.use(Vuetify);

describe('SearchField.vue', () => {
	const mountFunction = options => {
		return shallowMount(SearchField, {
			Vue,
			...options,
		})
	};

	// test('should emit focus-search-field on focus', () => {
	// 	const wrapper = mountFunction();
	// 	console.log(wrapper.html());
	// 	wrapper.find('v-textarea-stub').trigger('focus');
	// 	expect(wrapper.emitted('focus-search-field')).toHaveLength(1);
	// });
	
	// test('shout emit input-search-field when input', () => {
	// 	const wrapper = shallowMount(SearchField);
	// 	wrapper.find('v-textarea-stub').trigger('input');
	// 	expect(wrapper.emitted('input-search-field')).toHaveLength(1);
	// });

	// test('shoud spy onInput method when emit input-search-field', () => {
	// 	const wrapper = shallowMount(SearchField);
	// 	wrapper.setMethods({ onInputSearchField: jest.fn() });
	// 	wrapper.find('v-textarea-stub').trigger('input');
	// 	expect(wrapper.vm.onInputSearchField).toHaveBeenCalled();
	// });
});
