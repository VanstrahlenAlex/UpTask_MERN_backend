import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";


const registrar = async (req, res) =>{
    console.log('Registrando usuario...');
    // Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email: email});

    if(existeUsuario) {
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({ msg: error.message})
    }
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        //Enviar el email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre : usuario.nombre,
            token : usuario.token,
        })
        res.json({ msg: "Usuario creado correctamente, revisa tu Email para confirmar tu cuenta"});
    } catch (error) {
        console.log(error);
    }

};

const autenticar = async (req, res) => {
    console.log('Autenticando usuario...');
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    // Comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario._id),
    });
    } else {
        const error = new Error("El Password es Incorrecto");
        return res.status(403).json({ msg: error.message });
    }
}

const confirmar = async (req, res ) => {
    console.log("Ingresando a la funcion de Confirmando Usuario...");
    console.log(req.params.token);
    const { token } = req.params; // Leer de la URL 
    const usuarioConfirmar = await Usuario.findOne({token}); //Buscamos usuario con el token de la URL
    if(!usuarioConfirmar){
        const error = new Error("TOKEN no válido");
        console.log(error.message);
        return res.status(403).json({ msg : error.message})
    }
    try {
        console.log("================================ \n ");
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg : "Usuario Confirmado correctamente"});
        console.log("================================ \n " + msg);

    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg : error.message})
    }
    try {
        usuario.token = generarId();
        console.log("=====OlvidePassword Function=======");
        await usuario.save();
        //Enviar el email
        emailOlvidePassword({
            email: usuario.email,
            nombre : usuario.nombre,
            token : usuario.token,
        })
        res.json({msg: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Usuario.findOne({token });

    if(tokenValido) {
        res.json({ msg: "Token valido y el usuario existe"})
    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg : error.message})
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    //usuario Valido
    const usuario = await Usuario.findOne({token });
    if(usuario ) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save()
            res.json({ msg: "Password Modificado Correctamente"})
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg : error.message})
    }


    console.log(token);
    console.log(password);
}


const perfil = async (req, res) => {
    const { usuario } = req

    res.json(usuario);
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}