//setup express
const express = require('express');
const app = express();

//setup middleware
app.use(express.text());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render('error');
});


//routes
app.use(express.static("www"));
const authRoutes = require('./routes/auth-routes');
app.use("/auth", authRoutes);
const chainRoutes = require('./routes/chain-routes');
app.use("/chains", chainRoutes);

process.env.PORT=1337;
 
app.listen(process.env.PORT, () =>
  console.log(`Mox serving on port ${process.env.PORT}!`),
);