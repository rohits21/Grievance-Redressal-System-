//data manipulation operations to be written here
const bcrypt = require('bcrypt')
const saltrounds = 10
const {con}  = require('./dbconnect')
const path = require('path')
const Op = require('sequelize').Op
const emailValidator = require('deep-email-validator');
const nodemailer = require('nodemailer')
const {
    depts,
    emp,
    admins,
    students,
    compltDom,
    complaints,
    studentComplaints
} = require('./models')
const { sendOtp } = require('../app/auth')


/************************************************************************* */
/**Controller Functions */
/************************************************************************* */

login = async (req,role)=>{
    
    return await new Promise((resolve)=>{
        if(role == "student"){
            logStu(req).then(result =>{
                resolve(result)
            })
        }
        else if(role == "faculty"){
            logFac(req).then(result =>{
                resolve(result)
            })
        }
        else if(role == "admin"){
            logAdm(req).then(result =>{
                resolve(result)
            })
        } 
    })
    
     
}

 signup = async (req,role)=>{

    return new Promise(async (resolve,reject) => {

            if(role == "student"){
                signupStu(req).then(result =>{
                    resolve(result)
                }).catch(err =>{
                    reject(err)
                })
            }
            else if(role == "faculty"){
                signupFac(req).then(result =>{
                    resolve(result)
                }).catch(err =>{
                    reject(err)
                })
            }
        
    })

}



raiseComplaint = async (req)=>{
    
       //creating new complaint entry
       const complaint = {
        issue: req.body.subjectOfComplaint,
        description: req.body.descriptionOfComplaint,
        domId: req.body.domainOfComplaint,
        status : 'unresolved',
        dept_id: req.body.issuedToDept,
        upvotes: 0
    }
    
    //storing new complaint and fetching complaint id
    const comp = complaints.build(complaint)
    const complaint_id = await comp.save().then(()=>{
        return comp.complaint_id
    }).catch((err)=>{
        console.log(err)
        return null
    })

    //fetching student detail from session
    if(complaint_id == null)
        return false 
    const stu = await students.findOne({
        where:{
            username:req.session.user.username
        }
    })


    //creating student complaint entry on complaint_id received
    const studentComplaint = {
        complaint_id: complaint_id,
        stu_id: stu.enroll_no
    }
    const sc = studentComplaints.build(studentComplaint)
    
    //saving student complaint entry
    return new Promise((resolve,reject)=>{
        sc.save().then(async ()=>{
            const cd = await compltDom.findOne({
                where:{
                    domId: req.body.domainOfComplaint
                }
            })
            
            //update compltdom table to increment number of issues
            cd.totIssues = cd.totIssues + 1
            cd.totUnResolved = cd.totUnResolved + 1
            await cd.save().then(()=>{
                resolve(true)
            }).catch((err)=>{
                console.log(err); 
                resolve(false)
            })
        }).catch((err)=>{
            console.log(err)
            resolve(false)
        })
    }) 
         

}

upvotes = async (req)=>{
    return new Promise(async (resolve,reject)=>{
        const sc = await new Promise(async (resolve,reject)=>{
            //check if complaint is already upvoted by student
            await studentComplaints.findOne({
                where:{
                    complaint_id: Number(req.params.cid),
                    stu_id: req.session.user.enroll_no
                }
            }).then((sc)=>{
                resolve(sc)
                }).catch((err)=>{
                    console.log(err)
                    resolve(false)
            })  
            
        })
        if(sc == null)
        {
            //if not upvoted then update studentcomplaints table
            const studentComplaint = {
                complaint_id: req.params.cid,
                stu_id: req.session.user.enroll_no
            }
            const sc = studentComplaints.build(studentComplaint)
            await sc.save().then(async ()=>{
                console.log('student complaint saved')
                
                //update complt table to increment upvotes
                const comp = await complaints.findOne({
                    where:{
                        complaint_id: req.params.cid
                    }
                })
                comp.upvotes = comp.upvotes + 1
                await comp.save().then(()=>{
                    console.log('complaint upvoted')
                    resolve(true)
                }).catch((err)=>{
                    console.log(err)
                    resolve(false)
                })
                }).catch((err)=>{
                    console.log(err)
                    resolve(false)
                })

        }
        else{
            console.log('already upvoted')
            resolve('already upvoted')
        }
    })
}


