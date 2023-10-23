import nodemailer from "nodemailer";

export const emailRegistro = async (datos) =>{
    console.log("DATOS", datos);
    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    //Informacion del Email
    const info = await transport.sendMail({
        from : '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to : email,
        subject: "UpTask - Confirma tu cuenta",
        text : "Comprueba tu cuenta en UpTask",
        html : `
            <p>Hola: ${nombre} Comprueba tu cuenta en Uptask </p>
            <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace : </p>
            <a href="${process.env.FRONTEN_URL}/confirmar/${token}">Comprobar Cuenta </a>

            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje </p>
            
        
        `
    })
}

export const emailOlvidePassword = async (datos) =>{
    console.log("DATOS", datos);
    const { email, nombre, token } = datos;

    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    //Informacion del Email
    const info = await transport.sendMail({
        from : '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to : email,
        subject: "UpTask - Reestablece tu password",
        text : "Reestablece tu password",
        html : `
            <p>Hola: ${nombre} Has solicitado reestablecer tu password </p>
            <p>Continua en el siguiente enlace para generar un nuevo password: </p>
            <a href="${process.env.FRONTEN_URL}/olvide-password/${token}">Reestablecer Password </a>

            <p>Si tu no solicitaste este Email puedes ignorar este mensaje </p>
            
        
        `
    })
}