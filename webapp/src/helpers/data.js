const oldJSONData = {
  "time" : 0,
  "blocks" : [
      {
          type: 'paragraph',
          data: {
              text: 'its create test'
          }
      }
  ],
  "version" : 0
};
const newJSONData = {
  "time" : 0,
  "blocks" : [
    {
        type: 'paragraph',
        data: {
            text: 'its create test'
        }
    },  {
        type: 'paragraph',
        data: {
            text: 'its update test'
        }
    }
  ],
  "version" : 0
};

// const oldJSONData = {
//   data: ["apple", "orange", "mango"]
// }
// const newJSONData = {
//   data: ["apple", "banana", "mango", "blueberry"]
// }
export {
  oldJSONData, newJSONData
}