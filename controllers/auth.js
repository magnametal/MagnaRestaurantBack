
const bcrypt = require('bcryptjs/dist/bcrypt');
// Para tener las ayudas de express pero no es necesario
const { response } = require('express');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../modelos/usuario');
const { makeid } = require('../helpers/commons');
const Recuperacion = require('../modelos/recuperacion');
const Sesion = require('../modelos/sesion');
const Subscrito = require('../modelos/subscrito')
const { getMenuFrontEnd } = require('../helpers/menu-frontend.js');
const { sendMail } = require('../helpers/mailer');
const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                code: 25
            })
        }
        // Verificar contrase;a:  regresa true si hace match o false si no
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                code: 25
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuarioDB._id);
        const activo = usuarioDB.active;
        const existeSesion = await Sesion.findOne({ id: usuarioDB._id, closed: false });
        if (existeSesion) {
            let { closed, ...campos } = existeSesion.toJSON();
            campos.closed = true;
            const sesionActualizada = await Sesion.findByIdAndUpdate(existeSesion.id, campos, {
                new: true,
            });
        }
        const usuario = new Sesion({ user: usuarioDB._id, token: token }, { versionKey: false });
        await usuario.save();
        const subs = await Subscrito.find({ user: usuarioDB._id }).sort({ issued: 1 });
        let finalSubs = [];
        Promise.all(
            await subs.map((su) => {
                return new Promise((resolve0, _) => {
                    resolve0(su.toJSON());
                }).then((sub) => {
                    finalSubs.unshift(sub);
                });
            })
        ).then(async () => {
            const exit = finalSubs.sort(function (a, b) {
                return new Date(b.issued) - new Date(a.issued);
            })
            res.json({
                ok: true,
                token,
                userData: await usuarioDB.toJSON(),
                subscriptions: exit,
                activo: activo,
                menu: getMenuFrontEnd(usuarioDB.role)
            })
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            code: 0
        })
    }
}

// const googleSignIn= async (req,res=response)=>{

//     const googleToken=req.body.token;


//     try {

//         const {email, name, picture} = await googleVerify(googleToken);

//          const usuarioDB = await Usuario.findOne({email});

//          let usuario;

//         //si no existe el usuario
//         if ( !usuarioDB ){
//             usuario = new Usuario({
//                 nombre: name,
//                 email,
//                 password: '@@@',  // solo para que no choque con el modelo, no se va a usar
//                 img: picture,
//                 google: true
//             })
//         }else {
//             // si existe el usuario
//             usuario = usuarioDB;
//             usuario.google = true;  // si se autentico por google
//             //usuario.password = '@@@';
//         }

//         // Guardar en DB
//         await usuario.save();

//         // Generar el TOKEN - JWT
//         const token = await generarJWT( usuario.id);

//         res.json({
//             ok:true,
//             email, name, picture,
//             token,
//             menu: getMenuFrontEnd(usuario.role)
//         })

//     } catch (error) {

//         res.json({
//             ok:false,
//             msg: 'Token No es correcto',
//         })

//     }


// }

const renewToken = async (req, res=response)=>{

    const uid=req.uid;

    const usuarioDB = await Usuario.findById(uid);
    if(!usuarioDB){
        return res.status(404).json({
            ok: false,
            code : 25
        })
    }

    //Generar el Token - JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por UID
    // const usuario = await Usuario.findById(uid);

    //const activo= usuarioDB.active;
    const existeSesion = await Sesion.findOne({ id: usuarioDB.id, closed: false });
    if (existeSesion) {
        let { closed, ...campos} = existeSesion.toJSON();
        campos.closed = true; 
        const sesionActualizada = await Sesion.findByIdAndUpdate(existeSesion.id, campos, {
            new: true,
        });
    }
    const usuario = new Sesion({ user: usuarioDB.id, token:token  }, { versionKey: false });
    await usuario.save();

    res.json({
        ok: true,
        uid,
        usuarioDB,
        token,
        menu: getMenuFrontEnd(usuario.role)
    })
}

const recuperarCuenta = async (req, res) => {

    const email = req.body.email;
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
        return res.status(404).json({
            ok: false,
            code: 25
        })
    }
    const code = makeid(6);
    sendMail(usuarioDB.email, "Recuperación de clave de usuario GLON ACADEMY", "Tu código de recuperación de cuenta es: " + code)
    const recovery = new Recuperacion({ user: usuarioDB.toJSON().uid, code }, { versionKey: false });
    await recovery.save();
    res.json({
        ok: true,
        // recovery: recovery
    })
}

const recuperarCuentaConCodigo = async (req, res) => {
    const { email, code } = req.body;
    // Verificar email

    const peticionDB = await Recuperacion.findOne({ email, code, claimed: false });
    if (!peticionDB) {
        return res.status(404).json({
            ok: false,
            code: 25
        })
    }

    let { recoverykey, ...campos } = peticionDB.toJSON();
    if (Date.now() > campos.expire_at) {
        return res.status(404).json({
            ok: false,
            code: 26
        })
    }
    campos.recoverykey = makeid(12);
    campos.claimed = true;
    const peticionActualizada = await Recuperacion.findByIdAndUpdate(peticionDB.id, campos, {
        new: true,
    });
    res.json({
        ok: true,
        key: campos.recoverykey
    })
}

const recuperarCuentaConKey = async (req, res) => {
    const { email, key, password } = req.body;
    // Verificar email
    const peticionDB = await Recuperacion.findOne({ email, recoverykey: key, claimed: true, consumed: false });
    if (!peticionDB) {
        return res.status(404).json({
            ok: false,
            code: 25
        })
    }
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
        return res.status(404).json({
            ok: false,
            code: 25
        })
    }
    const salt = bcrypt.genSaltSync();
    usuarioDB.password = bcrypt.hashSync(password, salt);
    const token = await generarJWT(usuarioDB.id);
    const { consumed, ...campos } = peticionDB.toJSON();
    campos.consumed = true;
    const peticionActualizada = await Recuperacion.findByIdAndUpdate(peticionDB.id, campos, {
        new: true,
    });
    await usuarioDB.save(); // si no se graba, no funciona luego 
    res.json({
        ok: true,
        token: token
    })
}

module.exports = {
    login,
    // googleSignIn, 
    renewToken,
    recuperarCuenta,
    recuperarCuentaConCodigo,
    recuperarCuentaConKey
}