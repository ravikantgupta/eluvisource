

var Service = {
    	
    	fetchInitial: function(callback) {
        var initial_data = new Object();
        initial_data["service"] = "initial";
        initial_data["store"] = config.data[0].default_store;
        initial_data["currency"] = config.data[0].app_currency;
        console.log(JSON.stringify(initial_data));
       // $.mobile.loading('show');
        $.ajax({
            url: config.data[0].baseurl,
            type: "GET",
            contentType : "application/json; charset=utf-8",
            data: initial_data,
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
               console.log(JSON.stringify(result));
               $.mobile.loading('hide');
               var time_local = new Date().getTime();
               localStorage.setItem('sidebarlocal',JSON.stringify(result));
               localStorage.setItem('time_local',time_local);
               callback(result);
            }
        });

    }

}


/*
 *Function to check login status
 *@param
 *@return
 */
function checkLoginStatus() {
    localStorage.setItem('m_flag',0);
    var login_status = "Deactive";
    if (localStorage[config.data[0].storage_key+'_Session'] == null) {
        login_status = "Deactive";
    } else {
        var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
        if (Session != null) {
            login_status = Session["login_status"];
        }
    }
    var pages="";
    
        if(localStorage[config.data[0].storage_key+'cms_pages']==1)
        {
        if(localStorage[config.data[0].storage_key+'about_us'] != 0)
        {
            pages +="<li id='mofluid_about'><a href='javascript:void(0);' onclick='getCMSB("+localStorage[config.data[0].storage_key+'about_us']+")'>Contact Us</a></li>";
		   
		   pages +="<li id='mofluid_about'><a href='javascript:void(0);' onclick='getCMSB("+localStorage[config.data[0].storage_key+'about_us']+")'>Get 20% Off</a></li>";
        
		}
        if(localStorage[config.data[0].storage_key+'term_condition'] != 0)
        {
            pages +="<li id='mofluid_home'><a href='javascript:void(0);' onclick='getCMSB("+localStorage[config.data[0].storage_key+'term_condition']+")'>"+locale.message.text["termcondition"]+"</a></li>";
        }
        if(localStorage[config.data[0].storage_key+'privacy_policy'] != 0)
        {
            pages +="<li id='mofluid_home'><a href='javascript:void(0);' onclick='getCMSB("+localStorage[config.data[0].storage_key+'privacy_policy']+")'>"+locale.message.text["privacypolicy"]+"</a></li>";
        }
        if(localStorage[config.data[0].storage_key+'return_privacy_policy'] != 0)
        {
            pages +="<li id='mofluid_home'><a href='javascript:void(0);' onclick='getCMSB("+localStorage[config.data[0].storage_key+'return_privacy_policy']+")'>"+locale.message.text["returnpolicy"]+"</a></li>";
			 pages +="<li id='mofluid_home'><div class='search'><div id='searchBox' class='searchbox' ><form name='serachForm' action='javascript:custom_search();'><div><input id='searchFilter' type='serach' data-type='search' data-theme='a' /><ul id='suggestions' data-role='listview' data-inset='true' data-theme='a'></ul></div></form></div> </div></li>";
        }
    }
    var current_time = new Date().getTime();
    var time_local = localStorage.getItem('time_local');
    var diff=current_time - time_local;
    if (diff < cache_time){
        var response = JSON.parse(localStorage.getItem('sidebarlocal'));
        var categories = response.categories;
        var list_item =  Widget.initializeMainMenu(categories);
        new_side_cat(categories);
        list_item +=pages;
        localStorage.setItem('m_flag',1);
        $("#left_category_navigation").html(list_item);
        $("#left_category_navigation").listview();
        $("#left_category_navigation").listview("refresh");
    }
    else{
        Service.fetchInitial(function(response){
            try {
                var categories = response.categories;
                var list_item =  Widget.initializeMainMenu(categories);
                new_side_cat(categories);
                list_item +=pages;
                 localStorage.setItem('m_flag',1);
                $("#left_category_navigation").html(list_item);
                $("#left_category_navigation").listview();
                $("#left_category_navigation").listview("refresh");
            }
            catch(err) {
                console.error(err.message);
            }
        });
    }
    
    
    
   /* if (login_status == "Active") {
        var list_item = "<li id='mofluid_home'><a href='javascript:void(0);' onclick=\"Page.redirect('index.html', 'slide', 'down');\" id='mofluid_home_a'></a></li><li id='mofluid_myaccount'><a href='javascript:void(0);' onclick=\"Page.redirect('profile.html', 'slide', 'down');\" id='mofluid_myaccount_a'></a></li><li id='mofluid_myorders'><a href='javascript:void(0);' onclick=\"Page.redirect('myorder.html', 'slide', 'down');\" id='mofluid_myorders_a'></a></li><li id='mofluid_signout'><a href='javascript:void(0);' onclick='logOut();' id='mofluid_signout_a'></a></li>";
        $("#left_navigation").html(list_item);
        $("#left_navigation").listview();
        $("#left_navigation").listview("refresh");
        $("#mofluid_home_a").html(locale.message.button["home"]);
        $("#mofluid_signout_a").html(locale.message.button["sign_out"]);
    } else {
        
        var list_item = "<li id='mofluid_home'><a href='javascript:void(0);' onclick=\"Page.redirect('index.html', 'slide', 'down');\" id='mofluid_home_a'></a></li><li id='mofluid_signin'><a href='javascript:void(0);' onclick=\"Page.redirect('login.html', 'slide', 'down');\"; id='mofluid_signin_a'></a></li>";
        $("#left_navigation").html(list_item);
        $("#left_navigation").listview();
        $("#left_navigation").listview("refresh");
        $("#mofluid_home_a").html(locale.message.button["home"]);
        $("#mofluid_signin_a").html(locale.message.button["sign_in"]);
    }
    
    //---------------------------------New one---------------------------------------
    if (login_status == "Active") {
        var list_item = "<div class='ui-grid-d new_left_navigation'><div class='ui-block-b new_left_side_panel' style='width: 15%;' id='mofluid_home'><div style='padding: 10px 0px 10px 10px;' onclick=\"Page.redirect('index.html', 'slide', 'left');\" id='mofluid_home_a'></div></div><div class='ui-block-b new_right_side_panel' style='width: 25%;' id='mofluid_signout'><div style='padding: 10px 0px 10px 10px;' onclick='logOut();' id='mofluid_signout_a'></div></div><div class='ui-block-b new_left_side_panel' style='width: 30%;' id='mofluid_myaccount'><div style='padding: 10px 0px 10px 10px;'  onclick=\"Page.redirect('profile.html', 'slide', 'left');\" id='mofluid_myaccount_a'></div></div><div class='ui-block-b new_right_side_panel' style='width: 30%;' id='mofluid_myorders'><div style='padding: 10px 0px 10px 10px;'  onclick=\"Page.redirect('myorder.html', 'slide', 'left');\" id='mofluid_myorders_a'></div></div></div>";
        $("#left_navigation").html(list_item);
        $("#mofluid_home_a").html(locale.message.button["home"]);
        $("#mofluid_signout_a").html(locale.message.button["sign_out"]);
    } else {
        
        var list_item = "<div class='ui-grid-a new_left_navigation'><div class='ui-block-b new_left_side_panel' id='mofluid_home'><div style='padding: 10px 0px 10px 10px;' onclick=\"Page.redirect('index.html', 'slide', 'left');\" id='mofluid_home_a'></div></div><div class='ui-block-b new_right_side_panel' id='mofluid_signin'><div style='padding: 10px 10px 10px 10px;float: right;'  onclick=\"Page.redirect('login.html', 'slide', 'left');\"; id='mofluid_signin_a'></div></div></div>";
        $("#left_navigation").html(list_item);
        
        $("#mofluid_home_a").html(locale.message.button["home"]);
        $("#mofluid_signin_a").html(locale.message.button["sign_in"]);
    }*/
}




