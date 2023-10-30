//inserts data into the database

const {sequelize} = require('./dbconnect')
const {
    depts,
    compltDom
}=require('../database/models')



const insertDepartments = ()=>{
    const dept = ['CSE','ME','EX','EC','CE']
    const deptNames = ['Computer Science and Engineering','Mechanical Engineering','Electrical Engineering','Electronics','Civil Engineering']
    const hodIds = ['cshod','mehod','exhod','echod','cehod']
    for(let i=0;i<dept.length;i++){
        const department = depts.build({
            dept_id:dept[i],
            dept_name:deptNames[i],
            dept_head:hodIds[i]
        })
        department.save().then(()=>{
            console.log('values inserted')
        }).catch((err)=>{
            console.log(err)
        })

    }
}



const insertDomains = ()=>{
    const domains = ['LIB','MT','AC','TNP','MSCON','RAG','OTH']
    const domainNames = ['Library','Maintenance','Academics','Training and Placement','Misconduct','Ragging','Other']

    for(let i=0;i<domains.length;i++){
        const domain = compltDom.build({
            domId:domains[i],
            domainName:domainNames[i],
            totIssues:0,
            totUnResolved:0
        })
        domain.save().then(()=>{
            console.log('values inserted')
        }).catch((err)=>{
            console.log(err)
        })

    }
}

insertDepartments()
insertDomains()



