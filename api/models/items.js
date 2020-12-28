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

  // Check if item is already created
  const existingItem = await getByName(item.name)
  if (existingItem) {
    throw new Error(`An item with name "${item.name}" already exists`)
  }

  // Save
  const params = {
    TableName: process.env.db,
    Item: {
      hk: item.name,
      sk: 'item',
      sk2: shortid.generate(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      description: item.description,
      price: item.price,
      order: item.order,
      active: item.active,
      type: item.type,
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

  // Check if name is already taken
  if (existingItem.name !== item.name) {
    let itemByName = await getByName(item.name)
    if (itemByName.id === item.id) {
      throw new Error(`An item with name "${item.name}" already exists in the ${itemByName.type} section.`)
    }
  }

  // Save
  const params = {
    TableName: process.env.db,
    Item: {
      hk: item.name,
      sk: 'item',
      sk2: item.id,
      updatedAt: Date.now(),
      description: item.description,
      price: item.price,
      order: item.order,
      active: item.active,
      type: item.type,
    }
  }

  await dynamodb.put(params).promise()
}

/**
 * Delete item
 * @param {string} item.id Item id
 */
const remove = async(item = {}) => {

  // Validate
  if (!item.id) {
    throw new Error(`"id" is required`)
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
      hk: existingItem.name,
      sk: 'item',
      sk2: item.id
    }
  }

  await dynamodb.delete(params).promise()
}

/**
 * Get item by name
 * @param {string} name
 */

const getByName = async(name) => {

  // Validate
  if (!name) {
    throw new Error(`"name" is required`)
  }

  // Query
  const params = {
    TableName: process.env.db,
    KeyConditionExpression: 'hk = :hk',
    ExpressionAttributeValues: { ':hk': name }
  }

  let item = await dynamodb.query(params).promise()

  item = item.Items && item.Items[0] ? item.Items[0] : null
  if (item) {
    item.id = item.sk2
    item.name = item.hk
  }
  return item
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
    KeyConditionExpression: 'sk2 = :sk2 and sk = :sk',
    ExpressionAttributeValues: { ':sk2': id, ':sk': 'item' }
  }
  let item = await dynamodb.query(params).promise()

  item = item.Items && item.Items[0] ? item.Items[0] : null
  if (item) {
    item.id = item.sk2
    item.name = item.hk
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
    FilterExpression: 'sk = :sk',
    ExpressionAttributeNames: {
      "sk": ":sk",
    },
    ExpressionAttributeValues: { ":sk": 'item' }
  };

  dynamodb.scan(params, onScan);
  let count = 0;
  let scanResults = [];

  function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {        
        console.log("Scan succeeded.");
        data.Items.forEach(function(itemdata) {
          itemdata.id = itemdata.sk2;
          scanResults.push(itemdata);
          ++count;
        });

        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
  }
  return scanResults;
}

/**
 * Convert item record to public format
 * This hides the keys used for the dynamodb's single table design and returns human-readable properties.
 * @param {*} item 
 */
const convertToPublicFormat = (item = {}) => {
  item.name = item.hk || null
  item.id = item.sk2 || null
  if (item.hk) delete item.hk
  if (item.sk) delete item.sk
  if (item.sk2) delete item.sk2
  return item
}

module.exports = {
  create,
  update,
  remove,
  getByName,
  getById,
  getAll,
  convertToPublicFormat,
}
