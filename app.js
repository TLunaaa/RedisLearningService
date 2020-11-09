const express = require("express"),
      bodyParser  = require("body-parser"), //Allow JSON parsing
      userRouter = require('./src/routes/userRoutes'),
      loginRouter = require('./src/routes/loginRouter'),
      oauthServer = require('oauth2-server'),
      { promisify } = require('util');


const app = express();

app.use(bodyParser.json());

app.oauth = oauthServer({
  model: require('./src/middlewares/oauth')
})

app.use((req, res, next) => {
  console.log(req.method + ' ' + req.path);
  next();
})

app.use('/',loginRouter);
app.use('/users',userRouter);

app.use((err,req,res,next) => {
  res.status(400).json({message: err.message }).end();
});

const startServer = async () => {
  const port = process.env.SERVER_PORT || 3000
  await promisify(app.listen).bind(app)(port)
  console.log(`App - Escuchando el puerto: ${port}`)
}

startServer();

//PASSPORTJS http://www.passportjs.org/

//docker run -it --rm --name redsmin-proxy -e REDSMIN_KEY=5fa745b35764dc0fc0a41f88 -e REDIS_URI="redis://172.17.0.2:6379" redsmin/proxy