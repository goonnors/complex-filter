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
    return state === 4 ? 1 : ++state;
  },
  getStateById(stateId) {
    const [type] = Object.entries(types).find(([, value]) => value === stateId);
    return type;
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
  },
  isCellValueSelection(state) {
    return types.CELL_VALUE_SELECTION === state;
  },
  isKeywordInput(state) {
    return types.KEYWORD_INPUT === state;
  }
};
