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

crudRouter.delete('/delete', async (req, res) => {
    try {
        const object = await CRUDObject.findOneAndDelete({ _id: req.body.id });

        res.status(200).send(object);
    } catch (e) {
        res.status(404).send({ error: { status: 404, message: e.message } });
    }
});

crudRouter.patch('/update', async (req, res) => {
    try {
        const filter = { _id: req.body.id };
        const updates = { ...req.body.updates };
        const object = await CRUDObject.findOneAndUpdate(
            filter,
            { data: updates },
            {
                new: true,
            }
        );

        if (!object) throw new Error('Error updating document');

        res.send(object);
    } catch (e) {
        res.status(400).send({ error: { status: 400, message: e.message } });
    }
});

module.exports = crudRouter;
