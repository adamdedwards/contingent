var tick = 125;
var precision = 2;

// RESOURCES
var time = 0.0;
var semester = 0.0;
var anxiety = 0.0;

var state = {
night :     false,
word :      {r: 0.0, lim: 100.0, dt: 0.0, tot: 0.0},
sent :      {r: 0.0, lim: 40.0, dt: 0.0, tot: 0.0, cost: 10.0, viz: false},
graf :      {r: 0.0, lim: 40.0, dt: 0.0, tot: 0.0, cost: 10.0, viz: false},
draft :     {r: 0.0, lim: 10.0, dt: 0.0, tot: 0.0, cost: {g:10.0,t:1}, viz: false},
chapter :   {r: 0.0, lim: 10.0, dt: 0.0, tot: 0.0, cost: 10.0, viz: false},
diss :      {r: 0.0, lim: 1.0, dt: 0.0, tot: 0.0, cost: 8.0, viz: false},
monograph : {r: 0.0, lim: 1.0, dt: 0.0, tot: 0.0, cost: 40000.0, viz: false},
volume :    {r: 0.0, lim: 10.0, dt: 0.0, tot: 0.0, cost: 160000.0, viz: false},
article :   {r: 0.0, lim: 0.0, dt: 0.0, tot: 0.0, cost: 5.0, viz: false},
book :      {r: 0.0, lim: 0.0, dt: 0.0, tot: 0.0, cost: 100.0, viz: false},
anth :      {r: 0.0, lim: 0.0, dt: 0.0, tot: 0.0, cost: 1000.0, viz: false},
outline :   {r: 0.0, lim: 0.0, dt: 0.0, tot: 0.0, cost: 10.0, viz: false},
seminar :   {r: 0.0, lim: 0.0, dt: 0.0, tot: 0.0, cost: 200.0, viz: false},
thought :   {r: 0.0, lim: 100.0, dt: 0.001, viz: false},
anxiety :   {r: 0.0, lim: 100.0, dt: 0.00025, viz: false},
money :     {r: 1000.0, lim: 100000.0, dt: -0.0225, cost: 0.0, viz: false},
tech :      {sharp: false, sharpcost: 10, process: false, processcost: 100},
punct :     {period: {p:false, cost:100}, comma: {p:false, cost:500}, single_quote: {p:false, cost:1000},
             en_dash: {p:false, cost:5000}, semicolon: {p:false, cost:10000}, colon: {p:false, cost:50000},
             double_quote: {p:false, cost:100000}, ellipsis: {p:false, cost:500000}, em_dash: {p:false, cost:1000000}, scare_quote: {p:false, cost:5000000}, guillemets: {p:false, cost:10000000}, block_quote: {p:false, cost:50000000}, weird_s: {p:false, cost:100000000}}
};

function save() {
  localStorage.setItem('time', JSON.stringify(time));
  localStorage.setItem('state', JSON.stringify(state));
  document.getElementById("alert").insertAdjacentHTML('afterbegin', "<p>Game saved!</p>");
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
    if(state.night) {darkmode();}
    // STOCKS
    document.getElementById("time_stock").innerHTML = time;

    document.getElementById("word_stock").innerHTML =         state.word.r.toFixed(precision);
    document.getElementById("sent_stock").innerHTML =         state.sent.r.toFixed(precision);
    document.getElementById("graf_stock").innerHTML =         state.graf.r.toFixed(precision);
    document.getElementById("draft_stock").innerHTML =        state.draft.r.toFixed(precision);
    document.getElementById("chapter_stock").innerHTML =      state.chapter.r.toFixed(precision);
    document.getElementById("dissertation_stock").innerHTML = state.diss.r.toFixed(precision);
    document.getElementById("monograph_stock").innerHTML =    state.monograph.r.toFixed(precision);
    document.getElementById("volume_stock").innerHTML =       state.volume.r.toFixed(precision);
    document.getElementById("thought_stock").innerHTML =      state.thought.r.toFixed(precision);

    document.getElementById("money_stock").innerHTML =        state.money.r.toFixed(precision);

    document.getElementById("seminar_stock").innerHTML =      state.seminar.r.toFixed(0);
    document.getElementById("outline_stock").innerHTML =      state.outline.r.toFixed(0);
    document.getElementById("article_stock").innerHTML =      state.article.r.toFixed(0);
    document.getElementById("book_stock").innerHTML =         state.book.r.toFixed(0);
    document.getElementById("anth_stock").innerHTML =         state.anth.r.toFixed(0);

    // LIMITS
    document.getElementById("word_limit").innerHTML =         state.word.lim;
    document.getElementById("sent_limit").innerHTML =         state.sent.lim;
    document.getElementById("graf_limit").innerHTML =         state.graf.lim;
    document.getElementById("draft_limit").innerHTML =        state.draft.lim;
    document.getElementById("volume_limit").innerHTML =       state.volume.lim;
    document.getElementById("chapter_limit").innerHTML =      state.chapter.lim;
    document.getElementById("dissertation_limit").innerHTML = state.diss.lim;
    document.getElementById("monograph_limit").innerHTML =    state.monograph.lim;
    document.getElementById("thought_limit").innerHTML =      state.thought.lim;
};

