var config = require('config.json');
var express = require('express');
var router = express.Router();
var questionService = require('services/questions.service');

// routes
//router.post('/authenticate', authenticateUser);
router.post('/register', registerQuestions);
// router.put('/:_id', updateQuestions);
router.delete('/:_id', deleteQuestions);
router.get('/', exibeQuestions);

module.exports = router;

function authenticateUser(req, res) {
    questionService.authenticate(req.body.username, req.body.password)
        .then(function (response) {
            if (response) {
                // authentication successful
                res.send({ userId: response.userId, token: response.token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerQuestions(req, res) {
    questionService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// function updateQuestions(req, res) {
//     questionService.update(req.params._id, req.body)
//         .then(function () {
//             res.sendStatus(200);
//         })
//         .catch(function (err) {
//             res.status(400).send(err);
//         });
// }

function deleteQuestions(req, res) {
    questionService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function exibeQuestions(req, res) {
    questionService.getAll()
        .then(function (listaQuestions) {
            res.send(listaQuestions);

        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}