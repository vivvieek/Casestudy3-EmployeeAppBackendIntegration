// Task1: initiate app and run server at 3000
const express=require('express');
const app=express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const log=require('morgan');
app.use(log('dev'));

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

const PORT=3001;
app.listen(PORT,()=>{
    console.log(`Server is running on code ${PORT}`);
});

// Task2: create mongoDB connection 
const mongoose=require('mongoose');
const url = 'mongodb+srv://spvivekbabu:Fsda123@cluster0.iodvl1p.mongodb.net/';
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log('Connected to MongoDB Atlas');
})
.catch((error)=>{
    console.error('MongoDB Atlas connection error:',error);
});

// schema
const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

// model
const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', (req, res) => {
    Employee.find()
      .then((employees) => {
        res.status(200).json(employees);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to fetch employees' });
      });
  });


//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', (req, res) => {
    Employee.findById(req.params.id)
      .then((employee) => {
        if (employee) {
          res.status(200).json(employee);
        } else {
          res.status(404).json({ error: 'Employee not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to fetch employee' });
      });
  });

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

// Save data to db using api '/api/employeelist'
app.post('/api/employeelist', (req, res) => {
    console.log(req.body);
    // Create a new employee object from the request body
    const newEmployee = new Employee({
      name: req.body.name,
      location: req.body.location,
      position: req.body.position,
      salary: req.body.salary
    });
  
    // Save the new employee to the database
    newEmployee.save()
      .then(() => {
        res.status(200).json({ message: 'Employee saved successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to save employee' });
      });
  });


//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id)
      .then((employee) => {
        if (employee) {
          res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
          res.status(404).json({ error: 'Employee not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to delete employee' });
      });
  });



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist' , async (req, res) => {
    console.log(req.body);
    const updateFields = {
      name: req.body.name,
      location: req.body.location,
      position: req.body.position,
      salary: req.body.salary
    };
  
   await  Employee.findByIdAndUpdate(req.body._id, { $set: updateFields }, { new: true })
      .then((employee) => {
        if (employee) {
          res.status(200).json(employee);
        } else {
          res.status(404).json({ error: 'Employee not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to update employee' });
      });
  });
  
  


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});