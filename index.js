import { MessageEmbedImage } from 'discord.js';


const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const help = require('help.js');
const adapter = new FileSync('database.json');
const db = low(adapter);
db.defaults({ histoires: [], xp: []})
     .write()

        

var bot = new Discord.Client();
var prefix = (",");
var randnum = 0;

var storynumber = db.set('histoires').map('story_value').value();  //avatar

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: ',help | En dévloppement', type: 3}});
    console.log("bot ok");
});

bot.login('NDQwNzg5NzM1NDI2NzUyNTE0.Dcr1rw.2-Ai9Z9C7c1f7krw1DwL-6YTyb4');

//bot.on("guildMemberAdd", member => {
   // let role = member.guild.roles.find("name", "Joueur");
   // member.guild.channels.find("name", "bienvenue-au-revoir").send(`${member} vien de rejoindre notre famille !`)
   // member.addRole(role)

//})

////bot.on("guildMemberRemove", member =>{
   // member.guild.channels.find("name", "bienvenue-au-revoir").send(`${member} a quitté fesons la prière :sob:`)
//})


bot.on('message', message => {

    var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp);
        console.log(`Nombre d'xp : ${userxp[1]}`)
    
        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write(); //infodiscord
    }






    if (message.content === prefix + "infodiscord")
         var embed = new Discord.RichEmbed()
         .setDescription("Information sur le discord")
         .addField("Nom du discord", message.guild.name)
         .addField("Crée le ", message.guild.createdAt)
         .addField("Tu as rejoin le", message.member.joinedAt)
         .addField("Utilisateur sur le discord", message.guild.memberCount)
         .setColor("0X0000FF")
    message.channel.send(embed)






    //if (message.content === ",isdb"){
        //message.reply("Voici le discord du bot: https://discord.gg/dnfEZvN");
    // console.log('invite serveur ArliCraft');

   // }



    if (message.content.startsWith(prefix + "botinfo")) {
        message.channel.send("", {
            embed: {
                color: 0xE15306, //La couleur que l'on voit sur le côté gauche de l'embed
                author:  message.author.name,

                title: 'Statistiques du bot', //Le titre de l'embed
                description: '', //La description, dans ce cas-ci mieux vaut la laisser vide
                fields: [
                    {
                        name: '**Salons textuels au total**',
                        value: bot.channels.size,
                        inline: true
    }, {
                        name: '**Nombre d\'utilisateurs**',
                        value: bot.users.size,
                        inline: true
    }, {
                        name: '**Nombre de serveurs**',
                        value: bot.guilds.size,
                        inline: true
                   }],
                thumbnail: {
                    url: message.author.iconURL //l'avatar du bot //avatar
                },
                timestamp: new Date(), //La date d'aujourd'hui
                footer: {
                    text: 'un peu de texte tout en bas',
                }
            }
        });
    };
    if (message.content.startsWith(prefix + "serveurinfo")) { 
        message.channel.send("", {
            embed: {
                color: 0xE15306, //La couleur que l'on voit sur le côté gauche de l'embed
                author: message.author.name,

                title: 'Informations sur le serveur', //Le titre de l'embed
                description: '', //La description, dans ce cas-ci mieux vaut la laisser vide
                fields: [
                    {
                        name: '**Nom**',
                        value: message.guild.name,
                        inline: true
    }, {
                        name: '**Membres**',
                        value: message.guild.memberCount,
                        inline: true
    }, {
                        name: '**Propriétaire**',
                        value: message.guild.owner.user.tag,
                        inline: true
    }, {
                        name: '**Région**',
                        value: message.guild.region,
                        inline: true
    }, {
                        name: '**ID**',
                        value: message.guild.id,
                        inline: true
                   }],
                thumbnail: {
                    url: message.guild.iconURL //l'avatar du bot
                },
                timestamp: new Date(), //La date d'aujourd'hui
                footer: {
                    text: 'serveur support du bot ',   //avatar
                }
            }
        });
    };






    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()){

        case "newstory":
        var value = message.content.substr(10);
        var author = message.author.toString;
        console.log(value);
        message.reply("Ajout de l'histoire dans la base de données")

        db.get('histoires')
            .push({ story_value: value, story_author: author})
            .write();


            break;

        case "tellstory":

        story_random();
        console.log(randnum);

        var story = db.get(`histoires[${randnum}].story_value`).toString().value();
        var author_story = db.get(`histoires[${randnum}].story_value`).toString().value();
        console.log(story);

        message.channel.send(`Voici l'histoire : ${story} (Histoire de ${author_story})`)
    
        break;

        case "kick":

        if (!message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS")){
            message.reply("Tu n'as pas la permission de kicker !")
        }else{
            var memberkick = message.mentions.users.first();
            console.log(memberkick)
            console.log(message.guild.member(memberkick).kickable)
            if(!memberkick){
                message.reply("L'utilisateur est imposible a trouvé !");
            }else{
                if(!message.guild.member(memberkick).kickable){
                    message.reply("L'utilisateur a plus de permission que vous !")
                }else{
                    message.guild.member(memberkick).kick().then((member) => {
                    message.channel.send(`${member.displayName} a été kick avec succès !`);
                }).catch(() => {
                    message.channel.send("Kick refuser !")
            })
        }
    }}

    break;

    case "ban":

    if (!message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS")){
        message.reply("Tu n'as pas la permission de banir !")
    }else{
        var memberban = message.mentions.users.first();
        console.log(memberban)
        console.log(message.guild.member(memberban).bannable)
        if(!memberban){
            message.reply("L'utilisateur est imposible a trouvé !");
        }else{
            if(!message.guild.member(memberban).bannable){
                message.reply("Je n'ai pas la permission de le ban !") //.catch()
            }else{
                message.guild.member(memberban).ban().then((member) => {
                message.channel.send(`${member.displayName} a été ban avec succès !`);
            }).catch(() => {
                message.channel.send("ban refuser !")
        })
    }
}}


       


        
        break;
                case "stats":

        var userXpDB = db.get("xp").filter({user: msgauthor}).find("xp").value();
        var userXP = Object.values(userXpDB)

        var stats_embed = new Discord.RichEmbed()
           .setTitle(`Stats Utilisateur : ${message.author.username}`) //pinnable
           .addField("XP", `${userXP[1]} XP`, true)
           .addField("User ID", msgauthor)
           .setColor('#F85F67')

        message.author.send({embed: stats_embed});

        break;
        case "ping":
        message.channel.sendMessage('Temp de latence avec le serveur: `' + `${message.createdTimestamp - Date.now()}` +' ms `');
    
        break;
        case "clear":
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
               .then(function(list){
                    message.channel.bulkDelete(list);
                }, function(err){message.channel.send("Erreur")})}


            break;
            case "8ball":
            let args = message.content.split(" ").slice(1);
            let tte = args.join (" ")
            if (!tte){
                return message.reply("Je vous demanderais de poser une questions :8ball:")};

                var replys = [
                    "Oui",
                    "Non",
                    "Pas du tout",
                    "Peux-être",
                    "Absolument",
                    "Sa dépend des circanstance",
                    "bien sur que oui",
                    "et puis quoi encore !"
                ];

                let reponse = (replys[Math.floor(Math.random() * replys.length)])
                var bembed = new Discord.RichEmbed()
                .setDescription(":8ball: 8ball")
                .addField("Questions", tte)
                .addField("Réponse", reponse)
            message.channel.send(bembed)
            
  
            break;

        
    }
    


    if (message.content === ",help") {
        message.channel.send({embed: {
            color: 3447003,
            author: {
                name: bot.user.username,
                icon_url: bot.user.avatarURL
            },
            title: 'Commande du bot',
            description: '**,help**: Affiche la list des commande \n\n **,ping**: vous répond pong \n\n **,issou**: Affiche entre 14 image de issou \n \n **,xplevel**: Affiche votre niveaux dans le channel ou la commande est effectuer \n\n **,invite**: pour inviter le bot \n\n **,isdb**: Pour rejoindre le discord du bot ( veux dire: invite serveur du bot) \n\n **,stats**: Vous envoie un message en privé avec votre niveau \n \n **,ban {@user}**: ban l\'utilisateur \n \n **,kick {@user}**: kick l\'utilisateur \n \n **,avatar {@user}** vous donne l\'avatar de la personne \n \n **,serveurinfo**: vous donne des infos sur le serveur \n \n **,botinfo**: Vous donne des info sur le serveur ou vous l\'effectuer',
            fields: [ 
                {
                    name: 'version 1.1.0',
                    value: 'fasse pas du tout finit'

                }],
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    name: bot.user.username,

                }
        }});

    }
    if (message.content.startsWith(prefix + "sondage")) {
        let args = message.content.split(" ").slice(1);
        let thingToEcho = args.join(" ")
        var embed = new Discord.RichEmbed()
           .setDescription("Sondage")
           .addField(thingToEcho, "Répondre avec :white_check_mark: ou :x:")
           .setColor("0xB40404")
           .setTimestamp()
       message.guild.channels.find("name", "sondage").sendEmbed(embed)
       .then(function (message) {
           message.react("✅")
           message.react("❌")
       }).catch(function() {
       });



    }

         if (message.content === ",issou"){

        random();

    if (randnum == 0){
     message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524465973-issou4.jpg");

       }

    if (randnum == 1){
        message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524465963-issou1.jpg");

    }

    if (randnum == 2){
        message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524465963-issou2.jpg"); //SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION

        }

    if (randnum == 3){
        message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524465973-issou3.jpg");

        }


       if (randnum == 4){
        message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524465973-issou4.jpg");

   }

   if (randnum == 5){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471605-issou5.jpg");

}

    if (randnum == 6){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471605-issou6.jpg");

}

    if (randnum == 7){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471605-issou7.jpg");

}

    if (randnum == 8){    
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471617-issou8.jpg");
}
    
    if (randnum == 9){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471960-issou9.jpg");


}    
    if (randnum == 10){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471605-issou10.jpg");

}
    if (randnum == 11){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471605-issou11.jpg");

}

    if (randnum == 12){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524471605-issou12.jpg");

}

    if (randnum == 13){
    message.reply("http://image.noelshack.com/fichiers/2018/17/1/1524472081-issou13.jpg");


}
}





    if (message.content === prefix + "xplevel"){
        var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .setTitle (`xp de ${message.author.username}`)
            .setDescription("Voici toutes votre xp !")
            .addField("XP :", `${xpfinal[1]} xp`)
            .setColor('#AEEE00')
        message.channel.send({embed: xp_embed});
    }





    const fs = require("fs");

