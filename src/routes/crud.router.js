const express = require('express');
const CRUDObject = require('../models/crud.model');

const crudRouter = express.Router();

crudRouter.post('/post', async (req, res) => {
    try {
        const object = new CRUDObject({ ...req.body });

        await object.save();
        res.status(201).send(object);
    } catch (e) {
        res.status(409).send({ error: { status: 409, message: e.message } });
    }
});

module.exports = crudRouter;
