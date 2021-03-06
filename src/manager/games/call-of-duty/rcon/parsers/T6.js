module.exports = {
    commandTemplates: {
        status: 'status',
        tell: 'tell {0} \"{1}\"',
        say: 'say {0}',
        kick: 'clientkick_for_reason {0} "{1}"',
        setDvar: 'set {0} "{1}"',
        getDvar: 'get {0}',
        map: 'map {0}'
    },
    rconCommandFormat: '\xff\xff\xff\xffrcon {0} {1}',
    responseHeader: /\xff\xff\xff\xffprint/g,
    statusHeader: /num +score +bot +ping +guid +name +lastmsg +address +qport +rate */g,
    dvarRegex: /(.*?) +(is:|is) +\"(.*?)\"/g,
    statusRegex: /^ +([0-9]+) +([0-9]+) +([0-9]+) +([0-9]+) +((?:[A-Za-z0-9]){8,32}|(?:[A-Za-z0-9]){8,32}|bot[0-9]+|(?:[[A-Za-z0-9]+)) *(.{0,32}) +([0-9]+) +(\d+\.\d+\.\d+.\d+\:-*\d{1,5}|0+.0+:-*\d{1,5}|loopback|unknown|bot) +(-*[0-9]+) +([0-9]+) *$/g,
    parseStatus: (match) => {
        const address = match[8].split(':')

        return {
            slot: parseInt(match[1]),
            score: parseInt(match[2]),
            bot: match[3] == '1',
            ping: parseInt(match[4]),
            uniqueId: match[3] == '1' ? match[5] : parseInt(match[5], 16).toString(),
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