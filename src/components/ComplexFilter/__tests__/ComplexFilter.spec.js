import { shallowMount } from "@vue/test-utils";
import ComplexFilter from '../ComplexFilter';
import SearchField from '../SearchField';
import DynamicTable from '../DynamicTable';
import DynamicOptions from '../DynamicOptions';
import FilterState from '../enum/FilterState';
import Operation from '../enum/Operation';
import initialData from '@/assets/static/initialData';
import mockData from '@/assets/static/mockData';
import _ from 'lodash';

describe('ComplexFilter.vue', () => {
  const createWrapper = () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.vm.applyData(initialData);
    return wrapper;
  };

  const changeStateFromEntityToColumn = (wrapper) => {
    wrapper.vm.fetchData = () => {
      wrapper.vm.applyData(mockData);
    };
    const itemEntity = wrapper.vm.dynamicOptions[0];
    wrapper.vm.onDynamicOptionClick(itemEntity);
  };

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

	test('should modify items', async () => {
    const wrapper = createWrapper();
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

	test('should change initial state after selecting entity', () => {
    const wrapper = createWrapper();
    expect(FilterState.isEntitySelection(wrapper.vm.filterState)).toBeTruthy();
    expect(wrapper.vm.query).toBe('');

    const itemEntity = wrapper.vm.dynamicOptions[0];
    wrapper.vm.onDynamicOptionClick(itemEntity);

    expect(FilterState.isColumnSelection(wrapper.vm.filterState)).toBeTruthy();
    expect(wrapper.vm.dynamicKey).toBe('value');
    expect(wrapper.vm.dynamicOptions).not.toContain(itemEntity); // options
    expect(wrapper.vm.query).toContain(itemEntity + ': '); // query
  });

	test('should update dynamicOptions on column-selection step', async () => {
    const wrapper = createWrapper();
    changeStateFromEntityToColumn(wrapper);
    expect(wrapper.vm.dynamicOptions).toEqual(_.map(mockData.headers, 'value'));
  });

	test('should handle click on dynamicKey during column-selection step', async () => {
    const wrapper = createWrapper();

    // state
    expect(FilterState.isEntitySelection(wrapper.vm.filterState)).toBeTruthy();
    changeStateFromEntityToColumn(wrapper);
    expect(FilterState.isColumnSelection(wrapper.vm.filterState)).toBeTruthy();

    const dynamicItem = wrapper.vm.dynamicOptions[0];
    expect(wrapper.vm.query).not.toContain(dynamicItem); // query
    expect(wrapper.vm.dynamicOptions).toContain(dynamicItem); // options

    wrapper.vm.onDynamicOptionClick(dynamicItem);

    expect(wrapper.vm.dynamicOptions).not.toContain(dynamicItem);
    expect(wrapper.vm.query).toContain(dynamicItem);
  });

	// test('update DynamicOptions on operation-input step', () => {
  //   const wrapper = createWrapper();
  //   wrapper.vm.filterState = FilterState.getState('OPERATION_INPUT');
  //   expect(wrapper.vm.dynamicOptions).toBe(Operation.getList());
  //   console.log(1);
  // });
});
