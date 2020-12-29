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
    await items.create(req.body)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

  let item
  try {
    item = await items.getByName(req.body.name)
  } catch (error) {
    console.log(error)
    return next(error, null)
  }

  res.json({ message: 'create item successful', item })
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
      await items.create(element)
    } catch (error) {
      return res.status(400).json({ error: error.message })
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

  let item
  try { item = await items.getById(req.body.id) }
  catch (error) { return done(error, null) }

  if (!item) {
    return res.status(404).send({ error: 'Update failed. Item not found.' })
  }

  try {
    await items.update(req.body)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: 'Update item successful', item })
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
  get,
  getAll,
  remove
}