function new_side_cat(data){
    $("#Cate_slide").html("");
    
   // $("#Cate_slide").append('<div class="new_cate_panel_div_main" id="mofluid_home"  onclick=\"Page.redirect("index.html", "slide", "down");\">'+locale.message.button["home"]+'</div>');
    $("#Cate_slide").append('<div class="new_cate_panel_div_main new_head" id="mofluid_home">'+locale.message.text.shop_by_category+'</div>');

    localStorage.setItem(config.data[0].storage_key+"_categories",JSON.stringify(data));
    var main_menu ='';
    
    for(var key in data) {
        
        if (data.hasOwnProperty(key)) {
            
            $("#Cate_slide").append('<div class="new_cate_panel_div" id="new_category_id_'+data[key].id+'" onclick="new_sub_cat('+data[key].id+', 0,\''+data[key].name+'\')">'+data[key].name+'</div><div class="new_sub_cate_panel_div" style="display:none;" id='+data[key].id+'></div>');
            
            if(data[key].children != null && data[key].children.length > 0){
                $("#new_category_id_"+data[key].id).addClass("plus_class");
            }
           
        }
        
    }
    
    
    if(localStorage[config.data[0].storage_key+'cms_pages']==1)
    {
        if(localStorage[config.data[0].storage_key+'about_us'] != 0)
        {
            $("#Cate_slide").append('<div class="new_cate_panel_div_main new_head" id="mofluid_about" onclick="getCMSB('+localStorage[config.data[0].storage_key+'about_us']+')">'+locale.message.text["aboutus"]+'</div>');
            
        }
        if(localStorage[config.data[0].storage_key+'term_condition'] != 0)
        {
            $("#Cate_slide").append('<div class="new_cate_panel_div_main new_head" id="mofluid_home" onclick="getCMSB('+localStorage[config.data[0].storage_key+'term_condition']+')">'+locale.message.text["termcondition"]+'</div>');
            
        }
        if(localStorage[config.data[0].storage_key+'privacy_policy'] != 0)
        {
            $("#Cate_slide").append('<div class="new_cate_panel_div_main new_head" id="mofluid_home" onclick="getCMSB('+localStorage[config.data[0].storage_key+'privacy_policy']+')">'+locale.message.text["privacypolicy"]+'</div>');
            
        }
        if(localStorage[config.data[0].storage_key+'return_privacy_policy'] != 0)
        {
            $("#Cate_slide").append('<div class="new_cate_panel_div_main new_head" id="mofluid_home" onclick="getCMSB('+localStorage[config.data[0].storage_key+'return_privacy_policy']+')">'+locale.message.text["returnpolicy"]+'</div>');
            
        }
        
    }

}
function new_sub_cat(id, parentid,cat_name){
    var categories = JSON.parse(localStorage.getItem(config.data[0].storage_key+"_categories"));
    var total_child_current = 0;
    var children;
    $("#"+id).html('<div class="new_sub_cate_panel_single_div" onclick="Page.redirect(\'subcategory.html?parent='+id+'\',\'slide\', \'left\')">All '+cat_name+'</div>');
    
    if(parseInt(id)<= 0 ) {
        if(parseInt(parentid)<= 0 ) {
            new_side_cat(categories);
        }
        else {
            var sub_menu_data_length = 0;
            $.each(categories, function(i, row){
                if(row.id == id){
                   sub_menu_data = row.children;
                   if(sub_menu_data == null || sub_menu_data == ""){
                    sub_menu_data_length = 0;
                   }
                   else{
                    sub_menu_data_length = sub_menu_data.length;
                   }
                   
                }
            });
            if(sub_menu_data_length == 0){
                Page.redirect('subcategory.html?parent='+id, 'slide', 'left');
            }
            else{
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
                                var parent = 0;
                                if (sub_menu_data.hasOwnProperty(key)) {
                                    $("#"+id).append('<div class="new_sub_cate_panel_single_div" onclick="new_sub_cat('+sub_menu_data[key].id+', '+parent+',\''+sub_menu_data[key].name+'\');">'+sub_menu_data[key].name+'</div>');
                                }
                            }
                            else {
                                Page.redirect('subcategory.html?parent='+id, 'slide', 'left');
                                
                            }
                        }
                        catch(err) {
                            console.error(err.message);
                        }
                    }
                }
                //$("#new_category_id_"+id).addClass("plus_class");
                
                $('#new_category_id_'+id).toggleClass('plus_class');
                $('#new_category_id_'+id).toggleClass('minus_class');
                
                
                
                
                
                $("#"+id).slideToggle('slow');
                
            }
        }
    }
    else {
        var sub_menu_data_length = 0;
        
        $.each(categories, function(i, row){
                   if(row.id == id){
                    sub_menu_data = row.children;
                           if(sub_menu_data == null || sub_menu_data == ""){
                            sub_menu_data_length = 0;
                           }
                           else{
                             sub_menu_data_length = sub_menu_data.length;
                           }
               
                   }
               
               });
        
        
        if(sub_menu_data_length == 0){
            Page.redirect('subcategory.html?parent='+id, 'slide', 'left');
        }
        else{
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
                            
                            var parent = 0;
                            
                            if (sub_menu_data.hasOwnProperty(key)) {
                                
                                $("#"+id).append('<div class="new_sub_cate_panel_single_div" onclick="new_sub_cat('+sub_menu_data[key].id+', '+parent+',\''+sub_menu_data[key].name+'\');">'+sub_menu_data[key].name+'</div>');
                                
                            }
                        }
                        else {
                            Page.redirect('subcategory.html?parent='+id, 'slide', 'left');
                            
                        }
                    }
                    catch(err) {
                        console.error(err.message);
                    }
                }
            }
            
            $('#new_category_id_'+id).toggleClass('plus_class');
            $('#new_category_id_'+id).toggleClass('minus_class');
            $("#"+id).slideToggle('slow');

        }
        
       
        
    }

}









