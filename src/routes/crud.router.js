const express = require('express');
const CRUDObject = require('../models/crud.model');

const crudRouter = express.Router();

crudRouter.post('/post', async (req, res) => {
    // {
    //     "data": {
    //         "name": "saif hossain",
    //         "roll": 15,
    //         "age": 22
    //     }
    // }
    console.log({...req.body});
    console.log({...req.headers});
    try {
        const object = new CRUDObject({ ...req.body });

        await object.save();
        res.status(201).send(object);
    } catch (e) {
        res.status(409).send({ error: { status: 409, message: e.message } });
    }
});

crudRouter.get('/get', async (req, res) => {
    // {
    //     "skip":1
    // }
    try {
        const recentData = await CRUDObject.find()
            .sort({ createdAt: 'desc' })
            .skip(parseInt(req.body.skip))
            .limit(50);

        res.send(recentData);
    } catch (e) {
        res.status(400).send({ error: { status: 400, message: e.message } });
    }
});

crudRouter.delete('/delete', async (req, res) => {
    // {
    //     "id": "62a9ae014fb1d01ad3885e77"
    // }
    try {
        const object = await CRUDObject.findOneAndDelete({ _id: req.body.id });

        res.status(200).send(object);
    } catch (e) {
        res.status(404).send({ error: { status: 404, message: e.message } });
    }
});

crudRouter.patch('/update', async (req, res) => {
    // {
    //     "id": "62a9adff4fb1d01ad3885e71",
    //     "updates": {
    //         "name": "Saif Mredul",
    //         "age": 28
    //     }
    // }
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
