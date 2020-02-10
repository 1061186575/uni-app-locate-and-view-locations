var admin = require('./admin');
var users = require('./users');



function useRouter(app){
  app.use('/', users);
  app.use('/admin', admin);
}


module.exports = useRouter;