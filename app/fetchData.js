var request = require('request');
var JSONUtil = require("jsonutilities");
var _ = require('lodash');
var dbService = require('./db/dbServices')
var lineReader = require('linebyline')
var mongodb = require('mongodb');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

function options(word) {
    return {
        url: 'https://content.googleapis.com/dictionaryextension/v1/knowledge/search?term=' + word + '&language=en&key=AIzaSyC9PDwo2wgENKuI8DSFOfqFqKP2cKAxxso',
        headers: {
            'x-origin': 'chrome-extension://mgijmajocgfcbeboacabfgobmjgjcoja'
        }
    };
}

var files = ["verbs", "emotions", "peopleadj", "apperanceadj", "conditionadj",
    "feelingsadj", "shapeadj", "sizeadj", "soundadj", "timeadj",
    "tasteadj", "quantityadj", "descriptivewords"
]

var file = files[12]

var db = new Db('srujandictionary', new Server("ds023052.mlab.com", 23052, {auto_reconnect: true}));
db.open(function (error, dbCollection) {
    if (error) throw new Error(error);
    db.authenticate("srujanjack", "blueline1", function (err, res) {
        if (!err) {
            console.log("Authenticated");


            lineReader('./dbsource/' + file + '.txt')
                .on('line', function (line, lineCount, byteCount) {


                request(options(line.trim()), function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var obj = JSONUtil.json_getValues_of_key(JSON.parse(body), "senseFamilies");

                        var word = _.flattenDeep(_.uniq(JSONUtil.json_getValues_of_key(obj, "headword")))
                        var synonyms = JSONUtil.json_getValues_of_key(obj, "nym")
                        var definitions = JSONUtil.json_getValues_of_key(obj, "text")
                        var examples = JSONUtil.json_getValues_of_key(obj, "examples")

                        var body = {
                            "word": word[0],
                            "synonyms": _.uniq(synonyms),
                            "definitions": _.uniq(definitions),
                            "examples": _.flattenDeep(_.uniq(examples))
                        }

                        //dbService.saveWord(body, dbCollection, file)
                        if(body.word != undefined){
                            console.log(lineCount+" "+body.word)
                            dbCollection.collection(file, function (error, collection) {
                                collection.insert(body, function (err, records) {
                                    //console.log(body.word)
                                })
                            })
                        }
                    }
                });

            });


        } else {
            console.log("Error in authentication.");
            console.log(err);
        }
    });
});




