const express = require('express')
const path = require('path')
const controllers = require('../database/controllers')
const {auth, sendOtp} = require('./auth')
const { rejects } = require('assert')

//creating routers
const index = express.Router()
const admin  = express.Router()
const student = express.Router()
const faculty = express.Router()
const util = express.Router()

var allcomplaint = []


//setting up routers with static files 
index.use(express.static(path.resolve(__dirname,'../assets')))
admin.use(express.static(path.resolve(__dirname,'../assets')))
student.use(express.static(path.resolve(__dirname,'../assets')))
faculty.use(express.static(path.resolve(__dirname,'../assets')))
util.use(express.static(path.resolve(__dirname,'../assets')))

//defining routes
index.get('/',(req,res)=>{
    //destroy session
    req.session.destroy()
    res.render('index',{message: ''})
})


/**********************************/
/**student routes */
/**********************************/
{
    student.get('/login',(req,res)=>{
        res.render('login',{message: ''})
    })

    student.post('/',async (req,res)=>{
        result = await controllers.login(req,"student")
        if(result == true)
        {
            allcomplaint = await controllers.getAllComplaints()
            if(allcomplaint.length == 0)
            {
                allcomplaint = []
                res.render('dashboard',{message: 'No complaints found', allComplaints: allcomplaint})
            }
            else if(allcomplaint == false)
            {
                res.render('dashboard',{message: 'Something went wrong', allComplaints: allcomplaint})
            }
            else
            {
                // res.render('dashboard',{message: '', allComplaints: allcomplaint})
                branch = req.session.user.branch
                branchcomp = allcomplaint.filter((complaint)=>{
                    return complaint.dept_id.toLowerCase().includes(branch.toLowerCase())
                })
                res.render('dashboard',{message: '',allComplaints:branchcomp})
            }
        }
        else{
            res.render('login',{message: 'Kindly provide valid credentials'})
        }
    })

    student.post('/signup',async (req,res)=>{
        await controllers.signup(req,"student").then(result => {
            if(result == true)
            {
                res.render('login',{message: 'User created successfully'})
            }
            else{
                console.log(result)
                res.render('login',{message: result})
                
            }
            
        }).catch(err => {
            console.log(err)
            res.render('login',{message: 'Something went wrong!! Please try again'})
            
        })
    })


    student.get('/newcomplaint',authStu,async (req,res)=>{
        res.render('newcomplaint' ,{message: ''})
    })

    student.post('/newcomplaint',authStu,async (req,res)=>{
        
        result = await controllers.raiseComplaint(req).then((result)=>{return result}) //returns a promise
        console.log(result)
        if(result == true)
        {
            res.render('newcomplaint',{message: 'Issue raised successfully'})
        }
        else{
            console.log(result)
            res.render('newcomplaint',{message: 'Something went wrong!! Please try again'})
        }
    })

    student.get('/upvotes/:cid',authStu,async (req,res)=>{
        
        await controllers.upvotes(req,req.params.id).then(async (result)=>{
            allcomplaint = await controllers.getAllComplaints()
                branch = req.session.user.branch
                branchcomp = allcomplaint.filter((complaint)=>{
                return complaint.dept_id.toLowerCase().includes(branch.toLowerCase())
                })
            if(result == true)
            {
                
                res.render('dashboard',{message : 'Upvote added successfully' ,allComplaints:branchcomp})
                
            }
            else{
                res.render('dashboard',{message : result ,allComplaints:branchcomp})
            }
        })
    })

    student.get('/profile',authStu,async (req,res)=>{
        res.render('studentProfile',{
            role : req.session.user.role,
            name: req.session.user.name , 
            email: req.session.user.username , 
            phone: req.session.user.phone , 
            rollno: req.session.user.enroll_no , 
            branch: req.session.user.branch , 
            course : req.session.user.course ,
            sem: req.session.user.semester})
        
    })

}


/**********************************/
/**faculty routes */
/**********************************/
var branchcomp = []
{
    faculty.get('/login',(req,res)=>{
        res.render('facultyLogin',{message: ''})
    })

    faculty.post('/',async (req,res)=>{
        result = await controllers.login(req,"faculty")
        if(result == true)
        {
            allcomplaint = await controllers.getAllComplaints()
            // res.render('facultydashboard',{message: '',allComplaints:allcomplaint})
            branch = req.session.user.dept
            branchcomp = allcomplaint.filter((complaint)=>{
                return complaint.dept_id.toLowerCase().includes(branch.toLowerCase())
            })
            res.render('facultydashboard',{message: '',allComplaints:branchcomp})
        }
        else{
            res.render('facultyLogin',{message: 'Kindly provide valid credentials'})
        }
    })

    faculty.post('/signup',async (req,res)=>{
        result = await controllers.signup(req,"faculty")
        if(result == true)
        {
            res.render('facultyLogin',{message: 'User created successfully'})
        }
        else{
            console.log(result)
            res.render('facultyLogin',{message: 'Something went wrong!! Please try again'})
        }
    })


    faculty.get('/myprofile',authFac,async (req,res)=>{
        res.render('FacultyProf',{
            role : req.session.user.role,
            name: req.session.user.name , 
            username: req.session.user.username , 
            phone: req.session.user.phone ,  
            dept: req.session.user.dept ,
            designation : req.session.user.designation,
            scores: req.session.user.scores
            })
        
    })

    faculty.get('/feedback',authFac,async (req,res)=>{
        console.log("feedback form")
        res.send("feedback form")
    })


    faculty.get('/:cid',authFac,async (req,res)=>{
        await controllers.getComplaint(req,req.params.id).then(async (result)=>{
            if(result == false)
            {
                
                res.render('facultydashboard',{message : 'Something went wrong' ,allComplaints:branchcomp})
                
            }
            else{
                res.render('complaint-form',{message : '' ,complaint:result})
            }
        })
    })

    faculty.post('/:cid',authFac,async (req,res)=>{
        await controllers.setstatus(req,req.params.id).then(async (result)=>{
            allcomplaint = await controllers.getAllComplaints()
                branch = req.session.user.dept
                branchcomp = allcomplaint.filter((complaint)=>{
                return complaint.dept_id.toLowerCase().includes(branch.toLowerCase())
                })
            if(result == true)
            {
                
                res.render('facultydashboard',{message : 'Status Updated' ,allComplaints:branchcomp})
                
            }
            else{

                res.render('facultydashboard',{message : result ,allComplaints:branchcomp})
            }
        })
    })
}


