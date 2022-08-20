
// DECLARATIONS ================================================================
require('dotenv').config()
const { Client } = require('discord.js')
const client = new Client({
    intents: 'GUILDS' // just a random intent for the bot to login
})

const prompt = require('prompt-sync')()
const clc = require('cli-color')

const wait = require('node:timers/promises').setTimeout
// =============================================================================


client.on('ready', async () => {

    // shows your client application commands ===================================
    async function showSlash() {
        const fetchSlash = await client.application.commands.fetch()
        let slashCount = 0

        if (fetchSlash.size === 0) {
            console.log(clc.cyanBright('This Application doesn\'t have a Slash Command'))
            return await client.destroy()
        }

        const mapSlash = fetchSlash.map((cmd) => {
            slashCount++

            return `${clc.greenBright(`${slashCount})`)} ${clc.yellowBright(`${cmd.name}`)} ${clc.redBright('||')} ${clc.yellowBright(`${cmd.id}`)}`

        })

        mapSlash.unshift(`${clc.cyanBright('===================')}`); mapSlash.push(`${clc.cyanBright('===================')}`);

        console.log(mapSlash.join('\n'))

        await wait(600)

        console.log(clc.cyanBright('==================='))
        console.log(`${clc.greenBright('1. Delete a Single Slash Command')}\n${clc.greenBright('2. Delete all Slash Command')}`)
        console.log(clc.cyanBright('==================='))

        await wait(1300)

        chooseDeletion()
    }
    // =========================================================================


    // delete all slash command or one-by-one deletion =========================
    async function chooseDeletion() {
        const choosed = prompt(clc.blueBright('Choose between the 2 option: '))
        let selected = 0;

        if (choosed === '1') { // CHOOSING PART
            selected = 1
        } else if (choosed === '2') {
            selected = 2
        } else if (choosed?.length === 0) {
            chooseDeletion()
        } else if (typeof choosed === 'object') {
            return client.destroy()
        } else if (!/^\d+$/.test(choosed)) {
            console.log(clc.redBright('The option is a number'))
            chooseDeletion()
        } else if (selected === 0) {
            console.log(clc.redBright('You can only pick between 1 and 2'))
            chooseDeletion()
        }

        if (selected === 1) {
            firstDel()
        } else if (selected === 2) {
            deleteAllSlash()
        }
    }
    // =========================================================================
    

    // the prompt to be shown if there is available application slash command ==
    function firstDel() {
        const id = prompt(clc.greenBright('Input the ID of the Slash Command that you wish to delete: '))

        if (id?.length === 0) {
            firstDel()
        } else if (typeof id === 'object') { // if the end user wish to cancel A.K.A  " ^C "
            return client.destroy()
        } else if (!/^\d+$/.test(id)) {
            console.log(clc.red('ID Must be a Number'))
            secondDel()
        } else if (id?.length > 19) { // the ID must be only 18-19 number
            console.log(clc.red('That doesn\'t look quite right, Discord Slash Command ID\'s only contains 18-19 numbers'))
            secondDel()
        } else {
            deleteSlash(id)
        }
    }
    // =========================================================================


    // the prompt to be show if the first prompt isnt correct ==================
    function secondDel() {
        const id = prompt(`${clc.redBright('[Wrong ID]')} ${clc.greenBright('Input the ID of the Slash Command that you wish to delete:')} `)

        if (id?.length === 0) {
            secondDel()
        } else if (typeof id === 'object') { // if the end user wish to cancel A.K.A  " ^C "
            return client.destroy()
        } else if (!/^\d+$/.test(id)) {
            console.log(clc.red('ID Must be a Number'))
            secondDel()
        } else if (id?.length > 19) { // the ID must be only 18-19 number
            console.log(clc.red('That doesn\'t look quite right, Discord Slash Command ID\'s only contains 18-19 numbers'))
            secondDel()
        } else {
            deleteSlash(id)
        }
    }
    // =========================================================================


    // deleting the provided slash command ID ==================================
    async function deleteSlash(id) {
        try {

            await client.application.commands.fetch(id)
                .then(async (cmd) => {
                    await client.application.commands.delete(cmd.id)
                    client.destroy()
                    return console.log(`${clc.cyanBright(`You have successfully deleted a Slash Command named:`)} ${clc.blueBright(`${cmd.name}`)}`)
                })
                .catch(err => {
                    throw (err)
                })

        } catch (err) {
            if (err.code === 10063 || err.code === 50035) {
                console.log(clc.red('That Slash Command ID is Invalid'))

                await wait(650)

                secondDel()
            }
        }
    }
    // =========================================================================


    // deleting all of the slash command inside the application ================
    async function deleteAllSlash() {
        const fetchSlash = await client.application.commands.fetch()
        
        await Promise.all(fetchSlash.map(async slash => {
            await client.application.commands.delete(slash.id) // '.set' is the alternative case for this but this looks cooler lol
            console.log(clc.yellowBright(`Deleted ${slash.name}`))
        }))

        console.log(`${clc.cyanBright('You have successfully deleted all of the Slash Command from')} ${clc.cyan(`${client.user.tag}`)}`)
        return client.destroy()
    }
    // =========================================================================


    showSlash() // the first function to be called as soon as the file starts
})


client.login(process.env.TOKEN) // login the bot