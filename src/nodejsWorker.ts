var logPrefix = "LanguageWorkerConsoleLog";
var errorPrefix = logPrefix + "[error] ";
var supportedVersions:string[] = ["v8","v10"];
var worker;

// Try validating node version
// NOTE: This method should be manually tested if changed as it is in a sensitive code path 
//       and is JavaScript that runs on at least node version 0.10.28
function validateNodeVersion(version) {
    var message;
    try {
        var versionSplit = version.split(".");
        var major = versionSplit[0];
        // process.version returns invalid output
        if (versionSplit.length != 3){
            message = "Could not parse Node.js version: '" + version + "'";
        // Unsupported version note: Documentation about Node's stable versions here: https://github.com/nodejs/Release#release-plan and an explanation here: https://medium.com/swlh/understanding-how-node-releases-work-in-2018-6fd356816db4
        } else if (supportedVersions.indexOf(major) < 0) {
            message = "Incompatible Node.js version. The version you are using is "
                + version +
                ", but the runtime requires an LTS-covered major version (ex: 8.11.1 or 10.14.1). LTS-covered versions have an even major version number (8.x, 10.x, etc.) as per https://github.com/nodejs/Release#release-plan. "
                + "For deployed code, change WEBSITE_NODE_DEFAULT_VERSION in App Settings. Locally, install or switch to a supported node version (make sure to quit and restart your code editor to pick up the changes).";
        }
    // Unknown error
    } catch(err) {
        var unknownError = "Error in validating Node.js version. ";
        console.error(errorPrefix + unknownError + err);
        throw unknownError + err;
    }
    // Throw error for known version errors
    if (message) {
        console.error(errorPrefix + message);
        throw message;
    }
}

validateNodeVersion(process.version);

// Try requiring bundle
try {
    worker = require("../../worker-bundle.js");
} catch (err) {
    console.log(logPrefix + "Couldn't require bundle, falling back to Worker.js. " + err);
    worker = require("./Worker.js");
}

worker.startNodeWorker(process.argv);