getAllComplaints = async (req)=>{
    return await new Promise(async (resolve,reject)=>{
        await search(req).then((result)=>{
            console.log(result)
                if(result.length == 0)
                {
                    resolve([])
                }
                else{
                    var allcomplaint = []
                    for(var i=0;i<result.length;i++){
                        var complaint =  {
                                issue: '',
                                description: '',
                                status: '',
                                dept_id: '',
                                domId: '',
                                upvotes: '',
                                complaint_id: '',
                                remarks: ''
                            }
                        complaint.issue = result[i].issue.toString()
                        complaint.description = result[i].description.toString()
                        complaint.status = result[i].status.toString()
                        complaint.dept_id = result[i].dept_id.toString()
                        complaint.domId = result[i].domId.toString()
                        complaint.upvotes = result[i].upvotes.toString()
                        complaint.complaint_id = result[i].complaint_id.toString()
                        complaint.remarks = result[i].remarks.toString()
                        allcomplaint.push(complaint)
                    }
                    console.log(allcomplaint)
                    resolve(allcomplaint)
                }
            
            }).catch((err)=>{
                console.log(err)
                resolve(false)
            })

    })
}

getFaculties = async (req)=>{
    return await new Promise(async (resolve,reject)=>{
        await emp.findAll().then((result)=>{
            console.log(result)
            if(result.length == 0)
            {
                resolve([])
            }
            else{
                var allfaculties = []
                for(var i=0;i<result.length;i++){
                    var faculty =  {
                            role: 'faculty',
                            emp_id: '',
                            name: '',
                            designation: '',
                            dept_id: '',
                            scores: '',
                            username: '',
                            phone: ''
                        }
                    faculty.emp_id = result[i].emp_id.toString()
                    faculty.name = result[i].name.toString()
                    faculty.dept_id = result[i].dept_id.toString()
                    faculty.designation = result[i].designation.toString()
                    faculty.scores = result[i].scores.toString()
                    faculty.username = result[i].username.toString()
                    allfaculties.push(faculty)
                }
                console.log(allfaculties)
                resolve(allfaculties)
            }
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })

    })
}

getComplaint = async (req)=>{
    return await new Promise(async (resolve,reject)=>{
        await complaints.findOne({
            where:{
                complaint_id: req.params.cid
            }
        }).then((result)=>{
            if(result == null)
            {
                resolve(false)
            }
            else{
                var complaint =  {
                    issue: '',
                    description: '',
                    status: '',
                    dept_id: '',
                    domId: '',
                    upvotes: '',
                    complaint_id: ''
                }
                complaint.issue = result.issue.toString()
                complaint.description = result.description.toString()
                complaint.status = result.status.toString()
                complaint.dept_id = result.dept_id.toString()
                complaint.domId = result.domId.toString()
                complaint.upvotes = result.upvotes.toString()
                complaint.complaint_id = result.complaint_id.toString()
                resolve(complaint)
            }
        }).catch((err)=>{
            console.log(err)
            resolve(false)
        })

    })
}

setstatus = async (req)=>{
    return await new Promise(async (resolve,reject)=>{
        await complaints.findOne({
            where:{
                complaint_id: req.params.cid
            }
        }).then(async (result)=>{
            if(result == null)
            {
                resolve(false)
            }
            else{
                result.status = req.body.status
                if(req.body.status == 'Rejected')
                    result.remarks = req.body.remarks
                
                if(req.body.status == 'Resolved'){
                    const fac = await emp.findOne({
                        where:{
                            emp_id: req.session.user.emp_id
                        }
                    })
                    fac.scores = fac.scores + 1
                    req.session.user.scores = fac.scores
                    await fac.save().then(()=>{
                        console.log('faculty scores updated')
                    }).catch((err)=>{
                        console.log(err)
                        resolve(false)
                    })
                    //fetching complaint domId table record
                    const complt = await compltDom.findOne({
                        where:{
                            domId: result.domId
                        }
                    })
                    //reduce number of unresolved issues
                    complt.totUnResolved = complt.totUnResolved - 1
                    await complt.save().then(()=>{
                        console.log('One issue has been resolved from domain ' + complt.domainName)
                    }).catch((err)=>{
                        console.log(err)
                        resolve(false)
                    })
                }
                await result.save().then(()=>{
                    resolve(true)
                }).catch((err)=>{
                    console.log(err)
                    resolve(false)
                })

            }
        }).catch((err)=>{
            console.log(err)
            resolve(false)
        })

    })
}

