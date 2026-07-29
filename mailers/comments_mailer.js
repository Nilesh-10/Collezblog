const nodeMailer =require('../config/nodemailer');

// Another way of exporting a method

exports.newComment =(comment) =>{
    console.log('inside newComment mailer');
    nodeMailer.transporter.sendMail({
        from:'nileshkumar4872@gmail.com',
        to:comment.user.email,
        subject:"New comment published",
        html:'<h1>Your comment is published'
    },
    (err,info)=>{
        if(err){
            console.log('error in sending email');
        }
        console.log('Message sent ',info);
        return
    });
}