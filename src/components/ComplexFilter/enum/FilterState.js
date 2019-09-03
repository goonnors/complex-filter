const types = Object.freeze({
  INITIAL_STATE: -1,
  ENTITY_SELECTION: 0,
  COLUMN_SELECTION: 1,
  OPERATION_INPUT: 2,
  CELL_VALUE_SELECTION: 3,
  KEYWORD_INPUT: 4
});

export default {
  initialState: types.INITIAL_STATE,
  getNextState(state) {
    const nextState = ++state;
    const [type] = Object.entries(types).find(([, value]) => value === nextState);
    return types[type];
  },
  needsUpdateData(state) {
    return this.isInitialState(state) || this.isEntitySelection(state);
  },
  isInitialState(state) {
    return types.INITIAL_STATE === state;
  },
  isEntitySelection(state) {
    return types.ENTITY_SELECTION === state;
  },
  isColumnSelection(state) {
    return types.COLUMN_SELECTION === state;
  },
  isOperationInput(state) {
    return types.OPERATION_INPUT === state;
  }
};
