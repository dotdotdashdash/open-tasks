const jwt = require("jsonwebtoken");
const { fetchUserByNameAndPhone } = require("./user-model");

class User {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.phoneNumber = data.phoneNumber || data.phone_number;
    }

    async signJwt() {
        this.token = jwt.sign(
            { user_id: this._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' });
    }
}

async function findUserByNameAndPhone(connection, cred) {
    let { name, phone } = cred;
    if (!name || !phone) throw `name and number required`
    return await fetchUserByNameAndPhone(connection, name, phone);
}

module.exports = { User, findUserByNameAndPhone };