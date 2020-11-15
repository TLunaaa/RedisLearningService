const redis = require('redis');

var rediscli = redis.createClient({
    host: '172.17.0.2',
    port: 6379
});

rediscli.on("error", function(error) {
    console.log("Redis - No se pudo conectar con el servidor")
});
  
rediscli.on("connect", function() {
    console.log("Redis - Conexion establecida con el servidor");
});

module.exports = {rediscli: rediscli}