window.setInterval(function(){
    update_time();
    update_word(state.word.dt);
    update_sent(state.sent.dt);
    update_graf(state.graf.dt);
    update_draft(state.draft.dt);
    update_chapter(state.chapter.dt);
    update_diss(state.diss.dt);
    update_monograph(state.monograph.dt);
    update_volume(state.volume.dt);
    update_money(state.money.dt);
    update_thought(state.thought.dt);

    update_flows();
    update_costs();
    update_viz();
}, tick*1);

function update_flows(){
    if(state.money.r > 0.0 && state.anxiety.r < 8.0) {
        state.word.dt =         0.0 + state.outline.r*0.00625 + Number(state.tech.sharp)*0.25 + Number(state.tech.process)*1.0;
        state.sent.dt =         0.0;
        state.graf.dt =         0.0;
        state.draft.dt =        0.0;
        state.chapter.dt =      0.0;
        state.diss.dt =         0.0;
        state.monograph.dt =    0.0;
        state.volume.dt =       0.0;
    }
    else {
        state.word.dt =         0.0;
        state.sent.dt =         0.0;
        state.graf.dt =         0.0;
        state.draft.dt =        0.0;
        state.chapter.dt =      0.0;
        state.diss.dt =         0.0;
        state.monograph.dt =    0.0;
        state.volume.dt =       0.0;
    }

    document.getElementById("word_dt").innerHTML =         (state.word.dt*8).toFixed(precision);
    document.getElementById("sent_dt").innerHTML =         state.sent.dt.toFixed(precision);
    document.getElementById("graf_dt").innerHTML =         state.graf.dt.toFixed(precision);
    document.getElementById("draft_dt").innerHTML =        state.draft.dt.toFixed(precision);
    document.getElementById("chapter_dt").innerHTML =      state.chapter.dt.toFixed(precision);
    document.getElementById("dissertation_dt").innerHTML = state.diss.dt.toFixed(precision);
    document.getElementById("monograph_dt").innerHTML =    state.monograph.dt.toFixed(precision);
    document.getElementById("volume_dt").innerHTML =       state.volume.dt.toFixed(precision);
    document.getElementById("money_dt").innerHTML =        state.money.dt.toFixed(precision);
    document.getElementById("thought_dt").innerHTML =      state.thought.dt.toFixed(precision);
}

function update_costs(){
    document.getElementById("sent_cost").innerHTML =            state.sent.cost.toFixed(precision);
    document.getElementById("graf_cost").innerHTML =            state.graf.cost.toFixed(precision);
    document.getElementById("draft_cost_g").innerHTML =         state.draft.cost.g.toFixed(precision);
    document.getElementById("draft_cost_t").innerHTML =         state.draft.cost.t.toFixed(precision);
    document.getElementById("chapter_cost").innerHTML =         state.chapter.cost.toFixed(precision);
    document.getElementById("dissertation_cost").innerHTML =    state.diss.cost.toFixed(precision);
    document.getElementById("monograph_cost").innerHTML =       state.monograph.cost.toFixed(precision);
    document.getElementById("article_cost").innerHTML =         state.article.cost.toFixed(precision);
    document.getElementById("book_cost").innerHTML =            state.book.cost.toFixed(precision);
    document.getElementById("anth_cost").innerHTML =            state.anth.cost.toFixed(precision);
    document.getElementById("outline_cost").innerHTML =         state.outline.cost.toFixed(precision);
    document.getElementById("seminar_cost").innerHTML =         state.seminar.cost.toFixed(precision);
    document.getElementById("sharper_pencils_cost").innerHTML = state.tech.sharpcost.toFixed(precision);
    document.getElementById("word_processor_cost").innerHTML =  state.tech.processcost.toFixed(precision);

    document.getElementById("period_cost").innerHTML =        state.punct.period.cost.toFixed(precision);
    document.getElementById("comma_cost").innerHTML =         state.punct.comma.cost.toFixed(precision);
    document.getElementById("single_quote_cost").innerHTML =  state.punct.single_quote.cost.toFixed(precision);
    document.getElementById("en_dash_cost").innerHTML =       state.punct.en_dash.cost.toFixed(precision);
}

