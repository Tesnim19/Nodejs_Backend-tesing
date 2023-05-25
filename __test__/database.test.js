// const mysql = require('mysql2');
const datab= require("../database_connect.js")

// Configure MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'users',
// });

describe('Test the database queries', () => {
  // let userId;
  // let taskId;

  // beforeAll((done) => {
  //   connection.connect((err) => {
  //     if (err) throw err;
  //     console.log('Connected to MySQL database');
  //     done();
  //   });
  // });

  // afterAll((done) => {
  //   connection.end((err) => {
  //     if (err) throw err;
  //     console.log('Disconnected from MySQL database');
  //     done();
  //   });
  // });

  it('should insert a new user into the database', (done) => {
    const fullname= 'testuser'
    const email= "testuser@gmail.com"
    const password= 'testpassword123!'
    const age= '23' 

   const sign= datab.signup(fullname,email,password,age)
    // connection.query('INSERT INTO information SET ?', user, (err, results) => {
    //   if (err) throw err;
    //   userId = results.insertId;
    //   expect(results.affectedRows).toBe(1);
    //   done();
    // });

    expect(sign).toBeTruthy();
    done();
  });

//   it('should insert a new task for the user into the database', (done) => {
//     const tasks = { task: 'Test Task' , date:'03/20/2023', desc: 'new test task', id:'4'};
//     connection.query('INSERT INTO tasks SET ?',tasks, (err, results) => {
//       if (err) throw err;
//       taskId = results.insertId;
//       expect(results.affectedRows).toBe(1);
//       done();
//     });
//   });

it('should login existing user into the database', (done) => {
  //const fullname= 'testuser'
  const email= "tensub30@gmail.com"
  const password= 'Tensu123!'
  //const age= '23' 

 const login= datab.login(email,password)
  

  expect(login).toBeTruthy();
  done();
});

  
//   it('should delete the created task from the database', (done) => {
//     connection.query('DELETE FROM tasks WHERE id = ? ', [taskId], (err, results) => {
//       if (err) throw err;
//       expect(results.affectedRows).toBe(1);
//       done();
//     });
//   });

  
it('should add task into the database', (done) => {
  const task= 'test task'
  const date= "12/12/2012"
  const desc= 'this is a test task'
  const id= '23' 

 const addtask= datab.addTask(task,date,desc,id)
  

  expect(addtask).toBeTruthy();
  done();
});
 
it('should edit exisiting task into the database', (done) => {
  const otask= 'test task'
  const ntask= 'updated task'
  const date= "12/12/2012"
  const desc= 'this is a updated test task'
  const id= '23' 

 const edittask= datab.editTask(ntask,date,desc,otask,id)
  

  expect(edittask).toBeTruthy();
  done();
});
 
//   it('should update task', (done) => {
//     const updateTask = { ntask: 'Test Task', date:'03/20/2023', desc: 'new test task', tid:'19' };
//     connection.query('UPDATE tasks SET task = ?, date = ? ,description=? WHERE id = ? ',  [updateTask], (err, results) => {
//       if (err) throw err;
//       expect(results.affectedRows).toBe(1);
//       done();
//     });
//   });
it('should delete exisiting task into the database', (done) => {
  
  const id= '27' 

 const deletetask= datab.deleteTask(id)
  

  expect(deletetask).toBeTruthy();
  done();
});
 
});
