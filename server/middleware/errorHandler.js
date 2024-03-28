const errorHandler = (err, req, res, next) => {
    if (!err.message)
        err.message = 'Sorry, something went wrong!';
    if (!err.statusCode)
        err.statusCode = 500;
    const { statusCode, message } = err;
    console.log(err);

    switch (statusCode) {
        case 400:
            res.status(statusCode).json({ title: 'Bad Request', message });
            break;
        case 401:
            res.status(statusCode).json({ title: 'Unauthenticated', message });
            break;
        case 403:
            res.status(statusCode).json({ title: 'Forbidden', message });
            break;
        case 404:
            res.status(statusCode).json({ title: 'Not Found', message });
            break;
        default:
            res.status(statusCode).json({ title: 'Internal Server Error', message });
            break;
    }
}

module.exports = errorHandler;