const validator = require("validator")

exports.checkEmpty = (fields) => {
    const error = {}
    let isError = false
    for (const key in fields) {
        if (validator.isEmpty(fields[key]) ? "" + fields[key] : "") {
            error[key] = `${key} Is Required`,
                isError = true
        }
    }
    return { isError, error }
}