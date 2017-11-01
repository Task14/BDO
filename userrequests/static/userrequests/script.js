$(document).ready(function() {
    $('#all').click(function(e){
        call('all', '');
        document.getElementById("all").setAttribute("class", "btn btn-default active");
        document.getElementById("user").setAttribute("class", "btn btn-default");
    });
    $('#user').click(function(e){
        call('user', '');
        document.getElementById("user").setAttribute("class", "btn btn-default active");
        document.getElementById("all").setAttribute("class", "btn btn-default");
    });
    $('#search').click(function(e){
        var title = document.getElementById('title').value;
        call('search', title);
    });
    $("#title").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#search").click();
        }
    });
    $("#reqmenu").click(function(e){
       var span = document.getElementById("ddmenu");
       var spclass = span.getAttribute("class");
       if( spclass === "glyphicon glyphicon-chevron-right" ){
           span.setAttribute("class","glyphicon glyphicon-chevron-down");
       }
       else{
           span.setAttribute("class","glyphicon glyphicon-chevron-right");
       }
    });

});

function call(mode, title){
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
                    populate(optable, open);
                }
                else{
                    document.getElementById('spo').textContent = "0";
                }
                if( closed != "" ){
                    document.getElementById('spc').textContent = closed.length;
                    populate(cltable, closed);
                }
                else{
                    document.getElementById('spc').textContent = "0";
                }
            }
            else{
                sumheader = document.getElementById('ressum').innerHTML = "No Requests Were Found - Please Try Again";
                document.getElementById('spo').textContent = "0";
                document.getElementById('spc').textContent = "0";
                document.getElementById('allheader').innerHTML = 'No Requests Are Created Yet!';
            }
        },
        error: function () {
            document.getElementById('demo').innerHTML = 'Something isnt right!';
        }
    });
}

function populate(table, data){
    var res = "";
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