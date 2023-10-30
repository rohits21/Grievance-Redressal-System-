//creates all tables in the connected database


const {sequelize} = require('./dbconnect')

const {
    depts,
    emp,
    admins,
    students,
    compltDom,
    complaints,
    studentComplaints
} = require('../database/models')


depts.sync({alter:true}).then(()=>{console.log('depts synced')})
emp.sync({alter:true}).then(()=>{console.log('emp synced')})
admins.sync({alter:true}).then(()=>{console.log('admins synced')})
students.sync({alter:true}).then(()=>{console.log('students synced')})
compltDom.sync({alter:true}).then(()=>{console.log('compltDom synced')})
complaints.sync({alter:true}).then(()=>{console.log('complaints synced')})
studentComplaints.sync({alter:true}).then(()=>{console.log('studentComplaints synced')})

sequelize.sync({alter:true}).then(()=>{console.log('all synced')})