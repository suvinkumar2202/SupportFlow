const bcrypt = require('./node_modules/bcryptjs');
const hash = bcrypt.hashSync('password123', 10);
console.log(hash);
