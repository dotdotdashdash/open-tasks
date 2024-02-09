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

    const statusCode = err.httpErrorCode || 500; //TODO: HANDLE THIS error code can be different from http status codes
    const message = err.errorMessage || 'Internal Server Error';

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
    error.httpErrorCode = error.code || 500;
    error.errorMessage = error.message || error || `Unknown error`

    throw error;
}

module.exports = { errorHandler, throwError, sendJSONResponse }