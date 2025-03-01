**Prueba Poke**

Pasos a seguir para el funcionamiento de la app:

1. Extraer el proyecto.
2. Entrar a cada sección y hacer un **npm i** (api, client).
3. Para el backend deben crear el archivo .env con las siguientes variables.
  - **DB_USER**=
  - **DB_PASSWORD**=
  - **DB_HOST**=
  - **SESSION_SECRET**=
  - **JWT_SECRET**=
  
  Los valores lo colocan ustedes, ya que las 2 últimas variables son a decisión de ustedes y ya las 3 primeras son las credenciales de su base de datos relacional, para esta se uso Sequelize.
4. Deben crear una base de datos llamada pokémon.
5. En cada sección hacer un **npm start** para correr los servidores.

**NOTA** Cada servidor se debe correr por separado es decir en la ruta **api** un **npm start** y en la ruta **client** un **npm start**.

**Api** 

El backend fue creado con **node** y **express**, usando **axios** para el manejo http de las rutas, **javascript** como lenguaje, se uso **JWT** para generar un token de acceeso y **bcrypt** para almacenar la contraseña encriptada.

Se crearon 2 rutas **/searcpokemons** para buscar todas las coincidencias en el nombre suministrado y **/searchpokemon** para buscar el id del pokémon. Adicional, se crearon 2 rutas más para cargar tanto tipos, como pokémon directamente a la base de datos.

El backend cuenta con una ruta de inicio de sesión y de registro.


**Client**

El frontend fue creado con **react** usando **redux** y **axios** para el manejo de las rutas http.

Se crearon 3 vistas sencillas una para el registro, una para el inicio de sesión y la otra es una donde solo puedes acceder si has iniciado sesión para poder hacer las búsquedas de los pokémon, para mantener el inicio de sesión se utilizó **JWT** para manejar el token que viene desde el backend.


**¿Qué es Express.js? y ¿Por qué es útil en el desarrollo web?**

Express.js es un framework web para Node.js que ayuda a construir app web y apis sencillas, proporcionando herramientas para manejar rutas HTTP sin necesidad de mucha configuración.

Es útil; ya que que permite crear servidores con pocas líneas de código, facilita la interacción con peticiones GET, POST, PUT, DELETE y es muy fácil de integrar con bases de datos, ya sea relacional o no relacional.

**¿Cómo se realiza una solicitud HTTP GET en Express.js? Proporcione un ejemplo.**

Express tiene la facilidad de manejar solicitudes usando **express().get()** esto nos permite traer datos del servidor.

*Ejemplo:*
``` javascript
      const express = require("express");
      const app = express();

      app.get("/", (req, res) => {
        res.send("¡Bienvenido a mi servidor con Express.js!");
      });

```
**¿Qué es una API y cuál es su función en el desarrollo de aplicaciones web?**

Una api es una interfaz de programación que permite que dos sistemas de sofware se comuniquen etre sí.

Las api facilitan la interacción entre la interfaz del usuario, el servidor y la base de dato, haciendo de puente para mover información entre sí.

**¿Cómo se realiza una solicitud HTTP a una API externa en Node.js? Proporcione un ejemplo utilizando la API de Pokémon.**

Para realizar una solicitud HTTP existen varias librerías como axios, fetch y https.

En el ejemplo, usaremos axios para manejar las apis externas, axios por defecto entiende que debe hacer una petición get así que podemos colocar **axios('https://pokeapi.co/api/v2/type')** directamente, pero si preferimos usar **axios.get('https://pokeapi.co/api/v2/type')** también es aceptable, normalmente vemos que una petición axios.get o cualquier otra petición se encuenta junto a un await; esto se debe a que se usa el async/await en vez de una promesa con .then().

```javascript
const { Router } = require('express');
const axios = require("axios");
const {Pokemon, Type} = require("../db");


//Método encargado de cargar la base de datos con los tipos pokemones
const updateBaseType = async (req, res) => {
  try {
    const typePokemon = (await axios('https://pokeapi.co/api/v2/type')).data.results;

    for (const type of typePokemon) {
      await Type.findOrCreate({
        where: { name: type.name }
      });
    }

    const typeDb = await Type.findAll();
    res.send(typeDb);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const router = Router();


router.get("/typeall", updateBaseType);

module.exports = router;

```

**¿Qué es el manejo de errores en Express.js y por qué es importante?**

El manejo de errores en Express.js es la forma en que una aplicación captura y responde a errores inesperados para evitar que el servidor se bloquee y proporcionar respuestas adecuadas a los clientes.

Son importantes porque evita que la aplicaión se caiga o se frene al momento de encontrarse con un error, mejora la experiencia de usuario, puede registrar errores para ser analizados y brinda más seguridad.

**¿Qué es el enrutamiento en Express.js y cómo se define una ruta en una aplicación Express?**

Es el mecanismo que permite definir cómo la aplicación responde a las diferentes solicitudes.

Es importante porque nos ayuda a organizar y separar las rutas para estructurar una api rest eficiente y escalable.

**¿Cómo se renderiza una página web HTML en Express.js?**

Express.js permite renderizar páginas HTML de varias maneras, ya sea sirviendo archivos estáticos o utilizando motores de plantillas como EJS, Pug o Handlebars.