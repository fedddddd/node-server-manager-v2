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
    responseHeader: /\xff\xff\xff\xffprint/g,
    statusHeader: /num +score +ping +guid +name +lastmsg +address +qport +rate */g,
    rconCommandFormat: '\xff\xff\xff\xffrcon {0} {1}',
    dvarRegex: /\"(.*?)\" +(is:|is) +\"(.*?)\"/g,
    statusRegex: /^ +([0-9]+) +([0-9]+) +([0-9]+) +((?:[A-Za-z0-9]){8,32}|(?:[A-Za-z0-9]){8,32}|bot[0-9]+|(?:[[A-Za-z0-9]+)) *(.{0,32}) +([0-9]+) +(\d+\.\d+\.\d+.\d+\:-*\d{1,5}|0+.0+:-*\d{1,5}|loopback|unknown|bot) +(-*[0-9]+) +([0-9]+) *$/g,
    parseStatus: (match) => {
        const address = match[7].split(':')

        return {
            slot: parseInt(match[1]),
            score: parseInt(match[2]),
            bot: match[3] == '1',
            ping: parseInt(match[3]),
            uniqueId: match[4],
            name: match[5].replace(new RegExp(/\^([0-9]|\:|\;)/g, 'g'), ``),
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