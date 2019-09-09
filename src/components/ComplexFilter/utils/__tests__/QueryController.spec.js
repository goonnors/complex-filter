import QueryController from "../QueryController";

describe("QueryController.js", () => {
  const createVM = (line) => {
    return new QueryController(line);
  };

  test('sanity', () => {
    const query = createVM();
    expect(query.line).toBe('');
  });

  test('parse', () => {
    const query = createVM('Desserts: calories != 237 AND name = Frozen Yogurt ');
    expect(query.list).toHaveLength(9);
  });

  test('validate', () => {
    const query = createVM('Desserts: calories != 237 AND name = Frozen Yogurt ');
    query.validate();
  });
});
