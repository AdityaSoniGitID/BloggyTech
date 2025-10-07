const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//!load dotenv into process object
dotenv.config();

exports.sendEmail=async(to,resetToken)=>{
    try{
                    //create a transport object
                    const transport = nodemailer.createTransport({
                        host:"smtp.gmail.com",// fix value
                        port:587,//fix vaalue
                        secure:false,//fix value
                        auth:{
                            user:process.env.GMAIL_USER,
                            pass:process.env.APP_PASSWORD
                        }
                    });
                    //!create the message to be send
                const message={
                    to,
                    subject:"Password reset token",
                    html:`<p>Click <a href="http://localhost:3000/reset-password?token=${resetToken}">here</a> to reset your password</p>`,
                    text:`Your password reset token is ${resetToken}`
                }
                //!send the mail
               const info=await transport.sendMail(message);
               console.log("message sent",info.messageId);


       }
      catch(err){

        console.log(err);
        throw new Error("email sending failed");

       }

    }

