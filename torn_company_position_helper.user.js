// ==UserScript==
// @name         Company Position Helper
// @namespace    icebluefire.torn
// @version      v1.0.0
// @description  Add company specials to specific pages for ease of use
// @author       IceBlueFire 776
// @match        https://www.torn.com/joblist.php
// @updateURL    https://github.com/IceBlueFire/userscripts/raw/main/torn_company_position_helper.user.js
// @downloadURL  https://github.com/IceBlueFire/userscripts/raw/main/torn_company_position_helper.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at       document-start
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @require      https://cdn.datatables.net/1.13.7/js/jquery.dataTables.js
// @require      https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js
// @resource     dtCSS https://cdn.datatables.net/1.13.7/css/jquery.dataTables.css
// @resource     dtResponsive https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css
// ==/UserScript==

const companies = {
    "Firework Stand": {
        "specials" : {
                    "Audaciousness": { cost: 1, rank: 1, description: "2 nerve"},
                    "Illumination": { cost: 0, rank: 3, description: "50% awareness"},
                    "Pyromania": { cost: 0, rank: 5, description: "Flamethrower damage & accuracy"},
                    "Explosives Expert": { cost: 5, rank: 7, description: "Random bomb parts"},
                    "Inferno": { cost: 25, rank: 10, description: "Random incendiary ammunition "},
                },
    },
    "Flower Shop": {
        "specials" : {
                    "Rare Import": { cost: 3, rank: 1, description: "Special flower"},
                    "Cultivation": { cost: 0, rank: 3, description: "25% illegal production success & skill gain"},
                    "Herbal Cleansing": { cost: 1, rank: 5, description: "Drug addiction reduction"},
                    "Over Capacity": { cost: 0, rank: 7, description: "5 travel flower capacity"},
                    "Floral Contacts": { cost: 10, rank: 10, description: "View stock analysis of flowers in all countries"},
                },
    },
    "Candle Shop": {
        "specials" : {
                    "Warming Therapy": { cost: 1, rank: 1, description: "50 happiness"},
                    "Illumination": { cost: 0, rank: 3, description: "50% awareness"},
                    "Calming Therapy": { cost: 1, rank: 5, description: "2 nerve"},
                    "Reinvigorating Therapy": { cost: 1, rank: 7, description: "5 energy"},
                    "Meditation": { cost: 250, rank: 10, description: "View someone's true level"},
                },
    },
    "Property Broker": {
        "specials" : {
                    "Commission": { cost: 1, rank: 1, description: "Money"},
                    "Job Satisfaction": { cost: 1, rank: 3, description: "50 happiness"},
                    "Vendor": { cost: 0, rank: 5, description: "Free Item Market & Auction House listings"},
                    "Insider Trading": { cost: 150, rank: 7, description: "Random property"},
                    "Interior Connections": { cost: 0, rank: 10, description: "10% property upgrade cost reduction"},
                },
    },
    "Hair Salon": {
        "specials" : {
                    "Debate": { cost: 1, rank: 1, description: "Experience"},
                    "Gossip": { cost: 10, rank: 3, description: "View someone's money on hand"},
                    "Rumors": { cost: 0, rank: 5, description: "2.0 opponent stealth reduction"},
                    "Cutting Corners": { cost: 1, rank: 7, description: "30 minute education time reduction"},
                    "Sweeney's Revenge": { cost: 0, rank: 10, description: "20% slashing weapon damage"},
                },
    },
    "Clothing Store": {
        "specials" : {
                    "Fashion Show": { cost: 1, rank: 1, description: "Experience"},
                    "Nine to Five": { cost: 10, rank: 3, description: "100 endurance"},
                    "Activewear": { cost: 0, rank: 5, description: "25% passive dexterity"},
                    "Secret Pockets": { cost: 0, rank: 7, description: "75% incoming mug reduction"},
                    "Tailoring": { cost: 0, rank: 10, description: "20% armor mitigation bonus"},
                },
    },
    "Restaurant": {
        "specials" : {
                    "Free Meals": { cost: 1, rank: 1, description: "3 energy"},
                    "Butcher": { cost: 0, rank: 3, description: "10% melee weapon damage"},
                    "Flambayed": { cost: 50, rank: 5, description: "Flame thrower"},
                    "Healthy Diet": { cost: 0, rank: 7, description: "2.0% life regeneration"},
                    "Professional Metabolism": { cost: 0, rank: 10, description: "25% consumable cooldown reduction"},
                },
    },
    "Sweet Shop": {
        "specials" : {
                    "Sweet Tooth": { cost: 1, rank: 1, description: "50 happiness"},
                    "Sugar Rush": { cost: 2, rank: 3, description: "Bag of candy"},
                    "Gluttony": { cost: 10, rank: 5, description: "1,000 happiness"},
                    "Energy Rush": { cost: 15, rank: 7, description: "Can of energy drink"},
                    "Voracious": { cost: 30, rank: 10, description: "4,500 happiness"},
                },
    },
    "Pub": {
        "specials" : {
                    "Pub Lunch": { cost: 1, rank: 1, description: "3 energy"},
                    "Drunken Master": { cost: 0, rank: 3, description: "10% melee weapon damage"},
                    "Liquid Courage": { cost: 25, rank: 5, description: "Refill nerve bar"},
                    "Lightweight": { cost: 0, rank: 7, description: "50% nerve gain from alcohol"},
                    "Buzzed": { cost: 0, rank: 10, description: "15 maximum nerve"},
                },
    },
    "Game Shop": {
        "specials" : {
                    "Ub3rg33k": { cost: 0, rank: 1, description: "50% coding time reduction"},
                    "Early Release": { cost: 100, rank: 3, description: "Money"},
                    "Gamer": { cost: 0, rank: 5, description: "100% happy gain from Game Console"},
                    "Power Levelling": { cost: 10, rank: 7, description: "View progress to your next level"},
                    "Overpowered": { cost: 1, rank: 10, description: "1 nerve, 5 energy, 50 happiness"},
                },
    },
    "Music Store": {
        "specials" : {
                    "Ambience": { cost: 1, rank: 1, description: "50 happiness"},
                    "Well Tuned": { cost: 0, rank: 3, description: "30% gym experience"},
                    "High-fidelity": { cost: 0, rank: 5, description: "2.0 opponent stealth reduction"},
                    "Deafened": { cost: 10, rank: 7, description: "Maximum stealth"},
                    "The Score": { cost: 0, rank: 10, description: "15% passive battle stats"},
                },
    },
    "Adult Novelties": {
        "specials" : {
                    "Blackmail": { cost: 1, rank: 1, description: "Money"},
                    "Voyeur": { cost: 20, rank: 3, description: "Erotic DVD"},
                    "Party Supplies": { cost: 500, rank: 5, description: "Pack of Trojans"},
                    "Bondage": { cost: 0, rank: 7, description: "25% enemy speed reduction"},
                    "Indecent": { cost: 0, rank: 10, description: "100% happy gain from Erotic DVDs"},
                },
    },
    "Lingerie Store": {
        "specials" : {
                    "Nine to Five": { cost: 10, rank: 1, description: "100 endurance"},
                    "Concealment": { cost: 0, rank: 3, description: "2 travel item capacity"},
                    "Born Free": { cost: 0, rank: 5, description: "50% passive speed & dexterity when not wearing armor"},
                    "Simp": { cost: 0, rank: 7, description: "No property upkeep or staff costs"},
                    "Sex Appeal": { cost: 0, rank: 10, description: "Free business class upgrades"},
                },
    },
    "Grocery Store": {
        "specials" : {
                    "Bagged Down": { cost: 2, rank: 1, description: "Bag of candy"},
                    "Fast Metabolism": { cost: 0, rank: 3, description: "10% consumable cooldown reduction"},
                    "Bottled Up": { cost: 5, rank: 5, description: "Bottle of alcohol"},
                    "Absorption": { cost: 0, rank: 7, description: "10% consumable gain"},
                    "Canned In": { cost: 12, rank: 10, description: "Can of energy drink"},
                },
    },
    "Toy Shop": {
        "specials" : {
                    "Memory Lane": { cost: 1, rank: 1, description: "50 happiness"},
                    "Jumble Sale": { cost: 3, rank: 3, description: "Special plushie"},
                    "Gamer": { cost: 0, rank: 5, description: "100% happy gain from Game Console"},
                    "Over Capacity": { cost: 0, rank: 7, description: "5 travel plushie capacity"},
                    "Toy Importer": { cost: 10, rank: 10, description: "View stock analysis of plushies in all countries"},
                },
    },
    "Furniture Store": {
        "specials" : {
                    "Coffee Break": { cost: 1, rank: 1, description: "3 energy"},
                    "Heavy Lifting": { cost: 1, rank: 3, description: "Strength"},
                    "Removal": { cost: 0, rank: 5, description: "15% theft crime exp & skill gain"},
                    "Beefcake": { cost: 0, rank: 7, description: "25% passive strength"},
                    "Brute Force": { cost: 0, rank: 10, description: "100% fist & kick damage"},
                },
    },
    "Gun Shop": {
        "specials" : {
                    "Sales Discount": { cost: 0, rank: 1, description: "20% standard ammo cost reduction"},
                    "Surplus": { cost: 15, rank: 3, description: "Random special ammunition"},
                    "Skilled Analysis": { cost: 0, rank: 5, description: "Target loadout is always visible"},
                    "Bandoleer": { cost: 0, rank: 7, description: "1 extra clip for guns during attacks"},
                    "Firearms Expert": { cost: 0, rank: 10, description: "10% primary & secondary weapon damage"},
                },
    },
    "Mechanic Shop": {
        "specials" : {
                    "Machinist": { cost: 5, rank: 1, description: "Racing point"},
                    "Discount Parts": { cost: 0, rank: 3, description: "75% car parts cost reduction"},
                    "Junkyard Dog": { cost: 10, rank: 5, description: "Random car"},
                    "Refurbish": { cost: 0, rank: 7, description: "Lose no car parts after crashing"},
                    "Driver": { cost: 0, rank: 10, description: "50% racing skill gain"},
                },
    },
    "Cyber Cafe": {
        "specials" : {
                    "Ub3rg33k": { cost: 0, rank: 1, description: "50% coding time reduction"},
                    "Clone Data": { cost: 25, rank: 3, description: "Virus"},
                    "Proxy Hacking": { cost: 25, rank: 5, description: "Cancel a target's virus programming"},
                    "IP Tracing": { cost: 25, rank: 7, description: "View lister of anonymous bounties"},
                    "Financial Phishing": { cost: 25, rank: 10, description: "View details of someone's investment account"},
                },
    },
    "Meat Warehouse": {
        "specials" : {
                    "Blood Thirst": { cost: 1, rank: 1, description: "2 nerve"},
                    "Blood Splatter": { cost: 0, rank: 3, description: "50% crime XP penalty reduction"},
                    "Carnage": { cost: 0, rank: 5, description: "10 maximum nerve"},
                    "Huntsman": { cost: 0, rank: 7, description: "25% hunting skill gain"},
                    "Vampiric": { cost: 0, rank: 10, description: "3.0% life regeneration"},
                },
    },
    "Law Firm": {
        "specials" : {
                    "Bail Bondsman": { cost: 0, rank: 1, description: "50% bail cost reduction"},
                    "Background Check": { cost: 10, rank: 3, description: "View someone's stats"},
                    "Closing Argument": { cost: 0, rank: 5, description: "Easier to bust more people at once"},
                    "Loophole": { cost: 0, rank: 7, description: "20% organised crime skill"},
                    "Educated Decisions": { cost: 0, rank: 10, description: "View success chance of potential busts"},
                },
    },
    "Gents Strip Club": {
        "specials" : {
                    "Happy Ending": { cost: 1, rank: 1, description: "50 happiness"},
                    "Dancer's Flair": { cost: 0, rank: 3, description: "25% passive dexterity"},
                    "Supple": { cost: 0, rank: 5, description: "50% Tyrosine effectiveness & duration"},
                    "Pilates": { cost: 0, rank: 7, description: "10% dexterity gym gains"},
                    "No Touching": { cost: 0, rank: 10, description: "25% chance of dodging incoming melee attacks"},
                },
    },
    "Ladies Strip Club": {
        "specials" : {
                    "Hot Flush": { cost: 1, rank: 1, description: "50 happiness"},
                    "Hench": { cost: 0, rank: 3, description: "25% passive defense"},
                    "Hormonal": { cost: 0, rank: 5, description: "50% Serotonin effectiveness & duration"},
                    "Boxercise": { cost: 0, rank: 7, description: "10% defense gym gains"},
                    "Hardbody": { cost: 0, rank: 10, description: "30% incoming melee attacks damage reduction"},
                },
    },
    "Farm": {
        "specials" : {
                    "Fulfillment": { cost: 1, rank: 1, description: "50 happiness"},
                    "Animal Instinct": { cost: 0, rank: 3, description: "25% hunting income"},
                    "Special K": { cost: 5, rank: 5, description: "Ketamine drug"},
                    "Fertilizer": { cost: 100, rank: 7, description: "Small explosive device"},
                    "Early Riser": { cost: 1, rank: 10, description: "7 energy"},
                },
    },
    "Car Dealership": {
        "specials" : {
                    "Test Drive": { cost: 5, rank: 1, description: "Racing point"},
                    "Discount Parts": { cost: 0, rank: 3, description: "75% car parts cost reduction"},
                    "Salesman": { cost: 0, rank: 5, description: "Free Item Market & Auction House listings"},
                    "Two-Faced": { cost: 0, rank: 7, description: "25% fraud success & skill gain"},
                    "Getaway Car": { cost: 0, rank: 10, description: "Escape option always available during attacks"},
                },
    },
    "Software Corporation": {
        "specials" : {
                    "Ub3rg33k": { cost: 0, rank: 1, description: "50% coding time reduction"},
                    "Proxy Hacking": { cost: 25, rank: 3, description: "Cancel a target's virus programming"},
                    "Intricate Hack": { cost: 250, rank: 5, description: "Hack a company's bank account"},
                    "Hack the Planet": { cost: 0, rank: 7, description: "+ 25% computer crime success & skill gain"},
                    "Corporate Espionage": { cost: 50, rank: 10, description: "View financial details of a company"},
                },
    },
    "Nightclub": {
        "specials" : {
                    "Criminal Connections": { cost: 1, rank: 1, description: "Experience"},
                    "Target Market": { cost: 0, rank: 3, description: "25% illicit services success & skill gain"},
                    "Suppression": { cost: 1, rank: 5, description: "Drug addiction"},
                    "Tolerance": { cost: 0, rank: 7, description: "50% drug overdose risk reduction"},
                    "Restraint": { cost: 0, rank: 10, description: "Education is unaffected by drug addiction"},
                },
    },
    "Detective Agency": {
        "specials" : {
                    "References": { cost: 2, rank: 1, description: "View someone's employment & faction history"},
                    "Deputized": { cost: 0, rank: 3, description: "Arrest ability"},
                    "Friend or Foe": { cost: 100, rank: 5, description: "See who's added someone to their friend / enemy list"},
                    "Watchlist": { cost: 50, rank: 7, description: "Anonymously extend a target's flight time"},
                    "Most Wanted": { cost: 25, rank: 10, description: "View a list of highest wanted rewards"},
                },
    },
    "Fitness Center": {
        "specials" : {
                    "Healthy Mind": { cost: 1, rank: 1, description: "30 minute education time reduction"},
                    "Goal Oriented": { cost: 0, rank: 3, description: "50% happy loss reduction in gym"},
                    "Roid Rage": { cost: 1, rank: 5, description: "Strength"},
                    "Athlete": { cost: 0, rank: 7, description: "3% life regeneration per tick"},
                    "Training Regime": { cost: 0, rank: 10, description: "3% gym gains"},
                },
    },
    "Gas Station": {
        "specials" : {
                    "Molotov Cocktail": { cost: 3, rank: 1, description: "Molotov cocktail"},
                    "Fueled": { cost: 0, rank: 3, description: "25% passive speed"},
                    "Cauterize": { cost: 0, rank: 5, description: "Occasional healing during combat"},
                    "Fireproof": { cost: 0, rank: 7, description: "50% fire damage mitigation"},
                    "Blaze of Glory": { cost: 0, rank: 10, description: "50% fire damage dealt"},
                },
    },
    "Theater": {
        "specials" : {
                    "Stagecraft": { cost: 1, rank: 1, description: "Experience"},
                    "Dramatics": { cost: 10, rank: 3, description: "Maximum stealth"},
                    "Masked": { cost: 0, rank: 5, description: "Cannot be targeted by spies"},
                    "Twinlike": { cost: 0, rank: 7, description: "25% forgery success rate and skill gain"},
                    "Disguised": { cost: 0, rank: 10, description: "Hidden destination & traveling status"},
                },
    },
    "Amusement Park": {
        "specials" : {
                    "Dauntless": { cost: 1, rank: 1, description: "2 nerve"},
                    "Free Ride": { cost: 10, rank: 3, description: "250 happiness for target"},
                    "Unflinching": { cost: 0, rank: 5, description: "10 maximum nerve"},
                    "Adrenaline Rush": { cost: 0, rank: 7, description: "25% Epinephrine effectiveness & duration"},
                    "Thrill Seeker": { cost: 0, rank: 10, description: "10% crime exp & skill gain"},
                },
    },
    "Zoo": {
        "specials" : {
                    "Fulfillment": { cost: 1, rank: 1, description: "50 happiness"},
                    "Animal Instinct": { cost: 0, rank: 3, description: "25% hunting income"},
                    "Special K": { cost: 5, rank: 5, description: "Ketamine drug"},
                    "Eye of the Tiger": { cost: 0, rank: 7, description: "70% awareness"},
                    "Seasoned Poacher": { cost: 0, rank: 10, description: "3.0 accuracy"},
                },
    },
    "Cruise Line": {
        "specials" : {
                    "Bursar": { cost: 1, rank: 1, description: "25 casino tokens"},
                    "Portage": { cost: 0, rank: 3, description: "2 travel item capacity"},
                    "R&R": { cost: 1, rank: 5, description: "Drug addiction reduction"},
                    "Destination Report": { cost: 10, rank: 7, description: "View stock analysis of all items at a selected country"},
                    "Freight": { cost: 0, rank: 10, description: "3 travel item capacity"},
                },
    },
    "Private Security Firm": {
        "specials" : {
                    "Off the Grid": { cost: 20, rank: 1, description: "72 hour bounty protection"},
                    "Tactical Breach": { cost: 0, rank: 3, description: "50% Flash Grenade intensity"},
                    "Open Arsenal": { cost: 75, rank: 5, description: "Primary or Secondary weapon"},
                    "Regulation": { cost: 0, rank: 7, description: "25% full set armor mitigation bonus"},
                    "Mercenary": { cost: 1, rank: 10, description: "3 mission credits"},
                },
    },
    "Logistics Management": {
        "specials" : {
                    "Efficiency": { cost: 1, rank: 1, description: "Speed"},
                    "Organized": { cost: 0, rank: 3, description: "2 additional open mission contracts"},
                    "Repatriated": { cost: 0, rank: 5, description: "Return from abroad while in hospital"},
                    "Contraband": { cost: 50, rank: 7, description: "Shipment of foreign goods"},
                    "Logistics Report": { cost: 250, rank: 10, description: "Company productivity boost"},
                },
    },
    "Mining Corporation": {
        "specials" : {
                    "Salty": { cost: 5, rank: 1, description: "Salt Shaker"},
                    "Thirsty Work": { cost: 0, rank: 3, description: "30% alcohol cooldown reduction"},
                    "Rock Salt": { cost: 1, rank: 5, description: "Defense"},
                    "Essential Salts": { cost: 0, rank: 7, description: "10% maximum life"},
                    "Preserved Meat": { cost: 25, rank: 10, description: "Boosts current life to 150% of maximum"},
                },
    },
    "Television Network": {
        "specials" : {
                    "Propaganda ": { cost: 5, rank: 1, description: "1 faction respect"},
                    "Scoop": { cost: 0, rank: 3, description: "50% newspaper advertising cost reduction"},
                    "Inside Story": { cost: 15, rank: 5, description: "View someone's stats & money"},
                    "Bad Publicity": { cost: 0, rank: 7, description: "25% extortion success rate and skill gain"},
                    "Press Pass": { cost: 25, rank: 10, description: "Receive special privileges"},
                },
    },
    "Oil Rig": {
        "specials" : {
                    "Danger Money": { cost: 1, rank: 1, description: "Money"},
                    "Embargo": { cost: 50, rank: 3, description: "Halve a target's happiness"},
                    "Oil Mogul": { cost: 3, rank: 5, description: "Reduce bank investment time by 1 hour"},
                    "Tax Haven": { cost: 0, rank: 7, description: "10% offshore bank interest"},
                    "Fat Cat": { cost: 0, rank: 10, description: "50% investment banking limit"},
                },
    },
};

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}

