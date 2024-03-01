const express = require('express');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL database connection configuration
const connection = mysql.createConnection({
    //root- paas: 0532 - 8000
    host: 'localhost',  
    user: 'root', 
    password: '0532', 
    database: 'users',
    port: 8000   
  });
  
//Connecting to MySQL DB
connection.connect(err => {
  if(err) 
  {
    console.error('Error connecting DB: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL DB');
});

//API endpoint
app.get('/DBentry', (req, res) => {
    
    fs.readFile('userdata.json', 'utf8', (err, data) => {
      if(err) 
      {
        console.error('Error reading JSON file: ' + err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      const jsondata = JSON.parse(data);
  
      //Inserting values to the User table 
      connection.query('INSERT INTO user (name, email) VALUES ?', [jsondata.users.map(user => [user.name, user.email])], (err, result) => {
        if(err) 
        {
          console.error('Error inserting data into user table: ' + err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        console.log('Inserted ' + result.affectedRows + ' rows into user table.');
  
        //Inserting values to the user_information table 
        connection.query('INSERT INTO user_information (id, address, phone) VALUES ?', [jsondata.users.map(user => [user.id, user.address, user.phone])], (err, result) => {
          if(err) 
          {
            console.error('Error inserting data into user_information table: ' + err);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }
  
          console.log('Inserted ' + result.affectedRows + ' rows into user_information table.');
          res.status(200).json({ message: 'Data inserted successfully' });
        });
      });
    });
 });
  

// Start the server
app.listen(PORT, ()=> {
  console.log('Server is running on port ' + PORT);
});
