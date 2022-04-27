module.exports = {
    error_success: {
        code: 0,
        message: "Success",
    },
    error_login:{
        code: 1,
        message: "You have not logged in",
    },
    error_unknown: {
        code: 2,
        message: "Unknown Error",
    },
    error_credential: {
        code: 3,
        message: "Wrong username or password",
    },
    error_no_user: {
        code: 4,
        message: "The user doesn't exist",
    },
    error_del_sysadmin: {
        code: 5,
        message: "You can't delete the system admin",
    },
    error_not_admin: {
        code: 6,
        message: "You are not an administrator",
    },
};