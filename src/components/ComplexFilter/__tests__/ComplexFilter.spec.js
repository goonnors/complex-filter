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
    const data = JSON.parse(JSON.stringify(initialData.data));
    wrapper.vm.applyData(data);
    return wrapper;
  };

  const changeState = (wrapper, option) => {
    wrapper.vm.fetchAndApplyData = () => {
      wrapper.vm.applyData(mockData.data);
    };
    wrapper.vm.dOptions.items = _.map(mockData.headers, "value");
    wrapper.vm.dOptions.exclude(option);
    wrapper.vm.query.update(option, wrapper.vm.state);
    wrapper.vm.updateStateAndData(wrapper.vm.state);
  };

  const clickOnDynamicOption = (wrapper, option) => {
    wrapper.vm.fetchAndApplyData = () => {
      wrapper.vm.applyData(mockData.data);
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
    wrapper.vm.dOptions.items.push(true);
    wrapper.vm.dOptions.isVisible = true;
    wrapper.vm.loading = false;
    expect(wrapper.find(DynamicOptions).exists()).toBeTruthy();
  });

  test("hide dynamic options", () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.vm.dOptions.isVisible = false;
    expect(wrapper.find(DynamicOptions).exists()).toBeFalsy();
  });

  test("should show DynamicOptions when textarea is focused", () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.vm.dOptions.items.push(true);
    wrapper.vm.loading = false;
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
    const table = wrapper.vm.table;
    expect(table.items).not.toHaveLength(0);
    wrapper.vm.onInputSearchField(table.items[0].entity);
    wrapper.vm.debouncedClick.flush();
    expect(wrapper.vm.table.items).toHaveLength(initialData.data.items.length-1);
  });

  test("should handle query when input textarea", () => {
    const wrapper = shallowMount(ComplexFilter);
    wrapper.setMethods({ onDynamicOptionClick: jest.fn() });
    wrapper.find(SearchField).vm.$emit("focus-search-field");
    wrapper.vm.dOptions.items.push(true);
    wrapper.vm.loading = false;
    wrapper.find(DynamicOptions).vm.$emit("dynamic-option-click");
    expect(wrapper.vm.onDynamicOptionClick).toHaveBeenCalled();
  });

  /**
   * step 2: Column selection
   * to check: click, input (valid/invalid, complete/incomplete)
   * modified: query, dOptions.items, tableItems
   */

  test('init column-selection step', () => {
    const wrapper = createWrapper();
    expect(FilterState.isEntitySelection(wrapper.vm.state)).toBeTruthy();

    // state in the first step
    expect(wrapper.vm.query.line).toBe(""); // query
    expect(wrapper.vm.dOptions.items).toEqual(_.map(initialData.data.items, "entity")); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(initialData.data.items); // dOptions.items

    // transformation magic
    const option = wrapper.vm.dOptions.items[0];
    changeState(wrapper, option);

    // state in the second step
    expect(FilterState.isColumnSelection(wrapper.vm.state)).toBeTruthy();
    expect(wrapper.vm.query.line).toContain(option + ": "); // query
    expect(wrapper.vm.dOptions.items).not.toContain(option); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(mockData.data.items); // dOptions.items
  });

  test('transition to the second stage by click', () => {
    const wrapper = createWrapper();
    expect(FilterState.isEntitySelection(wrapper.vm.state)).toBeTruthy();

    // state in the first step
    expect(wrapper.vm.query.line).toBe(""); // query
    expect(wrapper.vm.dOptions.items).toEqual(_.map(initialData.data.items, "entity")); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(initialData.data.items); // dOptions.items

    // click on dynamic option
    const option = wrapper.vm.dOptions.items[0];
    clickOnDynamicOption(wrapper, option);

    // state in the second step
    expect(FilterState.isColumnSelection(wrapper.vm.state)).toBeTruthy();
    expect(wrapper.vm.query.line).toContain(option + ": "); // query
    expect(wrapper.vm.dOptions.items).not.toContain(option); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(mockData.data.items); // dOptions.items
  });

  test('transition to the second stage by complete-valid input', () => {
    const wrapper = createWrapper();
    expect(FilterState.isEntitySelection(wrapper.vm.state)).toBeTruthy();

    // state in the first step
    expect(wrapper.vm.query.line).toBe(""); // query
    expect(wrapper.vm.dOptions.items).toEqual(_.map(initialData.data.items, "entity")); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(initialData.data.items); // dOptions.items

    // input complete query
    const option = wrapper.vm.dOptions.items[0];
    wrapper.vm.fetchAndApplyData = () => {
      wrapper.vm.applyData(mockData.data);
    };
    wrapper.vm.onInputSearchField(option);
    wrapper.vm.debouncedClick.flush();

    expect(FilterState.isColumnSelection(wrapper.vm.state)).toBeTruthy();
    expect(wrapper.vm.query.line).toContain(option + ": "); // query
    expect(wrapper.vm.dOptions.items).not.toContain(option); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(mockData.data.items); // dOptions.items
  });

  /**
   * step 3: Operation input
   * to check: click, input (valid/invalid, complete/incomplete)
   * modified: query, dOptions.items, tableItems
   */

  test('init operation-input step', () => {
    const wrapper = createWrapper();

    const firstOption = wrapper.vm.dOptions.items[0];
    clickOnDynamicOption(wrapper, firstOption);
    expect(FilterState.isColumnSelection(wrapper.vm.state)).toBeTruthy();

    const secondOption = wrapper.vm.dOptions.items[0];
    clickOnDynamicOption(wrapper, secondOption);
    expect(FilterState.isOperationInput(wrapper.vm.state)).toBeTruthy();
    expect(wrapper.vm.query.line).toBe(firstOption + ': ' + secondOption + ' '); // query
    expect(wrapper.vm.dOptions.items).toEqual(Operation.getList()); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(mockData.data.items); // dOptions.items
  });

  test('transition to the third stage by complete/valid input', () => {
    // to select-entity state
    const wrapper = createWrapper();

    // to select-column state
    const firstOption = wrapper.vm.dOptions.items[0];
    changeState(wrapper, firstOption);

    const secondOption = wrapper.vm.dOptions.items[0];
    wrapper.vm.onInputSearchField(secondOption);
    wrapper.vm.debouncedClick.flush();

    expect(FilterState.isOperationInput(wrapper.vm.state)).toBeTruthy();
    expect(wrapper.vm.query.line).toBe(firstOption + ': ' + secondOption + ' '); // query
    expect(wrapper.vm.dOptions.items).toEqual(Operation.getList()); // dOptions.items
    expect(wrapper.vm.table.items).toEqual(mockData.data.items); // dOptions.items
  });

  test('downgrade state', () => {
    const wrapper = createWrapper(); // to select-entity state
    changeState(wrapper, wrapper.vm.dOptions.items[0]); // to select-column state
    changeState(wrapper, wrapper.vm.dOptions.items[0]); // to operation-input state

    expect(FilterState.isOperationInput(wrapper.vm.state)).toBeTruthy();
    wrapper.vm.downgradeState();
    expect(FilterState.isColumnSelection(wrapper.vm.state)).toBeTruthy();
  });

  // test('parse new query', () => {
  //   const wrapper = createWrapper();
  //   wrapper.find(SearchField).vm.$emit("input-search-field", "Desserts: calories != 237 AND name = Frozen Yogurt ");
  //   wrapper.vm.debouncedClick.flush();
  //   // jest.spyOn(wrapper.vm, 'parseQuery');
  //   // wrapper.vm.parseQuery = jest.fn();
  //   // expect(wrapper.vm.parseQuery).toBeCalled();
  //   // console.log(wrapper.vm.inputIsValid);
  // });
});
