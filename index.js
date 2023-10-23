import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";


const app = express();
app.use(express.json());
dotenv.config();
conectarDB();

//Configurar cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            //Puede consultar a la API
            callback(null, true);
        } else  {
            //No esta permitido su request
            callback(new Error("Error de cors"))
        }
    }
};

app.use(cors(corsOptions));


//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);




//Error Routing
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
  

const PORT = process.env.PORT || 4000;

console.log("Ejecutando el servidor de Node");
const servidor = app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io 
import { Server, Socket } from "socket.io";

const io = new Server(servidor, {
    pingTimeout : 60000,
    cors : {
        origin: process.env.FRONTEND_URL,
    }
})

io.on('connection', (socket) => {
    console.log("Conectado a Socket.IO");

    //Definir los eventos de socket.io
    socket.on('abrir proyecto', (proyecto) => {
        socket.join(proyecto);
        socket.emit("respuesta", {nombre : "Juan"})
    });

    socket.on('nueva tarea', (tarea) => {
        const  proyecto  = tarea.proyecto
        socket.on(proyecto).emit('tarea agregada', tarea)
    });

    socket.on('eliminar tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('acutalizar tarea', (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('cambiar estado', (tarea) =>{
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea);
    })
})