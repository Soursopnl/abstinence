let currentDay = 0;
let abLongevity = 0;
let abSec = 0;
let abDateTime;
let newAbFuncCompleted;
let totalAbdatabaseLength = 0; // количество сеансов
let posMax;
let timeAb = document.getElementById('timeAb');
let newAbButton = document.getElementById('newAb');
let finishAbButton = document.getElementById('finishAb');
let allAbStatsTable = document.getElementById('allAbStats');
let rankTitle = document.getElementById('rank');
let maxTimeTitle = document.getElementById('maxTime');
let charts = document.getElementsByClassName('charts')[0];
let chartsItems;
let newChartsItem;
let maxTimeFromArray;
let avgLine = document.getElementsByClassName('avg-line')[0];
let avgLineHeight; //высота линии среднего значения (проценты)
let avgLineNew;
let avgTimeWtLast;
let maxChartsItem;
let avgTimeLast;
let chartsWidth;
let openCloseChartsItem;
let posAddRemoveData = 0;
let posAddRemoveFirstTime = 0;
let timerRefreshToShowData;
let clickedPos = 0;
//let chartsItem = document.getElementsByClassName('charts__item');


let timer, timerRefresh, timerRefreshMainframe;

let days, hours, minutes;

let newTimestamp; // таймстемп последнего сеанса
let diff;

let isTimerLaunched; //состояние таймера, вкл/выкл

let savedDatabase;
let currentRank;
let chartsItemsHeights = [];
let lastChartsItem;
let currentDate = new Date();
let parsedMaxTime;


let abDatabase = []; // база данных воздержаний
let maxTime = 0;
let percentFromMaxTime = 0;
let avgTime = 0;


function getRank(avg) {
    let rank;
    if (avg / (1000 * 60 * 60 * 24) >= 180) {
        rank = 'гигачад';
    }
    else if(avg / (1000 * 60 * 60 * 24) >= 120) {
        rank = 'хозяин жизни';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 60) {
        rank = 'мужик';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 35) {
        rank = 'стоик';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 21) {
        rank = 'умелый';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 14) {
        rank = 'практик III';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 9) {
        rank = 'практик II';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 6) {
        rank = 'практик I';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 4) {
        rank = 'дважды старший аматор';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 3) {
        rank = 'старший аматор';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 2) {
        rank = 'аматор';
    }
    else if (avg / (1000 * 60 * 60 * 24) >= 1.5) {
        rank = 'младший аматор';
    }
    else if (avg / ((1000 * 60 * 60 * 24)) / (1000 * 60 * 60) > 24) {
        rank = 'старшая примата';
    }
    else if (avg / ((1000 * 60 * 60 * 24)) / (1000 * 60 * 60) > 16) {
        rank = 'примата IV';
    }
    else if (avg / ((1000 * 60 * 60 * 24)) / (1000 * 60 * 60) > 12) {
        rank = 'примата III';
    }
    else if (avg / ((1000 * 60 * 60 * 24)) / (1000 * 60 * 60) > 8) {
        rank = 'примата II';
    }
    else if (avg / ((1000 * 60 * 60 * 24)) / (1000 * 60 * 60) > 4) {
        rank = 'примата I';
    }
    else {
        rank = 'примата 0';
    }
    return rank;
}

