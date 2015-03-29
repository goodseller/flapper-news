// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = Schema({
	user_id    : String,
	last_login : Date,
	sessions   : [String],
	info             : {
		nick_name  : String,
		first_name : String,
		last_name  : String,
		birth      : Date,
		others     : Schema.Types.Mixed
	},
    local            : {
        email        : String,
        password     : String,
		create_date  : Date
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
		create_date  : Date
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String,
		create_date  : Date
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
		create_date  : Date
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);