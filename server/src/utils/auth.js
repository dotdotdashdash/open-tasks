const jwt = require(`jsonwebtoken`)
const { throwError } = require(`./handler`)

function authorizeUser(req, res, next) {
    const authToken = req.headers.auth
    const jwtSecretKey = process.env.JWT_SECRET_KEY

    if(!authToken) {
        console.log('Request without auth header received');
        throwError({
            code: 401,
            message: `Please login to access the resource`
        });
    }

    jwt.verify(authToken, jwtSecretKey, (err, userData)=> {
        if(err) {
            throwError({
                code: 401,
                err,
                message: `Unauthorized to access the resource`
            });
        } else {
            console.log(`User authorized: `, userData)
            req.locals.user = userData;
            next();
        }
    }); 
}

module.exports = { authorizeUser }