const Client       = require('./client')
const EventEmitter = require('events')
const fs           = require('fs')
const string       = require('../../utils/string')

class Server extends EventEmitter {
    constructor(config, context) {
        super()
        this.config = config
        this.loaded = false
        this.online = false

        this.commands = []
        this.clients = []
        this.dvars = {}
        this.snapshots = []

        if (!fs.existsSync(config.logPath)) {
            throw new Error('Log path does not exist')
        }

        this.rcon = new (require(`../games/${config.game}/rcon`))(this, config)
        this.log = new (require(`../games/${config.game}/log`))(this, config)

        const keys = Object.keys(context)
        keys.forEach(key => {
            this[key] = context[key]
        })
    }

    addCommand(command) {
        for (var i = 0; i < this.commands.length; i++) {
            if (this.commands[i].name == command.name) {
                this.commands.splice(i, 1)
            }
        }

        for (var i = 0; i < this.manager.commands.length; i++) {
            if (this.manager.commands[i].name == command.name) {
                this.manager.commands.splice(i, 1)
            }
        }

        this.commands.push(command)
        this.manager.commands.push(command)

        this.emit('updated_commands')
        this.manager.emit('updated_commands')
    }

    emit(event, ...args) {
        super.emit('*', event, args)
        super.emit(event, ...args)
    }

    connect() {
        return this.rcon.connect()
    }

    snapshot() {
        if (this.snapshots.length > 300) {
            this.snapshots.shift()
        }

        const clientSnapshot = []
        for (const client of this.clients) {
            clientSnapshot.push({
                name: client.name,
                clientId: client.clientId,
                uniqueId: client.uniqueId,
                roles: [...client.roles],
                slot: client.slot,
                address: client.address
            })
        }

        const snapshot = {
            dvars: {...this.dvars},
            hostname: this.hostname,
            maxClients: this.maxClients,
            mapname: this.mapname,
            online: this.online,
            loaded: this.loaded,
            uptime: this.getUptime(),
            clients: clientSnapshot
        }

        this.snapshots.push(snapshot)
    }

    getUptime() {
        const totalSnaps = this.snapshots.length
        const ups = this.snapshots.reduce((total, snapshot) => total + snapshot.online, 0)
        return (ups / totalSnaps) * 100
    }

    async start() {
        this.dvars['sv_hostname'] = await this.rcon.getDvar('sv_hostname')
        this.dvars['sv_maxclients'] = parseInt(await this.rcon.getDvar('sv_maxclients'))
        this.dvars['mapname'] = await this.rcon.getDvar('mapname')
        this.dvars['g_gametype'] = await this.rcon.getDvar('g_gametype')
        this.dvars['version'] = await this.rcon.getDvar('version')

        this.hostname = this.dvars['sv_hostname']
        this.maxClients = this.dvars['sv_maxclients']
        this.mapname = this.dvars['mapname']

        if (!this.hostname) {
            throw new Error('Unable to get server dvars')
        }

        const players = await this.rcon.playerList()

        for (const player of players) {
            if (this.clients.find(client => client.uniqueId == player.uniqueId)) {
                continue
            }

            const client = new Client({...player, ...{server: this}})
            await client.build()

            this.clients.push(client)

            client.emit('preconnect')
            this.emit('preconnect', client)
        }

        this.online = true

        this.rcon.once('disconnect', () => {
            this.online = false
            this.clients = []
        })

        this.rcon.once('reconnect', () => {
            this.start()
        })

        this.snapshot()
        setInterval(this.snapshot.bind(this), 5 * 60 * 1000)
    }

    broadcast(message) {
        this.rcon.command(string.format(this.rcon.parser.commandTemplates.say, message))
    }
}

module.exports = Server