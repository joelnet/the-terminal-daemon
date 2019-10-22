const withUpdatedAt = collection => ({
  find: collection.find.bind(collection),
  findAndRemove: collection.findAndRemove.bind(collection),
  remove: collection.remove.bind(collection),

  insert: data => {
    data.updated_at = new Date()
    return collection.insert(data)
  },

  update: data => {
    data.updated_at = new Date()
    return collection.update(data)
  },

  updateWhere: (filterFunction, updateFunction) =>
    collection.updateWhere(filterFunction, data => {
      data.updated_at = new Date()
      updateFunction(data)
    })
})

module.exports = {
  withUpdatedAt
}
