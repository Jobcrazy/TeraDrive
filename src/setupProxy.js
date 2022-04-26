const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            target: "http://localhost:3000/",
            pathRewrite: {
                //'^/api': '',
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: false, // 启用websocket
        })
    );
    app.use(
        createProxyMiddleware("/upload", {
            target: "http://localhost:3000/",
            pathRewrite: {
                //'^/api': '',
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: false, // 启用websocket
        })
    );
};
