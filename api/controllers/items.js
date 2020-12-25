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
 * Update Item
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const update = async (req, res, next) => {

  let item
  try { item = await item.getById(req.body.id) }
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
 * Get a user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get = async (req, res, next) => {
  const user = users.convertToPublicFormat(req.user)
  res.json({ user })
}

/**
 * Remove Item
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const remove = async (req, res, next) => {

  let item
  try { item = await item.getById(req.body.id) }
  catch (error) { return done(error, null) }

  if (!item) {
    return res.status(404).send({ error: 'Remove failed. Item not found.' })
  }

  try {
    await items.remove(req.body)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: 'Remove item successful' })
}

module.exports = {
  create,
  update,
  get,
  remove
}