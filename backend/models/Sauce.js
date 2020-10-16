const mongoose = require('mongoose');// on importe mongoose
const validate = require('mongoose-validator');

nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-z\d\-.'\s]+$/i,
      })
]

descriptionValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 200],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-z\d\-,.'\s]+$/i,
      })
]


const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true  },
    name: { type: String, required: true, validate: nameValidator  },
    manufacturer: { type: String, required: true, validate: nameValidator  },
    description: { type: String, required: true, validate: descriptionValidator },
    mainPepper: { type: String, required: true, validate: descriptionValidator  },
    imageUrl: { type: String, required: true  },
    heat: { type: Number, required: true  },
    likes: { type: Number, required: true  },
    dislikes: { type: Number, required: true  },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);