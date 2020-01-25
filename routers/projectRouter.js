const express = require('express');
const router = express.Router();
const db = require('../data/helpers/projectModel');
const actionDb = require('../data/helpers/actionModel');

router.use(express.json());

router.get('/', (req, res) => {
    db.get()
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'Error accessing the projects!'})
    })
})

router.get('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.get(id)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'Specified ID could not be retrieved!'})
    })
})

router.get('/:id/actions', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.getProjectActions(id)
    .then(project => {
        res.status(200).json(project)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: `There was an error when attempting to retrieve project's actions.`})
      })
})

router.post('/', validateProject, (req, res) => {
    const data = req.body;
    db.insert(data)
    .then(project => {
        res.status(200).json(project)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'There was an error when attempting to post the project data!'})
      })
})

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    const id = req.params.id;
    const data = req.body;
    actionDb.insert({...data, project_id: id})
    .then(project => {
        res.status(200).json(project)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'There was an error when attempting to post the project actions!'})
      })
})

router.delete('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(removed => {
        res.status(200).json(removed)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'The project could not be removed!'})
      })
})

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const id = req.params.id;
    const data = req.body;
    db.insert(id, data)
    .then(project => {
        res.status(200).json(project)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'The project was not updated!'})
      })
})

function  validateProjectId(req, res, next) {
    const id = req.params.id;
    db.get(id)
        .then(project => {
            if(!project) {
                res.status(404).json({error: 'The specified ID does not exist!'})
            } else {
                next();
            }
        })
}

function validateProject(req, res, next) {
    const data = req.body;
    if(!data){
        res.status(400).json({message: 'The user data is missing!'})
    } else if(!data.name){
        res.status(400).json({message: 'The required name field is empty or missing!'})
    } else if(!data.description) {
        res.status(400).json({message: 'The required description field is empty or missing!'})
    } else {
        next();
    }
}

function validateAction(req, res, next) {
    const data = req.body;
    if(!data){
        res.status(400).json({message: 'The action data is missing!'})
    } else if(!data.notes || !data.description){
        res.status(400).json({message: 'The required description and/or notes are missing!'})
    } else {
        next();
    }
}

module.exports = router;
