export default {
    /**
     * Response for a user (student, professor or staff)
     * @param {Object} data -> User's data
     * @param {String} message -> Custom message
     * @returns {Object} -> Formated response
     */
    user: ( data, message) => {
        return {
            message: message,
            full_name: (`${data.dataValues}.name ${data.dataValues}.lastnames`),
            dni: data.dni,
            phone: data.phone,
            email: data.email
        }
    },
    tokenGen: (data,token) => {
        return {
            user: data.email,
            message: "Usuario autenticado correctamente.",
            token: `Bearer ${token}`
        }
    }
}
