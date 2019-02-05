var bcrypt = require('bcrypt-nodejs');
var User = require('./data/user');

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

module.exports = async () => {
  try {
    
    // create admin user
    let admin = await User.getUserByEmail(ADMIN_EMAIL);
    if (!admin) {
      admin = await User.createUser(ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD, {
        role: 1,
        emailVerified: true
      });
    } else if (!bcrypt.compareSync(ADMIN_PASSWORD, admin.password)) {
      admin = await User.updateUser(admin.id, { password: ADMIN_PASSWORD });
    }
    console.log('is admin', admin.isAdmin)
    return {      
      // admin
      admin
    };
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
}
