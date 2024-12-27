
import nodemailer from "nodemailer"


export const sendEmail = async (to, subject, html , attachments =[]) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.emailSender,
            pass: process.env.password,
        },

    });

    const info = await transporter.sendMail({
        from: `<Sulina❤️ ${process.env.emailSender}>`,
        to: to ? to : "aya.bekhet4794@gmail.com",
        subject: subject ? subject : "Hello ✔",
        html: html ? html : "Hello world?",
        attachments
    });

    if (info.accepted.length) {
        return true
    }
    return false

}