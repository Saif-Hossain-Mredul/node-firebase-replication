const mongoose = require('mongoose');

const CRUDSchema = new mongoose.Schema(
    {
        data: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

CRUDSchema.methods.toJSON = function () {
    const crud = this;

    const crudObject = crud.toObject();

    delete crudObject.__v;
    delete crudObject.createdAt;
    delete crudObject.updatedAt;

    return crudObject;
};

const CRUDObject = new mongoose.model('CRUDObject', CRUDSchema);

module.exports = CRUDObject;
