const bcrypt =require("bcryptjs")
const db= require("./database.js")


//sign up data base connection
function signup (fullname,email,hpassword,age){
  return new Promise((resolve, reject) =>{
    try{
  db.query('SELECT * FROM information WHERE email = ?', [email], (err, results) => {
    if (err) {
      return reject(err)
      //throw err;
    }

    if (results.length > 0) {
      return resolve(true)
      //return true
     // res.render('signup', { message: 'email already exists' });
    } else {
      db.query('INSERT INTO information (fullname, email, password, age) VALUES (?, ?,?,?)', [fullname,email, hpassword,age], (err) => {
        if (err) {
          return reject(err)
          //throw err;
        }
        return resolve(false)
        //return false
        // req.session.loggedIn = true;
        // req.session.email = email;
        // res.redirect('/index');
      });
    }
  });
}
catch(e){
  reject(e)
}
  
});
}

//login data base connection

function login (email,password){
  return new Promise((resolve, reject) =>{
    try{
      db.query('SELECT * FROM information WHERE email = ?', [email], async (err, results) => {
        if (err) {
          return reject(err)
          //throw err;
        }
    
        if (results.length === 0 || !await bcrypt.compare(password, results[0].password)) {
          return resolve(0)
          
        } else {
          const identify= results[0].id
          return resolve(identify)
         
        }
      });
}
catch(e){
  reject(e)
}
  
});
}

// adding task data base connection
function addTask(task,date,desc,id){

  const query = 'INSERT INTO tasks (task,date,description,user_id) VALUES (?,?,?,?)';

  return new Promise((resolve, reject) =>{
    try{
  db.query(query, [task,date,desc,id], (err, result) => {
    if (err) {
      return resolve(false)
      
      
    }
    return resolve(true)
    
  });
}
catch(e){
  reject(e)
}
  
});

}

//editing task data base connection

function editTask(ntask,date,desc,otask,id){
  const query1= 'UPDATE tasks SET task = ?, date = ? ,description=? WHERE task = ? AND user_id = ?';
  return new Promise((resolve, reject) =>{
    try{
db.query('SELECT * FROM tasks WHERE task = ?', [otask], (err, results) => {
  console.log(results.length)
    if (err) {
      return reject(err)
      
    }

    if (results.length == 0) {
      return resolve(false)
      
    } else {
        db.query(query1, [ntask,date,desc,otask,id], (err, result) => {
          if (err) {
            return resolve(false)
          }
          return resolve(true)
          
        });
        
      
    }
  });
}
catch(e){
  reject(e)
}
  
});
  
}

// deleting task database connection
function deleteTask(id){
  const query = 'DELETE FROM tasks WHERE id = ?';
  return new Promise((resolve, reject) =>{
    try{
db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
  console.log(results.length)
    if (err) {
      return reject(err) 
    }
    if (results.length == 0) {
      return resolve(false)
      
    } else {
  db.query(query, [id], (err, result) => {
    if (err) {
      return resolve(false)
      
      
    }
    return resolve(true)
    
  });
}
});
}
catch(e){
  reject(e)
}
  
});
}
module.exports={signup,login,addTask,editTask, deleteTask}