const Doctor = require('../models/doctor');
const Patient = require('../models/patient')
const Report = require('../models/report')
const jwt = require('jsonwebtoken');
// Register the patient
module.exports.register = async function(req, res){
    console.log(req.body);
    try{
        let user = await Patient.findOne({number: req.body.number}); 

        if (!user){
            Patient.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating patient while signing up'); 
                    return res.json(500, {
                        message:"Internal Server Error!"
                    });
                }
                return res.json(200, {
                    message:"Patient registered Successfully!"
                });
            })
        }else{
            return res.json(400, {
                message:"Patient already exists!"
            });
        }
    }
    catch(err){
        console.log('Error in checking if the patient already exists : ', err);
        return res.json(500, {
            message:"Internal Server Error!"
        });
    }
}

module.exports.createReport = async function(req, res){
    // console.log(req.body);
    // console.log(req.params);
    // console.log(req.user);

    try{
        let patient  = await Patient.findById(req.params.id);
        console.log(patient);
        if(patient){
            //Create the comment along with post id
            let report = await Report.create({
                status:req.body.status,
                doctor:req.user._id,
                patient: patient._id
            });
            
            patient.reports.push(report);
            patient.save();
            return res.json(200, {
                message:"Report Generated!"
            });
        }
        return res.json(404, {
            message:"Patient couldn't be found!"
        });
    }catch(err){
        return res.json(500, {
            message:"Internal Server Error!"
        });
    }

}

module.exports.showAllReport = async function(req, res){
    console.log(req.params);
    // console.log(req.user);
    //Populate user of each Post
    try{
        let reports = await Report.find({patient : req.params.id})
        .select('-updatedAt -__v -_id')
        .sort('-createdAt')
        .populate('doctor', 'email -_id')//Both ways you can populate, path is used when nested data needs to be populated
        .populate('patient', 'name -_id');

        return res.json(200 , {
            message:'List of reports:',
            data: {
                reports : reports
            }
        })
    }catch(err){
        return res.json(500, {
            message:"Internal Server Error!"
        });
    }
}