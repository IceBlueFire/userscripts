// ==UserScript==
// @name         NPC Attack Time Newsfeed
// @namespace    npc.timing
// @version      v2.0.0
// @description  Add NPC attack time to the news ticker using Loot Rangers for Torn
// @author       IceBlueFire [776]
// @license      MIT
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/newspaper.php
// @exclude      https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @connect      api.lzpt.io
// @downloadURL https://update.greasyfork.org/scripts/486869/NPC%20Attack%20Time%20Newsfeed.user.js
// @updateURL https://update.greasyfork.org/scripts/486869/NPC%20Attack%20Time%20Newsfeed.meta.js
// ==/UserScript==

const color = "#8abeef"; // Any hex-code for the color to appear in the news feed as
const format = 24; // Time format. 12 = 12:00 AM format; 24 = 23:59 format
const local = false; // Adjust the timer to be local time or not. true = local; false = UTC

const lzpt = getAttackTimes();
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    var [resource, config] = args;
    var response = await originalFetch(resource, config);
    const json = () => response.clone().json()
    .then((data) => {
        data = { ...data };
        if(response.url.indexOf('?sid=newsTicker') != -1) {
            let attackItem = {ID: 0, headline: '<div id="icey-npctimer></span>', countdown: true, endTime: 0, link: '', isGlobal: false, type: 'generalMessage'};
            data.headlines.unshift(attackItem);
            // lzpt.then(function(result) {
            //     var attackOrder = '';
            //     var attackString = '';
            //     var attackLink = '';
            //     var attackTarget = 0;

            //     // If there's no clear time set
            //     if(result.time.clear == 0) {
            //         attackString = result.time.reason || (attackString = 'NPC attacking will resume after '+result.time.reason, 'No attack currently set.');
            //     } else {
            //         // Build the string for the attack order
            //         $.each(result.order, function(key, value) {
            //             if(result.npcs[value].next){
            //                 // If there's an attack happening right now, cross out NPCs that are in the hospital
            //                 if(result.time.attack === true) {
            //                     if(result.npcs[value].hosp_out >= result.time.current) {
            //                         attackOrder += '<span style="text-decoration: line-through">'+result.npcs[value].name+'</span>, ';
            //                     } else {
            //                         attackOrder += result.npcs[value].name+', ';
            //                     }
            //                 } else {
            //                     attackOrder += result.npcs[value].name+', ';
            //                 }
            //             }
            //             // Adjust the current target based on if an attack is going and who isn't in the hospital yet
            //             if(result.time.attack === true) {
            //                 if(result.npcs[value].hosp_out <= result.time.current) { // Check if the NPC is currently out of the hospital
            //                     if(attackTarget == 0) {
            //                         attackTarget = value;
            //                     }
            //                 }
            //             }
            //         });

            //         // Check if target has been set, otherwise default to first in attack order
            //         if(attackTarget == 0) {
            //             attackTarget = result.order[0];
            //         }

            //         // Clean up the attack order string
            //         attackOrder = attackOrder.slice(0, -2)+'.';

            //         // Check if an attack is currently happening and adjust the message accordingly
            //         if(result.time.attack === true) {
            //             attackString = 'NPC attack is underway! Get in there and get some loot!';
            //             attackLink = 'loader.php?sid=attack&user2ID='+attackTarget;
            //         } else {
            //             attackString = 'NPC attack set for '+utcformat(result.time.clear)+'. Order is: '+attackOrder;
            //             attackLink = 'loader.php?sid=attack&user2ID='+attackTarget;
            //         }
            //     }

            //     // Insert the custom news item into the news ticker
            //     let attackItem = {ID: 0, headline: '<span style="color:'+color+'; font-weight: bold;">'+attackString+'</span>', countdown: true, endTime: result.time.clear, link: attackLink, isGlobal: false, type: 'generalMessage'};
            //     data.headlines.unshift(attackItem);
            // }, function(err) {
            //     console.log(err); // Error: "It broke"
            // });
        }
        return data
    })

    response.json = json;
    response.text = async () =>JSON.stringify(await json());

    return response;
};

/* Format the time in the appropriate fashion */
function utcformat(d){
    d= new Date(d * 1000);
    if(local) {
        var tail= ' LT', D= [d.getFullYear(), d.getMonth()+1, d.getDate()],
            T= [d.getHours(), d.getMinutes(), d.getSeconds()];
    } else {
        var tail= ' TCT', D= [d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate()],
            T= [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()];
    }
    if(format == 12) {
        /* 12 hour format */
        if(+T[0]> 12){
            T[0]-= 12;
            tail= 'PM '+tail;
        }
        else tail= 'AM '+tail;
    }
    var i= 3;
    while(i){
        --i;
        if(D[i]<10) D[i]= '0'+D[i];
        if(T[i]<10) T[i]= '0'+T[i];
    }
    return T.join(':')+ tail;
}

/* Fetch the NPC details from Loot Rangers */
async function getAttackTimes() {
    
    const request_url = `https://api.lzpt.io/loot`;
    GM_xmlhttpRequest ({
        method:     "GET",
        url:        request_url,
        headers:    {
            "Content-Type": "application/json"
        },
        onload: response => {
            try {
                const data = JSON.parse(response.responseText);
                if(!data) {
                    console.log('No response from Loot Rangers');
                } else {
                    $('#icey-npctimer').html('This is a test');
                }
            }
            catch (e) {
                console.error(e);
            }

        },
        onerror: (e) => {
            console.error(e);
        }
    })
}
