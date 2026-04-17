import * as modelproductos from "../models/productos.model.js"

const obtenerTodosLosProductos = async() =>{
    const productos = await modelproductos.obtenerTodosLosProductos()

    if(!productos || productos.lenght === 0){
        throw new Error("No hay procductos para mostrar")
    }

    return productos
}

const obtenerPorid = async (id) => {
    const producto = await modelproductos.obtenerProducto(id)

    if(!producto){
        throw new Error("Producto no encontrado");
        
    }

    return producto

}

const crearProductos = async (data) =>{
  const{nombre,precio,stock} = data;
  
  if(precio <= 0){
    throw new Error ("El Precio no puede ser 0 ni negativo");
  }
  if (stock < 0){
    throw new Error ("El stock no es valido");
  }
  return await modelproductos.crearProductos({
        nombre,precio,stock
    })
}

const actualizarProducto = (id,data) => {

const{nombre,precio,stock} = data;

     if(precio <= 0){
    throw new Error ("El Precio no puede ser 0 ni negativo");
  }
  if (stock < 0){
    throw new Error ("El stock no es valido");
  }

  const actualizar = modelproductos.actualizarProductos({nombre,precio,stock,id})

  return actualizar

}

const eliminarProductos = (id) => {
    const eliminar = modelproductos.eliminarProductos(id)

    if(!eliminar){
        throw new Error("producto no encontrado")
    }

    return eliminar
}

export{
    obtenerTodosLosProductos,
    obtenerPorid,
    crearProductos,
    actualizarProducto,
    eliminarProductos
}
    