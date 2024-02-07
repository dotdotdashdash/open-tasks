function sendJSONResponse(res, responseData = {}) {
    let response = {};

    if (!responseData.code) response.code = 200;
    if (response.code == 200) response.success = true;
    response.data = responseData.data;
    
    if (responseData.message) response.message = responseData.message

    res
        .status(response.code)
        .json(response)
}

function errorHandler(err, req, res, next) {
    console.error('ERROR OCCURED:', err);

    const statusCode = err.code || 500;
    const message = err.message || 'Internal Server Error';

    res
        .status(statusCode)
        .json({
            code: statusCode,
            success: false,
            error: message 
        });
};

function throwError(error = {}) {

    error.err = error.err
    error.code = error.code || 500;
    error.message = error.message || error || `Unknown error`

    throw error;
}

module.exports = { errorHandler, throwError, sendJSONResponse }