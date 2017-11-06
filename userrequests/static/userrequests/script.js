$(document).ready(function() {

    paginate("open");

    $('#all').click(function(e){
        call('all', '', 1, true);
        document.getElementById("all").setAttribute("class", "btn btn-default active");
        document.getElementById("user").setAttribute("class", "btn btn-default");
    });
    $('#user').click(function(e){
        call('user', '', 1, true);
        document.getElementById("user").setAttribute("class", "btn btn-default active");
        document.getElementById("all").setAttribute("class", "btn btn-default");
    });
    $('#search').click(function(e){
        var title = document.getElementById('title').value;
        call('search', title, 1, true);
        paginate("open");
    });
    $("#title").keyup(function(event){
        if (event.keyCode === 13){
            $("#search").click();
        }
    });
    $("#opentab").click(function(e){
       paginate("open");
    });
    $("#closedtab").click(function(e){
       paginate("closed");
    });
    $('#next').click(function(e){
        e.preventDefault();
        var sector = $('ul.pagination li.active').next();
        console.log(sector.text());
        sector.removeClass('active').next().addClass('active');
        call('all', '', sector.text());
    });
    $('#prev').click(function(e){
        e.preventDefault();
        var sector = $('li.active').prev();
                console.log(sector.text());

        $('li.active').removeClass('active').prev().addClass('active');
        call('all', '', sector.text());
    });
    $('#paging').on('click', 'a', function(e){
        e.preventDefault();
        var sector = $(this);
        var mode;
        sector.parent().siblings().removeClass('active').end().addClass('active');
        console.log(" click on "+sector.text());
        if ($("#all").hasClass("active")){
            mode = "all";
        }
        else if($("#user").hasClass("active")){
            mode = "user";
        }
        else{
            mode = "search";
        }
        call(mode, '', sector.text(), false);
    });
});

function call(mode, title, sector, call_for_paginate){
    $.ajax({
        url: 'users/',
        datatype: 'json',
        type: 'GET',
        data: {'mode': mode, 'title': title},
        success: function (data) {
            var rows, i;

            var open = data.open;
            var closed = data.closed;
            var sum = data.sum;

            var optable = document.getElementById('otbody');
            var cltable = document.getElementById('ctbody');

            var opdiv = document.getElementById('openn');
            var cldiv = document.getElementById('closedd');

            opdiv.innerHTML = "";
            cldiv.innerHTML = "";

            rows = optable.rows.length;
            if( rows > 0 ){
                for(i=rows-1; i>=0; i--){
                    optable.deleteRow(i);
                }
            }
            rows = cltable.rows.length;
            if( rows > 0 ){
                for(i=rows-1; i>=0; i--){
                    cltable.deleteRow(i);
                }
            }
            //document.getElementById('demo').innerHTML = closed.length;
            if( sum != "0" ){
                sumheader = document.getElementById('ressum');
                if( mode == 'all'){
                    sumheader.innerHTML = '(' + sum + ') Requests';
                    if( closed == "" ){
                        document.getElementById('clheader').innerHTML = 'No Closed Requests!';
                    }
                }
                else if( mode == 'user'){
                    sumheader.innerHTML = 'You Have (' + sum + ') Requests';
                    if( closed == "" ){
                        document.getElementById('clheader').innerHTML = 'No Request Has Been Answered Yet!';
                    }
                }
                else if( mode == 'search' ){
                    sumheader.innerHTML = '(' + sum + ') Results';
                }
                else{
                    return 1;
                }

                if( open != "" ){
                    document.getElementById('spo').textContent = open.length;
                    document.getElementById('spoo').textContent = open.length;
                    console.log("POOCHES 1");
                    populate(optable, open);
                    populate2(opdiv, open, sector, 10);
                }
                else{
                    document.getElementById('spo').textContent = "0";
                    document.getElementById('spoo').textContent = "0";
                    console.log("POOCHES 2");
                }
                if( closed != "" ){
                    document.getElementById('spc').textContent = closed.length;
                    document.getElementById('spcc').textContent = closed.length;
                    console.log("POOCHES 3");
                    populate(cltable, closed);
                    populate2(cldiv, closed, sector, 10);
                }
                else{
                    document.getElementById('spc').textContent = "0";
                    document.getElementById('spcc').textContent = "0";
                    console.log("POOCHES 4");
                }
            }
            else{
                sumheader = document.getElementById('ressum').innerHTML = "No Requests Were Found - Please Try Again";
                document.getElementById('spo').textContent = "0";
                document.getElementById('spc').textContent = "0";
                document.getElementById('spoo').textContent = "0";
                document.getElementById('spcc').textContent = "0";
                document.getElementById('allheader').innerHTML = 'No Requests Are Created Yet!';
            }
            console.log("PAGINATE " + call_for_paginate);
            if( call_for_paginate == true ){
                paginate("open");
            }
        },
        error: function () {
            document.getElementById('demo').innerHTML = 'Something isnt right!';
        }
    });
}

