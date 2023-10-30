
const dotenv = require('dotenv')
dotenv.config()

//fetching environment variables from .env file (local to system)
const myhost= process.env.HOST
const mysqlUser = process.env.USER
const pass = process.env.PASSWORD
const dbname = process.env.DATABASE


//using sequelize
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(dbname, mysqlUser, pass, {
  host: myhost,
  dialect: 'mysql',
});


sequelize.authenticate().then(()=>{
  console.log('database connected')
})
.catch((err)=>{
  console.log(err)
})

module.exports = {sequelize}


