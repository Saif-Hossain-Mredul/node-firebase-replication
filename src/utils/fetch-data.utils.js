const CRUDObject = require('../models/crud.model');

const fetchData = async (skip) => {
    try {
        const recentData = await CRUDObject.find()
            .sort({ updatedAt: 'asc' })
            .skip(parseInt(skip))
            .limit(50);

        return recentData;
    } catch (e) {
        return e.message;
    }
}; 

module.exports = fetchData;
