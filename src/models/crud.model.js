const mongoose = require('mongoose');

const CRUDSchema = new mongoose.Schema(
    {
        data: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

CRUDSchema.methods.toJSON = function () {
    const crud = this;

    var crudObject = crud.toObject();

    crudObject.id = crudObject._id; 

    delete crudObject.__v;
    delete crudObject._id;
    delete crudObject.createdAt;
    delete crudObject.updatedAt;

    return crudObject;
};

const CRUDObject = new mongoose.model('CRUDObject', CRUDSchema);

module.exports = CRUDObject;
