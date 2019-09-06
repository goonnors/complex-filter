import _ from 'lodash';

const types = Object.freeze({
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  EMPTY: 'EMPTY',
  NULL: 'NULL',
  ORDER_BY: 'ORDER BY',
});

export default {
  getList() {
    return _.values(types);
  }
};