var msg = message;



let afk = JSON.parse(fs.readFileSync("./afks.json", "utf8"));

if (message.content.startsWith(prefix + "remafk")){

if (afk[msg.author.id]) {

delete afk[msg.author.id];

if (msg.member.nickname === null) {

msg.channel.send(" re, j'ai enlever votre afk ^^");

}else{

msg.channel.send(" re, j'ai enlever votre afk ^^");

}

fs.writeFile("./afks.json", JSON.stringify(afk), (err) => { if (err) console.error(err);});

}else{

msg.channel.send("Erreur ! Tu es déjà afk");

}

}





if (msg.content.startsWith(prefix + "afk")||msg.content === prefix + "afk") {

if (afk[msg.author.id]) {

return message.channel.send("Erreur ! Tu es déjà afk -_-");

}else{

let args1 = msg.content.split(" ").slice(1);

if (args1.length === 0) {

afk[msg.author.id] = {"reason" : true};

msg.delete();

msg.channel.send(`tu es désormais afk, met **${prefix}remafk** pour enlever ton afk`).then(x => DeleteQueue.add(x, 10000));

}else{

afk[msg.author.id] = {"reason" : args1.join(" ")};

msg.delete();

msg.channel.send(`tu es désormais afk, met **${prefix}remafk** pour enlever ton afk`).then(x => DeleteQueue.add(x, 10000));

}

fs.writeFile("./afks.json", JSON.stringify(afk), (err) => { if (err) console.error(err);});

}

}

    

    var mentionned = message.mentions.users.first();

if(msg.mentions.users.size > 0) {

if (afk[msg.mentions.users.first().id]) {

if (afk[msg.mentions.users.first().id].reason === true) {

message.channel.send(`@${mentionned.username} is AFK: pas de raison`);

}else{

message.channel.send(`@${mentionned.username} is AFK: ${afk[msg.mentions.users.first().id].reason}`);

}

}

}




 
    }); 
    
    


    



function story_random(min, max) {
    min = Math.ceil(1);
    max = Math.floor(storymember);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}

function random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(13);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}




    
