var tick = 125;
var precision = 2;

// RESOURCES
var time = 0.0;
var semester = 0.0;
var anxiety = 0.0;

var word =      {r: 0.0, lim: 100.0, dt: 0.0};
var sent =      {r: 0.0, lim: 20.0, dt: 0.0, cost: 10.0};
var graf =      {r: 0.0, lim: 20.0, dt: 0.0, cost: 10.0};
var draft =     {r: 0.0, lim: 10.0, dt: 0.0, cost: 40.0};
var chapter =   {r: 0.0, lim: 10.0, dt: 0.0, cost: 10000.0};
var diss =      {r: 0.0, lim: 1.0, dt: 0.0, cost: 5.0};
var monograph = {r: 0.0, lim: 1.0, dt: 0.0, cost: 10.0};
var volume =    {r: 0.0, lim: 10.0, dt: 0.0, cost: 10.0};
var outline =   {r: 0.0, lim: 0.0, dt: 0.0, cost: 10.0};
var bed =       {r: 0.0, lim: 0.0, dt: 0.0, cost: 10.0};
var money =     {r: 0.0, lim: 100.0, dt: 0.0, cost: 0.0};



function init() {
    // STOCKS
    document.getElementById("time_stock").innerHTML = time;

    document.getElementById("word_stock").innerHTML = word.r.toFixed(precision);
    document.getElementById("graf_stock").innerHTML = graf.r.toFixed(precision);
    document.getElementById("draft_stock").innerHTML = draft.r.toFixed(precision);
    document.getElementById("chapter_stock").innerHTML = chapter.r.toFixed(precision);
    document.getElementById("dissertation_stock").innerHTML = diss.r.toFixed(precision);
    document.getElementById("monograph_stock").innerHTML = monograph.r.toFixed(precision);
    document.getElementById("volume_stock").innerHTML = volume.r.toFixed(precision);
    document.getElementById("outline_stock").innerHTML = outline.r.toFixed(0);

    // LIMITS
    document.getElementById("word_limit").innerHTML = word.lim;
    document.getElementById("graf_limit").innerHTML = graf.lim;
    document.getElementById("draft_limit").innerHTML = draft.lim;
    document.getElementById("volume_limit").innerHTML = volume.lim;
    document.getElementById("chapter_limit").innerHTML = chapter.lim;
    document.getElementById("dissertation_limit").innerHTML = diss.lim;
    document.getElementById("monograph_limit").innerHTML = monograph.lim;

    // FLOWS
    document.getElementById("word_dt").innerHTML = word.dt.toFixed(precision); // multiply by (1000/tick) for per sec rate
    document.getElementById("graf_dt").innerHTML = graf.dt.toFixed(precision);
    document.getElementById("draft_dt").innerHTML = draft.dt.toFixed(precision);
    document.getElementById("chapter_dt").innerHTML = chapter.dt.toFixed(precision);
    document.getElementById("dissertation_dt").innerHTML = diss.dt.toFixed(precision);
    document.getElementById("monograph_dt").innerHTML = monograph.dt.toFixed(precision);
    document.getElementById("volume_dt").innerHTML = volume.dt.toFixed(precision);

   // COSTS
   document.getElementById("graf_cost").innerHTML = graf.cost.toFixed(precision);
   document.getElementById("draft_cost").innerHTML = draft.cost.toFixed(precision);
   document.getElementById("outline_cost").innerHTML = outline.cost.toFixed(precision);
};

window.setInterval(function(){
    update_time();
    update_word(word.dt);
    update_graf(graf.dt);
    update_draft(draft.dt);
    update_chapter(chapter.dt);
    update_diss(diss.dt);
    update_monograph(monograph.dt);
    update_volume(volume.dt);
    update_costs();
    update_flows();
}, tick*1);

function inc_word(n){ n=1;  word.r = Math.round(word.r*1000 + n*1000)/1000; };

function inc_draft(n){  };
function inc_chapter(n){  };
function inc_diss(n){  };

function update_flows(){
    word.dt =         0.0 + outline.r*0.01;
    graf.dt =         0.0;
    draft.dt =        0.0;
    chapter.dt =      0.0;
    diss.dt =         0.0;
    monograph.dt =    0.0;
    volume.dt =       0.0;

    document.getElementById("word_dt").innerHTML =         word.dt.toFixed(precision);
    document.getElementById("graf_dt").innerHTML =         graf.dt.toFixed(precision);
    document.getElementById("draft_dt").innerHTML =        draft.dt.toFixed(precision);
    document.getElementById("chapter_dt").innerHTML =      chapter.dt.toFixed(precision);
    document.getElementById("dissertation_dt").innerHTML = diss.dt.toFixed(precision);
    document.getElementById("monograph_dt").innerHTML =    monograph.dt.toFixed(precision);
    document.getElementById("volume_dt").innerHTML =       volume.dt.toFixed(precision);
}

