var tick = 125;
var precision = 2;

// RESOURCES
var time = 0.0;
var semester = 0.0;
var anxiety = 0.0;

var state = {
word :      {r: 0.0, lim: 100.0, dt: 0.0},
sent :      {r: 0.0, lim: 20.0, dt: 0.0, cost: 10.0},
graf :      {r: 0.0, lim: 40.0, dt: 0.0, cost: 10.0},
draft :     {r: 0.0, lim: 10.0, dt: 0.0, cost: 20.0},
chapter :   {r: 0.0, lim: 10.0, dt: 0.0, cost: 10000.0},
diss :      {r: 0.0, lim: 1.0, dt: 0.0, cost: 5.0},
monograph : {r: 0.0, lim: 1.0, dt: 0.0, cost: 10.0},
volume :    {r: 0.0, lim: 10.0, dt: 0.0, cost: 10.0},
outline :   {r: 0.0, lim: 0.0, dt: 0.0, cost: 10.0},
money :     {r: 1000.0, lim: 1000.0, dt: -0.002, cost: 0.0}
};

function save() {
  localStorage.setItem('time', JSON.stringify(time));
  localStorage.setItem('state', JSON.stringify(state));
}

function load() {
    if(localStorage.length > 0){
  time = JSON.parse(localStorage.getItem('time'));
  state = JSON.parse(localStorage.getItem('state'));
};
}

function delete_save() {
    localStorage.clear();
    location.reload();
};

function init() {
    load();
    // STOCKS
    document.getElementById("time_stock").innerHTML = time;

    document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
    document.getElementById("graf_stock").innerHTML = state.graf.r.toFixed(precision);
    document.getElementById("draft_stock").innerHTML = state.draft.r.toFixed(precision);
    document.getElementById("chapter_stock").innerHTML = state.chapter.r.toFixed(precision);
    document.getElementById("dissertation_stock").innerHTML = state.diss.r.toFixed(precision);
    document.getElementById("monograph_stock").innerHTML = state.monograph.r.toFixed(precision);
    document.getElementById("volume_stock").innerHTML = state.volume.r.toFixed(precision);

    document.getElementById("money_stock").innerHTML = state.money.r.toFixed(precision);

    document.getElementById("outline_stock").innerHTML = state.outline.r.toFixed(0);

    // LIMITS
    document.getElementById("word_limit").innerHTML = state.word.lim;
    document.getElementById("graf_limit").innerHTML = state.graf.lim;
    document.getElementById("draft_limit").innerHTML = state.draft.lim;
    document.getElementById("volume_limit").innerHTML = state.volume.lim;
    document.getElementById("chapter_limit").innerHTML = state.chapter.lim;
    document.getElementById("dissertation_limit").innerHTML = state.diss.lim;
    document.getElementById("monograph_limit").innerHTML = state.monograph.lim;

    // FLOWS
    document.getElementById("word_dt").innerHTML = state.word.dt.toFixed(precision); // multiply by (1000/tick) for per sec rate
    document.getElementById("graf_dt").innerHTML = state.graf.dt.toFixed(precision);
    document.getElementById("draft_dt").innerHTML = state.draft.dt.toFixed(precision);
    document.getElementById("chapter_dt").innerHTML = state.chapter.dt.toFixed(precision);
    document.getElementById("dissertation_dt").innerHTML = state.diss.dt.toFixed(precision);
    document.getElementById("monograph_dt").innerHTML = state.monograph.dt.toFixed(precision);
    document.getElementById("volume_dt").innerHTML = state.volume.dt.toFixed(precision);

   // COSTS
   document.getElementById("graf_cost").innerHTML = state.graf.cost.toFixed(precision);
   document.getElementById("draft_cost").innerHTML = state.draft.cost.toFixed(precision);
   document.getElementById("outline_cost").innerHTML = state.outline.cost.toFixed(precision);
};

