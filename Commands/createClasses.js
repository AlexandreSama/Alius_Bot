const Discord = require('discord.js');
const mysql = require('mysql');
const moment = require('moment')

module.exports.run = (client, message, args) => {

    message.delete();

    let guildName = message.guild.name;
    let guildNameNoSpace = guildName.replace(/\s/g, '');
    let authorid = message.author.id;
    const filter = message => message.author.id == authorid;

    var nowDate = new Date();
    let date = moment(nowDate).format("YYYY-MM-DD HH:mm:ss");

    const connection = mysql.createConnection({
        host: '185.216.25.216',
        user: 'bojo',
        password: 'bojo',
        database: `${guildNameNoSpace}`
    });

    let allClasses = message.guild.roles.cache.get("825688081100308511");
    let supérieurs = message.guild.roles.cache.get("823647936415531058");
    let troisèmes = message.guild.roles.cache.get("823647751548043344");
    let premieres = message.guild.roles.cache.get("822055575344381993");
    let creators =  message.guild.roles.cache.get("799061680343482428");


    // if(message.member.roles.cache.has(allClasses) || message.member.roles.cache.has(supérieurs) || message.member.roles.cache.has(troisèmes) || message.member.roles.cache.has(premieres) || message.member.roles.cache.has(creators)){
message.author.send("Bonjour, tu souhaite inscrire un cours a l'agenda de l'Académie c'est cela... Bien ! Alors première question, quel est le nom de ton professeur ?").then(res1 => {
    res1.channel.awaitMessages(filter, {max: 1}).then(collected1 => {
        let answer1 = collected1.first().content;
        message.author.send("Bien ! Quel matière sera le sujet du cour ? (exemple : Créatures, Botaniques, etc...)").then(res2 => {
            res2.channel.awaitMessages(filter, {max: 1}).then(collected2 => {
                let answer2 = collected2.first().content;
                message.author.send("Parfait ! A quel jour se tiendra ton cours ? (exemple : Jeudi , Mardi , etc... (**Respectez bien la majuscule sur le jour !**))").then(res3 => {
                    res3.channel.awaitMessages(filter, {max: 1}).then(collected3 => {
                        let answer3 = collected3.first().content;
                        message.author.send("Super ! A quel heure ? (exemple : 08h00, 10h00, 12h00, etc... (**respecter bien ce format d'heure !**))").then(res4 => {
                            res4.channel.awaitMessages(filter, {max: 1}).then(collected4 => {
                                let answer4 = collected4.first().content;
                                    connection.query(`INSERT INTO cours (professeur, matiere, jour_du_cours, heure_du_cours, date) VALUES ("${answer1}", "${answer2}", "${answer3}", "${answer4}", "${date}")`, function(error, results){
                                    if(error){
                                        console.log(error)
                                        connection.destroy();
                                    }
                                    if(results){
                                        message.author.send("Excellent ! J'ai tout ce qu'il me faut ! Passe une bonne journée !")
                                        connection.destroy();
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


} 

module.exports.help = {
    name: 'createcours'
};
