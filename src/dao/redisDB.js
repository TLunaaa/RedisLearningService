const redis = require('redis');

var redis_client = redis.createClient({
    host: '172.17.0.2',
    port: 6379
});

redis_client.on("error", function(error) {
    console.log("Redis - No se pudo conectar con el servidor")
});
  
redis_client.on("connect", function() {
    console.log("Redis - Conexion establecida con el servidor");
});

module.exports = {redis_client}