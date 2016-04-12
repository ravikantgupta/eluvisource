/*
 *****************************************************************************
 -----------------------------------------------------------------------------
 *  File            :     sidecategory.js
 *  Application     :     Mofluid Mobile Application
 *  Description     :     Manage SideCategory
 *  Organization    :     Mofluid
 *  Org URL         :     http://www.mofluid.com
 -----------------------------------------------------------------------------
 Copyright 2013: Ebizon Netinfo Pvt. Ltd. All rights reserved
 -----------------------------------------------------------------------------
 *****************************************************************************
*/

/*
 *Function to check products using autocomplete.
 *@param
 *@return
 */
 var Widget = new function() {
 
     this.getCmsPages = function(id) {
              //alert("This is called");
         var cms_api_data = new Object();
         cms_api_data["service"] = "getallCMSPages";
         cms_api_data["store"] = config.data[0].storeid;
         cms_api_data["pageId"] = id;
         $.mobile.loading('show');
		 
         $.ajax({
                url: config.data[0].baseurl,
                type: "GET",
                contentType : "application/json; charset=utf-8",
                data: cms_api_data,
                dataType: "jsonp",
                async: false,
                beforeSend: function(){
                console.log("Before Login Webservice");
                },
                error: function(error){
                $.mobile.loading('hide');
                console.log(error);
                },
                complete: function(){
                console.log("Complete Webservice");
                },
                success: function(result){
                  //alert(result.title);
                
                $.mobile.loading('hide');
                if(result.title != "" ) {
                var params = new Object();
                params["id"] = id;
                params["result"] = result;
               
                
                     
                Page.redirectWithParams('cms_page.html', 'slide', 'left', params);
                }
                }
                });
     };
     this.show = function() {
         var cms_page = '';
         try {
             var params = Page.getParams();
             
             var data = params.result;
             //console.log("product data =");
             //  alert(JSON.stringify(data));
             cms_page += '<div class="header_border border">'+data.title+'</div><div class="cms_page">';
             if(data.content) {
                
                 cms_page += '\ <div class="cms_page_text">'+data.content+'</div>';
             }
             else {
                 cms_page += '\
                 <div class="off top " style="width:100% !important;">\
                 <div class="cms_page_text" style="width:100% !important; margin:auto;padding-left:auto;" align="center">No Page Found</div>\
                 <div class="cms_page_pro"></div>\
                 </div>';
             }
             
         }
         catch(w1){
             console.error(w1.message+" in product");
             cms_page += '\
             <div>\
             <div class="cms_page_text" style="width:100% !important;">No Page Found</div>\
             <div class="cms_page_pro" style="width:100% !important; margin:auto; padding-left:auto;" align="center"></div>\
             </div>';
         }
         cms_page += '</div>';
         console.log(cms_page);
         $("#cms-page-detail").html(cms_page);
         $("#cms-page-detail").trigger("create");
     };
     
  this.initializeMainMenu = function(data) {
 
      // console.log("mydata"+JSON.stringify(data));
        localStorage.setItem(config.data[0].storage_key+"_categories",JSON.stringify(data));
        var main_menu ='';
       
        for(var key in data) {
        	
        	if (data.hasOwnProperty(key)) {
               //if(data[key].id==143 || data[key].id==130)
            
               //{
               		main_menu += '<li><a href="#" onclick="Widget.updateSliderMenu('+data[key].id+', 0);">'+data[key].name+'</a></li>';
               //}
           }
        }
   return main_menu;
        
    };
    this.getSliderMenu = function () {
        var main_menu = '\
          <ul data-role="listview" data-mini="true" data-shadow="false" class="main_menu_ul ui-nodisc-icon">\
            <li>\
              <form>\
                <input type="search" id="main_search" placeholder="Search" />\
              </form>\
            </li>\
            <li data-icon="none"><a href="#" onclick=\'Page.redirect("home.html", "slide", "left");\'>Home</a></li>\
            <li><a href="#" onclick="Widget.updateSliderMenu();">Mens</a></li>\
            <li><a href="#">Womens</a></li>\
            <li><a href="#">Kids</a></li>\
            <li data-icon="none"><a href="#" onclick="Brands.load()">Brands</a></li>\
            <li data-icon="none"><a href="#">Sales</a></li>\
            <li data-icon="none"><a href="#">Offers</a></li>\
            <li data-icon="none"><a href="#">Kefan Optics</a></li>\
            <li data-icon="none"><a href="#" onclick=\'Page.redirect("index.html", "slide", "left");\'>My Account</a></li>\
            <li data-icon="none"><a href="#">My Orders</a></li>\
            <li data-icon="none"><a href="#">About Us</a></li>\
            <li data-icon="none"><a href="#">Share this App</a></li>\
            <li data-icon="none"><a href="#">Rate this App</a></li>\
            <li data-icon="none"><a href="#">Terms of Use</a></li>\
            <li data-icon="none"><a href="#">Privacy Statement</a></li>\
            <li data-icon="none"><a href="#">Contact Us</a></li>\
            <li data-icon="none"><a href="#">Locate Us</a></li>\
          </ul>';
        return main_menu;
    };
    this.setSliderMenu = function() {
        $("[data-role=panel]").html(Widget.getSliderMenu()).enhanceWithin();
    };
    this.setSubMenu = function(data) {
    
        $("#left_category_navigation").html(data);
        $("#left_category_navigation").listview();
        $("#left_category_navigation").listview("refresh");
        
       // $("[data-role=panel]").html(data).enhanceWithin();
       // $(".main_menu_ul li.active").removeClass("active");
    };
    this.updateSliderMenu = function(id, parentid) {
       var categories = JSON.parse(localStorage.getItem(config.data[0].storage_key+"_categories"));
        var total_child_current = 0;
        var children;
        if(parseInt(id)<= 0 ) {
      
            if(parseInt(parentid)<= 0 ) {
           
                var list_item =  Widget.initializeMainMenu(categories);
            	$("#left_category_navigation").html(list_item);
            	$("#left_category_navigation").listview();
            	$("#left_category_navigation").listview("refresh");
            }
            else {
                var children_data = this.findChild(categories, "id", parentid);
               
                try {
                    children = children_data.children;
                    total_child_current = children_data.children.length;
                }
                catch(err) {
                    total_child_current = 0;
                }
                try {
                    if(total_child_current) {
               
                        var parent = this.findParentId(categories, parentid, 0);
                        var sub_menu = '<li>';
                            sub_menu += '<a class="ui-btn ui-shadow ui-corner-all ui-icon-carat-l ui-btn-icon-left" href="#" onclick="Widget.updateSliderMenu(0, '+parent+');">'+this.findParentName(categories, parentid, 0)+'</a>';
                        sub_menu += '</li>';
                        for(var key1 in children) {
                            if (children.hasOwnProperty(key1)) {
                        			sub_menu += '<li><a href="#" onclick="Widget.updateSliderMenu('+children[key1].id+', '+parent+');">'+children[key1].name+'</a></li>';
                            }
                        }
                    	this.setSubMenu(sub_menu);
                    }
                    else {
                        
                        Page.redirect('subcategory.html?parent='+id, 'slide', 'left');
                        //window.location="subcategory.html?parent="+id;
                        //Category.load(id);
                    }
                }
                catch(err) {
                    alert(err.message);
                }
            }
        }
        else {
            var current_menu_data = this.findChild(categories, "id", id);
            
            var sub_menu_data_length = 0;
            try {
            sub_menu_data = current_menu_data.children;
            sub_menu_data_length = sub_menu_data.length;
            }
            catch(err) {
            Page.redirect('subcategory.html?parent='+current_menu_data.id, 'slide', 'left');
                //window.location="subcategory.html?parent="+current_menu_data.id;
              // Category.load(current_menu_data.id);
            }
            if(sub_menu_data_length > 0) {
                for(var key in sub_menu_data) {
                    if (sub_menu_data.hasOwnProperty(key)) {
                        var total_child = 0;
                        try {
                            total_child = sub_menu_data.length;
                        }
                        catch(e) {
                            total_child = 0;
                        }
                        try {
                            if(total_child) {
                           
                                var parent = this.findParentId(categories, id, 0);
                                //alert(parent);
                                var sub_menu = '<li>\
                                      <a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-carat-l ui-btn-icon-left" onclick="Widget.updateSliderMenu(0, '+parent+');">'+this.findParentName(categories, id, 0)+'</a>\
                                    </li>';
                                for(var key1 in sub_menu_data) {
                                    if (sub_menu_data.hasOwnProperty(key1)) {
                                        sub_menu += '<li><a href="#" onclick="Widget.updateSliderMenu('+sub_menu_data[key1].id+', '+parent+');">'+sub_menu_data[key1].name+'</a></li>';
                                    }
                                }
                                //sub_menu += '</ul>';
                                this.setSubMenu(sub_menu);
                            }
                            else {
                                Page.redirect('subcategory.html?parent='+id, 'slide', 'left');
                            // window.location="subcategory.html?parent="+id;
                                //Category.load(id);
                            }
                        }
                        catch(err) {
                            console.error(err.message);
                        }
                    }
                }
            }
        }
    };
    this.findParentName = function(data, id, current_parent) {
        if(!current_parent) {
            current_parent = 0;
        }
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                var next, next_length = 0;
                try {
                    next = data[key].children;
                    next_length = next.length;
                }
                catch(err) {
                    next_length =0;
                }
                if(data[key].id == id) {
                    return data[key].name;
                }
                else if(next_length) {
                    for(var key2 in next) {
                        if(next.hasOwnProperty(key2)) {
                            var parent = this.findParentId(next, id, data[key].id);
                            if(next[key2].id == id) {
                                return next[key2].name;
                            }
                        }
                    }
                }
                else {
                    continue;
                }
            }
        }
    };
    this.findParentId = function(data, id, current_parent) {
        if(!current_parent) {
            current_parent = 0;
        }
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                var next, next_length = 0;
                try {
                    next = data[key].children;
                    next_length = next.length;
                }
                catch(err) {
                    next_length =0;
                }
                if(data[key].id == id) {
                    return current_parent;
                }
                else if(next_length) {
                    for(var key2 in next) {
                        if(next.hasOwnProperty(key2)) {
                            var parent = this.findParentId(next, id, data[key].id);
                            if(parent) {
                                return parent;
                            }
                        }
                    }
                }
                else {
                    continue;
                }
            }
        }
    };
    this.findChild = function(data, id, value) {
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                var next, next_length = 0;
                try {
                    next = data[key].children;
                    next_length = next.length;
                }
                catch(err) {
                    next_length =0;
                }
                if(data[key].id == value) {
                    return data[key];
                }
                else if(next_length) {
                    for(var key2 in next) {
                        if(next.hasOwnProperty(key2)) {
                            var content = this.findChild(next, id, value);
                            if(content) {
                                return content;
                            }
                        }
                    }
                }
                else {
                    continue;
                }
            }
        }
                
    };
    this.getAppPlatform = function() {
        var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        
        return deviceType;
    };
    this.shareApp = function() {
        try {
            $("#main_menu").panel( "close" );
            var app_share_title = 'Download '+config.app.name+' Now  ';
            if(Widget.getAppPlatform() == "Android") {
                window.plugins.socialsharing.share(app_share_title, null, null, config.url.share.android);
            }
            else {
                window.plugins.socialsharing.share(app_share_title, null, null, config.url.share.ios);
            }
        }
        catch(err) {
            alert("Social Share Error : "+err.message);
        }

    };


	
 
 }


