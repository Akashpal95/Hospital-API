const Doctor = require('../models/doctor');
const Patient = require('../models/patient')
const Report = require('../models/report')
const statusList = ["Negative", "Travelled-Quarantine", "Symptoms-Quarantine", "Positive-Admit"]
const jwt = require('jsonwebtoken');
// Register the patient
module.exports.register = async function(req, res){
    // console.log("Request : ", req.body);
    try{
        let user = await Patient.findOne({number: req.body.number}); 

        if (!user){
            Patient.create(req.body, function(err, user){
                if(err){
                    // console.log('Error in creating patient while signing up'); 
                    // console.log('ERROR :', err.name);
                    return res.status(500).json({
                        message:"Internal Server Error!",
                        error : err.name
                    });
                }
                return res.status(200).json({
                    message:"Patient registered Successfully!",
                    data : {
                        user:user
                    }
                });
            })
        }else{
            return res.status(400).json({
                message:"Patient already exists!",
                data : {
                    user:user
                }
            });
        }
    }
    catch(err){
        console.log('Error in checking if the patient already exists : ', err);
        return res.status(500).json({
            message:"Internal Server Error!",
            error:err.name
        });
    }
}

module.exports.createReport = async function(req, res){
    try{
        let patient  = await Patient.findById(req.params.id);
        // console.log(patient);
        if(patient){
            //Error if status is invalid
            if(!statusList.includes(req.body.status)){
                return res.status(400).json({
                    message:"Invalid Status!"
                });
            }
            //Create the comment along with post id
            let report = await Report.create({
                status:req.body.status,
                doctor:req.user._id,
                patient: patient._id
            });
            
            patient.reports.push(report);
            patient.save();
            return res.status(200).json({
                message:"Report Generated!",
                data : {
                    report:report
                }
            });
        }
        return res.status(404).json({
            message:"Patient couldn't be found!"
        });
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error!"
        });
    }

}

module.exports.showAllReport = async function(req, res){
    // console.log(req.params);
    // console.log(req.user);
    //Populate user of each Post
    try{
        let reports = await Report.find({patient : req.params.id})
        .select('-updatedAt -__v -_id')
        .sort('createdAt')
        .populate('doctor', 'email -_id')//Both ways you can populate, path is used when nested data needs to be populated
        .populate('patient', 'name -_id');

        return res.status(200).json({
            message:'List of reports.',
            data: {
                reports : reports
            }
        })
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error!"
        });
    }
}