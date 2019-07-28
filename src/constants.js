module.exports = {
    SESSION_VAR: {
        sessionId: "__KSESID",
        csrfToken: "__TOKEN",
        userId: "__ID",
        lastAccess: "__TM",
        isUserLogged: "__LG",
    },
    MSG: {
        ERR_NOT_VALID_ROUTING: "not valid routing(use numbers,letters,-,_)",
        ERR_ROUTING_DEFINED_MULTIPLE: "same routing is defined multiple time",
        ERR_NOT_SUPPORTED_CONTENT_TYPE: "not supported content type",
        ERR_INVALID_ROUTING: "routing is not valid",
        ERR_INVALID_CONFIGURATION: "configuration is not valid",
        ERR_INVALID_DATA_TYPE_PORT: "port should be number type",
        ERR_INVALID_DATA_TYPE_HOST: "host should be string type",
        ERR_INVALID_DATA_TYPE_PUBLIC_DIR: "publicDir should be string type",
        ERR_INVALID_PUBLIC_DIR: "publicDir should be different from ROOT directory",
        ERR_INVALID_DATA_TYPE_IS_PRODUCTION: "isProduction should be boolean type",
        ERR_INVALID_DATA_TYPE_SESSION_TIME: "timeOut should be number type",
        ERR_INVALID_DATA_TYPE_SESSION_ACTIVATION: "activate should be boolean type",
        ERR_INVALID_SESSION_TIME: "sessionTime should be greater then zero",
        ERR_INVALID_DATA_TYPE_MAX_BODY_SIZE: "maxBodySize should be number type",
        ERR_INVALID_MAX_BODY_SIZE: "maxBodySize should be greater then zero",
    }
};
