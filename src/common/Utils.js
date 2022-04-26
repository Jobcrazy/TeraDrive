let utils = {
    getDomain() {
        if (process.env.NODE_ENV === "development") {
            return "";
        }
        return "https://4800api.azurewebsites.net/";
    },
};

export default utils;