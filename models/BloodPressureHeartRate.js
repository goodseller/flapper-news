( function(mongoose) {
	mongoose = mongoose || require('mongoose');
	
	

	// define the schema for our user model
	var BPHRSchema = mongoose.Schema({
		user_id: {type: String, index: true},
		date: { type: Date, default: Date.now, index: true}
		//measurements : {
			// ref:
			// http://www.heart.org/HEARTORG/Conditions/HighBloodPressure/AboutHighBloodPressure/Understanding-Blood-Pressure-Readings_UCM_301764_Article.jsp
			// http://en.wikipedia.org/wiki/Blood_pressure
		upper_bp /*Systolic_mm_Hg*/ : Number,
		lower_bp /*Diastolic_mm_Hg*/ : Number,
		pulse: /*Pulse pressure*/: Number,
		//}
	});
	
	var BPHRAnalSchema = mongoose.Schema({
		user_id: String,
		date: Date
		d: {
			type: Array
		},
		m: {
			type: Array
		},
		y: {
			type: Array
		}
	});


	// generating a hash
	BPHRAnalSchema.methods.analyze = function(password) {
		return false;
	};

	// create the model for users and expose it to our app
	module.exports = mongoose.model('BPHR', BPHRSchema);
}(mongoose));




