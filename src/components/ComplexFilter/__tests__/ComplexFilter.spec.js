import { shallowMount } from "@vue/test-utils";
import ComplexFilter from "../ComplexFilter";
import SearchField from "../SearchField";
import DynamicTable from "../DynamicTable";
import DynamicOptions from "../DynamicOptions";
import FilterState from "../enum/FilterState";
import Operation from "../enum/Operation";
import initialData from "@/assets/static/initialData";
import mockData from "@/assets/static/mockData";
import _ from "lodash";

describe("ComplexFilter.vue", () => {
  const createWrapper = () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.vm.applyData(initialData);
    return wrapper;
  };

  const changeStateFromEntityToColumn = (wrapper, option) => {
    wrapper.vm.fetchData = () => {
      wrapper.vm.applyData(mockData);
    };
    wrapper.vm.dynamicOptions = _.map(mockData.headers, "value");
    wrapper.vm.excludeDynamicOption(option);
    wrapper.vm.updateQuery(option);
    wrapper.vm.updateState(wrapper.vm.filterState);
  };

  const clickOnDynamicOption = (wrapper, option) => {
    wrapper.vm.fetchData = () => {
      wrapper.vm.applyData(mockData);
    };
    wrapper.vm.onDynamicOptionClick(option);
  };

  test("should contains SearchField and not contains DynamicOptions", () => {
    const wrapper = shallowMount(ComplexFilter);
    expect(wrapper.find(SearchField).exists()).toBeTruthy();
    expect(wrapper.find(DynamicTable).exists()).toBeTruthy();
    expect(wrapper.find(DynamicOptions).exists()).toBeFalsy();
  });

  test("should show DynamicOptions on focus search field", () => {
    const wrapper = shallowMount(ComplexFilter);
    expect(wrapper.find(DynamicOptions).exists()).toBeFalsy();
    wrapper.vm.onFocusSearchField();
    expect(wrapper.find(DynamicOptions).exists()).toBeTruthy();
  });

  test("hide dynamic options", () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.vm.hideDynamicOptions();
    expect(wrapper.find(DynamicOptions).exists()).toBeFalsy();
  });

  test("should show DynamicOptions when textarea is focused", () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.find(SearchField).vm.$emit("focus-search-field");
    expect(wrapper.find(DynamicOptions).exists()).toBeTruthy();
  });

  test("should handle query when input textarea", () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.setMethods({ onInputSearchField: jest.fn() });
    wrapper.find(SearchField).vm.$emit("input-search-field");
    expect(wrapper.vm.onInputSearchField).toHaveBeenCalled();
  });

  test("should modify tableItems on input event", async () => {
    const wrapper = createWrapper();
    const tableItems = wrapper.vm.tableItems;
    expect(tableItems).not.toHaveLength(0);
    wrapper.vm.onInputSearchField(tableItems[0].entity);
    wrapper.vm.debouncedQueryHandler.flush();
    expect(wrapper.vm.tableItems).toHaveLength(1);
  });

  test("should handle query when input textarea", () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.setMethods({ onDynamicOptionClick: jest.fn() });
    wrapper.find(SearchField).vm.$emit("focus-search-field");
    wrapper.find(DynamicOptions).vm.$emit("dynamic-option-click");
    expect(wrapper.vm.onDynamicOptionClick).toHaveBeenCalled();
  });

  /**
   * step 2: Column selection
   * to check: click, input (valid/invalid, complete/incomplete)
   * modified: query, dynamicOptions, tableItems
   */

  test('init column-selection step', () => {
    const wrapper = createWrapper();
    expect(FilterState.isEntitySelection(wrapper.vm.filterState)).toBeTruthy();

    // state in the first step
    expect(wrapper.vm.query).toBe(""); // query
    expect(wrapper.vm.dynamicOptions).toEqual(_.map(initialData.data, "entity")); // dynamicOptions
    expect(wrapper.vm.tableItems).toEqual(initialData.data); // dynamicOptions

    // transformation magic
    const option = wrapper.vm.dynamicOptions[0];
    changeStateFromEntityToColumn(wrapper, option);

    // state in the second step
    expect(FilterState.isColumnSelection(wrapper.vm.filterState)).toBeTruthy();
    expect(wrapper.vm.query).toContain(option + ": "); // query
    expect(wrapper.vm.dynamicOptions).not.toContain(option); // dynamicOptions
    expect(wrapper.vm.tableItems).toEqual(mockData.data); // dynamicOptions
  });

  test('transition to the second stage by click', () => {
    const wrapper = createWrapper();
    expect(FilterState.isEntitySelection(wrapper.vm.filterState)).toBeTruthy();

    // state in the first step
    expect(wrapper.vm.query).toBe(""); // query
    expect(wrapper.vm.dynamicOptions).toEqual(_.map(initialData.data, "entity")); // dynamicOptions
    expect(wrapper.vm.tableItems).toEqual(initialData.data); // dynamicOptions

    // click on dynamic option
    const option = wrapper.vm.dynamicOptions[0];
    clickOnDynamicOption(wrapper, option);

    // state in the second step
    expect(FilterState.isColumnSelection(wrapper.vm.filterState)).toBeTruthy();
    expect(wrapper.vm.query).toContain(option + ": "); // query
    expect(wrapper.vm.dynamicOptions).not.toContain(option); // dynamicOptions
    expect(wrapper.vm.tableItems).toEqual(mockData.data); // dynamicOptions
  });

  test('transition to the second stage by complete-valid input', () => {
    const wrapper = createWrapper();
    expect(FilterState.isEntitySelection(wrapper.vm.filterState)).toBeTruthy();

    // state in the first step
    expect(wrapper.vm.query).toBe(""); // query
    expect(wrapper.vm.dynamicOptions).toEqual(_.map(initialData.data, "entity")); // dynamicOptions
    expect(wrapper.vm.tableItems).toEqual(initialData.data); // dynamicOptions

    // input complete query
    const option = wrapper.vm.dynamicOptions[0];
    wrapper.vm.fetchData = () => {
      wrapper.vm.applyData(mockData);
    };
    wrapper.vm.onInputSearchField(option);
    wrapper.vm.debouncedQueryHandler.flush();

    // state in the second step
    expect(FilterState.isColumnSelection(wrapper.vm.filterState)).toBeTruthy();
    expect(wrapper.vm.query).toContain(option + ": "); // query
    expect(wrapper.vm.dynamicOptions).not.toContain(option); // dynamicOptions
    expect(wrapper.vm.tableItems).toEqual(mockData.data); // dynamicOptions
  });

  /**
   * step 3: Operation input
   * to check: click, input (valid/invalid, complete/incomplete)
   * modified: query, dynamicOptions, tableItems
   */

  test('init column-selection step', () => {
    const wrapper = createWrapper();

    const firstOption = wrapper.vm.dynamicOptions[0];
    clickOnDynamicOption(wrapper, firstOption);
    expect(FilterState.isColumnSelection(wrapper.vm.filterState)).toBeTruthy();

    const secondOption = wrapper.vm.dynamicOptions[0];
    clickOnDynamicOption(wrapper, secondOption);
    expect(FilterState.isOperationInput(wrapper.vm.filterState)).toBeTruthy();
    expect(wrapper.vm.query).toBe(firstOption + ': ' + secondOption + ' '); // query
    expect(wrapper.vm.dynamicOptions).toEqual(Operation.getList()); // dynamicOptions
    // expect(wrapper.vm.tableItems).toEqual(initialData.data); // dynamicOptions
    //
    // // transformation magic
    // const option = wrapper.vm.dynamicOptions[0];
    // changeStateFromEntityToColumn(wrapper, option);
    //
    // // state in the second step
    // expect(FilterState.isColumnSelection(wrapper.vm.filterState)).toBeTruthy();
    // expect(wrapper.vm.query).toContain(option + ": "); // query
    // expect(wrapper.vm.dynamicOptions).not.toContain(option); // dynamicOptions
    // expect(wrapper.vm.tableItems).toEqual(mockData.data); // dynamicOptions
  });

});
