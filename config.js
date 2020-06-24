
// container for all the environments
var environments = {};

// staging (defualt) environment
environments.staging = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'staging'
};
environments.production = {
    'httpPort': 6000,
    'httpsPort': 6001,

    'envName': 'production'
};

// determing which env was passed as cli argument

var  currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '' 

//  check that the current enviromnent is one of th enviromennt above , if not, default to staging 

var enviromentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment]: environments.staging

module.exports = enviromentToExport;