function update_costs(){
    document.getElementById("graf_cost").innerHTML =         graf.cost.toFixed(precision);
    document.getElementById("draft_cost").innerHTML =        draft.cost.toFixed(precision);
    document.getElementById("chapter_cost").innerHTML =      chapter.cost.toFixed(precision);
    document.getElementById("dissertation_cost").innerHTML = diss.cost.toFixed(precision);
    document.getElementById("monograph_cost").innerHTML =    monograph.cost.toFixed(precision);
    document.getElementById("outline_cost").innerHTML =      outline.cost.toFixed(precision);
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
    if(word.r >= graf.cost) {
        word.r = word.r - graf.cost;
        graf.r = graf.r + 1;
        graf.cost = 10 + graf.r*1.05;

        document.getElementById("word_stock").innerHTML = word.r.toFixed(precision);
        document.getElementById("graf_stock").innerHTML = graf.r.toFixed(precision);
        document.getElementById("graf_cost").innerHTML = graf.cost.toFixed(precision);
    }
};

function add_outline(){
    if(word.r >= outline.cost) {
        word.r = word.r - outline.cost;
        word.lim = word.lim + 10;
        outline.r = outline.r + 1;
        outline.cost = 10 + outline.r*1.05;

        document.getElementById("word_stock").innerHTML = word.r.toFixed(precision);
        document.getElementById("word_limit").innerHTML = word.lim.toFixed(precision);        document.getElementById("outline_stock").innerHTML = outline.r.toFixed(0);
        document.getElementById("outline_cost").innerHTML = outline.cost.toFixed(precision);
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function update_word(n){
    word.r = Math.round(word.r*1000 + n*1000)/1000;
    if(word.r > word.lim) {
        word.r = word.lim;
    }
    if(word.r > 0) {
        document.getElementById("word_stock").innerHTML = word.r.toFixed(precision);
    }
    else {
        word.r = 0;
        document.getElementById("word_stock").innerHTML = '0';
    }
};

function update_graf(n){
    graf.r = Math.round(graf.r*1000 + n*1000)/1000;
    if(graf.r > graf.lim) {
        graf.r = graf.lim;
    }
    if(graf.r > 0) {
        document.getElementById("graf_stock").innerHTML = graf.r.toFixed(precision);
    }
    else {
        graf.r = 0;
        document.getElementById("graf_stock").innerHTML = '0';
    }
};

function update_draft(n){
    draft.r = Math.round(draft.r*1000 + n*1000)/1000;
    if(draft.r > draft.lim) {
        draft.r = draft.lim;
    }
    if(draft.r > 0) {
        document.getElementById("draft_stock").innerHTML = draft.r.toFixed(precision);
    }
    else {
        draft.r = 0;
        document.getElementById("draft_stock").innerHTML = '0';
    }
};


function update_chapter(n){
    chapter.r = Math.round(chapter.r*1000 + n*1000)/1000;
    if(chapter.r > chapter.lim) {
        chapter.r = chapter.lim;
    }
    if(chapter.r > 0) {
        document.getElementById("chapter_stock").innerHTML = chapter.r.toFixed(precision);
    }
    else {
        chapter.r = 0;
        document.getElementById("chapter_stock").innerHTML = '0';
    }
};

function update_diss(n){
    diss.r = Math.round(diss.r*1000 + n*1000)/1000;
    if(diss.r > diss.lim) {
        diss.r = diss.lim;
    }
    if(diss.r > 0) {
        document.getElementById("dissertation_stock").innerHTML = diss.r.toFixed(precision);
    }
    else {
        diss.r = 0;
        document.getElementById("dissertation_stock").innerHTML = '0';
    }
};


function update_monograph(n){
    monograph.r = Math.round(monograph.r*1000 + n*1000)/1000;
    if(monograph.r > monograph.lim) {
        monograph.r = monograph.lim;
    }
    if(monograph.r > 0) {
        document.getElementById("monograph_stock").innerHTML = monograph.r.toFixed(precision);
    }
    else {
        monograph.r = 0;
        document.getElementById("monograph_stock").innerHTML = '0';
    }
};

function update_volume(n){
    volume.r = Math.round(volume.r*1000 + n*1000)/1000;
    if(volume.r > volume.lim) {
        volume.r = volume.lim;
    }
    if(volume.r > 0) {
        document.getElementById("volume_stock").innerHTML = volume.r.toFixed(precision);
    }
    else {
        volume.r = 0;
        document.getElementById("volume_stock").innerHTML = '0';
    }
};


function hide() {
  var e = document.getElementById("myDIV");
  e.classList.add("unhide");
}
