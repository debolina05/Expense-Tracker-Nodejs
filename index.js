const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();

const User = require('./model/userModel');
const Expense = require('./model/expensemodel');
const Order = require('./model/orderModel');
const ForgotUser = require('./model/ForgotPasswordRequestsModel');
const sequelize = require('./util/db');
const signupRoutes = require('./routes/signupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const loginRoutes = require('./routes/loginRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const forgetRoutes = require('./routes/forgetRoutes');
const userRoutes = require('./routes/userRoutes');
const updatePassword  = require('./routes/updatePasswordRoutes');


const app = express();

//port number where our server runs
const port = 3000;
app.use(cors());

//we are using express.json which uses body-parser in background in order to parse only json request from body
//body-parser parses the incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(express.json());

// Sending static html file which are downloaded by our front-end users
app.use(express.static(path.join(__dirname, 'public')))

// handling request from users
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/expense', expenseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password',forgetRoutes);
app.use('/user',userRoutes);
app.use('/updatepassword',updatePassword);

User.hasMany(ForgotUser);
ForgotUser.belongsTo(User);

User.hasMany(Expense);   // user has many expenses (one to many relationship)
Expense.belongsTo(User);  // in expense table, user ka primary key will be added as foreign key

User.hasMany(Order);
Order.belongsTo(User);
sequelize.sync({ force: false })    // creates table according to the schema declared in model
    .then(result => console.log(`connected to data base`))
    .catch(err => console.log(err));

app.listen(port, console.log(`listening on port 3000`));