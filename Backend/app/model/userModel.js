// // userModel.js
// import db from '../config/db.js';


// export const findUserByEmail = async (email) => {
//   const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//   return user.length ? user[0] : null;
// };

// export const createUser = async (name, email, hashedPassword) => {
//   const sql = "INSERT INTO users (name,email, password) VALUES ( ?, ?, ?)";
//   await db.query(sql, [name,email, hashedPassword]);
// };

//

import db from '../config/db.js';
import bcrypt from "bcrypt";
 
class userService {
  static async findUserByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await  db.query(sql, [email]);
    return rows.length ? rows[0] : null;
  }
 
  static async createUser({ name, email, password }) {
    const sql = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
    const [result] = await db.query(sql, [name, email, password]);
    return result;
  }
 
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

}
 
export default userService;
 
 