import bcrypt from 'bcrypt';

const password = process.argv[2];
if (!password) {
  console.error('請提供密碼: node hash-password.js 密碼');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log('Hash:', hash);