function refreshMainframe() {
    //abDatabase = JSON.parse(localStorage.getItem('abDatabase'));
    if(isTimerLaunched == 1) {
        newAbButton.style.display = 'none';
        finishAbButton.style.display = 'block';
    }
    if (isTimerLaunched == 0) {
        finishAbButton.style.display = 'none';
        newAbButton.style.display = 'block';
    }
    //showData();
}
function refresh() {
    
    abDatabase = JSON.parse(localStorage.getItem('abDatabase'));
    diff = Date.now() - newTimestamp;
    localStorage.setItem('diffFromStart', diff);
    percentFromMaxTime = Math.round(diff/maxTime * 100) / 100;
    
    if (percentFromMaxTime >= 1) {
        timeAb.style.color = '#00952d';
    }
    else if (percentFromMaxTime >= 0.7) {
        timeAb.style.color = '#ffbf00';
    }
    else {
        timeAb.style.color = '#000000';
    }
    //console.log(percentFromMaxTime);

    //let now = new Date().getTime();
        days = Math.floor (diff / (1000 * 60 * 60 * 24));
        hours = Math.floor ((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor ((diff % (1000 * 60 * 60)) / (1000 * 60));
        timeAb.innerHTML = `${days}д ${hours}ч ${minutes}м`;
        localStorage.setItem('curDays', days);
        localStorage.setItem('curHours', hours);
        localStorage.setItem('curMinutes', minutes);
  
    abDatabase[abDatabase.length-1].longevity = diff;
    abDatabase[abDatabase.length-1].days = days;
    abDatabase[abDatabase.length-1].hours = hours;
    abDatabase[abDatabase.length-1].minutes = minutes;
    abDatabase[abDatabase.length-1].date = currentDate.toLocaleString();
    maxTime = Math.max.apply(Math, abDatabase.map(function(o) { return o.longevity; }));
    const keys = Object.keys(abDatabase);
    maxTimeFromArray = abDatabase.filter(keys => keys.longevity == maxTime);
    localStorage.setItem('maxTime', JSON.stringify(maxTimeFromArray));

    chartsItemsHeights = chartsItemsHeights.map(function(e, i) {
        return (abDatabase[i].longevity/maxTime * 100) + '%';
    });
    localStorage.setItem('chartsItemsHeights', JSON.stringify(chartsItemsHeights));
    //newChartsItem = document.getElementsByClassName('charts__item')[0];
    //for(let i = 0; i < chartsItemsHeights)
    //charts.lastChild.style.height = Math.floor(abDatabase[abDatabase.length-1].longevity * 100) / maxTime + '%';
    avgTime = abDatabase.reduce((sum, с) => sum + с.longevity, 0) / abDatabase.length;
    avgTimeLast = ((avgTime * abDatabase.length)-abDatabase[abDatabase.length-1].longevity)/(abDatabase.length-1);
    for (let i = 0; i < chartsItems.length; i++) {
        //chartsItems[i].classList.add('grayish');
        if(chartsItemsHeights[i] == '100%') {
            chartsItems[i].classList.add('recordChartsItem');
            
        }
        else chartsItems[i].classList.remove('recordChartsItem');
        chartsItems[i].style.height = ((abDatabase[i].longevity * 100) / maxTime) + '%';
    }
    maxChartsItem = chartsItemsHeights.findIndex(item => item == '100%');
    //console.log(maxChartsItem);
    
    
    
   
        if(chartsItemsHeights[chartsItemsHeights.length-1] == '100%') {
         
            avgLineHeight = avgTimeLast/maxTime * 100;
        }
        localStorage.setItem('avgLineHeight', avgLineHeight);
        localStorage.setItem('avgLineExists', true);
        avgLine.style.bottom = avgLineHeight + '%';

        // for(let i = 0; i < chartsItems.length; i++) {
        //     chartsItems[i].addEventListener('click', function() {
        //         let data;
        //         data = document.createElement('div');
        //         let ifSomeDataExists = document.getElementsByClassName('charts__item-data');
        //             for (let i = 0; i < ifSomeDataExists.length; i++) {
        //                 ifSomeDataExists[i].remove();
        //             }
        //         openCloseChartsItem++;
        //         if (openCloseChartsItem % 2 == 1) {
                    
                    
        //             chartsItems[i].appendChild(data);
        //             let diffLastFirst = Math.ceil((abDatabase[abDatabase.length-1].id - abDatabase[0].id)/2);
        //             data.classList.add('charts__item-data');
        //             console.log($(this).index());
                    
        //             if(chartsItems.length >= 20) {
        //                 if($(this).index() < diffLastFirst) {
        //                     data.style.left = 0 + 'px';
        //                     data.style.setProperty('--lt', '5px');
        //                 } else {
        //                     data.style.right = 0 + 'px';
        //                     data.style.setProperty('--rt', '5px');
        //                 }
        //             }
        //             else {
        //                 if($(this).index() < 10) {
        //                     data.style.left = 0 + 'px';
        //                     data.style.setProperty('--lt', '5px');
        //                 } else {
        //                     data.style.right = 0 + 'px';
        //                     data.style.setProperty('--rt', '5px');
        //                 }
        //             }
        //             data.innerHTML = `Сеанс:&nbsp;${abDatabase[i].id}<br>Время:&nbsp;${abDatabase[i].days}д&nbsp;${abDatabase[i].hours}ч&nbsp;${abDatabase[i].minutes}м`;    
        //         } else {
        //             data.classList.remove();
        //         }
        //         console.log('_____' + openCloseChartsItem);
        //     });
        // }
        chartsItems = document.getElementsByClassName('charts__item');
        
}



function renderChartsItem() {
   
    // chartsItemsHeights = chartsItemsHeights.map(function(e, i) {
    //     return Math.floor((abDatabase[i].longevity * 100) / maxTime * 100) / 100 + '%';
    // });
    
    
    for (let i = 0; i < abDatabase.length; i++) {
        chartsItems[i].style.height = ((abDatabase[i].longevity * 100) / maxTime) + '%';
    }
    //diff = 0;
    
    //abDatabase[abDatabase.length-1]
}

function render() {
    // chartsItemsHeights = JSON.parse(localStorage.getItem('chartsItemsHeights'));
    // console.log(chartsItemsHeights);
    for (let i = 0; i < chartsItemsHeights.length; i++) {
        chartsItems = document.getElementsByClassName('charts__item');
        
        newChartsItem = document.createElement('div');
        charts = document.getElementsByClassName('charts')[0];
        charts.appendChild(newChartsItem);
        newChartsItem.classList.add('charts__item');
        newChartsItem.style.width = chartsWidth / 20 + 'px';
        //chartsItems = document.getElementsByClassName('charts__item');
        
        //chartsItems[i].style.height = chartsItemsHeights;
        //((abDatabase[i].longevity * 100) / maxTime) + '%';
    }

    for(let i = 0; i < chartsItemsHeights.length; i++) {
        chartsItems[i].style.height = chartsItemsHeights[i];
        if(chartsItemsHeights[i] == '100%') {
            chartsItems[i].classList.add('recordChartsItem');
        }
        else chartsItems[i].classList.remove('recordChartsItem');
        //console.log(chartsItems[i]);
    }
   
    
}

window.onload = function() {
    
    chartsWidth = document.querySelector('.charts').offsetWidth;
    console.log(chartsWidth);
    //console.log(abDatabase.length);
    if (localStorage.getItem('abDatabase')) {
        abDatabase = JSON.parse(localStorage.getItem('abDatabase'));
    }
    else abDatabase = [];
    if (localStorage.getItem('totalAbdatabaseLength')) {
        totalAbdatabaseLength = localStorage.getItem('totalAbdatabaseLength');
    }
    else totalAbdatabaseLength = 0;
    if (localStorage.getItem('maxTime')) {
        parsedMaxTime = JSON.parse(localStorage.getItem('maxTime'));
        console.log(parsedMaxTime);
        maxTimeTitle.innerHTML = `Рекорд: <b>${parsedMaxTime[0].days}д ${parsedMaxTime[0].hours}ч ${parsedMaxTime[0].minutes}м</b>` ;
        
    } else  {
        parsedMaxTime = [];
        maxTimeTitle.innerHTML = '';
    }
   //console.log(abDatabase);
    // let valuesDatabase = Object.values(savedDatabase);
    for (let i in abDatabase) {
        //console.log(i.days);
        allAbStatsTable.insertAdjacentHTML('afterBegin', `${(abDatabase[i].days)}д ${abDatabase[i].hours}ч ${abDatabase[i].minutes}м ----- ${abDatabase[i].date} <br><br>`);
   
    }

    
    if (localStorage.getItem('chartsItemsHeights')) {
        chartsItemsHeights = JSON.parse(localStorage.getItem('chartsItemsHeights'));
        render();
    } else chartsItemsHeights = [];

    

    

    if (localStorage.getItem('timerLaunched')) {
        isTimerLaunched = localStorage.getItem('timerLaunched');
    } else timerLaunched = 0;
    
    timerRefreshMainFrame = setInterval(refreshMainframe, 100);
    
    if (localStorage.getItem('avgLineHeight')) {
        avgLineHeight = localStorage.getItem('avgLineHeight');
        avgLine.style.bottom = avgLineHeight + '%';
    }
    
    if (localStorage.getItem('currentRank')) {
        currentRank = localStorage.getItem('currentRank');
    }
    else currentRank = 'нет ранга';
    rankTitle.innerHTML = `Ранг: <b>${currentRank}</b>`;


    
    
    
    
    if(localStorage.getItem('timerLaunched') == 1) {
        chartsItems[chartsItems.length-1].classList.toggle('newChartsItem');
        //newAbButton.style.display='none';
        if(localStorage.getItem('curDays')) {
            days = localStorage.getItem('curDays');
        } else { days = 0; }
        if(localStorage.getItem('curHours')) {
            hours = localStorage.getItem('curHours');
        } else { hours = 0; }
        if(localStorage.getItem('curMinutes')) { 
            minutes = localStorage.getItem('curMinutes');
        } else { minutes = 0; }
        timeAb.innerHTML = `${days}д ${hours}ч ${minutes}м`;
        if(localStorage.getItem('diffFromStart')) {
            diff = +parseInt(localStorage.getItem('diffFromStart')); // время в мс от начала последнего сеанса
            newTimestamp = +parseInt(localStorage.getItem('newTimestamp'));
            timerRefresh = setInterval(refresh, 1000);
        } else {
            diff = 0;
        }
    }
    else {
        
    }
    if (localStorage.getItem('avgLineHeight')) {
        avgLineHeight = localStorage.getItem('avgLineHeight');
        avgLine.style.bottom = avgLineHeight + '%';
    }
    
    

    console.log(isTimerLaunched);
    openCloseChartsItem = false;
    posAddRemoveData = -1;
    showData();

}
let ifSomeDataExists;
function showData() {

    chartsItems = document.getElementsByClassName('charts__item');
    console.log(chartsItems.length);
    

    for(let i = 0; i < chartsItems.length; i++) {
        
        chartsItems[i].addEventListener('click', function() {
            
            ifSomeDataExists = document.getElementsByClassName('charts__item-data')[0];
            console.log('Нажатый элемент ---- ' + i);
            console.log('Позиция под удаление ---- ' + posAddRemoveData);
            // if(ifSomeDataExists) {
            //     ifSomeDataExists.remove();
            //     console.log(ifSomeDataExists);
            //     posAddRemoveData = -1;
            // }
            //ifSomeDataExists.remove();
            // if(clickedPos == i) {
            //     //clickedPos = -1;
            //     console.log(ifSomeDataExists);
            //     ifSomeDataExists.remove();
                
            // }
            
            //if (clickedPos % 2 == 1) {
            if (posAddRemoveData == i) {
                if (ifSomeDataExists) {
                    ifSomeDataExists.remove();
                }
                posAddRemoveData = -1;
                clickedPos = 0;
            } else {
                
                if (ifSomeDataExists) {
                    ifSomeDataExists.remove();
                }
                let data = document.createElement('div');
                chartsItems[i].appendChild(data);
                let diffLastFirst = Math.ceil((abDatabase[abDatabase.length-1].id - abDatabase[0].id)/2);
                data.classList.add('charts__item-data');
                console.log($(this).index());
                if(chartsItems.length >= 20) {
                    if($(this).index() < diffLastFirst) {
                        data.style.left = 0 + 'px';
                        data.style.setProperty('--lt', '5px');
                    } else {
                        data.style.right = 0 + 'px';
                        data.style.setProperty('--rt', '5px');
                    }
                }
                else {
                    if($(this).index() < 10) {
                        data.style.left = 0 + 'px';
                        data.style.setProperty('--lt', '5px');
                    } else {
                        data.style.right = 0 + 'px';
                        data.style.setProperty('--rt', '5px');
                    }
                }
                data.innerHTML = `Сеанс:&nbsp;${abDatabase[i].id}<br>Время:&nbsp;${abDatabase[i].days}д&nbsp;${abDatabase[i].hours}ч&nbsp;${abDatabase[i].minutes}м`;    
                posAddRemoveData = i;
                clickedPos++;
                console.log(clickedPos);
            }
        
                
                
                
            }
                
            
            
            // posAddRemoveData = i;
    
            // if(posAddRemoveData !== i) {
          
                
            //     //posAddRemoveData = i;
            //     // if(posAddRemoveFirstTime >= 1) {
            //     //     if(ifSomeDataExists !== null) {
            //     //         ifSomeDataExists.remove();
            //     //     }
            //     // }
            //     //posAddRemoveData = -1;
            // } 
            
            
            
            
            
            // else {
                
            // }
 
            
            // if(openCloseChartsItem == false) {
                
            //     let data = document.createElement('div');
            //     chartsItems[i].appendChild(data);
            //     let diffLastFirst = Math.ceil((abDatabase[abDatabase.length-1].id - abDatabase[0].id)/2);
            //     data.classList.add('charts__item-data');
            //     console.log($(this).index());
            //     if(chartsItems.length >= 20) {
            //         if($(this).index() < diffLastFirst) {
            //             data.style.left = 0 + 'px';
            //             data.style.setProperty('--lt', '5px');
            //         } else {
            //             data.style.right = 0 + 'px';
            //             data.style.setProperty('--rt', '5px');
            //         }
            //     }
            //     else {
            //         if($(this).index() < 10) {
            //             data.style.left = 0 + 'px';
            //             data.style.setProperty('--lt', '5px');
            //         } else {
            //             data.style.right = 0 + 'px';
            //             data.style.setProperty('--rt', '5px');
            //         }
            //     }
            //     data.innerHTML = `Сеанс:&nbsp;${abDatabase[i].id}<br>Время:&nbsp;${abDatabase[i].days}д&nbsp;${abDatabase[i].hours}ч&nbsp;${abDatabase[i].minutes}м`;    
            //     openCloseChartsItem = true;
            //     //posAddRemoveFirstTime++;
            // }
            // else {
            //     ifSomeDataExists.remove();
                
            //     //data.remove();
            //     openCloseChartsItem = false;
            // }
            
            
            // if(i == posAddRemoveData) {
            //     openCloseChartsItem = true;
            // }
            // if (openCloseChartsItem) {
                
                
            // } else openCloseChartsItem = true;
            //posAddRemoveData = i;
            // if(posAddRemoveFirstTime == 0) {
            //     posAddRemoveData = i;
            // }
            
            //console.log(ifSomeDataExists);
            
            
            
            
            
            //openCloseChartsItem = true;
            
            
            //posAddRemoveData = i;
            //openCloseChartsItem = true;
            // if(openCloseChartsItem) {
            //     let ifSomeDataExists = document.getElementsByClassName('charts__item-data');
            //     console.log(ifSomeDataExists);
            //     ifSomeDataExists[0].remove();
            // }
            
            
            // if (posAddRemoveFirstTime >= 1) {
            //     let ifSomeDataExists = document.getElementsByClassName('charts__item-data')[0];
            //     //console.log(ifSomeDataExists);
            //     console.log("1");
            //     ifSomeDataExists.remove();
            // }
            // if(posAddRemoveData !== i) {
            //     let ifSomeDataExists = document.getElementsByClassName('charts__item-data')[0];
            //     ifSomeDataExists.remove();
            // }
            
            
            //openCloseChartsItem = false;
            // if(posAddRemoveData !== i) {
            //     let ifSomeDataExists = document.getElementsByClassName('charts__item-data')[0];
            //     ifSomeDataExists.remove();
            // }
          
            // ifSomeDataExists = document.getElementsByClassName('charts__item-data')[0];
            // ifSomeDataExists.remove();
            
            
        );
    }
    
}
newAbButton.onclick = function() {
    //posAddRemoveData = -1;
    
    abDateTime = new Date().getTime();
    totalAbdatabaseLength++;
    localStorage.setItem('totalAbdatabaseLength', totalAbdatabaseLength);
    
    if (abDatabase.length == 20) {
        abDatabase.shift();
        chartsItemsHeights.shift();
        charts.removeChild(chartsItems[0]);
    }
    
    abDatabase.push({
        id: totalAbdatabaseLength,
        longevity: diff,
        days: days,
        hours: hours,
        minutes: minutes,
        date: currentDate.toLocaleString(),
    });

    localStorage.setItem('abDatabase', JSON.stringify(abDatabase));
    
    let newChartsItem = document.createElement('div');
    charts.appendChild(newChartsItem);
    newChartsItem.classList.add('charts__item');
    newChartsItem.style.width = chartsWidth / 20 + 'px';
    chartsItems = document.getElementsByClassName('charts__item');
    chartsItems[chartsItems.length-1].classList.add('newChartsItem');
    //localStorage.setItem('chartsItems', )

    //localStorage.setItem('chartsItems', JSON.stringify(chartsItems));
    let heightNow = Math.floor(((diff * 100) / maxTime) * 100) / 100 + '%';
    chartsItemsHeights.push(heightNow);
    timerRefresh = setInterval(refresh, 1000);
    isTimerLaunched = 1;
    localStorage.setItem('timerLaunched', isTimerLaunched);
    newTimestamp = Date.now();
    localStorage.setItem('newTimestamp', newTimestamp);
    console.log(chartsItems.length);
    //newAbFuncCompleted = true;
    
}




finishAbButton.onclick = function() {
    //newAbButton.style.display = 'block';
    //finishAbButton.style.display = 'none';
    isTimerLaunched = 0;
    localStorage.setItem('timerLaunched', isTimerLaunched);
    clearInterval(timerRefresh);
    percentFromMaxTime = 0;
    
    clearInterval(timer);
    localStorage.setItem('chartsItemsHeights', JSON.stringify(chartsItemsHeights));
    chartsItems[chartsItems.length-1].classList.toggle('newChartsItem');
    
    

    // maxTime = Math.max.apply(Math, abDatabase.map(function(o) { return o.longevity; }));
    // const keys = Object.keys(abDatabase);
    // const maxTimeFromArray = abDatabase.filter(keys => keys.longevity == maxTime);
    // localStorage.setItem('maxTime', JSON.stringify(maxTimeFromArray));
    maxTimeTitle.innerHTML = `Рекорд: <b>${maxTimeFromArray[0].days}д ${maxTimeFromArray[0].hours}ч ${maxTimeFromArray[0].minutes}м</b>` ;
    avgTime = abDatabase.reduce((sum, с) => sum + с.longevity, 0) / abDatabase.length;

    currentRank = getRank(avgTime);

    if(localStorage.getItem('avgLineExists')) {
        avgLine.remove();
    }
    avgLine = document.createElement('div');
    avgLine.classList.add('avg-line');
    charts.appendChild(avgLine);
    avgLineHeight = avgTime/maxTime * 100;
    localStorage.setItem('avgLineHeight', avgLineHeight);
    localStorage.setItem('avgLineExists', true);
    avgLine.style.bottom = avgLineHeight + '%';


    localStorage.setItem('currentRank', currentRank);
    rankTitle.innerHTML = `Ранг: <b>${currentRank}</b>`;

    //renderChartsItem();
    //abDatabase[abDatabase.length-1].height = chartsItemsHeights[chartsItemsHeights.length-1];
    diff = 0;
    console.log(abDatabase);
    console.log(maxTime);

    timeAb.innerHTML = "Сеанс окончен";
    localStorage.setItem('abDatabase', JSON.stringify(abDatabase));
    savedDatabase = JSON.parse(localStorage.getItem('abDatabase'));
    console.log(savedDatabase);
    allAbStatsTable.insertAdjacentHTML('afterBegin', `${days}д ${hours}ч ${minutes}м ----- ${currentDate.toLocaleString()} <br><br>`);
    //posAddRemoveData = -1;
}





