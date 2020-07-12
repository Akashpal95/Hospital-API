const Report = require('../models/report');

module.exports.showReports = async function(req, res){

    try{
        let reports = await Report.find({status : req.params.status})
        .select('-updatedAt -__v -_id')
        .sort('-createdAt')
        .populate('doctor', 'email -_id')//Both ways you can populate, path is used when nested data needs to be populated
        .populate('patient', 'name -_id');

        return res.json(200 , {
            message:`List of ${req.params.status} reports:`,
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