const express = require('express');
const router = express.Router();
const db = require('../data/helpers/actionModel');

router.use(express.json());

router.get('/', (req, res) => {
    db.get()
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'Error accessing the actions!'})
    })
})

router.get('/:id', validateActionById, (req, res) => {
    const id = req.params.id;
    db.get(id)
    .then(action => {
        res.status(200).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'Specified ID could not be retrieved!'})
    })
})

router.delete('/:id', validateActionById, (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(deleted => {
        res.status(200).json({deleted})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'There was an error when attempting to remove the action!'})
    })
})

router.put('/:id', validateActionById, validateAction, (req, res) => {
    const id = req.params.id;
    const data = req.body;
    db.update(id, data)
    .then( action => {
        res.status(201).json(action)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: 'There was an error when attempting to update the action!'})
    })
})

function validateAction(req,res,next) {
    const data = req.body;
    if(!data){
        res.status(400).json({errorMessage: 'The action data is missing!'})
    } else if(!data.description || !data.notes) {
        res.status(400).json({errorMessage:'The required description and/or notes are missing!'})
    } else {
        next();
    }
}

function validateActionById(req, res, next) {
    const id = req.params.id;
    db.get(id)
    .then(action => {
        if(!action) {
            res.status(404).json({error: 'The specified ID does not exist!'})
        } else {
            next();
        }
    })
}

module.exports = router;
