const Discord = require('discord.js');
const mysql = require('mysql');
const request = require(`request`);
const fs = require(`fs`);

module.exports.run = (client, message, args) => {

message.delete();

let authorid = message.author.id;
const filter = message => message.author.id == authorid;

const connection = mysql.createConnection({
    host: '185.216.25.216',
    user: 'bojo',
    password: 'bojo',
    database: `KashirPlace`
});

message.author.send("Bonjour, tu souhaite faire une présentation de ton personnage... Bien ! Alors première question, quel est le prénom de ton personnage ?").then(res1 => {
    res1.channel.awaitMessages(filter, {max: 1}).then(collected1 => {
        let answer1 = collected1.first().content;
        message.author.send("Bien ! quel age a t'il ?").then(res2 => {
            res2.channel.awaitMessages(filter, {max: 1}).then(collected2 => {
                let answer2 = collected2.first().content;
                message.author.send("Parfait ! Tu me fait une petite déscription mental ? PAS TROP LONGUE HEIN").then(res3 => {
                    res3.channel.awaitMessages(filter, {max: 1}).then(collected3 => {
                        let answer3 = collected3.first().content;
                        message.author.send("Super ! Tu me fait une petite déscription physique maintenant ? PAS TROP LONGUE NON PLUS HEIN").then(res4 => {
                            res4.channel.awaitMessages(filter, {max: 1}).then(collected4 => {
                                let answer4 = collected4.first().content;
                                message.author.send("Excellent ! Il est dans quel classe ?").then(res5 => {
                                    res5.channel.awaitMessages(filter, {max: 1}).then(collected5 => {
                                        let answer5 = collected5.first().content;
                                        message.author.send("Magnifique ! Envoi-moi une photo de ton personnage s'il te plait (juste l'image hein)").then(res6 => {
                                            res6.channel.awaitMessages(filter, {max: 1}).then(collected6 => {
                                                let answer6 = collected6.first().attachments.first();
                                                connection.query(`INSERT INTO presentation (prenom, age, description_mental, description_physique, classe) VALUES ("${answer1}", "${answer2}", "${answer3}", "${answer4}", "${answer5}")`, function(error, results){
                                                    if(error){
                                                        console.log(error)
                                                    }
                                                    if(results){
                                                        fs.mkdir(`./Assets/${answer1}`, (err) => {
                                                            if(err) throw err;
                                                        })
                                                        request.get(answer6.url)
                                                            .on('error', console.error)
                                                            .pipe(fs.createWriteStream(`./Assets/${answer1}/${answer1}.png`));
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

const exampleEmbed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle("")

} 

module.exports.help = {
    name: 'createpresentation'
};
