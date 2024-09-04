// Requiring modules
const express = require('express');
const app = express();
const mssql = require("mssql");
// Get request
function Conectar() {

    app.get('/', function (req, res) {
        // Config your database credential
        const config = {
            user: 'usuarios',
            password: '1234',
            server: '192.168.0.46',
            database: 'Mtto'
        };
    
        // Connect to your database
        mssql.connect(config, function (err) {
    
            // Create Request object to perform
            // query operation
            let request = new mssql.Request();
    
            // Query to the database and get the records
            request.query('select * from Mtto',
                function (err, records) {
    
                    if (err) console.log(err)
    
                    // Send records as a response
                    // to browser
                    res.send(records);
    
                });
        });
    });
    
    let server = app.listen(5000, function () {
        console.log('Server is listening at port 5000...');
    });

}