function populate2(div, data, sector, perpage){
    sector = parseInt(sector);
    var ranged = (sector-1)*perpage;
    var rangeu = sector*perpage;
    for( var index in data ){                   // pagination error here when all_requests -> user
        if( index >= ranged && index < rangeu ){
            var entry = data[index];
            var datadiv, a, p , img, attr, text, span;
            var entrydiv = document.createElement('div');
            entrydiv.setAttribute("class", "entry");
            div.appendChild(entrydiv);
            // first data
            datadiv = document.createElement('div');
            datadiv.setAttribute("class", "secondary");
            a = document.createElement('a');
            a.setAttribute("href", entry.id + "/");
            img = document.createElement('img');
            img.setAttribute("src", entry.file);
            img.setAttribute("width","100px");
            img.setAttribute("height","100px");
            img.setAttribute("alt","No Image Has Been Uploaded");
            img.setAttribute("style","color: brown; float: left; margin-right: 40px;");
            a.appendChild(img);
            datadiv.appendChild(a);
            entrydiv.appendChild(datadiv);
            // second td
            datadiv = document.createElement('div');
            datadiv.setAttribute("class","primary");
            a = document.createElement('a');
            a.setAttribute("href", entry.id + "/");
            attr = document.createElement("h4");
            text = document.createTextNode(entry.title);
            attr.appendChild(text);
            attr.setAttribute("class", "text-left");
            a.appendChild(attr);
            datadiv.appendChild(a);
            attr = document.createElement("hr");
            datadiv.appendChild(attr);
            p = document.createElement('p');
            span = document.createElement('span');
            span.setAttribute("class", "btn-info");
            text = document.createTextNode(entry.keywords);
            span.appendChild(text);
            text = document.createTextNode("keywords: ");
            p.appendChild(text);
            p.appendChild(span);
            p.setAttribute("class", "text-left");
            datadiv.appendChild(p);
            entrydiv.appendChild(datadiv);
            // third td
            datadiv = document.createElement('div');
            datadiv.setAttribute("class","secondary");
            p = document.createElement('p');
            text = document.createTextNode("Posted By: " + entry.user);
            p.appendChild(text);
            datadiv.appendChild(p);
            p = document.createElement('p');
            text = document.createTextNode("On: " + entry.deadline);
            p.appendChild(text);
            datadiv.appendChild(p);
            entrydiv.appendChild(datadiv);
            // fourth td
            datadiv = document.createElement('td');
            datadiv.setAttribute("class","secondary");
            p = document.createElement('p');
            text = document.createTextNode(entry.views + " views");
            p.appendChild(text);
            datadiv.appendChild(p);
            p = document.createElement('p');
            text = document.createTextNode(entry.downloads + " downloads");
            p.appendChild(text);
            datadiv.appendChild(p);
            entrydiv.appendChild(datadiv);
        }
    }
}

function populate(table, data){
    for( var index in data ){
        var entry = data[index];
        var td, a, p, text, span, attr;
        var tr = document.createElement('tr');
        table.appendChild(tr);
        // first td
        td = document.createElement('td');
        td.setAttribute("class","secondary");
        a = document.createElement('a');
        a.setAttribute("href", entry.id + "/");
        var image = document.createElement('img');
        image.setAttribute("src", entry.file);
        image.setAttribute("width","100px");
        image.setAttribute("height","100px");
        image.setAttribute("alt","No Image Has Been Uploaded");
        image.setAttribute("style","color: brown; float: left; margin-right: 40px;");
        a.appendChild(image);
        td.appendChild(a);
        tr.appendChild(td);
        // second td
        td = document.createElement('td');
        td.setAttribute("class","primary");
        a = document.createElement('a');
        a.setAttribute("href", entry.id + "/");
        attr = document.createElement("h4");
        text = document.createTextNode(entry.title);
        attr.appendChild(text);
        attr.setAttribute("class", "text-left");
        a.appendChild(attr);
        td.appendChild(a);
        attr = document.createElement("hr");
        td.appendChild(attr);
        p = document.createElement('p');
        span = document.createElement('span');
        span.setAttribute("class", "btn-info");
        text = document.createTextNode(entry.keywords);
        span.appendChild(text);
        text = document.createTextNode("keywords: ");
        p.appendChild(text);
        p.appendChild(span);
        p.setAttribute("class", "text-left");
        td.appendChild(p);
        tr.appendChild(td);
        // third td
        td = document.createElement('td');
        td.setAttribute("class","secondary");
        p = document.createElement('p');
        text = document.createTextNode("Posted By: " + entry.user);
        p.appendChild(text);
        td.appendChild(p);
        p = document.createElement('p');
        text = document.createTextNode("On: " + entry.deadline);
        p.appendChild(text);
        td.appendChild(p);
        tr.appendChild(td);
        // fourth td
        td = document.createElement('td');
        td.setAttribute("class","secondary");
        p = document.createElement('p');
        text = document.createTextNode(entry.views + " views");
        p.appendChild(text);
        td.appendChild(p);
        p = document.createElement('p');
        text = document.createTextNode(entry.downloads + " downloads");
        p.appendChild(text);
        td.appendChild(p);
        tr.appendChild(td);
    }
}

function paginate(mode){
    if( mode == "open" ){
        var sum = document.getElementById("spoo").innerHTML;
    }
    else{
        var sum = document.getElementById("spcc").innerHTML;
    }
    sum = parseInt(sum);
    var paging = document.getElementById("upaging");
    var range = sum/10;
    var li, a, text;

    paging.innerHTML = "";
    paging.setAttribute("class", "pagination");

    li = document.createElement("li");
    li.setAttribute("id","prev");
    a = document.createElement("a");
    a.innerHTML = "&laquo;";
    a.setAttribute("href", "#");
    li.appendChild(a);
    paging.appendChild(li);

    console.log(" Sum " + sum );

    for(var i=0; i<=range; i++){
        li = document.createElement("li");
        if(i == 0){
            li.setAttribute("class","active");
        }
        a = document.createElement("a");
        a.innerHTML = i+1;
        a.setAttribute("href", "#");
        li.appendChild(a);
        paging.appendChild(li);
    }

    li = document.createElement("li");
    li.setAttribute("id","next");
    a = document.createElement("a");
    a.innerHTML = "&raquo;";
    a.setAttribute("href", "#");
    li.appendChild(a);
    paging.appendChild(li);
}