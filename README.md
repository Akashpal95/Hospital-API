# Hospital-API
An API to develop a patient management application for doctors.

# Description 
An API for the doctors of a Hospital which has been
allocated by the govt for testing and quarantine + well being of COVID-19
patients.
Doctors can log in and each time a patient visits, the doctor will follow 2 steps
  - Register the patient in the app (using phone number, if the patient
    already exists, returns the patient info in the API)
  - After the checkup, create a Report
  - Patient Report will have the following fields:
      - Created by doctor
      - Status[Negative, Travelled-Quarantine,
        Symptoms-Quarantine, Positive-Admit]
      - Date

# Routes Present
- /doctors/register 
   → Register doctors with their username and password and store the data in mongoDB.
- /doctors/login 
   → To match the username and password and return the JWT to be stored and used for client requests.
- /patients/register
   → To register a patient using their phone number.
- /patients/:id/create_report
   → Creates a report for the patient and stores it in mongoDB, 
- /patients/:id/all_reports 
   → List all the reports of a patient oldest to latest.
- /reports/:status 
   → List all the reports of all the patients filtered by a specific
status.

## Setting up the project
1. Clone at your local system.
2. Open the folder in visual studio code.
3. Open terminal and make the project folder as your current directory
4. Install all the dependencies as mentioned in the package.json :
```
npm install
```
5. Configure your secret encryption key used in passport-jwt-strategy.

6. input the command `npm start` on terminal

7. Pat yourself in the back for making it so far!!

# Unit Tests

1.Unit Tests for route: /patients/register

    a. it should not register a patient without phone number
    b. it should not register a patient with a phone already registered
    c. it should register a new patient when all mandatory details are present and phone number is unique
    d. it should create a report successfully if status is valid and patient id is registered
    
2.Unit Tests for route: /patients/:id/create_report

    a. it should not create a report if pateint id in url is not registered
    b. it should not create a report if status code is missing
    c. it should not create a report if status code is invalid
    d. it should create a report successfully if status is valid and patient id is registered
    
3.Unit Tests for route: /patients/:id/all_reports

    a.it should not return any reports if pateint id in url is not registered
    b.it should return all the reports correspoding to the patient id in url
    
# Directory Structure
The Directory strutcure follows a MVC design pattern with each folder serving a specific purpose making it easily maintainable as well as scalable.

    /assets - Folder for static files

    /config - Folder for all config files used for setting up the project.

    /routes - Folder for all route files, correspoding to each URL the client may use

    /models - Folder for all DB schema files

    /controller - Folder for all the modules responsible for processing data, each file containing all the functions for the corresponding route

    /test - Folder for all the unit tests