// Make sure we're on the newspaper listings page
waitForElm('.job-listings-wrap').then((elm) => {
    drawFullSpecialsTable();
});

waitForElm('.job-lists-wrap').then((elm) => {
    drawCompanyTable();
});

waitForElm('.company-details-wrap').then((elm) => {
    drawCompanyProfileTable();
});

function drawFullSpecialsTable() {
    var data = sanitizeTableData();
    const div = `
<div id="icey-container">
    <div class="icey-head">
        <span class="icey-title">job specials</span>
    </div>
    <div class="icey-content">
    <table id="specialsTable" class="display">
    <thead>
        <tr>
            <th>Company</th>
            <th>Rank</th>
            <th>Name</th>
            <th>Description</th>
            <th>Cost</th>
        </tr>
    </thead>
    <tbody>

    </tbody>
</table>
</div>
</div>
    `;
    $('.job-listings-wrap').append(div);
    var table = $('#specialsTable').DataTable( {
        "bLengthChange": false,
        "bInfo" : false,
        "pageLength": 25,
        responsive: true,
        data: data,
        columns: [
            { data: 'company' },
            { data: 'rank' },
            { data: 'name' },
            { data: 'description' },
            { data: 'cost' },
        ]
    } );
}

function drawCompanyTable() {
    var company = $('.job-lists-wrap').find('div.title-black').first().text().trim().replace(' positions', '');
    var data = sanitizeTableData(company);
    const div = `
<div id="icey-container">
    <div class="icey-head">
        <span class="icey-title">job specials</span>
    </div>
    <div class="icey-content">
    <table id="specialsTable" class="display">
    <thead>
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Description</th>
            <th>Cost</th>
        </tr>
    </thead>
    <tbody>

    </tbody>
</table>
</div>
</div>
    `;
    $('.job-lists-wrap').append(div);
    var table = $('#specialsTable').DataTable( {
        "bLengthChange": false,
        "bInfo" : false,
        "pageLength": 5,
        "searching": false,
        "paging": false,
        responsive: true,
        data: data,
        columns: [
            { data: 'rank' },
            { data: 'name' },
            { data: 'description' },
            { data: 'cost' },
        ]
    } );
}