function update_time(){
    time = time + 1;
    semester = (time/40000).toFixed(0);
    document.getElementById("time_stock").innerHTML = (time/8).toFixed(0);
    document.getElementById("year_stock").innerHTML = (Math.floor(time/80000) +1).toFixed(0);

    if((semester % 2) == 0) {document.getElementById("semester").innerHTML = "fall";}
    else if((semester % 2) == 1) {document.getElementById("semester").innerHTML = "spring";}

    if(time == 1)      {document.getElementById("alert").insertAdjacentHTML('afterbegin', "<p>You have 5 years of funding.</p>");}
    if(time == 80001)  {document.getElementById("alert").insertAdjacentHTML('afterbegin', "<p>You have 4 years of funding.</p>");}
    if(time == 160001) {document.getElementById("alert").insertAdjacentHTML('afterbegin', "<p>You have 3 years of funding.</p>");}
    if(time == 240001) {document.getElementById("alert").insertAdjacentHTML('afterbegin', "<p>You have 2 years of funding.</p>");}
    if(time == 320001) {document.getElementById("alert").insertAdjacentHTML('afterbegin', "<p>You have 1 years of funding.</p>");}
    if((time % 800) == 0) {save();}
}

function update_viz(){
if(state.word.tot > 10.0) {document.getElementById("research").classList.toggle("hidden",false);}
if(state.sent.tot >= 1.0) {document.getElementById("upgrades").classList.toggle("hidden",false);}
if(state.tech.sharp){document.getElementById("sharper_pencils").classList.add("hidden");}
if(state.tech.process){document.getElementById("word_processor").classList.add("hidden");}
if(state.sent.viz){document.getElementById("sent_label").classList.toggle("hidden",false);
    document.getElementById("sent").classList.toggle("hidden",false);
    document.getElementById("sent_disp").classList.toggle("hidden",false);
    document.getElementById("sent_rate").classList.toggle("hidden",false);}
if(state.graf.viz){document.getElementById("graf_label").classList.toggle("hidden",false);
    document.getElementById("graf").classList.toggle("hidden",false);
    document.getElementById("graf_disp").classList.toggle("hidden",false);
    document.getElementById("graf_rate").classList.toggle("hidden",false);}
if(state.draft.viz){document.getElementById("draft_label").classList.toggle("hidden",false);
    document.getElementById("draft").classList.toggle("hidden",false);
    document.getElementById("draft_disp").classList.toggle("hidden",false);
    document.getElementById("draft_rate").classList.toggle("hidden",false);}
if(state.chapter.viz){document.getElementById("chapter_label").classList.toggle("hidden",false);
    document.getElementById("chapter").classList.toggle("hidden",false);
    document.getElementById("chapter_disp").classList.toggle("hidden",false);
    document.getElementById("chapter_rate").classList.toggle("hidden",false);}
if(state.diss.viz){document.getElementById("dissertation_label").classList.toggle("hidden",false);
    document.getElementById("dissertation").classList.toggle("hidden",false);
    document.getElementById("dissertation_disp").classList.toggle("hidden",false);
    document.getElementById("dissertation_rate").classList.toggle("hidden",false);}
if(state.sent.r >= 1.0) {document.getElementById("period").classList.toggle("hidden",false);}
if(state.punct.period.p) {document.getElementById("period").classList.add("hidden");
document.getElementById("comma").classList.toggle("hidden",false);}
if(state.punct.comma.p) {document.getElementById("comma").classList.add("hidden");
document.getElementById("single_quote").classList.toggle("hidden",false);}
if(state.punct.single_quote.p) {document.getElementById("single_quote").classList.add("hidden");
document.getElementById("en_dash").classList.toggle("hidden",false);}
if(state.punct.en_dash.p) {document.getElementById("en_dash").classList.add("hidden");
document.getElementById("semicolon").classList.toggle("hidden",false);}
if(state.punct.semicolon.p) {document.getElementById("semicolon").classList.add("hidden");
document.getElementById("colon").classList.toggle("hidden",false);}
if(state.punct.colon.p) {document.getElementById("colon").classList.add("hidden");
document.getElementById("double_quote").classList.toggle("hidden",false);}
if(state.punct.double_quote.p) {document.getElementById("double_quote").classList.add("hidden");
document.getElementById("ellipsis").classList.toggle("hidden",false);}
if(state.punct.ellipsis.p) {document.getElementById("ellipsis").classList.add("hidden");
document.getElementById("em_dash").classList.toggle("hidden",false);}
if(state.punct.em_dash.p) {document.getElementById("em_dash").classList.add("hidden");
document.getElementById("scare_quote").classList.toggle("hidden",false);}
if(state.punct.scare_quote.p) {document.getElementById("scare_quote").classList.add("hidden");
document.getElementById("guillemets").classList.toggle("hidden",false);}
if(state.punct.guillemets.p) {document.getElementById("guillemets").classList.add("hidden");
document.getElementById("block_quote").classList.toggle("hidden",false);}
if(state.punct.block_quote.p) {document.getElementById("block_quote").classList.add("hidden");
document.getElementById("weird_s").classList.toggle("hidden",false);}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function inc_word(n){ n=1;  state.word.r = state.word.r + n;  state.word.tot = state.word.tot + n; };

function inc_sent(n){
    n = 1;
    if(state.sent.lim > state.sent.r && state.word.r >= state.sent.cost) {
        state.word.r = state.word.r - state.sent.cost;
        state.sent.r = state.sent.r + n;
        state.sent.tot = state.sent.tot + n;
        state.sent.cost = ((10 + state.sent.tot*0.85)*1.002 + state.sent.cost*0.0002)*(1.0-(Number(state.punct.period.p)*0.1));

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("sent_stock").innerHTML = state.sent.r.toFixed(precision);
        document.getElementById("sent_cost").innerHTML = state.sent.cost.toFixed(precision);
    }
};


function inc_graf(){
    if(state.graf.lim > state.graf.r && state.sent.r >= state.graf.cost) {
        state.sent.r = state.sent.r - state.graf.cost;
        state.graf.r = state.graf.r + 1;
        state.graf.tot = state.graf.tot + 1;
        state.graf.cost = 10 + state.graf.tot*1.01;

        document.getElementById("sent_stock").innerHTML = state.sent.r.toFixed(precision);
        document.getElementById("graf_stock").innerHTML = state.graf.r.toFixed(precision);
        document.getElementById("graf_cost").innerHTML = state.graf.cost.toFixed(precision);
    }
};

function inc_draft(n){
    if(state.draft.lim > state.draft.r && state.graf.r >= state.draft.cost.g && state.thought.r >= state.draft.cost.t) {
        state.graf.r = state.graf.r - state.draft.cost.g;
        state.thought.r = state.thought.r - state.draft.cost.t;
        state.draft.r = state.draft.r + 1;
        state.draft.tot = state.draft.tot + 1;
        state.draft.cost.g = 40 + state.draft.tot*1.02;
        state.draft.cost.t = 1 + state.draft.tot;

        document.getElementById("graf_stock").innerHTML = state.graf.r.toFixed(precision);
        document.getElementById("draft_stock").innerHTML = state.draft.r.toFixed(precision);
        document.getElementById("draft_cost_g").innerHTML = state.draft.cost.g.toFixed(precision);
        document.getElementById("draft_cost_t").innerHTML = state.draft.cost.t.toFixed(precision);
    }
};

function inc_chapter(n){
    if(state.chapter.lim > state.chapter.r && state.draft.r >= state.chapter.cost) {
        state.draft.r = state.draft.r - state.chapter.cost;
        state.chapter.r = state.chapter.r + 1;
        state.chapter.tot = state.chapter.tot + 1;
        state.chapter.cost = 10 + state.chapter.tot*1.02;

        document.getElementById("draft_stock").innerHTML = state.draft.r.toFixed(precision);
        document.getElementById("chapter_stock").innerHTML = state.chapter.r.toFixed(precision);
        document.getElementById("chapter_cost").innerHTML = state.chapter.cost.toFixed(precision);
    }
};

function inc_dissertation(n){
    if(state.diss.lim > state.diss.r && state.chapter.r >= state.diss.cost) {
        state.chapter.r = state.chapter.r - state.diss.cost;
        state.diss.r = state.diss.r + 1;
        state.diss.tot = state.diss.tot + 1;
        state.diss.cost = 8 + state.diss.tot*1.02;

        document.getElementById("chapter_stock").innerHTML = state.chapter.r.toFixed(precision);
        document.getElementById("diss_stock").innerHTML = state.diss.r.toFixed(precision);
        document.getElementById("diss_cost").innerHTML = state.diss.cost.toFixed(precision);
    }
};

function add_outline(){
    if(state.word.r >= state.outline.cost) {
        state.outline.r++;
        state.word.r = state.word.r - state.outline.cost;
        state.word.lim = state.word.lim + 10;
        state.outline.cost = state.outline.cost + state.outline.r*1.05;

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("word_limit").innerHTML = state.word.lim.toFixed(precision);        document.getElementById("outline_stock").innerHTML = state.outline.r.toFixed(0);
        document.getElementById("outline_cost").innerHTML = state.outline.cost.toFixed(precision);
    }
};

function add_article(){
        if(state.word.r >= state.article.cost) {
        state.article.r++;
        state.word.r = state.word.r - state.article.cost;
        state.word.lim = state.word.lim + 25;
        state.article.cost = (state.article.cost + state.article.r)*1.05;

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("word_limit").innerHTML = state.word.lim.toFixed(precision);        document.getElementById("article_stock").innerHTML = state.article.r.toFixed(0);
        document.getElementById("article_cost").innerHTML = state.article.cost.toFixed(precision);
    }
};

function add_book(){
        if(state.word.r >= state.book.cost) {
        state.book.r++;
        state.word.r = state.word.r - state.book.cost;
        state.word.lim = state.word.lim + 100;
        state.book.cost = (state.book.cost + state.book.r)*1.1;

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("word_limit").innerHTML = state.word.lim.toFixed(precision);        document.getElementById("book_stock").innerHTML = state.book.r.toFixed(0);
        document.getElementById("book_cost").innerHTML = state.book.cost.toFixed(precision);
    }
};

function add_anth(){
        if(state.word.r >= state.anth.cost) {
        state.anth.r++;
        state.word.r = state.word.r - state.anth.cost;
        state.word.lim = state.word.lim + 500;
        state.anth.cost = (state.anth.cost + state.anth.r)*1.1;

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("word_limit").innerHTML = state.word.lim.toFixed(precision);        document.getElementById("anth_stock").innerHTML = state.anth.r.toFixed(0);
        document.getElementById("anth_cost").innerHTML = state.anth.cost.toFixed(precision);
    }
};

function add_seminar(){
        if(state.word.r >= state.seminar.cost) {
        state.seminar.r++;
        state.word.r = state.word.r - state.seminar.cost;
        state.thought.lim = state.thought.lim + 5;
        state.seminar.cost = (state.seminar.cost + state.seminar.r)*1.05;

        document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);
        document.getElementById("thought_limit").innerHTML = state.thought.lim.toFixed(precision);        document.getElementById("seminar_stock").innerHTML = state.seminar.r.toFixed(0);
        document.getElementById("seminar_cost").innerHTML = state.seminar.cost.toFixed(precision);
    }
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function update_word(n){
    state.word.r = state.word.r + n;
    state.word.tot = state.word.tot + n;
    if(state.word.r > state.word.lim) {state.word.r = state.word.lim;}
    if(state.word.r > 0) {document.getElementById("word_stock").innerHTML = state.word.r.toFixed(precision);}
    else {state.word.r = 0; document.getElementById("word_stock").innerHTML = '0';}
};

function update_sent(n){
    state.sent.r = state.sent.r + n;
    state.sent.tot = state.sent.tot + n;
    if(state.sent.r > state.sent.lim) {state.sent.r = state.sent.lim;}
    if(state.sent.r > 0) {document.getElementById("sent_stock").innerHTML = state.sent.r.toFixed(precision);}
    else {state.sent.r = 0; document.getElementById("sent_stock").innerHTML = '0';}
    if(state.word.r >= 10.0) {state.sent.viz = true;}
};

function update_graf(n){
    state.graf.r = state.graf.r + n;
    state.graf.tot = state.graf.tot + n;
    if(state.graf.r > state.graf.lim) {state.graf.r = state.graf.lim;}
    if(state.graf.r > 0) {document.getElementById("graf_stock").innerHTML = state.graf.r.toFixed(precision);}
    else {state.graf.r = 0; document.getElementById("graf_stock").innerHTML = '0';}
    if(state.sent.r >= 10.0) {state.graf.viz = true;}
};

function update_draft(n){
    state.draft.r = state.draft.r + n;
    state.draft.tot = state.draft.tot + n;
    if(state.draft.r > state.draft.lim) {state.draft.r = state.draft.lim;}
    if(state.draft.r > 0) {document.getElementById("draft_stock").innerHTML = state.draft.r.toFixed(precision);}
    else {state.draft.r = 0; document.getElementById("draft_stock").innerHTML = '0';}
    if(state.graf.r >= 10.0) {state.draft.viz = true;}
};

function update_chapter(n){
    state.chapter.r = state.chapter.r + n;
    state.chapter.tot = state.chapter.tot + n;
    if(state.chapter.r > state.chapter.lim) {state.chapter.r = state.chapter.lim;}
    if(state.chapter.r > 0) {document.getElementById("chapter_stock").innerHTML = state.chapter.r.toFixed(precision);}
    else {state.chapter.r = 0; document.getElementById("chapter_stock").innerHTML = '0';}
    if(state.draft.r >= 2.0) {state.chapter.viz = true;}
};

function update_diss(n){
    state.diss.r = state.diss.r + n;
    state.diss.tot = state.diss.tot + n;
    if(state.diss.r > state.diss.lim) {state.diss.r = state.diss.lim;}
    if(state.diss.r > 0) {document.getElementById("dissertation_stock").innerHTML = state.diss.r.toFixed(precision);}
    else {state.diss.r = 0; document.getElementById("dissertation_stock").innerHTML = '0';}
    if(state.chapter.r >= 2.0) {state.diss.viz = true;}
};

function update_monograph(n){
    state.monograph.r = state.monograph.r + n;
    if(state.monograph.r > state.monograph.lim) {state.monograph.r = state.monograph.lim;}
    if(state.monograph.r > 0) {document.getElementById("monograph_stock").innerHTML = state.monograph.r.toFixed(precision);}
    else {state.monograph.r = 0; document.getElementById("monograph_stock").innerHTML = '0';}
};

function update_volume(n){
    state.volume.r = state.volume.r + n;
    if(state.volume.r > state.volume.lim) {state.volume.r = state.volume.lim;}
    if(state.volume.r > 0) {document.getElementById("volume_stock").innerHTML = state.volume.r.toFixed(precision);}
    else {state.volume.r = 0; document.getElementById("volume_stock").innerHTML = '0';}
};

function update_money(n){
    state.money.r = state.money.r + n;
    if(state.money.r > state.money.lim) {state.money.r = state.money.lim;}
    if(state.money.r > 0) {document.getElementById("money_stock").innerHTML = state.money.r.toFixed(precision);}
    else {state.money.r = 0; document.getElementById("money_stock").innerHTML = '0';}
};


function update_thought(n){
    state.thought.r = state.thought.r + n;
    if(state.thought.r > state.thought.lim) {state.thought.r = state.thought.lim;}
    if(state.thought.r > 0) {document.getElementById("thought_stock").innerHTML = state.thought.r.toFixed(precision);}
    else {state.thought.r = 0; document.getElementById("thought_stock").innerHTML = '0';}
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function sharper_pencils() {
    if(state.word.r >= state.tech.sharpcost) {
    state.word.r = state.word.r - state.tech.sharpcost;
    state.tech.sharp = true;}
}

function word_processor() {
    if(state.word.r >= state.tech.processcost) {
    state.word.r = state.word.r - state.tech.processcost;
    state.tech.process = true;}
}

function period() {
    if(state.word.r >= state.punct.period.cost) {
    state.word.r = state.word.r - state.punct.period.cost;
    state.punct.period.p = true;}
}

function comma() {
    if(state.word.r >= state.punct.comma.cost) {
    state.word.r = state.word.r - state.punct.comma.cost;
    state.punct.comma.p = true;}
}

function single_quote() {
    if(state.word.r >= state.punct.single_quote.cost) {
    state.word.r = state.word.r - state.punct.single_quote.cost;
    state.punct.single_quote.p = true;}
}

function en_dash() {
    if(state.word.r >= state.punct.en_dash.cost) {
    state.word.r = state.word.r - state.punct.en_dash.cost;
    state.punct.en_dash.p = true;}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function darkmode() {
    state.night = !state.night;
  $('.darkmode').toggleClass('darkmode-active');
};
