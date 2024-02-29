const express=require ('express');
const mysql=require('mysql2');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'renuka',
    database:'Hospital',
});
db.connect((err)=>{
    if(err){
        console.error('Error connecting to MySQL database'+err.message);

    }else{
        console.log('Connected to MySQL database');

    }
});
app.get("/", (req,res) =>{
    res.json("hello this is backend")
})
app.get("/users", (req, res) => {
    const q = "SELECT * FROM patients ";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      return res.json(data);
    });
  });
   

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    
    const query = `SELECT * FROM patients WHERE email = ? AND password = ?`;
  
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (results.length > 0) {
        
        res.json({ success: true, message: 'Login successful' });
      } else {
        
        res.status(401).json({ error: 'Invalid email or password' });
      }
    });
  });
  app.post("/create", (req, res) => {
    const name = req.body.name;
    const address = req.body.address;
    const state = req.body.state;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const admitted_date = req.body.admitted_date;
    const gender = req.body.gender;
    const marital_status = req.body.marital_status;
    const password = req.body.password;
     
    db.query(
      "INSERT INTO app (name,address,state, email,mobile,admitted_date,gender,marital_status, password) VALUES (?,?,?,?,?,?,?,?,?)",
      [name,address,state, email,mobile,admitted_date,gender,marital_status, password],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("You have registered successfully!");
        }
      }
    );
}); 

 
app.get("/userdetails/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM patients WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
 
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q = " DELETE FROM patients WHERE id = ? ";
 
  db.query(q, [userId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});
 
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const q = "UPDATE patients SET `name`= ?,`address`=?,`state`=?,`code`=?,`email`= ?,`mobile`=?,`admitted_date`=?,`gender`=?,`marital_status`=?, `password`= ? WHERE id = ?";
 
  const values = [
    req.body.name,
    req.body.address,
    req.body.state,
    req.body.code,
    req.body.email,
    req.body.mobile,
    req.body.admitted_date,
    req.body.gender,
    req.body.marital_status,
    req.body.password,
  ];
 
  db.query(q, [...values,userId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});



    app.listen(4000,() =>{
console.log(`server is running on port`);
    })