/******************************** */
/**admin routes */
/******************************** */
{
    admin.get('/signup',(req,res)=>{
        res.render('adminSignup',{message: 'Enter your Details'})

    })
    admin.post('/signup',async (req,res)=>{
        result = await controllers.adminReg(req,"admin")
        if(result == true)
        {
            res.render('adminLogin',{message: 'User created successfully'})
        }
        else{
            console.log(result)
            res.render('adminLogin',{message: 'Something went wrong!! Please try again'})
        }
    })

    admin.get('/login',(req,res)=>{
        res.render('adminLogin',{message: ''})
    })


    admin.post('/',async (req,res)=>{
        result = await controllers.login(req,"admin")
        if(result == true)
        {
            allcomplaint = await controllers.getAllComplaints()
            res.render('admindashboard',{message: '',allComplaints:allcomplaint})
        }
        else{
            res.render('adminLogin',{message: 'Kindly provide valid credentials'})
        }
    })

    admin.get('/assign-fac',authAdmin,async (req,res)=>{
        var fac_names = []
        await controllers.getFaculties().then((faculties)=>{
            faculties.forEach(faculty => {
                fac_names.push(faculty.name)
            });            
        }).catch((err)=>{
            res.render('assign-faculty',{message: 'something went wrong',faculties:fac_names})    
        })
        
        res.render('assign-faculty',{message: '',faculties:fac_names})
    })

    admin.get('/allprofiles/students',authAdmin,async(req,res)=>{
        res.send("students profiles page")
    })

    admin.get('/deactivate-stu/:stuid',authAdmin,async (req,res)=>{
        await controllers.deactivateStu(req).then((result)=>{
            res.send(`userid: ${req.params.stuid} , deactivated : ${result}`)
        }).catch((err)=>{
            console.log(err)
            res.send('something went wrong')
        })
    })
}

/**********************************/
/**common routes */
/**********************************/
{
    util.get('/',auth,async (req,res)=>{
        var branchcomp = []
        allcomplaint = await controllers.getAllComplaints()
        if(req.session.user.role=="student"){
            file = 'dashboard'
            branch = req.session.user.branch
            branchcomp = allcomplaint.filter((complaint)=>{
                return complaint.dept_id.toLowerCase().includes(branch.toLowerCase())
            })
            res.render(file,{message: '',allComplaints:branchcomp})
        } 
        else if(req.session.user.role=="faculty"){ 
            file = 'facultydashboard'
            branch = req.session.user.dept
            branchcomp = allcomplaint.filter((complaint)=>{
                return complaint.dept_id.toLowerCase().includes(branch.toLowerCase())
            })
            res.render(file,{message: '',allComplaints:branchcomp})
        }
        else if(req.session.user.role=="admin"){ 
            file = 'admindashboard'
            res.render(file,{message: '',allComplaints:allcomplaint})    
        }
        
        
    })

    util.get('/search',auth,async (req,res)=>{
        const srchquery = req.query.search
        var srchresult = []
        
        if(req.session.user.role=="student") file = 'dashboard'
        else if(req.session.user.role=="faculty") file = 'facultydashboard'
        else if(req.session.user.role=="admin") file = 'admindashboard'
    
        if(allcomplaint){
            srchresult = allcomplaint.filter((complaint)=>{
                return complaint.issue.toLowerCase().includes(srchquery.toLowerCase()) || complaint.status.toLowerCase().includes(srchquery.toLowerCase()) || complaint.dept_id.toLowerCase().includes(srchquery.toLowerCase()) || complaint.description.toLowerCase().includes(srchquery.toLowerCase())
            })
            if(srchresult == []){
                res.render(file,{message: 'No complaints found', allComplaints: srchresult})
            }
            else
                res.render(file,{message: '', allComplaints: srchresult})
        }
        else res.render(file,{message: 'No complaints', allComplaints: allcomplaint})
    
    })
    util.get('/faculties',auth,async (req,res)=>{
        await controllers.getFaculties().then((Faculties)=>{

            res.render('faculties',{ faculties: Faculties,role: req.session.user.role})
        }).catch(err=>{
            res.render('faculties',{ faculties:[],role: req.session.user.role})
        })
    })
}

module.exports = {
    student,
    util,
    faculty,
    index,
    admin
}