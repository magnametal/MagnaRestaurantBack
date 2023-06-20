const bcrypt = require("bcryptjs/dist/bcrypt");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../modelos/usuario");
const Notificacion = require("../modelos/notificacion");
const SocketSesion = require("../modelos/socketsesion");
var moment = require('moment');
moment.locale('es');

const { base64ToFile, removeFolder } = require("../helpers/commons");
const Country = require('country-state-city').Country;

const getSearchUsuarios = async (request, response) => {
  const query = request.params.query;
  const desde = Number(request.query.desde) || 0;
  let regex = new RegExp(query, "i");
  const search = {
    $and: [
      { $or: [{ name: regex }, { email: regex }, { role: regex }] },
    ],
  };
  const [usuarios, total] = await Promise.all([
    Usuario.find(search).skip(desde).limit(10).sort({ email: 1 }),
    Usuario.countDocuments(search),
  ]);
  let usuarios0 = [];
  Promise.all(
    usuarios.map((usuario) => {
      return new Promise((resolve0, _) => {
        resolve0(usuario.toJSON());
      }).then((usuario0) => {
        usuarios0.push(usuario0);
      });
    })
  ).then(() => {
    response.json({
      ok: true,
      users: usuarios0,
      total,
    });
  });
};


const getUsuarios = async (req, res) => {
  // Se obtiene el valor desde para la paginacion y si no lo manda es 0(cero)
  const desde = Number(req.query.desde) || 0;

  // La paginacion se hace en el find()
  // el skip indica que se salte los registros anteriores al desde
  // el limit indica que van a ser 5 registros
  // const usuarios = await Usuario
  //                               .find({}, 'nombre email role google')
  //                               .skip(desde)
  //                               .limit(5)

  // permite obtener la cantidad de usuarios en el modelo Usuario
  // const total = await Usuario.count();

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "name email code phone country city role google status img").skip(desde).limit(10).sort({ email: 1 }),
    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    users: usuarios,
    total,
  });
};

const getUsuarioProfile = async (req, res) => {
  const { email } = req.body;
  const usuarioDB = await Usuario.findOne({ email: email });
  if (!usuarioDB) {
    return res.status(404).json({
      ok: false,
      code: 1
    });
  }
  res.json({
    ok: true,
    user: await usuarioDB.toCustomA()
  });
};
const crearUsuario = async (req, res) => {
  const { password, email } = req.body;
  try {
    // buscar por email el Usuario
    const existeEmail = await Usuario.findOne({ email });
    // Si el email existe
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        code: 2,
      });
    }
    const countries = Country.getAllCountries();
    const index = countries.findIndex(x => x.name == req.body.country);
    let input = req.body;
    if (index != -1) {
      input.countryisoCode = countries[index].isoCode;
    }
    // crea una instancia del usuario
    const usuario = new Usuario(input, { versionKey: false });
    if (usuario.img) {
      const reg = new RegExp(
        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
      );
      let block = usuario.img.split(";base64,");
      if (!reg.test(block[1])) {
        return res.status(500).json({
          ok: false,
          code: 3,
        });
      }
      if (block[1].charAt(0) != 'i' && block[1].charAt(0) != '/') {
        return res.status(500).json({
          ok: false,
          code: 4,
        });
      }
      const path = "/usuarios/" + usuario.id;
      const filename = usuario.id + "_usuario";
      base64ToFile(usuario.img, path, filename).then(
        async (base64ToFileRes) => {
          if (base64ToFileRes.status == "success") {
            usuario.img = base64ToFileRes.finalpath;
            // encriptar contraseña
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salt);
            // console.log(usuario.id);
            // Generar el JWT
            const token = await generarJWT(usuario.id);

            // Para grabar en la base de datos
            await usuario.save();
            const newNotify = new Notificacion({ user: usuario.id, type: 0, message: 'Bienvenido a GLON Academy esperamos disfrutes todos los beneficios y servicios que podemos ofrecerte.' }, { versionKey: false });
            await newNotify.save();
            const actual = await SocketSesion.findOne({
              $and: [{
                user: usuario.id
              },
              {
                loguedOutAt: null
              }]
            }).select('socket');
            if (actual) {
              var io = req.app.get('io');
              io.to(actual.socket).emit('newNotification', { type: 0, message: 'Bienvenido a GLON Academy esperamos disfrutes todos los beneficios y servicios que podemos ofrecerte.', date: moment().fromNow(), status: 'new' });
            }
            res.json({
              ok: true,
              user: usuario,
              token: token,
            });
          } else {
            return res.status(500).json({ ok: false, code: 5 });
          }
        }
      );
    } else {
      const salt = bcrypt.genSaltSync();
      usuario.password = bcrypt.hashSync(password, salt);
      // console.log(usuario.id);
      // Generar el JWT
      const token = await generarJWT(usuario.id);

      // Para grabar en la base de datos
      await usuario.save();
      res.json({
        ok: true,
        user: usuario,
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      code: 0,
    });
  }
};

