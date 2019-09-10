import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify);

import { mount } from "@vue/test-utils";
import _ from 'lodash';
import DynamicOptions from '../DynamicOptions';
import initialData from "@/assets/static/initialData";

describe('DynamicOptions.vue', () => {
	const dynamicOptions = _.map(initialData.data.items, 'entity');

	const amountWithDynamicOptions = () => {
		return mount(DynamicOptions, {
			propsData: { items: dynamicOptions },
      attachToDocument: true
		});
	};

	test('shoud init data', () => {
    const wrapper = amountWithDynamicOptions();
		expect(wrapper.vm.items).toBe(dynamicOptions);
	});

	test('shoud render data', () => {
		const wrapper = amountWithDynamicOptions();
    expect(wrapper.findAll('.v-list').exists()).toBeTruthy();
		expect(wrapper.findAll('.v-list-item').length).toBe(dynamicOptions.length);
	});

	test('should handle click on item', async () => {
		const wrapper = amountWithDynamicOptions();
		wrapper.setMethods({ onItemClick: jest.fn() });
    wrapper.find('.v-list-item').trigger('click');
		expect(wrapper.vm.onItemClick).toBeCalled();
	});

	test('should emit dynamic-option-click when click on item', () => {
		const wrapper = amountWithDynamicOptions();
		wrapper.find('.v-list-item').trigger('click');
		expect(wrapper.emitted('dynamic-option-click')).toHaveLength(1);
	});
});
