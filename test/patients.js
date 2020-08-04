//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Report = require('../models/report');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
let token=''
const statusList = ["Negative", "Travelled-Quarantine", "Symptoms-Quarantine", "Positive-Admit"]

chai.use(chaiHttp);

describe('Patients', () => {
    beforeEach(async() => { 
        //Before each test we empty the database
        await Patient.deleteMany({}); 
        await Doctor.deleteMany({});
        await Report.deleteMany({});
        //Doctor information to register
        let doctor = {
            email: "akash.pal95@gmail.com",
            password: "passpass",
            name: "Dr. Akash Pal"
        }  
        //Create a doctor
        doctor= await Doctor.create(doctor);
        //Get the JWT token after signing in the doctor
        token = await jwt.sign( doctor.toObject(), 'hospitalEncryptionKey',{expiresIn: '1d'}); 
    });
    describe('/POST Register-patient', () => {
        it('Ok, It should register patient successfully.', (done) => {
            //Patient information
            let patient = {
                name: "Anusha",
                number: "9888420363"
            };
          chai.request(server)
              .post('/patients/register')
              .type('form')
              .set({ "Authorization": `Bearer ${token}` })
              .send(patient)
              .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.data.user.should.have.property('_id');
                        res.body.data.user.should.have.property('name');
                        res.body.data.user.should.have.property('number');
                        res.body.data.user.reports.should.have.length(0);
                done();
              });
        });

        it('Fail, It should not register patient without name.', (done) => {
            //Patient information
            let patient = {
                number: "9888420363"
            };
          chai.request(server)
              .post('/patients/register')
              .type('form')
              .set({ "Authorization": `Bearer ${token}` })
              .send(patient)
              .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Internal Server Error!');
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('ValidationError');
                done();
              });
        });

        it('Fail, It should not register patient without number.', (done) => {
            //Incomplete Patient information
            let patient = {
                name:"Anusha"
            };
          chai.request(server)
              .post('/patients/register')
              .type('form')
              .set({ "Authorization": `Bearer ${token}` })
              .send(patient)
              .end((err, res) => {
                    // console.log(res.body.error);
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Internal Server Error!');
                    res.body.should.have.property('error');
                    res.body.should.have.property('error').eql('ValidationError');
                done();
              });
        });
        it('Fail, Don\'t register an already existing patient.', async() => {
            //1st Patient information
            let patient = {
                name: "Anusha",
                number: "9888420363"
            };
            await Patient.create(patient);
            //2nd Patient information
            patient = {
                name: "Anusha valecha",
                number: "9888420363"
            };
            let res =  await chai.request(server)
            .post('/patients/register')
            .type('form')
            .set({ "Authorization": `Bearer ${token}` })
            .send(patient)    
            res.should.have.status(400);
            res.body.should.have.property('message').eql('Patient already exists!');
            
        });
    });
    describe('/POST Create-report', ()=> {

        it('Ok, It should create report successfully.', async() => {
    
            let patient = {
                name: "Anusha",
                number: "9888420363"
            };
            patient = await Patient.create(patient);
            let status = "Negative";
            let res =  await chai.request(server)
                        .post(`/patients/${patient._id}/create_report`)
                        .type('form')
                        .set({ "Authorization": `Bearer ${token}` })
                        .send({status: status});

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.report.should.have.property('status');
            res.body.data.report.should.have.property('doctor');
            res.body.data.report.should.have.property('patient');
        });

        it('Fail, It should not create report for unregistered patient.', async() => {
            //Generating random patient ID to unit test
            let random_id  =  crypto.randomBytes(12).toString('hex');                
            let res =  await chai.request(server)
                        .post(`/patients/${random_id}/create_report`)
                        .type('form')
                        .set({ "Authorization": `Bearer ${token}` })
                        .send({status: "Negative"});
                            
            res.should.have.status(404);
            res.body.should.have.property('message').eql("Patient couldn't be found!");
          });

        it('Fail, It should not create report without status.', async() => {
            let patient = {
                name: "Anusha",
                number: "9888420363"
            };
            patient = await Patient.create(patient);            
            let res =  await chai.request(server)
                        .post(`/patients/${patient._id}/create_report`)
                        .type('form')
                        .set({ "Authorization": `Bearer ${token}` });
            res.should.have.status(400);
            res.body.should.have.property('message').eql("Invalid Status!");
        });  

        it('Fail, It should not create report for invalid status.', async() => {
            let patient = {
                name: "Anusha",
                number: "9888420363"
            };
            patient = await Patient.create(patient);
            let random_status = "Random" ;             
            let res =  await chai.request(server)
                        .post(`/patients/${patient._id}/create_report`)
                        .type('form')
                        .set({ "Authorization": `Bearer ${token}` })
                        .send({status: random_status});
            res.should.have.status(400);
            res.body.should.have.property('message').eql("Invalid Status!");
        });

    });
    describe('/POST All-report-generation', () => {

        it('OK, It should generate all reports of the patient.', async() => {
            let patient = {
                name: "Anusha",
                number: "9888420363"
            };
            patient = await Patient.create(patient);
            for(let i=0; i<4;i++){ 
                let status =  statusList[Math.floor(Math.random() * 4)];       
                await chai.request(server)
                            .post(`/patients/${patient._id}/create_report`)
                            .type('form')
                            .set({ "Authorization": `Bearer ${token}` })
                            .send({status: status});
            }

            let res = await chai.request(server)
                        .post(`/patients/${patient._id}/all_reports`)

                        
            // console.log(res.body);
            res.should.have.status(200);
            res.body.should.have.property('message').eql("List of reports.");
        });

        it('Fail, It should not generate reports for unregistered patient.', async() => {
            //Generating random patient ID to unit test
            let random_id  =  crypto.randomBytes(12).toString('hex');                
            let res =  await chai.request(server)
                        .post(`/patients/${random_id}/create_report`)
                        .type('form')
                        .set({ "Authorization": `Bearer ${token}` })
                        .send({status: "Negative"});
                            
            res.should.have.status(404);
            res.body.should.have.property('message').eql("Patient couldn't be found!");
        });

    })
});