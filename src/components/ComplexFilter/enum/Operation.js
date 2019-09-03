import _ from 'lodash';

const types = Object.freeze({
  EQUALS: "=",
  "NOT EQUALS": "!=",
  "GREATER THAN": ">",
  "GREATER THAN EQUALS": ">=",
  "LESS THAN": "<",
  "LESS THAN EQUALS": "<=",
  // IN: "IN",
  // "NOT IN": "NOT IN",
  CONTAINS: "~",
  "DOES NOT CONTAIN": "!~",
  // IS: "IS",
  // "IS NOT": "IS NOT",
  // WAS: "WAS",
  // "WAS IN": "WAS IN",
  // "WAS NOT IN": "WAS NOT IN",
  // "WAS NOT": "WAS NOT",
  // CHANGED: "CHANGED"
});

export default {
  getList() {
    return _.values(types);
  }
};
