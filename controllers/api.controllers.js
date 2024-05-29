const { selectTopics,} = require('../models/api.models');
const endpoints = require('../endpoints.json')



const getTopics = (req, res, next) => {
    selectTopics()
        .then(topics => {
            res.status(200).send(topics);
        })
        .catch(err => {
            next(err); 
        });
};



const getApi =  (req, res, next) => {
res.status(200).send({endpoints})

}




module.exports = {getTopics, getApi}