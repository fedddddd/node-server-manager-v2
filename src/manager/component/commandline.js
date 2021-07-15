const path         =  require('path')
const io           = require('../../utils/io')
const localization = require('../../utils/io')
const rl           = require('serverline')

const config       = new io.ConfigWatcher(path.join(__dirname, '../../../config/config.json'))

rl.init({
    prompt: '\x1b[34m[nsm²] > \x1b[0m'
})

const commands = {
    'quit': () => {
        process.exit(0)
    }
}

rl.setCompletion(Object.keys(commands))

rl.on('line', (cmd) => {
    if (cmd.length == 0) {
        return
    }

    const args = cmd.trim().split(/\s+/g)
    const name = args[0]

    args.join = (index) => {
        var buffer = ""
        for (var i = index; i < args.length; i++) {
            buffer += args[i]
            if (i < args.length - 1) {
                buffer += " "
            }
        }

        return buffer
    }

    if (!commands[name]) {
        io.print(string.format(localization['CMD_COMMAND_NOT_FOUND'], `${config.commandPrefix}help`))
        return
    }
    
    commands[name](args)
    return
})

const colors = {
    'white': '^7',
    'red': '^1',
    'green': '^2',
    'yellow': '^3',
    'blue': '^5',
    'purple': '^6',
    'default': '^7',
}

const parseColors = (message) => {
    message = colors.default + message + colors.default
    return message.replace(/\<(.+?)\>/g, (match, index) => {
        const original = match
        match = match.toLowerCase().slice(1, -1)

        return colors[match]
            ? colors[match]
            : original
    })
}

const addServerCommands = (server) => {
    for (const cmd of server.commands) {
        if (cmd.inGame) {
            continue
        }

        const callback = async (args) => {
            const client = {
                clientId: server.database.consoleId,
                roles: ['role_owner'],
                inGame: false,
                tell: (msg) => {
                    io.print(parseColors(msg.trim()))
                }
            }

            await cmd.execute(client, args)
        }

        commands[cmd.name] = callback
        if (cmd.alias) {
            commands[cmd.alias] = callback
        }
        
        rl.setCompletion(Object.keys(commands))
    }
}

module.exports = {
    onLoad: (manager) => {
        if (manager.servers.length) {
            addServerCommands(manager.servers[0])
            manager.servers[0].on('updated_commands', () => {
                addServerCommands(manager.servers[0])
            })
        }
    }
}