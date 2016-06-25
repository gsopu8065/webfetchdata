/**
 * Created by srujangopu on 6/25/16.
 */

var dbservice = {

    saveWord: function (body, dbCollection, db) {
        dbCollection.collection(db, function (error, collection) {
            collection.insert(body, function (err, records) {
                console.log(body.word)
            })
        });
    }
}

module.exports = dbservice;