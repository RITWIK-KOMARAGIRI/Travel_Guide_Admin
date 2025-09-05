const mongoose = require("mongoose");
const loginSchema = new mongoose.Schema({
    id:Number,
    name:String,
    userName:String,
    email:String,
    password:String,
});
const AdminLogin = new mongoose.Schema({
    id:Number,
    name:String,
    userName:String,
    email:String,
    password:String,
});
const placeSchema = new mongoose.Schema({
    placename:String,
    month:String,
    about:String,
    minbudget:Number,
    official:String
});
const tovisit = new mongoose.Schema({
    place:String,
    tovisit:[{
      name:String,
    budget:Number,
    opening:String,
    closing:String,
    rules:String
    }]
});
const budgetSchema = new mongoose.Schema({
  place:String,
   totalbudget:Number,
   persons:Number,
   type:String
});
const toprated = new mongoose.Schema({
    place:String,
    minbudget:Number,
    maxbudget:Number,
    official:String,
    details:String,
    img:String
});
const hotelsSchema = new mongoose.Schema({
    place:String,
    hotels: [
        {
            name:String,
            rating:Number,
            budget:Number
        }
    ]
});
const homestays = new mongoose.Schema({
    place:String,
    stays:[
        {
            name:String,
            rating:Number,
            budget:Number
        }
    ]
});
const hospitalSchema = new mongoose.Schema({
   place:String,
   hospitals:[String]
});

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  trips: {
    type: [String], // Array of trip names or IDs
    default: []
  },
  personalInfo: {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true
    },
    payment: {
      type: String // e.g., "Credit Card", "UPI", etc.
    },
    phone: {
      type: String, // use String to support "+91..." or leading zeroes
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v); // basic validation
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  }
});

const loginModel = mongoose.model("Login",loginSchema);
const placeModel = mongoose.model("MainPlace",placeSchema);
const tovisitModel = mongoose.model("NearbyPlaces",tovisit);
const budgetModel = mongoose.model("Buget",budgetSchema);
const topratedModel = mongoose.model("Top rated",toprated);
const hotelsModel = mongoose.model("Hotels",hotelsSchema);
const homestaysModel = mongoose.model("Home stays ",homestays);
const hospitalModel = mongoose.model("Hospitals",hospitalSchema);
const profileModel = mongoose.model("Profile",profileSchema);
const AdminloginModel = mongoose.model("AdminLogin", AdminLogin);
module.exports ={
    loginModel,
    placeModel,
    tovisitModel,
    budgetModel,
    topratedModel,
    hotelsModel,
    homestaysModel,
    hospitalModel,
    profileModel,
    AdminloginModel
}