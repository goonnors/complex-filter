import _ from 'lodash'
import FilterState from '../enum/FilterState'

export default class QueryController {
  constructor (line = '') {
    this.line = line
    this.isValid = null
  }

  get list () {
    return this.toList(this.line)
  }

  toList (input) {
    return _.words(input, /[^:\s ]+/g)
  }

  // get line() {
  //   return this._line;
  // }
  //
  // set line(value) {
  //   this._line = value;
  // }

  getColumn () {
    return this.list[this.list.length - 2]
  }

  update (input) {
    this.line = input
  }

  addOption (option, state) {
    this.line += option
    // this.list.push(option);

    if (FilterState.isEntitySelection(state)) {
      this.line += ': '
    } else {
      this.line += ' '
    }
  }

  validate () {
    // TODO
    // const rootEntity = this.list[0];
    // console.log(rootEntity);
  }
}
