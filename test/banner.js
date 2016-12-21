module.exports = function (req, res, next) {
    debugger
    if (req['page']['yan'] == 1) {
        res.sendFile(__dirname + '/banner.json', function (err) {
            if (err) {
                next(err);
                // res.status(err.status).end();
            }
            // res.end();
        });
    } else {
        res.sendFile(__dirname + '/banner2.json', function (err) {
            if (err) {
                next(err);
                // res.status(err.status).end();
            }
            // res.end();
        });
    }
};
