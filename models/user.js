/**
 * @author: Morebodi Modise
 * @contacts: http://github.com/mrmodise, http://mrmodise.com
 */
// require the needed modules
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* With mongoose, everything is derived from the schema.
We have a Schema below with email, password, profile, address, history properties */
var UserSchema = new Schema({

	email: {type: String, unique: true, lowercase: true},

	facebook: String,

	tokens: Array,

	password: String,

	profile: {
		name: {type: String, default: ''},
		picture: {type: String, default: ''}
	},

	address: String,
	
	history: [{
		paid: {type: Number, default: 0},
		item: {type: Schema.Types.ObjectId, ref: 'Product'}
	}]
});

/* Hash the password before saving it to the database*/ 
UserSchema.pre('save', function(next){

	/* this refers to the user passed as argument to the save method in /routes/user*/
	var user = this;
	// console.log(user) to get an idea of what the user object contains : TODO: remove this

	/* only hash the password if it has been modified or its new */
	if (!user.isModified('password')) return next();

	// generate the salt
	bcrypt.genSalt(10, function(err, salt){

		/* hash the password using the generated salt */
		bcrypt.hash(user.password, salt, function(err, hash){
			
			/* if an error has occured we stop hashing */
			if (err) return next(err);

			/* override the cleartext (user entered) passsword with the hashed one */
			user.password = hash;
			/*return a callback */
			next();	
		});
	});
});

/*compare database password with user user entered password */
UserSchema.methods.comparePassword = function(userPassword){
	/* this.password refers to the database password, 
	userPassword to the password the user entered on the login form*/
	return bcrypt.compareSync(userPassword, this.password);
}

/* add avator incase user does not have a profile picture */
UserSchema.methods.gravatar = function(size){

	if (!this.size) size = 200;

	if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';

	var md5 = crypto.createHash('md5').update(this.email).digest('hex');

	/* return avator to save to database*/
	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}
/* compiling our schema into a model object - a class that constructs documents in mongoose */
module.exports = mongoose.model('User', UserSchema);