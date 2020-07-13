const Doctor = require('../models/doctor');
const jwt = require('jsonwebtoken');
// get the sign up data
module.exports.register = async function(req, res){
    console.log(req.body);
    try{
        //Check if user already exists
        let user = await Doctor.findOne({email: req.body.email}); 

        if (!user){
            //Create user
            Doctor.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user while signing up'); 
                    return res.json(500, {
                        message:"Internal Server Error!"
                    });
                }
                return res.json(200, {
                    message:"User created, Please sign in to continue!"
                });
            })
        }else{
            return res.json(400, {
                message:"User already exists!"
            });
        }
    }
    catch(err){
        console.log('Error in checking if the user already exists : ', err);
        return res.json(500, {
            message:"Internal Server Error!"
        });
    }
}

// sign in and create a session for the user
module.exports.createSession =async function(req, res){
    try{
        let user = await Doctor.findOne({email:req.body.email})
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message:"Invalid username/password!"
            });
        }

        return res.json(200, {
            message:"Sign in successful, here is your token, please keep it safe.",
            data: {
                token: jwt.sign(user.toObject(), 'hospitalEncryptionKey', {expiresIn: '1d'})
            }
        });
    }catch(error){
        console.log(error);
        return res.json(500, {
            message: "Internal Server Error!"
        })
    }
    
}
