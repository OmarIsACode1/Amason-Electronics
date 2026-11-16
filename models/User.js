// Definimos los datos de cada Usuario
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
// Creamos y exportamos el modelo que utilizaremos desde nuestros controladores.
module.exports = mongoose.model('User', userSchema);