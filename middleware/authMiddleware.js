module.exports = function (req, res, next) {

    const { user } = req.session

    if (!user) {

        return res.status(401).send({
            status: false,
            "message": "unauthorized access please login again"
        })
    }
    next();
}