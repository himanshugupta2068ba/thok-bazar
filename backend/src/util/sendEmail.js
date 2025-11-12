const nodemailer=require('nodemailer');
require('dotenv').config();
async function sendVerificationEmail(to,subject,body){
    const transporter=nodemailer.createTransport({
       service:'Gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });

    const mailOptions={
        from:process.env.EMAIL_USER,
        to:to,
        subject:subject,
        text:body
    };
    await transporter.sendMail(mailOptions);
}
module.exports=sendVerificationEmail;