import nodemailer from "nodemailer"


export const sendEmail =async ({to='', subject='' , html=''}) => {
    const transporter = nodemailer.createTransport({
       
        service : 'gmail',
        auth : {
            user : "elsayedshalan64@gmail.com",
            pass : "faimpsmowoevurgg"
        },
        tls : {
            rejectUnauthorized : false
        }
    })


    const info = await transporter.sendMail({
        from: "e-commerce",
        to,
        subject,
        html
        
     })
return info ;
}