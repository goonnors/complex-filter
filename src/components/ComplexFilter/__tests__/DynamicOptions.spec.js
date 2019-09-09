import { shallowMount } from "@vue/test-utils";
import _ from 'lodash';
import DynamicOptions from '../DynamicOptions';
import initialData from "@/assets/static/initialData";

describe('DynamicOptions.vue', () => {
	const dynamicOptions = _.map(initialData.data, 'entity');

	const amountWithDynamicOptions = () => {
		return shallowMount(DynamicOptions, {
			propsData: { items: dynamicOptions }
		});
	};

	test('shoud init data', () => {
		const wrapper = amountWithDynamicOptions();
		expect(wrapper.vm.items).toBe(dynamicOptions);
	});

	test('shoud render data', () => {
		const wrapper = amountWithDynamicOptions();
		expect(wrapper.findAll('ul li').length).toBe(dynamicOptions.length);
	});

	test('should handle click on item', () => {
		const wrapper = amountWithDynamicOptions();
		wrapper.setMethods({ onItemClick: jest.fn() });
		wrapper.find('ul li').trigger('click');
		expect(wrapper.vm.onItemClick).toBeCalled();
	});

	test('should emit dynamic-option-click when click on item', () => {
		const wrapper = amountWithDynamicOptions();
		wrapper.find('ul li').trigger('click');
		expect(wrapper.emitted('dynamic-option-click')).toHaveLength(1);
	});
});
