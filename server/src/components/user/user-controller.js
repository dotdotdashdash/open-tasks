const { throwError, sendJSONResponse } = require("../../utils/handler");
const { User, findUserByNameAndPhone } = require("./user-services");

async function logInUser(req, res, next) {
    try {
        const { body } = req;
        const connection = req.locals.connection;
        const cred = {
            name: body.name,
            phone: body.phoneNumber
        }
        const _user = await findUserByNameAndPhone(connection, cred);
        
        if (!_user) throwError({
            code: 404,
            message: `User not found`
        });

        let user = new User(_user);
        user.signJwt();       

        sendJSONResponse(res, {
            status: 200,
            data: {
                auth: user.token
            }
        })
    } catch (error) {
        next(error)
    }

}

module.exports = {
    logInUser
}