adminReg = async (req)=>{
    const admin = {
        emp_id: req.body.emp_id,
        name: req.body.name,
        desig : req.body.desig,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password,saltrounds),
        
    }
    const ad = admins.build(admin)
    return ad.save().then(()=>{
        console.log('admin registered')
        return true
    }).catch((err)=>{
        return err
    }
    )

}

deactivateStu = async (req,res)=>{
    return await new Promise(async (resolve,reject)=>{
        await students.findOne({
            where:{
                enroll_no: req.params.stuid
            }
        }).then(async (result)=>{
            if(result == null)
            {
                resolve(false)
            }
            else{
                result.status = 'Deactivated'
                result.deactivated_by = req.session.user.name
                await result.save().then(()=>{
                    resolve(true)
                }).catch((err)=>{
                    console.log(err)
                    resolve(false)
                })

            }
        }).catch((err)=>{
            console.log(err)
            resolve(false)
        })
    })
}

module.exports = {
    login,
    signup,
    raiseComplaint,
    upvotes,
    getAllComplaints,
    adminReg,
    getFaculties,
    setstatus,
    getComplaint,
    deactivateStu
}



/******************************************************************/
/*local utility functions*/
/******************************************************************/

async function logStu(req){
    const stu = await students.findOne({
        where:{
            username:req.body.loginEmail
        }
    })
    if(stu == null)
    {
        return false
    }
    else{
        const result = await bcrypt.compare(req.body.loginPassword,stu.password)
        if(result == true)
        {
            req.session.user = {
                role : 'student',
                name: stu.name,
                username: stu.username,
                semester : stu.semester,
                branch: stu.branch,
                course: stu.course,
                phone : stu.phone,
                enroll_no:stu.enroll_no,
                message : ''
            }
            return true
        }
    }
}

async function logFac(req){
    const fac = await emp.findOne({
        where:{
            username:req.body.loginEmail
        }
    })
    if(fac == null)
    {
        return false
    }
    else{
        const result = await bcrypt.compare(req.body.loginPassword,fac.password)
        if(result == true)
        {
            req.session.user = {
                role : 'faculty',
                name: fac.name,
                username: fac.username,
                designation : fac.designation,
                dept: fac.dept_id,
                scores: fac.scores,
                phone : fac.phone,
                emp_id:fac.emp_id
            }
            return true
        }
    }
}

async function logAdm(req){
    const adm = await admins.findOne({
        where:{
            username:req.body.loginEmail
        }
    })
    if(adm == null)
    {
        return false
    }
    else{
        const result = await bcrypt.compare(req.body.loginPassword,adm.password)
        if(result == true)
        {
            req.session.user = {
                role : 'admin',
                name: adm.name,
                username: adm.username,
                designation : adm.desig,
                phone : adm.phone,
                emp_id:adm.emp_id
            }
            return true
        }
    }
}

async function signupStu(req){
    return new Promise(async (resolve,reject)=>{

            const student = {
                enroll_no: req.body.enrollmentOfStudent,
                name: req.body.nameOfStudent,
                branch: req.body.branchOfStudent,
                course: req.body.courseOfStudent,
                semester: req.body.semesterOfStudent,
                username: req.body.email,
                password: await bcrypt.hash(req.body.password,saltrounds),
                phone: req.body.contactOfStudent
            }   
            
            const st = students.build(student)
            return await st.save().then(()=>{
                console.log('student saved')
                resolve(true)
            }).catch((err)=>{
                reject(err)
            })

        })
}

async function signupFac(req){
    const faculty = {
        emp_id: req.body.employeeIdofFaculty,
        name: req.body.nameOfFaculty,
        dept_id : req.body.branchOfFaculty,
        designation : req.body.designationOfEmployee,
        course: req.body.courseOfFaculty,
        username: req.body.email,
        password: await bcrypt.hash(req.body.password,saltrounds),
        scores:0,
        phone: req.body.contactOfFaculty
        
    }
    const fac = emp.build(faculty)
    return fac.save().then(()=>{
        console.log('faculty saved')
        return true
    }).catch((err)=>{
        console.log("some error")
        return err
    }
    )
}


async function search(req){
        return await new Promise(async (resolve,reject)=>{
            await complaints.findAll().then((comp)=>{
                console.log(comp)
                resolve(comp)
            }).catch((err)=>{
                console.log(err)
                resolve(false)
            })
        })
}