const actualizarUsuario = async (req, res) => {
  const uid = req.params.id;
  try {
    //Actualizaciones
    let { password, google, email, img, ...campos } = req.body;
    // buscar  Usuario por id
    const usuarioDB = await Usuario.findById(uid);
    // Verificar si el usuario existe en DB
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        code : 6,
      });
    }

    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail && existeEmail.id != uid) {
      return res.status(400).json({
        ok: false,
        code : 1,
      });
    }

    // Solo si no es un usuario de google
    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        code : 7,
      });
    }
    const countries = Country.getAllCountries();
    const index = countries.findIndex(x => x.name == campos.country);
    if (index != -1) {
      campos.countryisoCode = countries[index].isoCode;
    }
    if (img) {
      const reg = new RegExp(
        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
      );
      let block = img.split(";base64,");
      if (!reg.test(block[1])) {
        return res.status(500).json({
          ok: false,
          code : 3,
        });
      }
      if (block[1].charAt(0) != 'i' && block[1].charAt(0) != '/') {
        return res.status(500).json({
          ok: false,
          code : 4,
        });
      }
      if (usuarioDB.img) {
        var imgURL = usuarioDB.img.split("/");
        removeFolder(`/${imgURL[1]}/${imgURL[2]}`);
      }
      const path = "/usuarios/" + uid;
      const filename = uid + "_usuario";
      base64ToFile(img, path, filename).then(async (base64ToFileRes) => {
        if (base64ToFileRes.status == "success") {
          campos.img = base64ToFileRes.finalpath;

          const usuarioActualizado = await Usuario.findByIdAndUpdate(
            uid,
            campos,
            { new: true }
          );

          res.json({
            ok: true,
            user: usuarioActualizado,
          });
        } else {
          console.log(base64ToFileRes.message);
          return res.status(500).json({ ok: false, msg: "Error inesperado" });
        }
      });
    } else {
      const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.json({
        ok: true,
        user: usuarioActualizado,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      code : 0,
    });
  }
};

const actualizarPerfilUsuario = async (req, res) => {
  const uid = req.params.id;
  try {
    let { password, google, email, img, ...campos } = req.body;
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        code: 1,
      });
    }
    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        code: 7,
      });
    }
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail && existeEmail.id != uid) {
      return res.status(400).json({
        ok: false,
        code: 1,
      });
    }
    const countries = Country.getAllCountries();
    const index = countries.findIndex(x => x.name == campos.country);
    if (index != -1) {
      campos.countryisoCode = countries[index].isoCode;
    }
    if (password) {
      const salt = bcrypt.genSaltSync();
      campos.password = bcrypt.hashSync(password, salt);
    }
    if (img) {
      const reg = new RegExp(
        "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
      );
      let block = img.split(";base64,");
      if (!reg.test(block[1])) {
        return res.status(500).json({
          ok: false,
          code: 3,
        });
      }
      if (block[1].charAt(0) != 'i' && block[1].charAt(0) != '/') {
        return res.status(500).json({
          ok: false,
          code: 4,
        });
      }
      if (usuarioDB.img) {
        var imgURL = usuarioDB.img.split("/");
        removeFolder(`/${imgURL[1]}/${imgURL[2]}`);
      }
      const path = "/usuarios/" + usuarioDB._id;
      const filename = usuarioDB._id + "_usuario";
      base64ToFile(img, path, filename).then(async (base64ToFileRes) => {
        if (base64ToFileRes.status == "success") {
          campos.img = base64ToFileRes.finalpath;

          const usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuarioDB._id,
            campos,
            { new: true }
          );

          res.json({
            ok: true,
            user: password ? await { token: await generarJWT(usuarioDB._id), ...usuarioActualizado.toCustomA() } : await usuarioActualizado.toCustomA(),
          });
        } else {
          return res.status(500).json({ ok: false, code: 0 });
        }
      });
    } else {
      const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioDB._id, campos, {
        new: true,
      });
      res.json({
        ok: true,
        user: password ? await { token: await generarJWT(usuarioDB._id), ...usuarioActualizado.toCustomA() } : await usuarioActualizado.toCustomA(),
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      code: 0,
    });
  }
};

const borrarUsuario = async (req, res) => {
  const uid = req.params.id;
  try {
    // buscar  Usuario por id
    const usuarioDB = await Usuario.findById(uid);
    // Verificar si el usuario existe en DB
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        code: 1,
      });
    }

    if (usuarioDB.img) {
      var imgURL = usuarioDB.img.split("/");
      removeFolder(`/${imgURL[1]}/${imgURL[2]}`);
    }

    await Usuario.findByIdAndDelete(uid);
    res.json({
      ok: true,
      uid,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      code: 0,
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  getSearchUsuarios,
  getUsuarioProfile,
  actualizarPerfilUsuario,
};
