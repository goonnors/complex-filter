import _ from 'lodash';
import FilterState from '../enum/FilterState';

export default class OptionsController {
  constructor() {
    this.items = [];
    this.isVisible = false;
  }

  set isVisible(value) {
    this._isVisible = value;
  }

  get isVisible() {
    return this._isVisible && !!this.items.length;
  }

  wordIsComplete(word, state) {
    if (FilterState.isOperationInput(state)) {
      return this.items.find(item => item === word);
    } else if (this.items.length === 1) {
      return this.items[0].toLowerCase() === word.toLowerCase();
    }
    return false;
  }

  drop() {
    this.items = [];
  }

  update(options, tableData) {
    this.items = options || tableData;
    setTimeout(() => {
      this.isVisible = true;
    });
  }

  exclude(option) {
    this.items = this.items.filter(item => item !== option);
  }

  filter(option, state, tableData) {
    if (FilterState.isOperationInput(state)) {
      // TODO
    } else {
      this.items = tableData.filter(
        item =>
          ~item.toLowerCase().search(_.escapeRegExp(option.toLowerCase()))
      );
    }
  }

  containsWord(chars, tableData) {
    return !!tableData.filter(
      item => ~item.toLowerCase().search(_.escapeRegExp(chars.toLowerCase()))
    ).length;
  }
}
