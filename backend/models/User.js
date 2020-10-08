const mongoose = require('mongoose');// on importe mongoose
const uniqueValidator = require('mongoose-unique-validator');// on importe mongoose-unique-validator


const userSchema = mongoose.Schema ({
    email: { type: String, required: true, unique: true, },// on a utilsé unique pour qu'on ait une des adresse mail unique
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);// on va l'appliquer au schema avant d'en faire un model

module.exports = mongoose.model('User', userSchema);