import _ from 'lodash';
import FilterState from "../enum/FilterState";

export default class QueryController {
  constructor(line = '') {
    this.line = line;
  }

  get list() {
    return _.words(this.line, /[^:\s ]+/g);
  }

  getColumn() {
    return this.list[this.list.length-2];
  }

  update(option, state) {
    this.line += option;
    // this.list.push(option);

    if (FilterState.isEntitySelection(state)) {
      this.line += ": ";
    } else {
      this.line += " ";
    }
  }

  validate() {
    // TODO
    // const rootEntity = this.list[0];
    // console.log(rootEntity);
  }
}
