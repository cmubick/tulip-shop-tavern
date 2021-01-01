/**
 * Controllers: Items
 */

const { items } = require('../models')

/**
 * Create Item
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 */
const create = async (req, res, next) => {

  try {
    await items.put(req.body)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: 'create item successful' })
}

/**
 * Create Many
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 */
const createMany = async (req, res, next) => {

  await req.body.data.forEach(async (element) => {
    try {
      await items.put(element)
    } catch (error) {
      console.log(`{ error: ${error.message}`)
    }
  });

  res.json({ message: 'create items successful' })
}

/**
 * Update Item
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const update = async (req, res, next) => {

  let item = await items.getById(req.body.id)

  if (!item) {
    return res.status(404).send({ error: 'Update failed. Item not found.' })
  }

  await items.put(req.body)

  res.json({ message: 'Update item successful', item })
}

/**
 * Update Many
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 */
const updateMany = async (req, res, next) => {

  await req.body.data.forEach(async (element) => {
    try {
      let item = await items.getById(element.id)

      if (!item) {
        return res.status(404).send({ error: 'Update failed. Item not found.' })
      }
      
      await items.put(element)
    } catch (error) {
      console.log(`{ error: ${error.message}`)
    }
  });

  res.json({ message: 'create items successful' })
}

/**
 * Get an item
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get = async (req, res, next) => {
  const item = await items.getById(req.body.id)
  res.json({ item })
}

/**
 * Get all items
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getAll = async (req, res, next) => {
  const returnItems = await items.getAll()
  res.json({ returnItems })
}

/**
 * Remove Item
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const remove = async (req, res, next) => {

  let item
  let response
  try { item = await items.getById(req.body.id) }
  catch (error) { return done(error, null) }

  if (!item) {
    return res.status(404).send({ error: 'Remove failed. Item not found.' })
  }

  try {
    response = await items.remove(item)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: 'Remove item successful' })
}

module.exports = {
  create,
  createMany,
  update,
  updateMany,
  get,
  getAll,
  remove
}