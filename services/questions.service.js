var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('questions');

var service = {};

//service.authenticate = authenticate;
service.create = create;
// service.update = update;
service.delete = _delete;
service.getAll = getAll;

module.exports = service;

// function authenticate(username, password) {
//     var deferred = Q.defer();

//     db.users.findOne({ username: username }, function (err, user) {
//         if (err) deferred.reject(err.name + ': ' + err.message);

//         if (user && bcrypt.compareSync(password, user.hash)) {
//             // authentication successful
//             deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
//         } else {
//             // authentication failed
//             deferred.resolve();
//         }
//     });

//     return deferred.promise;
// }


function create(questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findOne(
        {question: questionParam.question },
        function (err, questionBD) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (questionBD) {
                // question already exists
                deferred.reject('Question "' + questionParam.question + '" is already taken');
            } else {
                createquestion();
            }
        });

    function createquestion() {
        // set question object to questionParam without the cleartext password
        // var user = _.omit(userParam, 'password');
        // var question = _.omit(idQuestionParam, 'idQuestion', questionParam, 'question')
        // add hashed password to user object
        // user.hash = bcrypt.hashSync(userParam.password, 10);

        //var deferred = Q.defer();

        db.questions.insert(
            questionParam,
            function (err, doc) { // retorno do banco de dados
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.questions.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();
    db.questions.find({}).toArray(
        function (err, resulBD) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(resulBD);
        
    });
    return deferred.promise;
}