window.setInterval(function(){
    update_time();
    update_word(state.word.dt);
    update_graf(state.graf.dt);
    update_draft(state.draft.dt);
    update_chapter(state.chapter.dt);
    update_diss(state.diss.dt);
    update_monograph(state.monograph.dt);
    update_volume(state.volume.dt);
    update_money(state.money.dt);

    update_costs();
    update_flows();
}, tick*1);

function inc_word(n){ n=1;  state.word.r = Math.round(state.word.r*1000 + n*1000)/1000; };

function update_flows(){
    state.word.dt =         0.0 + state.outline.r*0.01;
    state.graf.dt =         0.0;
    state.draft.dt =        0.0;
    state.chapter.dt =      0.0;
    state.diss.dt =         0.0;
    state.monograph.dt =    0.0;
    state.volume.dt =       0.0;

    document.getElementById("word_dt").innerHTML =         state.word.dt.toFixed(precision);
    document.getElementById("graf_dt").innerHTML =         state.graf.dt.toFixed(precision);
    document.getElementById("draft_dt").innerHTML =        state.draft.dt.toFixed(precision);
    document.getElementById("chapter_dt").innerHTML =      state.chapter.dt.toFixed(precision);
    document.getElementById("dissertation_dt").innerHTML = state.diss.dt.toFixed(precision);
    document.getElementById("monograph_dt").innerHTML =    state.monograph.dt.toFixed(precision);
    document.getElementById("volume_dt").innerHTML =       state.volume.dt.toFixed(precision);
    document.getElementById("money_dt").innerHTML =       state.money.dt.toFixed(precision);
}

function update_costs(){
    document.getElementById("graf_cost").innerHTML =         state.graf.cost.toFixed(precision);
    document.getElementById("draft_cost").innerHTML =        state.draft.cost.toFixed(precision);
    document.getElementById("chapter_cost").innerHTML =      state.chapter.cost.toFixed(precision);
    document.getElementById("dissertation_cost").innerHTML = state.diss.cost.toFixed(precision);
    document.getElementById("monograph_cost").innerHTML =    state.monograph.cost.toFixed(precision);
    document.getElementById("outline_cost").innerHTML =      state.outline.cost.toFixed(precision);
}

function update_time(){
    time = time + 1;
    semester = (time/16000).toFixed(0);
    document.getElementById("time_stock").innerHTML = (time/8).toFixed(0);
    document.getElementById("year_stock").innerHTML = (time/32000).toFixed(0);
//    if(semester % 2 == 0) {
//        document.getElementById("semester").innerHTML = 'fall semester';
//    }
//    else if(semester % 2 == 1) {
//        document.getElementById("semester").innerHTML = 'spring semester';
//    }
}

function inc_graf(){
    if(state.word.r >= state.graf.cost) {
        state.word.r = state.word.r - state.graf.cost;
        state.graf.r = state.graf.r + 1;
        state.graf.cost = 10 + state.graf.r*1.05;

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("graf_stock").innerHTML = state.graf.r.toFixed(precision);
        document.getElementById("graf_cost").innerHTML = state.graf.cost.toFixed(precision);
    }
};

function inc_draft(n){
    if(state.graf.r >= state.draft.cost) {
        state.graf.r = state.graf.r - state.draft.cost;
        state.draft.r = state.draft.r + 1;
        state.draft.cost = 10 + state.draft.r*1.05;

        document.getElementById("graf_stock").innerHTML = state.graf.r.toFixed(precision);
        document.getElementById("draft_stock").innerHTML = state.draft.r.toFixed(precision);
        document.getElementById("draft_cost").innerHTML = state.draft.cost.toFixed(precision);
    }
};

