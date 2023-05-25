const express = require('express');
const db= require("./database.js")

const bodyParser = require('body-parser');
const session = require('express-session');
const sign= require("./validate.js")
const datab= require("./database_connect.js")
const bcrypt =require("bcryptjs")
const ejs = require('ejs');
const app = express();


// Database connection


// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
 
  if (!sign.validateBoth(email,password) ) {
    return res.render('login', { message: 'Please enter both email and password' });
  }
  try{
    //const userId = await db(sql)
    const login_result= await datab.login(email,password)

    console.log(login_result)
    if (login_result==0){
      res.render('login', { message: 'Invalid email or password' });

    }else{
      req.session.loggedIn = true;
      req.session.email = email;
      req.session.identify = login_result;
      
      console.log(req.session.identify)
      res.redirect('/index');
      
    }
   
}
catch(e){
    console.error(e)
    return res.status(500).send({
        success: false,
        message: 'internal server error'
    })
}
  
});


app.get('/signup', (req, res) => {
  res.render('signup', { message: '' });
});

app.post('/signup', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;
  const fullname= req.body.fullname;

  if (!sign.validateAll(fullname,email,password,age)) {
    return res.render('signup', { message: 'Please enter all fields' });
  }

  if (!sign.validateEmail(email)) {
    return res.render('signup', { message: 'Please enter a valid email address' });
  }

  if (!sign.validatePassword(password)) {
    return res.render('signup', { message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
  }
   const hpassword= await sign.hash(password)
   console.log(hpassword)
  // console.log(sign.validateEmail(email))
  try{
    //const userId = await db(sql)
    const signupp= await datab.signup(fullname,email,password,age)
    console.log(signupp)
    if (signupp){
      res.render('signup', { message: 'email already exists' });

    }else{
      req.session.loggedIn = true;
      req.session.email = email;
      res.redirect('/index');
    }
   
}
catch(e){
    console.error(e)
    return res.status(500).send({
        success: false,
        message: 'internal server error'
    })
}
  
   
});


// app.get('/index', (req, res) => {
  
// });

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/index', (req, res) => {

  // if (!req.session.loggedIn) {
  //   res.redirect('/');
  // } else {
  //   res.render('index', { email: req.session.email });
  // }
  const query = 'SELECT * FROM tasks WHERE user_id = ?';
   
 
  db.query(query,[req.session.identify] ,(err, results) => {
    if (err) {
      console.error('Error retrieving tasks: ', err);
      res.render('index', { error: 'Failed to retrieve tasks', tasks: [] });
      return;
    }
    res.render('index', { tasks: results });
  });
});

// Add new task
app.post('/add', async (req, res) => {
  const task = req.body.task;
  const date=req.body.date;
const desc=req.body.description;

  // const result = dval.check(task);
  // dval.check(task, (err, usertask) => {
  //   if (err) {
  //     res.status(500).send('Internal Server Error');
  //     return;
  //   }

  //   // Send the user information back to the calling page
  //   if (!usertask) {
  //     return res.render('this task is already added');
  //   }
  // });
  // console.log(result)
  // if(result){
    try{
      //const userId = await db(sql)
      const add= await datab.addTask(task,date,desc,req.session.identify)
      console.log(add)
      if (add){
        
        res.redirect('/index');
  
      }else{
        res.render('index', { message: 'Error creating task. Try again' });
      //console.error('Error creating task. Try again: ', err);
      res.redirect('/index');
      }
     
  }
  catch(e){
      console.error(e)
      return res.status(500).send({
          success: false,
          message: 'internal server error'
      })
  }
    

    
// }else {
  //return res.render('index', { message: 'this task is already registered' });
  // res.redirect('/index');
  

// }
});
//edit task
app.post('/edit', async(req, res) => {
  const ntask = req.body.ntask;
  const date=req.body.date;
const desc=req.body.description;
const otask = req.body.otask;
try{
  //const userId = await db(sql)
  const edit= await datab.editTask(ntask,date,desc,otask,req.session.identify)
  console.log(edit)
  if (edit){
    
    res.redirect('/index');

  }else{
    //res.render('index', { message: 'Error editing task. Try again' });
    //res.render('Error editing task');
    res.redirect('/index');
  }
 
}
catch(e){
  console.error(e)
  return res.status(500).send({
      success: false,
      message: 'internal server error'
  })
}
  // const result = dval.check(task);
  // dval.check(task, (err, usertask) => {
  //   if (err) {
  //     res.status(500).send('Internal Server Error');
  //     return;
  //   }

  //   // Send the user information back to the calling page
  //   if (!usertask) {
  //     return res.render('this task is already added');
  //   }
  // });
  // console.log(result)
  // if(result){
  
// }else {
  //return res.render('index', { message: 'this task is already registered' });
  // res.redirect('/index');
  

// }
});
// Delete task
app.post('/delete/:id', async (req, res) => {
  const id = req.params.id;
  const deleted= await datab.deleteTask(id)
  if(deleted){
    res.redirect('/index');

  }else{
    console.error('Error deleting task: ');

      res.redirect('/index');
  }
});



// Display user profile

// Display user profile

app.get('/UserProfile', (req, res) =>{
  const id = req.session.id;
  const query = 'SELECT * FROM information WHERE id = ?';
  db.query(query, [4], (err, results) => {
    if (err) {
      console.error('Error display profile: ', err);
      res.render('index', { error: 'Failed to display profile', user: [] });
      return;
    }
    res.render('UserProfile', { user: results });
  });
   
})

//save the updated profile
app.post('/UserProfile/:id', (req, res) => {
  const userId = req.params.id;
  const  fullname = req.body.fullname;
  const  email = req.body.email;
  const  age = req.body.age;
  const sql = 'UPDATE information SET fullname = ?, email = ? , age= ? WHERE id = ?';
  db.query(sql, [fullname, email,age, userId], (err, result) => {
    if (err) {
      console.error('Error editing user information: ', err);
      res.redirect('/UserProfile');
      return;
     
    }
    else{

      res.redirect('/index');
    }
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});