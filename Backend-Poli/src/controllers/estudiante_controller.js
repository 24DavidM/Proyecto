import { sendMailToRecoveryPassword, sendMailToRegister } from "../config/nodemailer.js";
import Estudiante from "../models/Estudiante.js";

const registro = async (req,res) => {
    
    // Obtener los datos
    const {nombre, email,password} = req.body

    //Verifica que no exista campo vacios
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debes llenar todo los campos"})
    
    //Verifica si existe algun correo en el base de datos
    const verificarEmailBDD = await Estudiante.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos el email ya que se encuentra registrado"})
    
    //Encriptar la contraseña
    const nuevoEstudiante = new Estudiante(req.body)
    nuevoEstudiante.password = await nuevoEstudiante.encrypPassword(password)

    //Crer un token
    const token = nuevoEstudiante.createToken()

    //Enviar correo y guardar estudiante nuevo
    sendMailToRegister(nombre, email, token);
    await nuevoEstudiante.save()
    res.status(200).json({msg:"Revisa tu correo electronico para verificar tu cuenta"})

}

const confirmarMail = async(req,res) => { 
    // Obtener el token
    const {token} = req.params

    //Verificar el token
    const estudianteBDD = await Estudiante.findOne({token})

    //Verificar si ya se verifico el token
    if(!estudianteBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
        
    //Cambiar el estado del token
    estudianteBDD.token = null
    estudianteBDD.emailConfirmado = true
    await estudianteBDD.save()
    res.status(200).json({msg:"Cuenta confirmada correctamente"})
}

const recuperarPassword = async(req,res) => {
    //Obtener el email
    const {email} = req.body

    //Verificar que no exista un campo vacio
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes ingresar tu correo"})

    //Buscamos en la base el correo
    const estudianteBDD = await Estudiante.findOne({email})
    if (!estudianteBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})

    //Creamos un nuevo token
    const token = estudianteBDD.createToken()
    estudianteBDD.token = token
    sendMailToRecoveryPassword(email,token)
    await estudianteBDD.save()
    res.status(200).json({msg:"Revisa tu correo para restablecer la contraseña"})

}
export {
    registro,
    confirmarMail,
    recuperarPassword
}