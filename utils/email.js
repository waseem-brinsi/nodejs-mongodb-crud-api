const nodemailer = require('nodemailer')


const sendEmail =async function(options){

    //1) create Transporter
    const transporter = nodemailer.createTransport({
        host:'smtp.mailtrap.io',
        port:2525,
        auth:{
            user:"4ae86402c8e4cf",
            pass:"154f7c1b05e297"
        }
    });
    //2) define the email options:
    const mailOptions = {
        from:'wetcci<wetcci@test.io>',
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    //3) send the email 
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
