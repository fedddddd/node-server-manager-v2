module.exports = {
    commandTemplates: {
        status: 'status',
        tell: 'tellraw {0} \"{1}\"',
        say: 'sayraw {0}',
        kick: 'clientkick {0} "{1}"',
        setDvar: '{0} "{1}"',
        getDvar: '{0}',
        map: 'map {0}'
    },
    ignoreCommandResponses: ['tell', 'tellraw', 'say', 'sayraw'],
    rconCommandFormat: '\xff\xff\xff\xffrcon {0} {1}',
    responseHeader: /\xff\xff\xff\xffprint/g,
    statusHeader: /num +score +bot +ping +guid +name +address +qport */g,
    dvarRegex: /\"(.*?)\" +(is:|is) +\"(.*?)\"/g,
    statusRegex: /^ +([0-9]+) +([0-9]+) +(Yes|No) +([0-9]+) +((?:[A-Za-z0-9]){8,32}|(?:[A-Za-z0-9]){8,32}|bot[0-9]+|(?:[[A-Za-z0-9]+)) *(.{0,32}) +() +(\d+\.\d+\.\d+.\d+\:-*\d{1,5}|0+.0+:-*\d{1,5}|loopback|unknown|bot) +([0-9]+) *$/g,
    parseStatus: (match) => {
        const address = match[8].split(':')

        return {
            slot: parseInt(match[1]),
            score: parseInt(match[2]),
            bot: match[3] == 'Yes',
            ping: parseInt(match[4]),
            uniqueId: match[5],
            name: match[6].replace(new RegExp(/\^([0-9]|\:|\;)/g, 'g'), ``),
            address: address[0],
            port: parseInt(address[1])
        }
    },
    parseGuid: (guid) => {
        return guid
    },
    colors: {
        'white': '^7',
        'red': '^1',
        'green': '^2',
        'yellow': '^3',
        'blue': '^5',
        'purple': '^6',
        'default': '^7',
    },
}