function add_outline(){
    if(state.word.r >= state.outline.cost) {
        state.word.r = state.word.r - state.outline.cost;
        word.lim = word.lim + 10;
        state.outline.r = state.outline.r + 1;
        state.outline.cost = 10 + state.outline.r*1.05;

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("word_limit").innerHTML = state.word.lim.toFixed(precision);        document.getElementById("outline_stock").innerHTML = state.outline.r.toFixed(0);
        document.getElementById("outline_cost").innerHTML = state.outline.cost.toFixed(precision);
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function update_word(n){
    state.word.r = Math.round(state.word.r*1000 + n*1000)/1000;
    if(state.word.r > state.word.lim) {
        state.word.r = state.word.lim;
    }
    if(state.word.r > 0) {
        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
    }
    else {
        state.word.r = 0;
        document.getElementById("word_stock").innerHTML = '0';
    }
};

function update_graf(n){
    state.graf.r = Math.round(state.graf.r*1000 + n*1000)/1000;
    if(state.graf.r > state.graf.lim) {
        state.graf.r = state.graf.lim;
    }
    if(state.graf.r > 0) {
        document.getElementById("graf_stock").innerHTML = state.graf.r.toFixed(precision);
    }
    else {
        state.graf.r = 0;
        document.getElementById("graf_stock").innerHTML = '0';
    }
};

function update_draft(n){
    state.draft.r = Math.round(state.draft.r*1000 + n*1000)/1000;
    if(state.draft.r > state.draft.lim) {
        state.draft.r = state.draft.lim;
    }
    if(state.draft.r > 0) {
        document.getElementById("draft_stock").innerHTML = state.draft.r.toFixed(precision);
    }
    else {
        state.draft.r = 0;
        document.getElementById("draft_stock").innerHTML = '0';
    }
};


function update_chapter(n){
    state.chapter.r = Math.round(state.chapter.r*1000 + n*1000)/1000;
    if(state.chapter.r > state.chapter.lim) {
        state.chapter.r = state.chapter.lim;
    }
    if(state.chapter.r > 0) {
        document.getElementById("chapter_stock").innerHTML = state.chapter.r.toFixed(precision);
    }
    else {
        state.chapter.r = 0;
        document.getElementById("chapter_stock").innerHTML = '0';
    }
};

function update_diss(n){
    state.diss.r = Math.round(state.diss.r*1000 + n*1000)/1000;
    if(state.diss.r > state.diss.lim) {
        state.diss.r = state.diss.lim;
    }
    if(state.diss.r > 0) {
        document.getElementById("dissertation_stock").innerHTML = state.diss.r.toFixed(precision);
    }
    else {
        state.diss.r = 0;
        document.getElementById("dissertation_stock").innerHTML = '0';
    }
};


function update_monograph(n){
    state.monograph.r = Math.round(state.monograph.r*1000 + n*1000)/1000;
    if(state.monograph.r > state.monograph.lim) {
        state.monograph.r = state.monograph.lim;
    }
    if(state.monograph.r > 0) {
        document.getElementById("monograph_stock").innerHTML = state.monograph.r.toFixed(precision);
    }
    else {
        state.monograph.r = 0;
        document.getElementById("monograph_stock").innerHTML = '0';
    }
};

function update_volume(n){
    state.volume.r = Math.round(state.volume.r*1000 + n*1000)/1000;
    if(state.volume.r > state.volume.lim) {
        state.volume.r = state.volume.lim;
    }
    if(state.volume.r > 0) {
        document.getElementById("volume_stock").innerHTML = state.volume.r.toFixed(precision);
    }
    else {
        state.volume.r = 0;
        document.getElementById("volume_stock").innerHTML = '0';
    }
};

function update_money(n){
    state.money.r = Math.round(state.money.r*1000 + n*1000)/1000;
//    if(state.money.r > state.money.lim) {
//        state.money.r = state.money.lim;
//    }
    if(state.money.r > 0) {
        document.getElementById("money_stock").innerHTML = state.money.r.toFixed(precision);
    }
    else {
        state.money.r = 0;
        document.getElementById("money_stock").innerHTML = '0';
    }
};


function hide() {
  var e = document.getElementById("myDIV");
  e.classList.add("unhide");
}
