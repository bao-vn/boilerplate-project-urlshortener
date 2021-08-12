let mongoose;
try {
    mongoose = require("mongoose");
} catch (e) {
    console.log(e);
}

// 0. import common module
const util = require('../common/util.js');

// 1. import module
const ShortenerModule = require('../model/ShortenerDto.js');

// 2. Create Schema
const shortenerSchema = new mongoose.Schema({
    original_url: { type: String, required: true },
    short_url: { type: Number, required: true },
});

// Create a instance for shortener Schema
const shortenerModel = mongoose.model("Shortener", shortenerSchema);

// Create function repository
const saveShortener = (originalURL, middleware) => {
    // validate URL
    const validURL = /^((http|https):\/\/)(www.)?[a-zA-Z0-9@:%._\/\-+~#?&//=]{2,256}$/g;

    if (!validURL.test(originalURL)) {
        middleware(null, { error: 'invalid url' });
        return;
    };

    // Create UUID
    const UUID = util.getRandomInt(0, 1000);

    // Create object shortener contain ID and shortener
    const shortenerDto = new ShortenerModule.ShortenerDto(originalURL, UUID);
    const shortenerDao = new shortenerModel(shortenerDto);

    console.log(shortenerDto);

    // save object to DB
    shortenerDao.save((err, data) => {
        if (err) {
            middleware(err);
        } else {
            console.log("shortener object: " + data);
            middleware(null, data);
        }
    });
}

// Get shortener from DB
const getShortenerByShortURL = (shortURL, middleware) => {
    shortenerModel.find({
        short_url: shortURL
    }, (err, data) => {
        if (err) {
            middleware(err);
        } else {
            console.log(data);
            middleware(null, data);
        }
    });
}

module.exports = {
    shortenerModel: shortenerModel,
    saveShortener,
    getShortenerByShortURL,
}