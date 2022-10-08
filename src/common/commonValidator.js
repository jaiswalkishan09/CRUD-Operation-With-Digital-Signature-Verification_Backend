let emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,24}$/; /**email id validation */
let numberValidation = /^[0-9]+$/; /**only numbers allowed */
let firstLastNameValidation = /^[a-z0-9'.-\s]+$/i; /** Alpha numeric,space,dot,single quotes and hyphen allowed */

module.exports = {
    emailValidation: function (input) {
        return (result = emailValidation.test(input) ? true : false);
    },
    numberValidation: function(input) {
        return (result = numberValidation.test(input) ? true : false);
    },
    firstLastNameValidation: function(input) {
        return (result = firstLastNameValidation.test(input) ? true : false);
    }
};