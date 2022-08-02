module.exports = modifySearchResult = (dataList) => {
    dataList.forEach((data, index) => {
        dataList[index] = {
            id: data._id,
            data: data.data,
        };
    });

    return dataList;
};
