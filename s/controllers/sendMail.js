const nodemailer = require("nodemailer");

exports.main = async () => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  return transporter;
};

exports.send = async (
  to,
  data = {
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  }
) => {
  //   console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
      // api_key: process.env.SMTP_API_KEY
    },
  });
  try {
    // console.log(to, data);
    //  const transporter = main();
    const { subject, text, html } = data;
    // console.log(subject, html);
    let info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}", ${process.env.SMTP_FROM_EMAIL}`,
      to,
      subject,
      text,
      html,
    });
    // console.log(info);
    return info;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};
