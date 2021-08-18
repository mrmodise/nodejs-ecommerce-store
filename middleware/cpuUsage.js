const os = require('node-os-utils')
const cpu = os.cpu;


function cpuPercentage()
{cpu.usage().then((info)=>{
    return "Server Overload, CPU Percentage : "+ info;
})
}
module.exports = cpuPercentage;


