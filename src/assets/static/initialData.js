export default {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/product.schema.json",
  title: "Entity list",
  description: "A list of root entities",
  type: "object",
  properties: {
    headers: {
      description: "Table columns",
      type: "array",
      items: {
        type: "object",
        properties: {
          text: {
            type: "string"
          },
          value: {
            type: "string"
          }
        },
        required: ["text", "value"]
      }
    },
    items: {
      description: "Table rows",
      type: "array",
      items: {
        type: "object",
        properties: {
          entity: {
            type: "string"
          },
          value: {
            type: "string"
          }
        },
        required: ["entity", "value"]
      }
    }
  },
  data: {
    headers: [
      {
        text: "Name of entity",
        value: "entity"
      },
      {
        text: "Entity description",
        value: "description"
      }
    ],
    items: [
      {
        entity: "Desserts",
        description: "100g serving"
      },
      {
        entity: "Vegetables",
        description: "for 1 kg"
      }
    ]
  }
};
