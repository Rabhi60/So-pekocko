const mongoose = require('mongoose');// on importe mongoose

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true  },
    name: { type: String, required: true  },
    manufacturer: { type: String, required: true  },
    description: { type: String, required: true  },
    mainPepper: { type: String, required: true  },
    imageUrl: { type: String, required: true  },
    heat: { type: Number, required: true  },
    likes: { type: Number, required: true  },
    dislikes: { type: Number, required: true  },
    usersLikes: { type: Number, required: true  },
    usersDislikes: { type: Number, required: true  },
});

module.exports = mongoose.model('Sauce', sauceSchema);