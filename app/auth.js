auth = async (req,res,next)=>{
    if(req.session.user == null)
    {
        res.redirect('/')
    }
    else{
        next()
    }
}
authStu = async (req,res,next)=>{
    if(req.session.user!==null && req.session.user.role == 'student')
    {
        next()
    }
    else{
        res.redirect('/')
    }
}
authFac = async (req,res,next)=>{
    if(req.session.user!==null && req.session.user.role == 'faculty')
    {
        next()
    }
    else{
        res.redirect('/')
    }
}
authAdmin = async (req,res,next)=>{
    if(req.session.user!==null && req.session.user.role == 'admin')
    {
        next()
    }
    else{
        res.redirect('/')
    }
}


function sendOtp(req){

	const mail = req.body.email
	// generate a random 6-digit OTP
	const OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

	// create a nodemailer transport
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'poojalohar789@gmail.com', // replace with your email
			pass: 'vnnyjpvepfwhimjp' // replace with your email password
		}
	});

	// configure the email message
	const mailOptions = {
		from: 'poojalohar789@gmail.com',
		to: mail, // replace with the recipient's email
		subject: 'Your One-Time Password',
		text: `Your OTP is: ${OTP}` // include the OTP in the email body
	};

	// send the email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log(`Email sent: ${info.response}`);
		}
	});
	return OTP
}




module.exports = {
    auth
}
