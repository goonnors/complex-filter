import { shallowMount } from "@vue/test-utils";
import _ from 'lodash';
import DynamicOptions from '../DynamicOptions';
import initialData from "@/assets/static/initialData";

describe('DynamicOptions.vue', () => {
	test('shoud init data', () => {
		const { data } = initialData;
		const dynamicOptions = _.map(data, 'entity');
		const wrapper = shallowMount(DynamicOptions, {
			propsData: { items: dynamicOptions }
		});
		expect(wrapper.vm.items).toBe(dynamicOptions);
	});

	test('shoud render data', () => {
		const { data } = initialData;
		const dynamicOptions = _.map(data, 'entity');
		const wrapper = shallowMount(DynamicOptions, {
			propsData: { items: dynamicOptions }
		});
		expect(wrapper.findAll('ul li').length).toBe(dynamicOptions.length);
	});
});
