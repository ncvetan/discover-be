const errorHandler = (err, req, res) => {
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status);
    res.json({ message: err.message });
};

module.exports = errorHandler;
