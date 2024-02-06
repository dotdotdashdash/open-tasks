function errorHandler(err, req, res, next) {
    console.error('An error occurred:', err);

    const statusCode = err.statusCode || 500;
    const message = 'Internal Server Error';

    res
        .status(statusCode)
        .json({ error: message });
};

module.exports = { errorHandler }