const Joi = require(`joi`)

const createTasksSchema = Joi.array().items(
    Joi.object({
        title:Joi.string().required(),
        description: Joi.string(),
        due_date: Joi.date().required()
    })
);

const createSubtasksForTaskSchema = Joi.array().items(
    Joi.object({
        description: Joi.string().required(),
        status: Joi.number().valid(0,1)
    })
);

const editTaskByIdSchema = Joi.object({
    title:Joi.string(),
    description: Joi.string(),
    dueDate: Joi.date(),
    status: Joi.string().valid("TODO", "DONE", "IN_PROGRESS")
});

const editSubtaskByIdSchema = Joi.object({
    status: Joi.number().valid(0,1).required()
});


module.exports = {
    createTasksSchema,
    createSubtasksForTaskSchema,
    editTaskByIdSchema,
    editSubtaskByIdSchema
}