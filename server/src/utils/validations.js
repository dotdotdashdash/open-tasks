const Joi = require(`joi`)

const createTasksSchema = Joi.array().items(
    Joi.object({
        title:Joi.string().required(),
        description: Joi.string(),
        due_date: Joi.date().required()
    })
)

module.exports = {
    createTasksSchema
}