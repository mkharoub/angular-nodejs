const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//unique here not doing validation, it's for mongose and database for internal optimizations
//require throw an error
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

//we're using the validator here as a plugin, this feature provided by mongoose
//mongoose will run this plugin on the schema
//with this plugin we're adding extra hook which is checks the data before saving it to database.
//Now, unique property above with this plugin will works as a validator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
