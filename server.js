const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const DB_USER = 'dubmfj';


const DB_PASS = '2125dinosaurio';


const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.xhtoge3.mongodb.net/usuariosDB?retryWrites=true&w=majority`; 


mongoose.connect(DB_URL)
    .then(() => console.log('✅ Conexión a MongoDB Atlas exitosa.'))
    .catch(err => console.error('❌ Error de conexión a la DB:', err));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.post('/register', async (req, res) => {
    const { username, password } = req.body; 

    try {

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
    username: username,
      password: hashedPassword // Guarda el hash
    });
    await newUser.save();

    res.status(201).send('Usuario registrado con éxito.');

    } catch (err) {
    if (err.code === 11000) {
    return res.status(400).send('El nombre de usuario ya está en uso.');
    }
    console.error(err);
    res.status(500).send('Error interno del servidor.');
}
});

// --- 5. INICIA EL SERVIDOR ---
app.get('/', (req, res) => {
    res.send('El servidor Express está funcionando.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor de login corriendo en http://localhost:${port}`);
});



/*login*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).send('Usuario no encontrado.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send('Contraseña incorrecta.');
    }

    res.status(200).send('Usuario logeado con éxito.');
    } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor.');
    }
});
