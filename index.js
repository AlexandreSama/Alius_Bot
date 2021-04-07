const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = "$";
const fs = require('fs');
const mysql = require('mysql');
const Canvas = require('canvas');
const config = require('./config.json');
const schedule = require('node-schedule');

client.on('ready', async (guild, message) => {
    console.log(`Logged in as ${client.user.tag}!`);
    let nameActivitys = ['Entrain d\'être développé', 'Mon créateur : Alexandre', '$help pour mes commandes']
    let random = nameActivitys[Math.floor((Math.random()*nameActivitys.length))]
    client.user.setActivity({name: random, type: "PLAYING"})

    //Auto-Ping for Classes (1h before it start)
schedule.scheduleJob('* * 1 * *', function(){
    let dayRightNow = new Date().getDate();
    var connection = mysql.createConnection({
        host     : '185.216.25.216',
        user     : 'bojo',
        password : 'bojo',
        port: 3306
    });
    connection.query('USE KashirPlace', function(error, results){
        if(error){
            console.log(error)
        }
        if(results){
            connection.query(`SELECT heure_du_cours FROM cours WHERE jour_du_cours = ${dayRightNow}`, function(error, results){
                if(error){
                    console.log(error)
                }
                if(results){
                    let res = JSON.parse(JSON.stringify(results));
                    let hourRightNow = new Date().getHours() + 1;
                    console.log(hourRightNow)
                    res.forEach(element => {
                        console.log(element['heure_du_cours']);
                        if(element['heure_du_cours'] == hourRightNow){
                            let channel = client.channels.cache.get('799060721475911706');
                            channel.send("Bonjour, il reste une heure avant le début du cours !")
                        }else{
                            return ;
                        }
                    })
                }
            })
        }
    })
});

//Actualise every hours the calendar for Classes
    setInterval(async function(){
        const canvas = Canvas.createCanvas(1683, 1190);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('Assets/calendar.png')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        connection.query('USE KashirPlace', function(error, results){
            if(error){
                console.log(error)
            }
            if(results){
                connection.query('SELECT professeur, matiere, jour_du_cours, heure_du_cours FROM cours', function(error, results){
                    if(error){
                        console.log(error)
                    }
                    if(results){
                        let res = JSON.parse(JSON.stringify(results));
                        res.forEach(async element => {

                            if(element['jour_du_cours'] === "jeudi" & element['heure_du_cours'] === '08h00'){
                                ctx.font = '30px sans-serif';
                                ctx.fillStyle = '#000000';
                                ctx.fillText(element['matiere'], 1066, 240);
                                ctx.fillText(element['professeur'], 1066, 280);
                            }
                            
                            else if(element['jour_du_cours'] === "jeudi" & element['heure_du_cours'] === '10h00'){
                                ctx.font = '30px sans-serif';
                                ctx.fillStyle = '#000000';
                                ctx.fillText(element['matiere'], 1066, 380);
                                ctx.fillText(element['professeur'], 1066, 440);
                            }

                            else if(element['jour_du_cours'] === "jeudi" & element['heure_du_cours'] === '12h00'){
                                ctx.font = '30px sans-serif';
                                ctx.fillStyle = '#000000';
                                ctx.fillText(element['matiere'], 1066, 517);
                                ctx.fillText(element['professeur'], 1066, 568);
                            }

                            else if(element['jour_du_cours'] === "jeudi" & element['heure_du_cours'] === '14h00'){
                                ctx.font = '30px sans-serif';
                                ctx.fillStyle = '#000000';
                                ctx.fillText(element['matiere'], 1066, 669);
                                ctx.fillText(element['professeur'], 1066, 727);
                            }

                            else if(element['jour_du_cours'] === "jeudi" & element['heure_du_cours'] === '16h00'){
                                ctx.font = '30px sans-serif';
                                ctx.fillStyle = '#000000';
                                ctx.fillText(element['matiere'], 1066, 822);
                                ctx.fillText(element['professeur'], 1066, 875);
                            }

                            else if(element['jour_du_cours'] === "jeudi" & element['heure_du_cours'] === '18h00'){
                                ctx.font = '30px sans-serif';
                                ctx.fillStyle = '#000000';
                                ctx.fillText(element['matiere'], 1066, 973);
                                ctx.fillText(element['professeur'], 1066, 1010);
                            }
                        } )
                        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'calendar-cours.png');
                        let channel = client.channels.cache.get('828762525432020992');
                        channel.messages.fetch({limit: 1}).then(messages => {
                            let lastMessage = messages.first();
                            if(!lastMessage){
                                channel.send("Calendrier des cours", attachment);
                                console.log("pas mis a jour");
                                connection.destroy();
                            }else{
                                lastMessage.delete();
                                channel.send("Calendrier des Cours", attachment);
                                console.log("mis a jour");
                                connection.destroy();
                            }
                        })
                    }
                })
            }
        })
    }
        , 3600000);
})

fs.readdir('./Commands/', (error, f) => {
    if (error) {
      return console.error(error);
    }
    const commandes = f.filter((f) => f.split('.').pop() === 'js');
    if (commandes.length <= 0) {
      return console.log('Aucune commandes trouvée !');
    }
  
    commandes.forEach((f) => {
      const commande = require(`./Commands/${f}`);
      console.log(`commande ${f} chargée !`);
      client.commands.set(commande.help.name, commande);
    });
});
  
fs.readdir('./Events/', (error, f) => {
    if (error) {
      return console.error(error);
    }
    console.log(`${f.length} events chargés`);
  
    f.forEach((f) => {
      const events = require(`./Events/${f}`);
      const event = f.split('.')[0];
      client.on(event, events.bind(null, client, fs));
    });
});

client.on('message', async (message) => {

    const messageArray = message.content.split(/\s+/g);
    const command = messageArray[0];
    const args = messageArray.slice(1);
  
    if (!command.startsWith(config.prefix)) return;
  
    const cmd = client.commands.get(command.slice(config.prefix.length));
    if (cmd) cmd.run(client, message, args);
    if (message.author.bot) {
      return;
    }
});


client.on('guildCreate', (guild) => {

    //Create Database for each server the bot join
    let guildName = guild.name;;
    let guildNameNoSpace = guildName.replace(/\s/g, '');

    var connection = mysql.createConnection({
        host     : '185.216.25.216',
        user     : 'bojo',
        password : 'bojo',
        port: 3306
    });

    connection.query(`CREATE DATABASE ${guildNameNoSpace};`, function (error, results){
        if(error){
            console.log(error)
        }
        if(results){
            connection.query(`USE ${guildNameNoSpace}`, function (error, results){
                if(error){
                    console.log(error)
                }
                if(results){    
                    connection.query(`CREATE TABLE cours (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, professeur VARCHAR(100) NOT NULL, matiere VARCHAR(100) NOT NULL, jour_du_cours VARCHAR(100) NOT NULL, heure_du_cours VARCHAR(100) NOT NULL, date DATETIME NOT NULL, is_done TINYINT NOT NULL DEFAULT 0)`, function(error, results){
                        if(error){
                            console.log(error)
                            connection.destroy();
                        }
                        if(results){
                            connection.query(`CREATE TABLE presentation (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, prenom VARCHAR(100) NOT NULL, age INT, description_mental TEXT NOT NULL, description_physique TEXT NOT NULL, classe VARCHAR(100))`, function(error, results){
                                if(error){
                                    console.log(error);
                                }
                                if(results){
                                    console.log("Base de données crée avec succés !" + results)
                                    connection.destroy();
                                }
                            })
                        }
                    })
                }
            })
        }
    })
        
})

client.login(config.token);