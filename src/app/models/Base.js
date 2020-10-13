const db = require("../config/db")

function find(filters, table) {
  let query = `SELECT * FROM ${table}`

  if (filters) {
    Object.keys(filters).map(key => {
      // WHERE | OR | AND
      query += ` ${key}`

      Object.keys(filters[key]).map(field => {
        query += ` ${field} = '${filters[key][field]}'`
      })
    })
  }

  return db.query(query)
}

const Base = {
  init({
    table
  }) {

    if (!table) throw new Error('Invalid params.')

    this.table = table

    return this
  },
  async find(id) {
    try {
      const results = await find({
        where: {
          id
        }
      }, this.table)

      return results.rows[0]
    } catch (err) {
      console.error(err);
    }
  },
  async findOne(filters) {
    try {
      const results = await find(filters, this.table)

      return results.rows[0]
    } catch (err) {
      console.error(err);
    }
  },
  async findAll(filters) {
    try {
      const results = await find(filters, this.table)

      return results.rows
    } catch (err) {
      console.error(err);
    }
  },
  async create(fields) {
    try {

      let keys = [],
        values = []

      Object.keys(fields).map((key) => {
        keys.push(key)
        values.push(`'${fields[key]}'`)
      })

      const query = `
        INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id
      `

      const results = await db.query(query)

      return results.rows[0].id
    } catch (err) {
      console.error(err);
    }
  },
  async update(id, fields) {
    try {

      let update = []

      //category_id=($1),

      Object.keys(fields).map(key => {

        const line = `${key} = '${fields[key]}'`
        update.push(line)

      })

      let query = `UPDATE ${this.table} SET
      ${update.join(',')} WHERE id = ${id}
      `
      return db.query(query)

    } catch (err) {
      console.error(err);
    }
  },
  async delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
  },
}

module.exports = Base