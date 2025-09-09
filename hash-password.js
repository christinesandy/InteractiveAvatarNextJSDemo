// hash-password.js

const bcrypt = require('bcryptjs'); // Use bcryptjs as it's already installed

const password = process.argv[2]; // Get the password from the command line

if (!password) {
  console.error('Usage: node hash-password.js <your-password>');
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Your hashed password is:');
  console.log(hash);
});