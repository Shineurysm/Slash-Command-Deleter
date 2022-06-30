
// DECLARATIONS ================================================================
require('dotenv').config()
const { Client } = require('discord.js');
const client = new Client({
    intents: 'GUILDS' // just a random intent for the bot to login
});

const prompt = require('prompt-sync')()
const clc = require('cli-color')

const wait = require('node:timers/promises').setTimeout
// =============================================================================

client.on('ready', async () => {

    // show your client application commands ===================================
    async function showSlash() {
        const fetchSlash = await client.application.commands.fetch() // fetching the slash commands

        if (fetchSlash.size === 0) { // the application doesn't have a slash command
            console.log(clc.cyanBright('This Application doesn\'t have a Slash Command'))
            return await client.destroy() // destroying the client (disconnecting) if there is no slash commands to be deleted
        }

        const slashCmd = fetchSlash.map((cmd) => { // mapping the slash commands
            return ` ${clc.yellowBright(`${cmd.name}`)} ${clc.redBright('||')} ${clc.yellowBright(`${cmd.id}`)}`

        })

        slashCmd.unshift(`${clc.cyanBright('===================')}`); slashCmd.push(`${clc.cyanBright('===================')}`); // the top/bottom-most message's

        console.log(slashCmd.join('\n')); // joining the message's since they're in array

        await wait(1500);

        firstDel() // calling the first prompts
    }
    // =========================================================================

    // the prompt to be shown if there is available application slash command ==
    function firstDel() {
        const id = prompt(clc.greenBright('Input the ID of the Slash Command that you wish to delete: '))

        if (id?.length === 0) { // id length is 0
            firstDel()
        } else if (typeof id === 'object') { // if the end user wish to cancel A.K.A  " ^C "
            return client.destroy()
        } else if (!/^\d+$/.test(id)) { // testing if the id is a number
            console.log(clc.red('ID Must be a Number'))
            secondDel()
        } else if (id?.length > 18) { // the ID must be only 18 numbers
            console.log(clc.red('That doesn\'t look quite right, Discord Slash Command ID\'s only contains 18 numbers'))
            secondDel()
        } else { // preparing to delete the slash command
            deleteSlash(id) // proceed to the last step
        }
    }
    // =========================================================================


    // the prompt to be show if the first prompt isnt correct ==================
    function secondDel() {
        const id = prompt(`${clc.redBright('[Wrong ID]')} ${clc.greenBright('Input the ID of the Slash Command that you wish to delete:')} `)

        if (id?.length === 0) { // id length is 0
            secondDel()
        } else if (typeof id === 'object') { // if the end user wish to cancel A.K.A  " ^C "
            return client.destroy()
        } else if (!/^\d+$/.test(id)) { // testing if the id is a number
            console.log(clc.red('ID Must be a Number'))
            secondDel()
        } else if (id?.length > 18) { // the ID must be only 18 numbers
            console.log(clc.red('That doesn\'t look quite right, Discord Slash Command ID\'s only contains 18 numbers'))
            secondDel()
        } else { // preparing to delete the slash command
            deleteSlash(id) // proceed to the last step
        }
    }
    // =========================================================================


    // deleting the provided slash command ID ==================================
    async function deleteSlash(id) {
        try {
            await client.application.commands.fetch(id) // fetching the slash command
                .then(async (cmd) => {
                    await client.application.commands.delete(cmd.id) // deleting the provided slash command
                    client.destroy() // destroy the client (disconnect) after the deleting of the slash command
                    return console.log(`${clc.cyanBright(`You have successfully deleted a Slash Command named:`)} ${clc.blueBright(`${cmd.name}`)}`) // just some console message
                })
                .catch(err => {
                    throw (err) // throw the error
                })
        } catch (err) {
            if (err.code === 10063 || err.code === 50035) {
                console.log(clc.red('That Slash Command ID is Invalid')) // the provided ID is invalid

                await wait(650)

                secondDel() // call the second Delete function
            }
        }
    }
    // =========================================================================

    showSlash() // the first function to be called as soon as the file starts
})

client.login(process.env.TOKEN); // login the bot