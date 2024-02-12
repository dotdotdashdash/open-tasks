async function fetchUserByNameAndPhone(connection, name, phone) {
    if (!name || !phone) throw `name and phone required`;

    const sql = `
        SELECT 
            id,
            name,
            phone_number
        FROM users
        WHERE 
            name = ? AND
            phone_number = ?
    `;

    let res = await connection.query(sql, [name, phone]);
    return res[0][0];
}

module.exports = { fetchUserByNameAndPhone }