var setbj = []; // Global array for route
var app = (function(){
	
	var hnd = {} // DOM handle object
	var routing = false; // first rounting check
	
	this.run = function(callback){ // Application Run function
		validation();
		callback(model(),route);
		bind();
		format();
	};
	
	this.model = function(){ // Model function (view<->controller<->model)
		var all = document.getElementsByTagName("*");
		var i;
		var s, h;
		var vl, cl;
		for(var i=0, max=all.length; i < max; i++)
		{
			if (all[i].hasAttribute('app-in'))
			{
				s = all[i].getAttribute('app-in');
				vl = new value('app-in',all[i].getAttribute('app-in'));
				hnd[s] = vl;
				//all[i].setAttribute('oninput', 'window.onload()');
				if(navigator.userAgent.indexOf("Firefox") != -1 )
				{
					all[i].setAttribute('oninput', 'window.onload()');
				}
				else
				{
					all[i].addEventListener('input',bind);
				}
			}
			else if(all[i].hasAttribute('app-out'))
			{
				s = all[i].getAttribute('app-out');
				vl = new value('app-out',all[i].getAttribute('app-out'));
				hnd[s] = vl;
			}
			else if(all[i].hasAttribute('app-click'))
			{
				s = all[i].getAttribute('app-click');
				cl = new on(s);
				hnd[s] = cl;
			}
			else if(all[i].hasAttribute('app-img'))
			{
				s = all[i].getAttribute('app-img');
				vl = new value('app-img',all[i].getAttribute('app-img'));
				hnd[s] = vl;
			}
		}
		return hnd;		
	};
	
	this.bind = function(){ // Data-bind DOM function (view<->model)
		var all = document.getElementsByTagName("*");
		var i,j;
		var getmodel = '';
		
		for(var i=0, max=all.length; i < max; i++)
		{
			if (all[i].hasAttribute('app-in'))
			{
				getmodel = all[i].getAttribute('app-in');
				if(navigator.userAgent.indexOf("Firefox") != -1 )
				{
					all[i].setAttribute('oninput', 'window.onload()');
				}
				else
				{
					all[i].addEventListener('input',bind);
				}
				for(var j=0, max=all.length; j < max; j++)
				{
					if (all[j].hasAttribute('app-out'))
					{
						if (all[j].getAttribute('app-out') == getmodel)
						{
							all[j].innerText = all[i].value;
						}
					}
				}
			}
		}
	};
	
	this.title = function(caption) // Title function for document
	{
		document.title = caption;
	};
	
	this.format = function() { // Formatting function
		var all = document.getElementsByTagName("*");
		var i;
		for(var i=0, max=all.length; i < max; i++)
		{
			if (all[i].hasAttribute('format'))
			{
				if (all[i].getAttribute('format').indexOf(",") == -1)
				{
					var str = all[i].getAttribute('format').split(":");
					if (str[0] == "letter")
					{
						if (str[1] == "upper")
						{
							all[i].innerText = all[i].innerText.toUpperCase();
						}
						else if (str[1] == "lower")
						{
							all[i].innerText = all[i].innerText.toLowerCase();
						}
						else if (str[1] == "bold")
						{
							all[i].innerHTML = all[i].innerHTML.bold();
						}
						else if (str[1] == "italic")
						{
							all[i].innerHTML = all[i].innerHTML.italics();
						}							
					}
					if (str[0] == "currency")
					{
						if (str[1] == "dollar")
						{
							
							all[i].innerText = currencyFormat(parseFloat(all[i].innerText));
						}
						function currencyFormat (num) {
							return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
						}
					}					
				}
				
			}
		}
	};
	
	this.httpget = function(theUrl, callback){
		/*var result;
		xmlHttp = new XMLHttpRequest(); 
		xmlHttp.onreadystatechange = ProcessRequest;
		xmlHttp.open("GET", theUrl, true);
		xmlHttp.send(null)
		function ProcessRequest(e) {
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				if(xmlHttp.responseText == "Not found") 
				{
					console.log("Not found");
				}
				else
				{
					var info = eval ( "(" + xmlHttp.responseText + ")" );
					result = info;
					return result;
				}
			}
		}
		console.log(xmlHttp.response);*/
	    var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
		}
		xmlHttp.open("GET", theUrl, true); // true for asynchronous 
		xmlHttp.send(null);
		
	};
	
	this.validation = function(){
		var all = document.getElementsByTagName("*");
		
		for(var i=0, max=all.length; i < max; i++)
		{
			if(all[i].hasAttribute('app-in'))
			{
				if(all[i].hasAttribute('app-validtype'))
				{
					if(all[i].getAttribute('app-validtype') == "required")
					{
						all[i].outerHTML += "<span style='color:red;visibility:hidden;' app-validator='" + all[i].getAttribute('app-in') + "'>" + "*</span>";
						all[i].addEventListener("input",setvalidation);
					}
				}
			}
		}
		function setvalidation(evt){
			if(evt.target.value == "")
			{
				for(var j=0, max=all.length; j < max; j++)
				{
					if(all[j].tagName == "SPAN")
					{
						if(all[j].hasAttribute('app-validator'))
						{
							if(all[j].getAttribute('app-validator') == evt.target.getAttribute('app-in'))
							{
								all[j].style.visibility = "visible";
								bind();
							}
						}
					}
				}
			}
			else
			{
				for(var k=0, max=all.length; k < max; k++)
				{
					if(all[k].tagName == "SPAN")
					{
						if(all[k].hasAttribute('app-validator'))
						{
							if(all[k].getAttribute('app-validator') == evt.target.getAttribute('app-in'))
							{
								all[k].style.visibility = "hidden";
								bind();
							}
						}
					}
				}				
			}
			
		}
	};
	
	this.goo = function(path){ // User redirect to URL (single page application(SPA))
		firstroute = path;
		window.history.pushState( {} , '', '/#/'+path);
		window.onpopstate();
	};
	
	this.route = function(name, obj){ // Route function
		var ur = window.location.href;
		var nnn = window.location.hash.replace('#','');
		if (routing == false && nnn == obj[0].path)
		{
			routing = true;
			var all = document.getElementsByTagName("*");
			var i;
			for(var i=0, max=all.length; i < max; i++)
			{
				if (all[i].hasAttribute("app-continer"))
				{
					all[i].innerHTML = all[i].innerHTML.replace(all[i].innerHTML, obj[0].define);
				}
			}
			model();			
		}
		else if (routing == true && nnn == obj.path)
		{
			var all = document.getElementsByTagName("*");
			var i;
			for(var i=0, max=all.length; i < max; i++)
			{
				if (all[i].hasAttribute("app-continer"))
				{
					all[i].innerHTML = all[i].innerHTML.replace(all[i].innerHTML, obj.define);
				}
			}
			model();			
		}
		setbj = obj;
		//children[i].children[0].children[j].addEventListener("load", window.history.pushState( {} , '', '/#/'+firstroute));		
	};
	
	this.execute = function(callback){ // Run application in load page
		window.onload = function(){
			callback();
		}		
	};
	
	// Feature functions 
	this.enumeral = function(params) // Enumeration function
	{
		var enm = {};
		for (i = 0; i < params.length; i++)
		{
			var s = params[i];
			enm[s] = params[i];
		}
		return enm;
	};

	this.element = function(name, attribute, callback) // User-define html elements function
	{
		callback();
	};

	this.datacontiner = function(name,obj) {
		var all = document.getElementsByTagName("*");
		var tbl = "", lst = "";
		var tblapt = false,tblvalue = false;
		var lstvalue = false;
		for(var i=0, max=all.length; i < max; i++)
		{
			if(all[i].tagName == "DATACONTINER")
			{
				if(all[i].hasAttribute('type'))
				{
					if(all[i].getAttribute('type') == "table")
					{
						if(all[i].hasAttribute('name'))
						{
							if(all[i].getAttribute('name') == name)
							{
								tblapt = true;
								tbl += "<table id='" + name + "' style='width:100%'>"
								tbl += "<tr>";
							}
						}
					}
					else if(all[i].getAttribute('type') == "list")
					{
						if(all[i].hasAttribute('name'))
						{
							if(all[i].getAttribute('name') == name)
							{
								lstvalue = true;
								lst += "<ul>";
							}
						}
					}
				}
			}
		}
		if(tblapt == true)
		{
			for(var j=0, max=all.length; j < max; j++)
			{
				if (all[j].tagName == "DATACOLUMN")
				{
					tbl += "<th>" + all[j].innerHTML + "</th>";
				}
			}
			tbl += "</tr>";
			tblvalue = true;
		}
		else if(lstvalue == true)
		{
			for(m=0;m<obj.length;m++)
			{

				lst += "<li>";
				for(var k=0, max=all.length; k < max; k++)
				{
					if (all[k].tagName == "DATALIST")
					{
						for(nm in obj[m])
						{
							if(all[k].innerHTML == nm)
							{
								if(all[k].getAttribute('type') == "text")
								{
									if(all[k].hasAttribute('format'))
									{
										lst += "<p format='" + all[k].getAttribute('format') + "' >" + obj[m][nm] + "</p> ";
									}
									else
									{
										lst += obj[m][nm] + " "; 
									}

								}
								else if (all[k].getAttribute('type') == "image")
								{
									lst += "<img src='" + obj[m][nm] + "' />";
								}
							}
						}
					}
				}
			}
			lst += "</li>";
			lst += "</ul>";
		}
		if(tblvalue == true)
		{
			for(m=0;m<obj.length;m++)
			{
				tbl += "<tr>";
				for(var k=0, max=all.length; k < max; k++)
				{
					if (all[k].tagName == "DATAROW")
					{
						for(nm in obj[m])
						{
							if(all[k].innerHTML == nm)
							{
								if(all[k].getAttribute('type') == "text")
								{
									if(all[k].hasAttribute('format'))
									{
										tbl += "<td format='" + all[k].getAttribute('format') + "'>" + obj[m][nm] + "</td>";
										
									}
									else
									{
										tbl += "<td>" + obj[m][nm] + "</td>";
									}
								}
								else if(all[k].getAttribute('type') == "image")
								{
									tbl += "<td>" + "<img src='" + obj[m][nm] + "' />" + "</td>";
								}
								else if(all[k].getAttribute('type') == "link")
								{
									if(all[k].hasAttribute('value'))
									{
										tbl += "<td>" + "<a href='" + obj[m][nm] + "'>" + all[k].getAttribute('value') + "</a>" + "</td>";
									}
								}
								else if(all[k].getAttribute('type') == "button")
								{
									if(all[k].hasAttribute('value'))
									{
										tbl += "<td>" + "<button type='button' app-click='" + obj[m][nm] + "'>" + all[k].getAttribute('value') + "</td>";
									}
								}								
							}
						}

					}
				}
				tbl += "</tr>";
			}
			tbl += "</table>";
		}
		for(var s=0, max=all.length; s < max; s++)
		{
			if(all[s].hasAttribute('type'))
			{
				if(all[s].getAttribute('type') == "table")
				{
					if(all[s].hasAttribute('name'))
					{
						if(all[s].getAttribute('name') == name)
						{
							all[s].innerHTML = tbl;
						}
					}
				}
				else if(all[s].getAttribute('type') == "list")
				{
					if(all[s].hasAttribute('name'))
					{
						if(all[s].getAttribute('name') == name)
						{
							all[s].innerHTML = lst;
						}
					}
				}				
			}
		}
		model();
	};
	
	this.outln = function(msg, id,elem){ // Print function
		var all = document.getElementsByTagName("*");
		var i,j;
		var vl;
		if (id != undefined && id != '' && (elem == undefined && elem == ''))
		{
			for(var i=0, max=all.length; i < max; i++)
			{
				if (all[i].hasAttribute('app-out'))
				{
					if (all[i].getAttribute('app-out') == id)
					{
					all[i].innerText = msg + '\n';
					}
				}
			}
		}
		else
		{
			for(var j=0, max=all.length; j < max; j++)
			{
				if (all[j].tagName == elem)
				{
					all[j].innerText = msg + '\n';
				}
			}
		}
	};
	this.task = function(tskparam) // Task function (service)
	{
		var taskobj = new tskparam();
		return taskobj;
	};
	
	// Inside functions
	this.value = function($type,$id,$form){ // return get and set function for get and set to DOM objects
		var all = document.getElementsByTagName("*");
		var i,j;
		this.set = function($value){
			if($value != undefined || $value != '')
			{
				for(var i=0, max=all.length; i < max; i++)
				{
					if($type == 'app-in')
					{
						if (all[i].hasAttribute('app-in') && all[i].getAttribute('app-in') == $id)
						{
							all[i].value = $value;
						}
					}
					else if($type == 'app-out')
					{
						if (all[i].hasAttribute('app-out') && all[i].getAttribute('app-out') == $id)
						{
							all[i].innerText = $value;
						}
					}					
					else if($type == 'app-img')
					{
						if (all[i].hasAttribute('app-img') && all[i].getAttribute('app-img') == $id)
						{
							all[i].src = $value;
						}
					}				
				}
			}
		};
		this.get = function(){
			for(var j=0, max=all.length; j < max; j++)
			{
				if($type == 'app-in')
				{
					if (all[j].hasAttribute('app-in') && all[j].getAttribute('app-in') == $id)
					{
						return all[j].value;
					}
				}
				if($type == 'app-out')
				{
					if (all[j].hasAttribute('app-out') && all[j].getAttribute('app-out') == $id)
					{
						return all[j].innerText;
					}
				}
			}	
		};		
	};
	
	this.on = function($id,$form) { // return on... events
		var all = document.getElementsByTagName("*");
		var i;
		var chlk = {};
		this.onclick = function($callback){
			for(var i=0, max=all.length; i < max; i++)
			{
				if (all[i].hasAttribute('app-click') && ($form == undefined || $form == ""))
				{
					if (all[i].getAttribute('app-click') == $id)
					{
						all[i].onclick = $callback;
					}
				}
			}
		};
		this.ondblclick = function($callback){
			for(var i=0, max=all.length; i < max; i++)
			{
				if (all[i].hasAttribute('app-click') && ($form == undefined || $form == ""))
				{
					if (all[i].getAttribute('app-click') == $id)
					{
						all[i].ondblclick = $callback;
					}
				}
			}
		}		
		
	};
})();
window.onpopstate = function(event) {
	var all = document.getElementsByTagName("*");
	var j;
	for(k=0;k<setbj.length;k++)
	{
		if (window.location.hash.replace('#','') == setbj[k].path)
		{
			for(var j=0, max=all.length; j < max; j++)
			{
				if (all[j].hasAttribute("app-continer"))
				{
					//children[j].innerHTML = children[j].innerHTML.replace(children[j].innerHTML, setbj[k].define);
					route("",setbj[k]);
				}
			}
		}
	}
};
