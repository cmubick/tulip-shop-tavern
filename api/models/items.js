/**
 * Model: Items
 */

const AWS = require('aws-sdk')
const shortid = require('shortid')

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

/**
 * Create item
 * @param {string} item.name Item name
 * @param {string} item.description Item description
 * @param {string} item.price Item price
 * @param {string} item.order Item order
 * @param {string} item.active Item active
 * @param {string} item.type Item type
 */
const create = async(item = {}) => {

  // Validate
  if (!item.name) {
    throw new Error(`"name" is required`)
  }
  if (!item.type) {
    throw new Error(`"type" is required`)
  }

  // Save
  const params = {
    TableName: process.env.db,
    Item: {
      hk: shortid.generate(),
      sk: 'item',
      sk2: 'item',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      description: item.description,
      price: item.price,
      order: item.order,
      active: item.active,
      type: item.type,
      name: item.name
    }
  }

  await dynamodb.put(params).promise()
}

/**
 * Update item
 * @param {string} item.id Item id
 * @param {string} item.name Item name
 * @param {string} item.description Item description
 * @param {string} item.price Item price
 * @param {string} item.order Item order
 * @param {string} item.active Item active
 * @param {string} item.type Item type
 */
const update = async(item = {}) => {

  // Validate
  if (!item.id) {
    throw new Error(`"id" is required`)
  }
  if (!item.name) {
    throw new Error(`"name" is required`)
  }
  if (!item.type) {
    throw new Error(`"type" is required`)
  }

  // Check if item exists
  const existingItem = await getById(item.id)
  if (!existingItem) {
    throw new Error(`An item with id "${item.id}" does not exists`)
  }

  // Save
  const params = {
    TableName: process.env.db,
    Item: {
      hk: item.id,
      sk: 'item',
      updatedAt: Date.now(),
      description: item.description,
      price: item.price,
      order: item.order,
      active: item.active,
      type: item.type,
      name: item.name
    }
  }

  await dynamodb.put(params).promise()
}

/**
 * Delete item
 * @param {string} item.id Item id
 * @param {string} item.name Item name
 * @param {string} item.description Item description
 * @param {string} item.price Item price
 * @param {string} item.order Item order
 * @param {string} item.active Item active
 * @param {string} item.type Item type
 */
const remove = async(item) => {

  // Validate
  if (!item.id) {
    throw new Error(`"id" is required`)
  }

  const params = {
    TableName:process.env.db,
    Key:{
      "hk": item.id,
      "sk": "item"
    },
    ConditionExpression:"hk = :val",
    ExpressionAttributeValues: {
        ":val": item.id
    }
  }

  dynamodb.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
}

/**
 * Get item by id
 * @param {string} id
 */

const getById = async(id) => {

  // Validate
  if (!id) {
    throw new Error(`"id" is required`)
  }

  // Query
  const params = {
    TableName: process.env.db,
    IndexName: process.env.dbIndex1,
    KeyConditionExpression: 'hk = :hk and sk = :sk',
    ExpressionAttributeValues: { ':hk': id, ':sk': 'item' }
  }
  let item = await dynamodb.query(params).promise()

  item = item.Items && item.Items[0] ? item.Items[0] : null
  if (item) {
    item.id = item.hk
  }
  return item
}

/**
 * Get all items
 */

const getAll = async() => {
  const params = {
    TableName: process.env.db,
    IndexName: process.env.dbIndex1,
  };

  let scanResults = [];
  let items;
  do {
      items =  await dynamodb.scan(params).promise();
      items.Items.forEach((item) => {
        if (item.sk === "item") {
          item.id = item.hk;
          scanResults.push(item);
        }
      });
      params.ExclusiveStartKey  = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != "undefined");

  return scanResults;
}

/**
 * Convert item record to public format
 * This hides the keys used for the dynamodb's single table design and returns human-readable properties.
 * @param {*} item 
 */
const convertToPublicFormat = (item = {}) => {
  item.id = item.hk || null
  if (item.hk) delete item.hk
  if (item.sk) delete item.sk
  return item
}

module.exports = {
  create,
  update,
  remove,
  getById,
  getAll,
  convertToPublicFormat,
}
