var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;


module.exports = function () {

    var db = new Db('srujandictionary', new Server("ds023052.mlab.com", 23052, {auto_reconnect: true}));
    db.open(function (error, databaseConnection) {
        if (error) throw new Error(error);
        db.authenticate("srujanjack", "blueline1", function (err, res) {
            if (!err) {
                console.log("Authenticated");
                databaseConnection;

            } else {
                console.log("Error in authentication.");
                console.log(err);
            }
        });
    });

};