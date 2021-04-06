const Discord = require('discord.js');
const mysql = require('mysql');

module.exports.run = (client, message, args) => {

    message.delete();

    let guildName = message.guild.name;
    let guildNameNoSpace = guildName.replace(/\s/g, '');
    let authorid = message.author.id;
    const filter = message => message.author.id == authorid;


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
message.author.send("Bonjour, tu souhaite supprimer un cours de l'agenda de l'Académie c'est cela... Bien ! Alors première question, a quel jour se passe ton cours ?").then(res1 => {
    res1.channel.awaitMessages(filter, {max: 1}).then(collected1 => {
        let answer1 = collected1.first().content;
        message.author.send("Bien ! a quel heure ? (exemple : 08h00, 10h00, 12h00, etc...)").then(res2 => {
            res2.channel.awaitMessages(filter, {max: 1}).then(collected2 => {
                let answer2 = collected2.first().content;
                    connection.query(`DELETE FROM cours WHERE jour_du_cours = "${answer1}" AND heure_du_cours = "${answer2}"`, function(error, results){
                    if(error){
                        console.log(error)
                        connection.destroy();
                        message.author.send("Désolé, je n'ai pas trouver de cours a ce nom ou a cet matiére !")
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
} 

module.exports.help = {
    name: 'removecours'
};
