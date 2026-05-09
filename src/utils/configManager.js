const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');

function getConfig() {
    if (!fs.existsSync(configPath)) return {};
    return JSON.parse(fs.readFileSync(configPath));
}

function setConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = { getConfig, setConfig };