function drawCompanyProfileTable() {
    var company = $('.company-details-wrap').find('.details-wrap').find('.info').find('.m-title').find('.m-show').text();
    var data = sanitizeTableData(company);
    const div = `
<div id="icey-container">
    <div class="icey-head">
        <span class="icey-title">job specials</span>
    </div>
    <div class="icey-content">
    <table id="specialsTable" class="display">
    <thead>
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Description</th>
            <th>Cost</th>
        </tr>
    </thead>
    <tbody>

    </tbody>
</table>
</div>
</div>
    `;
    $('.company-details-wrap').append(div);
    var table = $('#specialsTable').DataTable( {
        "bLengthChange": false,
        "bInfo" : false,
        "pageLength": 5,
        "searching": false,
        "paging": false,
        responsive: true,
        data: data,
        columns: [
            { data: 'rank' },
            { data: 'name' },
            { data: 'description' },
            { data: 'cost' },
        ]
    } );
}

//=================== Helpers/CSS ==========================//

function sanitizeTableData(company) {
    let data = [];
    if(company) {
        $.each(companies, function(key, value) {
            if(key == company) {
                $.each(value.specials, function(ikey, ivalue) {
                    data.push({"company": key, "rank": ivalue.rank, "name": ikey, "description": ivalue.description, "cost": ivalue.cost});
                });
            }
        });
    } else {
        $.each(companies, function(key, value) {
            $.each(value.specials, function(ikey, ivalue) {
                data.push({"company": key, "rank": ivalue.rank, "name": ikey, "description": ivalue.description, "cost": ivalue.cost});
            });
        });
    }
    return data;
}

var newCSS = GM_getResourceText ("dtCSS");
GM_addStyle (newCSS);

var responsiveCSS = GM_getResourceText ("dtResponsive");
GM_addStyle (responsiveCSS);

GM_addStyle(`
#icey-container {
    margin-top: 5px;
    width: 100%;
}
.icey-head {
    border-radius: 5px 5px 0 0;
    height: 30px;
    line-height: 30px;
    width: 100%;
    background: linear-gradient(180deg, #8ABEEF, #53728f);
    color: white;
}
.icey-title {
    width: 100%;
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: 700;
    line-height: 16px;
    flex-grow: 2;
    padding: 5px;
    margin: 5px;
    text-transform: capitalize;
    text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
}
body.dark-mode .icey-content {
    background: #333333;
}
body.dark-mode .icey-content td {
    color: #c0c0c0;
}
.icey-content {
    padding: 5px;
    background: #f2f2f2;
}

`);