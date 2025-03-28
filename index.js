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
const { file: nombreArchivo } = yargs(process.argv).option('file', {
    alias: 'f',
    type: 'string',
    description: 'El nombre del archivo JSON',
    default: 'productos.json'
}).help().argv;

//Verifico que de el nombre del archivo (ya no se necesita)


//Pido los datos del producto
const juntarDatos = async () => {
    const producto = await pregunta('Producto : ');
    const precio = await pregunta('Precio : ');
    const cantidad = await pregunta('Cantidad : ');

    const datoProducto = { producto, precio, cantidad }; //

    fs.readFile(nombreArchivo, 'utf-8', (err, data) => {
        let productos = [];
        if (err) {
            console.log('Archivo no encontrado, se creará uno nuevo.');
        } else {
            // Si el archivo existe, parsear los datos
            try {
                productos = JSON.parse(data); // Parseo los datos del archivo
            } catch (parseError) {
                console.log('El archivo estaba vacío o no tenía formato JSON válido.');
            }
        }

        // Agregar el nuevo producto al array
        productos.push(datoProducto);

        // Sobrescribir el archivo con el array actualizado
        fs.writeFile(nombreArchivo, JSON.stringify(productos, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log('Error al escribir el archivo:', err);
            } else {
                console.log(`El producto ${producto} fue agregado correctamente al archivo ${nombreArchivo}.`);
            }


            //Leer y Mostrar el Contenido del Archivo JSON:
            fs.readFile(nombreArchivo, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Error al leer el archivo:', err);
                } else {
                    console.log(`Contenido del archivo ${nombreArchivo}:`);
                    console.log(JSON.parse(data));
                }
            })
        });
        rl.close();
    }
    )
}

juntarDatos()