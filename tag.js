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
			var strtemp = all[i].innerText.split(' ');
			if (all[i].hasAttribute('tag-in'))
			{
				s = all[i].getAttribute('tag-in');
				vl = new value('tag-in',all[i].getAttribute('tag-in'));
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
			else if(strtemp[0] == '<{' && strtemp[2] == '}>')
			{	
				bind();
				s = strtemp[1];
				vl = new value('tag-out',strtemp[1]);
				hnd[s] = vl;
				
			}
			else if(all[i].hasAttribute('tag-click'))
			{
				s = all[i].getAttribute('tag-click');
				cl = new on(s);
				hnd[s] = cl;
			}
			else if(all[i].hasAttribute('tag-img'))
			{
				s = all[i].getAttribute('tag-img');
				vl = new value('tag-img',all[i].getAttribute('tag-img'));
				hnd[s] = vl;
			}
		}
		return hnd;
	};
	
	this.bind = function(){ // Data-bind DOM function (view<->model)
		var all = document.getElementsByTagName("*");
		var getmodel = '';
		
		for(var i=0, max=all.length; i < max; i++)
		{
			if (all[i].hasAttribute('tag-in'))
			{
				getmodel = all[i].getAttribute('tag-in');
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
					var strtemp = all[j].innerText.split(' ');	
					
					if (strtemp[0] == '<{' && strtemp[2] == '}>')
					{
						if (strtemp[1] == getmodel)
						{
							var attout = document.createAttribute("tag-out");
							attout.value = getmodel;
							all[j].setAttributeNode(attout);
						}
					}
				}
				for(var k=0, max=all.length; k < max; k++)
				{
					if (all[k].hasAttribute('tag-out'))
					{
						if (all[k].getAttribute('tag-out') == getmodel)
						{
							all[k].innerText = all[i].value;
						}
					}
				}
			}
		}
	};
	
	this.title = function(caption) // Title function for set document title
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
	
	this.httprequest = function(theUrl, callback){ // httprequest function for http operations
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
			if(all[i].hasAttribute('tag-in'))
			{
				if(all[i].hasAttribute('tag-validtype'))
				{
					if(all[i].getAttribute('tag-validtype') == "required")
					{
						all[i].outerHTML += "<span style='color:red;visibility:hidden;' tag-validator='" + all[i].getAttribute('tag-in') + "'>" + "*</span>";
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
						if(all[j].hasAttribute('tag-validator'))
						{
							if(all[j].getAttribute('tag-validator') == evt.target.getAttribute('tag-in'))
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
						if(all[k].hasAttribute('tag-validator'))
						{
							if(all[k].getAttribute('tag-validator') == evt.target.getAttribute('tag-in'))
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

	this.datacontiner = function(name,records_per_page,obj) { // datacontiner function for insert data
		var current_page = 1;
		var all = document.getElementsByTagName("*");
		var str = "";
		var firstRun = false;
		
		function addBtSp()
		{
			for(var k=0, max=all.length; k < max; k++)
			{
				if(all[k].tagName == "DATACONTINER")
				{
					if(all[k].hasAttribute('name'))
					{
						if(all[k].getAttribute('name') == name)
						{
							all[k].outerHTML += `<a href='javascript:prevPage()' id='btn_prev'>Prev</a>
												<a href='javascript:nextPage()' id='btn_next'>Next</a>
												page: <span id='page'></span>`;
						}
					}
				}
			}
		}
		
		function changePage(page)
		{
			str = "";
			
			var btn_next = document.getElementById("btn_next");
			
			var btn_prev = document.getElementById("btn_prev");
			
			var page_span = document.getElementById("page");
			
			if(page < 1)
				page = 1;
			if(page > numberofPage())
				page = numberofPage();
			
			if(firstRun == false)
			{
				for(var i = (page-1) * records_per_page; i < (page * records_per_page); i++)
				{
					for(var k=0, max=all.length; k < max; k++)
					{
						if(all[k].tagName == "DATACONTINER")
						{
							if(all[k].hasAttribute('name'))
							{
								if(all[k].getAttribute('name') == name)
								{
									for(var j=0; j<all[k].children.length;j++)
									{
										var sta = all[k].children[j].innerHTML;
										str += obj[i][sta] + " ";
									}
									str += "<br>";
								}
							}
						}
					}
					page_span.innerHTML = page + "/" + numberofPage();
					if (page == 1) {
						btn_prev.style.visibility = "hidden";
					} else {
						btn_prev.style.visibility = "visible";
					}

					if (page == numberofPage()) {
						btn_next.style.visibility = "hidden";
					} else {
						btn_next.style.visibility = "visible";
					}
					
					this.prevPage = function()
					{
						if (current_page > 1) {
							current_page--;
							changePage(current_page);
						}
					}
					
					this.nextPage = function()
					{
						if (current_page < numberofPage()) {
							current_page++;
							changePage(current_page);
						}
					}					
				}
				firstRun = true;
			}
			else if(firstRun == true)
			{
				for(var i = (page-1) * records_per_page; i < (page * records_per_page); i++)
				{
					for(nm in obj[i])
					{
						str += obj[i][nm] + " ";	
					}
					str += "<br>";
				}				
			}
			for(var k=0, max=all.length; k < max; k++)
			{
				if(all[k].tagName == "DATACONTINER")
				{
					if(all[k].hasAttribute('name'))
					{
						if(all[k].getAttribute('name') == name)
						{
							all[k].innerHTML = "";
							all[k].innerHTML +=str;
						}
					}
				}
			
				page_span.innerHTML = page + "/" + numberofPage();
				if (page == 1) {
					btn_prev.style.visibility = "hidden";
				} else {
					btn_prev.style.visibility = "visible";
				}

				if (page == numberofPage()) {
					btn_next.style.visibility = "hidden";
				} else {
					btn_next.style.visibility = "visible";
				}
				
				this.prevPage = function()
				{
					if (current_page > 1) {
						current_page--;
						changePage(current_page);
					}
				}

				this.nextPage = function()
				{
					if (current_page < numberofPage()) {
						current_page++;
						changePage(current_page);
					}
				}
			}			
		}
		
		function nochangePage()
		{
			var m;
			for(m=0;m<obj.length;m++)
			{
				for(nm in obj[m])
				{
					str += obj[m][nm] + " ";	
				}
				str += "<br>";
			}
			for(var k=0, max=all.length; k < max; k++)
			{
				if(all[k].tagName == "DATACONTINER")
				{
					if(all[k].hasAttribute('name'))
					{
						if(all[k].getAttribute('name') == name)
						{
							all[k].innerHTML +=str;
						}
					}
				}
			}
			
		}
		function numberofPage()
		{
			return Math.ceil(obj.length / records_per_page);
		}
		if(records_per_page > 0)
		{
			addBtSp();
			changePage(1);
		}
		else
		{
			nochangePage();
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
					var strtemp = all[i].innerText.split(' ');
					if($type == 'tag-in')
					{
						if (all[i].hasAttribute('tag-in') && all[i].getAttribute('tag-in') == $id)
						{
							all[i].value = $value;
						}
					}
					else if($type == 'tag-out')
					{
						if (strtemp[1] == $id)
						{
							all[i].innerText = $value;
						}
					}					
					else if($type == 'tag-img')
					{
						if (all[i].hasAttribute('tag-img') && all[i].getAttribute('tag-img') == $id)
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
				if($type == 'tag-in')
				{
					if (all[j].hasAttribute('tag-in') && all[j].getAttribute('tag-in') == $id)
					{
						return all[j].value;
					}
				}
				if($type == 'tag-out')
				{
					if (all[j].hasAttribute('tag-out') && all[j].getAttribute('tag-out') == $id)
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
					route("",setbj[k]);
				}
			}
		}
	}
};