import readline from 'readline';
import fs from 'fs';
import yargs from 'yargs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para preguntar
const pregunta = (pregunta) => {
    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            resolve(respuesta);
        });
    });
};

// Obtener el nombre del archivo desde los argumentos
const { archivo: nombreArchivo } = yargs(process.argv).option('archivo', {
    alias: 'a',
    type: 'string',
    description: 'El nombre del archivo JSON'
}).help().argv;

//Verifico que de el nombre del archivo
if (!nombreArchivo) {
    console.log('Por favor, especifica el nombre del archivo usando --archivo=nombre.json');
    process.exit(1); // Salir si no se proporciona el nombre del archivo
}

//Pido los datos del producto
const juntarDatos = async () => {
    const producto = await pregunta('Producto : ');
    const precio = await pregunta('Precio : ');
    const cantidad = await pregunta('Cantidad : ');

    const datoProducto = { producto, precio, cantidad }; //

    fs.readFile(nombreArchivo, 'utf8', (err, data) => {
        let productos = [];
        if (err) {
            console.log('Archivo no encontrado, se creará uno nuevo.');
        } else {
            // Si el archivo existe, parsear los datos
            productos = JSON.parse(data);
        }

        // Agregar el nuevo producto al array
        productos.push(datoProducto);

        // Sobrescribir el archivo con el array actualizado
        fs.writeFile(nombreArchivo, JSON.stringify(productos, null, 2), 'utf8', (err) => {
            if (err) {
                console.log('Error al escribir el archivo:', err);
            } else {
                console.log(`El producto ${producto} fue agregado correctamente al archivo.`);
            }
        });

        rl.close();
    }
    )
}

juntarDatos()