var BASE_URL = config.data[0].baseurl;
var STORE = config.data[0].storeid;
var app_curr_symbol = config.data[0].app_curr_symbol;
var app_curr_code = config.data[0].app_currency;
var database = config.data[0].storage_key;

//localStorage.setItem('cache_setting');
var cache_expire_time=localStorage['c_time'];
var cache_expire_status=localStorage['c_status'];
var cache_time = parseInt(parseInt(cache_expire_time) * 60 *1000);
if(cache_expire_status==0 || cache_expire_status==null)
{
        var cache_time = parseInt(parseInt(config.data[0].cache_time) * 60 *1000);
}
function dbConnection(){
    db = window.sqlitePlugin.openDatabase({name: database,location: 0});
    return db;
}

/*
 *Function to fetch the querystring by name.
 *@param name
 *@return decodeURIComponent
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* To fetch the directory path. */
function dirname(path) {
    return path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');;
}

                          
//------------------------------------------Product detail page------------------------------------------------
function getProDetail(proid,stk_stat,type) {

$(".ui-loader").show();
//var product_val=queryValue();
//var PRODUCT_IDD =product_val.split("stock_status");
var PRODUCT_ID=proid;
var stock_status=stk_stat;
var BASE_URL  = config.data[0].baseurl;
var STORE = config.data[0].storeid;

localStorage.setItem(config.data[0].storage_key+"_pro_detail_flag",1);
                          
if(type == "configurable"){
                          
                         
//var  Configurable_product_detail_webservice = BASE_URL+"?callback=?"+"&store="+STORE+"&service=get_configurable_product_details&productid="+PRODUCT_ID+"&currency="+app_curr_code;
var Configurable_product_detail_webservice = BASE_URL+"?callback=?"+"&store="+STORE+"&service=get_configurable_product_details_description&productid="+PRODUCT_ID+"&currency="+app_curr_code;

console.log(Configurable_product_detail_webservice);
$.ajax({
     url:Configurable_product_detail_webservice,
     type: 'GET',
     contentType: 'application/json',
     dataType: 'json',
     async: false,
       error: function(){
       $(".ui-loader").hide();
           if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
           navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
           }
           else {
           alert(locale.message.alert["try_again"])
           }
       },
     success: function(results){
     var params = new Object();
     params["result"] = results;
     params["stock_status"] = stock_status;
     params["ptype"] = type;
    // alert("datastr"+JSON.stringify(results));
       localStorage.setItem('productDetailslocal', JSON.stringify(params));
       Page.redirectWithParams('product_details.html', 'slide', 'left', params);
     }
     });

}

  else if(type == "grouped")
  {  
      var params = new Object();
      params["stock_status"] = stock_status;
      params["ptype"] = type;
      params["pid"] = PRODUCT_ID;
      Page.redirectWithParams('product_details.html', 'slide', 'left', params);
  }

else{
                         // alert("enter in silple product");
//var Simple_product_detail_webservice = BASE_URL+"?callback=?"+"&store="+STORE+"&service=productdetail&productid="+PRODUCT_ID+"&currency="+app_curr_code;
var Simple_product_detail_webservice = BASE_URL+"?callback=?"+"&store="+STORE+"&service=productdetaildescription&productid="+PRODUCT_ID+"&currency="+app_curr_code;
   console.log(Simple_product_detail_webservice);
$.ajax({
     url:Simple_product_detail_webservice,
     type: 'GET',
     contentType: 'application/json',
     dataType: 'json',
     async: false,
     error: function(){
     $(".ui-loader").hide();
     if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
     navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
     }
     else {
     alert(locale.message.alert["try_again"])
     }
     },
     success: function(results){
       localStorage.setItem('productDetailslocal', JSON.stringify(results));
     var params = new Object();
       params["result"] = results;
       params["stock_status"] = stock_status;
       params["ptype"] = results["type"];
       
       //alert(JSON.stringify(results));
       if(results["type"] == "configurable"){
       getProDetail(PRODUCT_ID,stock_status,results["type"]);
       }
       else{
       localStorage.setItem('productDetailslocal', JSON.stringify(params));
       Page.redirectWithParams('product_details.html', 'slide', 'left', params);
       }
     
       
     }
     });
}



}
                          
                          
                          
                          

/* To fetch the querystring. */
function queryValue() {
    var qrStr = window.location.search;
    if (qrStr)
        var qrvalue = (qrStr.split("?")[1].split("=")[1]);

    return decodeURIComponent(qrvalue);
}

/*
 *Function to check pincode is valid or not
 *@param name
 *@return true or false
 */
function isValidalphanumeric(name) {
    var alphaExp = /^([a-zA-Z0-9 ]+)$/;
    if (name.match(alphaExp))
        return true;
    else
        return false;
}



                          
    function getCMSB(id)
    {
                          
        Widget.getCmsPages(id);
    }
                          
                          
    function checkLoginStatus_preview() {
        var login_status = "Deactive";
        if (localStorage[config.data[0].storage_key+'_Session'] == null) {
            login_status = "Deactive";
        } else {
            var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
            if (Session != null) {
                login_status = Session["login_status"];
            }
        }
        if (login_status == "Active") {
            var list_item = "<li id='mofluid_home'><a href='javascript:void(0);' id='mofluid_home_a'></a></li><li id='mofluid_myaccount'><a href='javascript:void(0);'  id='mofluid_myaccount_a'></a></li><li id='mofluid_myorders'><a href='javascript:void(0);' id='mofluid_myorders_a'></a></li><li id='mofluid_signout'><a href='javascript:void(0);' id='mofluid_signout_a'></a></li>";
            $("#left_navigation").html(list_item);
            $("#left_navigation").listview();
            $("#left_navigation").listview("refresh");
        } else {
            var list_item = "<li id='mofluid_home'><a href='javascript:void(0);'  id='mofluid_home_a'></a></li><li id='mofluid_signin'><a href='javascript:void(0);'  id='mofluid_signin_a'></a></li>";
            $("#left_navigation").html(list_item);
            $("#left_navigation").listview();
            $("#left_navigation").listview("refresh");
        }

    }
    /*
     *Function to get date format
     *@param date
     *return
     */


function getFormatDate(date) {
    var error = 0;
    var now = date;
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    var valid_date = new Date();
    var valid_day = valid_date.getDate();
    var valid_month = valid_date.getMonth() + 1;
    var valid_year = valid_date.getFullYear();
    if (year == valid_year && month == valid_month && day == valid_day) {
        var dateTime = year + '-' + month + '-' + day;
        return dateTime;
    } else if (date < valid_date) {
        if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
            navigator.notification.alert("Invalid Date.", function() {}, config.data[0].app_name, locale.message.button["close"]);
        } else {
            alert("Invalid Date.");
        }
        day = valid_day;
        month = valid_month;
        year = valid_year;
        error++;
    } else {
        if (year >= valid_year + 1) {
            if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                navigator.notification.alert("Invalid Date.", function() {}, config.data[0].app_name, locale.message.button["close"]);
            } else {
                alert("Invalid Date.");
            }
            day = valid_day;
            month = valid_month;
            year = valid_year;
            error++;
        }
    }
    if (error == 0) {
        var dateTime = year + '-' + month + '-' + day;
    } else {
        var dateTime = '';
    }
    return dateTime;
}

/*
 *Function to get time format
 *@param time
 *return
 */

function getFormatTime(date) {
        var now = date;
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (hour.toString().length == 1) {
            var hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            var minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            var second = '0' + second;
        }
        var dateTime = hour + ':' + minute + ':' + second;
        return dateTime;
    }
    /*
     *Function to redirect to various page
     *@param
     *@return
     */
function redirectTopage(pagename) {
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/" + pagename;
    if(pagename=='index.html')
    {
        localStorage.setItem('foo',1);
    }
    Page.redirect(pagename, 'slide', 'down')
    
                          //window.location = fullPath;
}

/*
 *Function call to logout
 *@param
 *@return
 */
function logOut() {
    localStorage[config.data[0].storage_key+'_Session'] = null;
    //clearCart();
    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
        navigator.notification.alert(locale.message.alert["sign_out_message"], function() {}, config.data[0].app_name, locale.message.button["close"]);
    } else {
        alert(locale.message.alert["sign_out_message"]);
    }
    redirectTopage('index.html');
}
                          
/* Print Root Category. */
function printRootCategory() {
                  //start data
  var app_curr_code = config.data[0].app_currency;
  
  var db = dbConnection();
  var current_time = new Date().getTime();
  var key = 'categorydetails';
                          
  db.transaction(function(tx) {
                 
                 //tx.executeSql('DROP TABLE IF EXISTS mofluid_cache');
    tx.executeSql('CREATE TABLE IF NOT EXISTS mofluid_cache (key text, data text, timestamp text)');
    tx.executeSql("select * from mofluid_cache where key='categorydetails';", [], function(tx, resdata) {
                  
      if (resdata.rows.length > 0) {
      
          var diff=current_time - resdata.rows.item(0).timestamp;
      
          //if the cache time expire then this code wiil execute
          if (diff > cache_time){
                  //delete the old row of storedetails data if cache time expire
                  
              tx.executeSql("DELETE FROM mofluid_cache WHERE key=?", ["categorydetails"],
                            function(tx, result) {
                            });// end deletion
                  var BASE_URL  = config.data[0].baseurl;
                  var STORE = config.data[0].storeid;
                  var store_webservice = config.data[0].baseurl + "?callback=?" + "&store=" + config.data[0].storeid + "&service=rootcategory&currency="+app_curr_code+"&theme="+config.data[0].theme;
                  
                  $.ajax({
                         url: store_webservice,
                         type: "get",
                         dataType: "jsonp",
                         async: false,
                         success: function(results){
                         db.transaction(function(tx) {
                                        tx.executeSql("INSERT INTO mofluid_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(results) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                                      console.log("ERROR in insert product: " + e);
                                                      });
                                        
                                        });
                         category_list_home(JSON.stringify(results));
                         },
                         error: function(){
                         $(".ui-loader").hide();
                         if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                         navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                         }
                         else {
                         alert(locale.message.alert["try_again"])
                         }
                         }
                         });
          }
          else{
                  var results = resdata.rows.item(0).data;
              category_list_home(results);
          }
      }
      else{
            
                  var BASE_URL  = config.data[0].baseurl;
                  var STORE = config.data[0].storeid;
                 var store_webservice = config.data[0].baseurl + "?callback=?" + "&store=" + config.data[0].storeid + "&service=rootcategory&currency="+app_curr_code+"&theme="+config.data[0].theme;
                  
                  $.ajax({
                         url: store_webservice,
                         type: "get",
                         dataType: "jsonp",
                         async: false,
                         success: function(results){
                         db.transaction(function(tx) {
                                        tx.executeSql("INSERT INTO mofluid_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(results) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                                      console.log("ERROR in insert product: " + e);
                                                      });
                                        });
                         category_list_home(JSON.stringify(results));
                         },
                         error: function(){
                         $(".ui-loader").hide();
                         if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                         navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                         }
                         else {
                         alert(locale.message.alert["try_again"])
                         }
                         }
                         });
                  
                  
                  
        
         //category_list_home();
      }
    });//tx execute
                 
                 
                 
 });//db close
                 
}

function category_list_home(results){
    var result1 = JSON.parse(results);
    var response=result1.categories;
      //Starting response
      var parent_list = " ",
      i = 0;
      j = 0;
      var border_color = ["u_tag", "i_tag", "m_tag", "w_tag", "mo_tag"];
      var img = ["images/shirts.png", "images/women.png", "images/kids.png", "images/coats.png", "images/mobile.png"];
       parent_list = '<ul data-role="listview" data-inset="true" class="navigation_cat">';
                          if (response) {
                          if (response.length) {
                          while (i < response.length) {
                          var categoryName = response[i]["name"];
                          var complete_path = location.href;
                          var categoryId = response[i]["id"];
                          var dirPath = dirname(complete_path);
                          var imageURL = response[i]["thumbnail"];
                          // var fullPath = "'" + dirPath + "/subcategory.html?parent=" + categoryId + "'";
                          var fullPath ="subcategory.html?parent="+categoryId;
                          
                          if (config.data[0].display_category_image == "1" || config.data[0].display_category_image == "1") {
                          parent_list += '<li onclick="getCategory(this);"><a class="ui-link-inherit no-svg" rel=' + fullPath + '><img src="' + imageURL + '" onerror="bad_image(this);"><h2>' + categoryName + '</h2></a></li>';
                          } else {
                          parent_list += '<li onclick="getCategory(this);"><a class="ui-link-inherit no-svg" rel=' + fullPath + '><h2>' + categoryName + '</h2></a></li>';
                          
                          }
                          i++;
                          j++;
                          if (j == 5)
                          j = 0;
                          }
                          }
                          } else {
                          //console.log("no");
                          parent_list += '<li>No Category found !!!!</li>';
                          }
                          parent_list += '</ul>';
                          //$( "#cathideid" ).remove();
                          $( "#cathideid" ).hide('slow', function(){ $( "#cathideid" ).remove(); });
                           $("#heading_text").html(locale.message.text["shop_by_departments"]);
                          $("#category").html(parent_list);
                          $("#category ul").listview();
                          $("#category ul").listview("refresh");
                          $("#footer_content").show();
}
         
         
         
         
         
         
function printRootCategory_preview(response) {
            var parent_list = " ",
                i = 0;
            j = 0;
            var border_color = ["u_tag", "i_tag", "m_tag", "w_tag", "mo_tag"];
            var img = ["images/shirts.png", "images/women.png", "images/kids.png", "images/coats.png", "images/mobile.png"];
            parent_list = '<ul data-role="listview" data-inset="true" class="navigation_cat">';
            if (response) {
                if (response.length) {
                    while (i < response.length) {
                        var categoryName = response[i]["name"];
                        var complete_path = location.href;
                        var categoryId = response[i]["id"];
                        var dirPath = dirname(complete_path);
                        //var imageURL = response[i]["image"];
                        var imageURL = response[i]["thumbnail"];
                        var fullPath = "'" + dirPath + "/subcategory.html?parent=" + categoryId + "'";
                        if (config.data[0].display_category_image == "1" || config.data[0].display_category_image == "1") {
                            parent_list += '<li ><a class="ui-link-inherit no-svg" rel="#"><img src="' + imageURL + '" onerror="bad_image(this);"><h2>' + categoryName + '</h2></a></li>';
                        } else {
                            parent_list += '<li ><a class="ui-link-inherit no-svg" rel="#"><h2>' + categoryName + '</h2></a></li>';

                        }
                        i++;
                        j++;
                        if (j == 5)
                            j = 0;
                    }
                }
            } else {
                //console.log("no");
                parent_list += '<li>No Category found !!!!</li>';
            }
            parent_list += '</ul>';
           
            $("#category").html(parent_list);
            $("#category ul").listview();
            $("#category ul").listview("refresh");

}


/*
 *Function To update the jquery after the categories are listed
 *@param data
 *@return
 */
function updateList(data) {
     
    localStorage.setItem(config.data[0].storage_key+'_cat_flag', 1);
    localStorage.setItem(config.data[0].storage_key+"_pro_detail_flag",0);
    parent_list = "<ul data-role='listview' data-inset='true'>";
    parent_list += data;
    parent_list += "</ul>";
    $("#category").html(parent_list);
    $("#category ul").listview();
    $("#category ul").listview("refresh");
                          
}

function getCategory(source) {
    var catName = $(source).find("h2").text();
    var catLink = $(source).find("a").attr("rel");
    var imageurl = $(source).find("img").attr("src");
    Page.redirect(catLink, 'slide', 'left')
    // parent.location = catLink;
}
                          


function getSubCategory(source) {
    var catName = $(source).find("h2").text();
    var catLink = $(source).find("a").attr("rel");
    var imageurl = $(source).find("img").attr("src");
     Page.redirect(catLink, 'slide', 'left')
                          //parent.location = catLink;
}

// Global InAppBrowser reference
var iabRef = null;

/*
 *Function to check load start
 *@param event
 *@return
 */
function iabLoadStart(event) {

}

/*
 *Function to check load stop
 *@param event
 *@return
 */
function iabLoadStop(event) {

}

/*
 *Function to check load close
 *@param event
 *@return
 */
function iabClose(event) {
    var Session = JSON.parse(localStorage[config.data[0].storage_key+"_Session"]);
    var Store = JSON.parse(localStorage[config.data[0].storage_key+"_STORE"]);
    var Order = JSON.parse(localStorage[config.data[0].storage_key+"_Order"]);
    localStorage.clear();
    localStorage[config.data[0].storage_key+"_Session"] = JSON.stringyfy(Session);
    localStorage[config.data[0].storage_key+"_Order"] = JSON.stringyfy(Order);
    localStorage[config.data[0].storage_key+"_STORE"] = JSON.stringyfy(Store);
    visitHomePage();
    iabRef.removeEventListener('loadstart', iabLoadStart);
    iabRef.removeEventListener('loadstop', iabLoadStop);
    iabRef.removeEventListener('exit', iabClose);
}

/*
 *Function to verify session
 *@param
 *@return
 */
function verify_session() {
    console.log("Session Checking Starts..");
    if (localStorage[config.data[0].storage_key+'_Session'] == null) {
        var dirPath = dirname(location.href);
        var fullPath = dirPath + "/login.html";
        window.location = fullPath;
    } else {
        var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
        if (Session != null) {
            var login_status = Session["login_status"];
            if (login_status != "Active") {
                localStorage[config.data[0].storage_key+'_Session'] = null;
                var dirPath = dirname(location.href);
                var fullPath = dirPath + "/login.html";
                window.location = fullPath;
            }
        } else {
            var dirPath = dirname(location.href);
            var fullPath = dirPath + "/login.html";
            window.location = fullPath;
        }
    }
    console.log("Session Checking Done..");
}
function setApplicationFooter(store) {
    var footer_content = Base64.decode(config.data[0].footer);
    if (footer_content == "") {
        $("#storemail").html(store.email);
        $("#storeadminname").html('&copy; ' + new Date().getFullYear() + " " + store.name);
	}
     else {
         $("#footer_content").html(footer_content);
     }
      document.title = store.name;
      $("#storelabel").html(store.frontname);
      //$("#footer_content").show();
}


                          
function setApplicationLogoBanner_preview(response) {
    console.log("Logo and Banner Function Called : ");
    try {
    var theme = response.theme;
    var store_response = response.store;
    var banner_data = theme.banner;
    var logo_data = theme.logo;
    var banner_image_slider = '';
    try { var image_len =banner_data.image.length; } catch(err) {var image_len = 0;}
    var i = 0;
    console.log("Images : "+image_len);
    try {
    if(image_len <= 0 || image_len == null || image_len == "") {
	   banner_image_slider += '<div class="item hauto"><img src="images/' + config.data[0].banner +'" alt=""  onerror="this.src=\'images/banner.png\'"></div>';
    }
    else {
	    for(i=0; i<image_len; i++) {
	         banner_image_slider += '<div class="item hauto"><img  src="'+banner_data.image[i].mofluid_image_value+'" alt=""  onerror="this.src=\''+ config.data[0].banner+'\'" ></div>';
	    }
    }
    } catch(err) {
    banner_image_slider += '<div class="item hauto"><img src="images/' + config.data[0].banner +'" alt=""  onerror="this.src=\'images/banner.png\'"></div>';
    }
    $("#banner_slider").html(banner_image_slider);
    var storeLogo = "<a href='javascript:void(0);'><img src="+logo_data.image[0].mofluid_image_value+" onerror ='this.src=\'images/" + config.data[0].logo + "\'' alt='" + config.data[0].logo + "' class='logo_icon'/></a>";
    $(".navigation_logo").html(storeLogo);
    var store_data = {};
    store_data["logo"] = storeLogo;
    store_data["banner"] = banner_image_slider;
    store_data["store"] = store_response;
    localStorage[config.data[0].storage_key+"_STORE"] = JSON.stringify(store_data); 
    var owl = $("#banner_slider");
    owl.owlCarousel({
		   items : 1, //10 items above 1000px browser width
		   itemsDesktop : [1000,1], //5 items between 1000px and 901px
		   itemsDesktopSmall : [900,1], // betweem 900px and 601px
		   itemsTablet: [600,1], //2 items between 600 and 0
		   itemsMobile : false,  // itemsMobile disabled - inherit from itemsTablet option
		   navigation : true,
		   pagination: false,
           autoHeight:false
	});
	} catch(err) {
	   console.error(err.message);
	}
}
function bannerAction(action) {
	if(action == null || action == "") {
	         
	}
	else {
	     try {
	     	var banner_action =  JSON.parse(Base64.decode(action));
	          if(banner_action.action == "open") {
	          	if(banner_action.base == "category") {
	                    var dirPath = dirname(location.href);
                         var fullPath = dirPath + "/subcategory.html?parent=" + banner_action.id;
                         window.location = fullPath;
	               }
	               else if(banner_action.base == "product") {
	                   // var dirPath = dirname(location.href);
                       //  var fullPath = dirPath + "/product_details.html?id=" + banner_action.id+"stock_status"+banner_action.status;
                         //window.location = fullPath;
                          getProDetail(banner_action.id,banner_action.status,banner_action.type);
	               } 
	          }
	      } 
	      catch(ex) { 
	     	console.error(ex.message);
	      }
	}
}

 //get google analytics
function setGoogleAnalytics(analytics) {
   try{
        if(analytics.status) {
            var timeSpent = Math.floor((Math.random() * 300000) + 60000);
            window.analytics.startTrackerWithId(analytics.accountid);
            window.analytics.trackView(config.data[0].app_name);
            window.analytics.trackEvent(config.data[0].app_name, 'DeviceReady', 'Hits', 1);
            window.analytics.trackTiming(config.data[0].app_name, timeSpent, 'AppUser', 'Duration');
            window.analytics.debugMode();  
        } else {}
     } catch (e) {
         console.error(e);
      }
 }
/*
 *Function to fetch store details
 *@param
 *@return
 */
function fetchStoredetail_preview() {
    var store_webservice = config.data[0].baseurl + "?callback=?" + "&store=" + config.data[0].storeid + "&service=storedetails&currency="+app_curr_code+"&theme="+config.data[0].theme;
	$.ajax({
		url: store_webservice,
		type: "get",
		dataType: "jsonp",
		beforeSend: function(){
			console.log("Before Store Webservice");
		},
		error: function(){
		    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                   navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
              }
              else {
              		alert(locale.message.alert["try_again"])
              }
		    console.log("Error  on Webservice");
		},
		complete: function(){
			console.log("Complete Webservice");
		},
		success: function( response ){
		    //console.log(response);
             setGoogleAnalytics(response.analytics);
	         setApplicationFooter(response.store);
		    setApplicationLogoBanner_preview(response);
		    printRootCategory_preview(response.categories);
		    //console.log("Success Webservice");
		}
	});
}

                          
function fetchStoredetail() {
    //  $("#new_hide").hide();
      //      return false;
      if(localStorage.getItem('foo') == 1){
          setApplicationLogoBanner(localStorage.getItem('logoban'));
      }
      else{
          var db = dbConnection();
          var current_time = new Date().getTime();
          var key = 'storedetails';
          
          
          db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS mofluid_cache (key text, data text, timestamp text)');
            tx.executeSql("select * from mofluid_cache where key='storedetails';", [], function(tx, resdata) {
                if (resdata.rows.length > 0) {
                    var diff=current_time - resdata.rows.item(0).timestamp;
                    
                    //if the cache time expire then this code wiil execute
                    if (diff > cache_time) {
                        //delete the old row of storedetails data if cache time expire
                        tx.executeSql("DELETE FROM mofluid_cache WHERE key=?", ["storedetails"],
                            function(tx, result) {
                                                         
                        });// end deletion
                        var store_webservice = config.data[0].baseurl + "?callback=?" + "&store=" + config.data[0].storeid + "&service=storedetails&currency="+app_curr_code+"&theme="+config.data[0].theme;
                        $.ajax({
                            url: store_webservice,
                            type: "get",
                            dataType: "jsonp",
                            async: false,
                            beforeSend: function(){
                                console.log("Before Store Webservice");
                            },
                            error: function(){
                                if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                    navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                                }
                                else {
                                    alert(locale.message.alert["try_again"])
                                }
                                console.log("Error  on Webservice");
                            },
                            complete: function(){
                                console.log("Complete Webservice");
                            },
                            success: function( response ){
                                db.transaction(function(tx) {
                                    tx.executeSql("INSERT INTO mofluid_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(response) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                        console.log("ERROR in insert product: " + e);
                                    });
                                });
                               localStorage.setItem('logoban', JSON.stringify(response));
                               localStorage.setItem('c_time', response.store.cache_setting.cache_time);
                               localStorage.setItem('c_status', response.store.cache_setting.status);
                               
                               localStorage.setItem(config.data[0].storage_key+'google_ios_clientid', response.store.google_ios_clientid);
                               localStorage.setItem(config.data[0].storage_key+'google_login_flag', response.store.google_login_flag);
                               
                               localStorage.setItem(config.data[0].storage_key+'cms_pages', response.store.cms_pages);
                               localStorage.setItem(config.data[0].storage_key+'about_us', response.store.about_us);
                               localStorage.setItem(config.data[0].storage_key+'term_condition', response.store.term_condition);
                               localStorage.setItem(config.data[0].storage_key+'privacy_policy', response.store.privacy_policy);
                               localStorage.setItem(config.data[0].storage_key+'return_privacy_policy', response.store.return_privacy_policy);
                               localStorage.setItem(config.data[0].storage_key+'tax_flag', response.store.tax_flag);
                               setApplicationLogoBanner(JSON.stringify(response));
                            }
                        });
                    } //End of (if the cache time expire then this code wiil execute) comment
                                           
                    else // if cache time is not expire then this code will be execute
                    {
                        var response = JSON.parse(resdata.rows.item(0).data);
                        localStorage.setItem('logoban', resdata.rows.item(0).data);
                        setApplicationLogoBanner(resdata.rows.item(0).data);
                                           //   printRootCategory(response.categories);
                    }//End of (if cache time is not expire then this code will be execute) comment
                }//end of if table is not empty
                else
                {
                   var store_webservice = config.data[0].baseurl + "?callback=?" + "&store=" + config.data[0].storeid + "&service=storedetails&currency="+app_curr_code+"&theme="+config.data[0].theme;
                   $.ajax({
                        url: store_webservice,
                        type: "get",
                        dataType: "jsonp",
                        async: false,
                        beforeSend: function(){
                            console.log("Before Store Webservice");
                        },
                        error: function(){
                            if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                            }
                            else {
                                alert(locale.message.alert["try_again"])
                            }
                            console.log("Error  on Webservice");
                        },
                        complete: function(){
                            console.log("Complete Webservice");
                        },
                        success: function( response ){
                            //Insert data of storeDetails if cache table don't have data with the key of storedetails
                            db.transaction(function(tx) {
                                tx.executeSql("INSERT INTO mofluid_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(response) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                                       console.log("ERROR in insert product: " + e);
                                });
                                         
                            });
                            localStorage.setItem('logoban', JSON.stringify(response));
                            localStorage.setItem('c_time', response.store.cache_setting.cache_time);
                            localStorage.setItem('c_status', response.store.cache_setting.status);
                            localStorage.setItem('cache_setting', response.store.cache_setting);
                            localStorage.setItem(config.data[0].storage_key+'google_ios_clientid', response.store.google_ios_clientid);
                            localStorage.setItem(config.data[0].storage_key+'google_login_flag', response.store.google_login_flag);
                          
                          localStorage.setItem(config.data[0].storage_key+'cms_pages', response.store.cms_pages);
                          localStorage.setItem(config.data[0].storage_key+'about_us', response.store.about_us);
                          localStorage.setItem(config.data[0].storage_key+'term_condition', response.store.term_condition);
                          localStorage.setItem(config.data[0].storage_key+'privacy_policy', response.store.privacy_policy);
                          localStorage.setItem(config.data[0].storage_key+'return_privacy_policy', response.store.return_privacy_policy);
                          localStorage.setItem(config.data[0].storage_key+'tax_flag', response.store.tax_flag);
                          
                            //setGoogleAnalytics(response.analytics);
                            //setApplicationFooter(response.store);
                            setApplicationLogoBanner(JSON.stringify(response));
                            //    printRootCategory(response.categories);
                            //console.log("Success Webservice");
                        }
                    });
                }//end of the tag if table is empty
                                           
            });
                             
        });

    }
                          
}
    /*
     *Function to application logo
     *@param country array
     *@return
     */
                          
function setApplicationLogoBanner(results) {
                          
                          var response = JSON.parse(results);
                          console.log("Logo and Banner Function Called : ");
                          document.getElementById("hideit").style.display = "";
                          try {
                          var theme = response.theme;
                          var store_response = response.store;
                          var banner_data = theme.banner;
                          var logo_data = theme.logo;
                          var storeLogo = "<a href='javascript:void(0);' onclick=redirectTopage('index.html')><img src="+logo_data.image[0].mofluid_image_value+" onerror ='this.src=\'images/" + config.data[0].logo + "\'' alt='" + config.data[0].logo + "' class='logo_icon'/></a>";
                          $(".navigation_logo").html(storeLogo);
                          
                          
                          
                          var banner_image_slider = '';
                          try { var image_len =banner_data.image.length; } catch(err) {var image_len = 0;}
                          var i = 0;
                          console.log("Images : "+image_len);
                          try {
                          if(image_len <= 0 || image_len == null || image_len == "") {
                          banner_image_slider += '<div class="item hauto"><img src="images/' + config.data[0].banner +'" alt=""  onerror="this.src=\'images/banner.png\'"></div>';
                          $("#banner_slider").append('<div class="item hauto"><img src="images/' + config.data[0].banner +'" alt=""  onerror="this.src=\'images/banner.png\'"></div>');
                          }
                          else {
                          for(i=0; i<image_len; i++) {
                          $("#banner_slider").append('<div class="item hauto"><img onclick="bannerAction(\''+banner_data.image[i].mofluid_image_action+'\')" src="'+banner_data.image[i].mofluid_image_value+'" alt=""  onerror="this.src=\''+ config.data[0].banner+'\'" ></div>');
                          banner_image_slider += '<div class="item hauto"><img onclick="bannerAction(\''+banner_data.image[i].mofluid_image_action+'\')" src="'+banner_data.image[i].mofluid_image_value+'" alt=""  onerror="this.src=\''+ config.data[0].banner+'\'" ></div>';
                          
                          }
                          }
                          } catch(err) {
                          $("#banner_slider").append('<div class="item hauto"><img src="images/' + config.data[0].banner +'" alt=""  onerror="this.src=\'images/banner.png\'"></div>');
                          banner_image_slider += '<div class="item hauto"><img src="images/' + config.data[0].banner +'" alt=""  onerror="this.src=\'images/banner.png\'"></div>';
                          }
                          
                          localStorage.setItem(config.data[0].storage_key+'_banner_image_slider', banner_image_slider);
                          //alert($("#hideit").attr('value'));
                          $( "#hideit" ).remove();
                          $("#new_hide").show();
                          //alert($("#hideit").attr('value'));
                          //$("#hideit").attr('value');
                          var store_data = {};
                          store_data["logo"] = storeLogo;
                          store_data["banner"] = banner_image_slider;
                          store_data["store"] = store_response;
                          localStorage[config.data[0].storage_key+"_STORE"] = JSON.stringify(store_data);
                          var owl_banner = $("#banner_slider");
                          owl_banner.owlCarousel({
                                                 items : 1, //10 items above 1000px browser width
                                                 itemsDesktop : [1000,1], //5 items between 1000px and 901px
                                                 itemsDesktopSmall : [900,1], // betweem 900px and 601px
                                                 itemsTablet: [600,1], //2 items between 600 and 0
                                                 itemsMobile : false,  // itemsMobile disabled - inherit from itemsTablet option
                                                 navigation : false,
                                                 pagination: true
                                                 });
                          
                          } catch(err) {
                          console.error(err.message);
                          }
                       /*   if(localStorage.getItem('foo') == 1){
                          feature_local();
                          new_local();
                          }
                          else{
                          fetchFeaturesProduct();
                          optional_products_slide();
                          } */
                          setApplicationFooter(response.store);
                          setGoogleAnalytics(response.analytics);
                          
                          }

                          
/*
 *Function to create country dropdown
 *@param country array
 *@return
 */

function print_country(country_arrr) {
    var defcountryarr1 = country_arrr.mofluid_countries;
    var defcountry = country_arrr.mofluid_default_country.country_id;
    var option_str = document.getElementById("Scountry");
    var i = 1,
        indexj = 0;
    option_str.options[0] = new Option("Select", "Select");

    $.each(defcountryarr1, function() {
        option_str.options[i++] = new Option(defcountryarr1[indexj].country_name, defcountryarr1[indexj].country_id);
        console.log(defcountryarr1[indexj].country_name);
        indexj++;
    });



    $("#Scountry").val(defcountry);
    $("#Scountry").trigger("create");
}


function print_countryy(country_arr) {
    var defcountryarr = country_arr.mofluid_countries;
    var defcountry = country_arr.mofluid_default_country.country_id;
    var option_str1 = document.getElementById("country");
    var jj = 1,
        indexjj = 0;
    option_str1.options[0] = new Option("Select", "Select");
    $.each(defcountryarr, function() {
        option_str1.options[jj++] = new Option(defcountryarr[indexjj].country_name, defcountryarr[indexjj].country_id);
        indexjj++;
    });


    $("#country").val(defcountry);
    $("#country").trigger("create");
}



/*
 *When this function is called, PhoneGap has been initialized and is ready to roll
 *@param
 *@return
 */
function onDeviceReady() {
    try {
        if (document.addEventListener) {
            document.addEventListener(PayPal.PaymentEvent.Success, onPaymentSuccess, false);
            document.addEventListener(PayPal.PaymentEvent.Canceled, onPaymentCanceled, false);
            document.addEventListener(PayPal.PaymentEvent.Failed, onPaymentFailed, false);
        } else {}
    } catch (e) {
        console.error(e);
    }
}

/*
 *Function to check name is valid or not
 *@param name
 *@return true or false
 */
function isValidName(name) {
    var alphaExp = /^[A-Za-z]+( [A-Za-z]+)*$/;
    if (name.match(alphaExp))
        return true;
    else
        return false;
}

/*
 *Function to check email is valid or not
 *@param email
 *@return true or false
 */
function checkEmail(email) {
    var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!filter.test(email)) {
        return false;
    }
    return true;
}

/*
 *Function to check number is valid or not
 *@param text
 *@return true or false
 */
function IsNumeric(sText) {
    var ValidChars = "0123456789.";
    var IsNumber = true;
    var Char;
    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}



/*
 *Function to fetch the querystring by name.
 *@param name
 *@return decodeURIComponent
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*
 *Function to fetch the querystring
 *@param
 *@return decodeURIComponent
 */
function queryValue() {
    var qrStr = window.location.search;
    if (qrStr)
        var qrvalue = (qrStr.split("?")[1].split("=")[1]);
    return decodeURIComponent(qrvalue);
}

/*
 *Function to sleep for some seconds
 *@param milliseconds
 *@return
 */
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

/*
 *Function to update order status
 *@param this
 *@return
 */
function orderComplete(ths) {
    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
        navigator.notification.alert(locale.message.alert["order_success_message"], function() {}, config.data[0].app_name, locale.message.button["close"]);
    } else {
        alert(locale.message.alert["order_success_message"])
    }
}

/*
 *Function to get current date
 *@param days
 *@return someFormattedDate
 */
function getCurDate(days) {
    var someDate = new Date();
    var numberOfDaysToAdd = days;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear();
    var someFormattedDate = y + '-' + mm + '-' + dd;
    return someFormattedDate;
}

/*
 *Function to get directory path
 *@param path
 *@return
 */
function dirname(path) {
    return path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');;
}

/*
 *Function to call shipmy id form
 *@param amount
 *@return
 */
function previewShipMyIdForm(amount) {
    var name = $("#name").val();
    var lname = $("#blname").val();
    var phone = $("#phone").val();
    var email = $("#email").val();
    var address = $("#address").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var country = $("#country").val();
    var pincode = $("#pincode").val();
    var PreviewOrder = new Object();
    PreviewOrder["name"] = name;
    PreviewOrder["lname"] = lname;
    PreviewOrder["phone"] = phone;
    PreviewOrder["email"] = email;
    PreviewOrder["address"] = address;
    PreviewOrder["city"] = city;
    PreviewOrder["state"] = state;
    PreviewOrder["country"] = country;
    PreviewOrder["pincode"] = pincode;
    PreviewOrder["totamt"] = amount;
    var ship_order = JSON.stringify(PreviewOrder);
    localStorage[config.data[0].storage_key+"_PreviewOrder"] = ship_order;
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/shiptomyid.html";
    window.location = fullPath;
}


/*
 *Function to call shipping method page
 *@param amount, ship_state, ship_country
 *@return
 */
function previewForm(amount, ship_state, ship_country) {
    var address = new Object();
    var billing = new Object();
    var shipping = new Object();
    var previeworder = new Object();
    //Retrive Save action Flag
    var saveaction = $("#saveaction").is(':checked') ? 1 : 0;
    //Retrive Billing Address
    billing["prefix"] = "";
    billing["firstname"] = $("#name").val();
    billing["lastname"] = $("#blname").val();
    billing["company"] = "";
    billing["street"] = $("#address").val();
    billing["city"] = $("#city").val();
    billing["region"] = $("#state").val();
    billing["country"] = $("#country").val();
    billing["postcode"] = $("#pincode").val();
    billing["phone"] = $("#phone").val();
    billing["email"] = $("#email").val();
    //Retrive Shipping Address
    shipping["prefix"] = "";
    shipping["firstname"] = $("#recName").val();
    shipping["lastname"] = $("#recLName").val();
    shipping["company"] = "";
    shipping["street"] = $("#Saddress").val();
    shipping["city"] = $("#Scity").val();
    shipping["region"] = $("#Sstate").val();
    shipping["country"] = $("#Scountry").val();
    shipping["postcode"] = $("#Spincode").val();
    shipping["phone"] = $("#recMobile").val();
    address["billing"] = billing;
    address["shipping"] = shipping;
    previeworder["address"] = address;
    localStorage[config.data[0].storage_key+"_address"] = Base64.encode(JSON.stringify(address));
    console.log(previeworder);
    var dirPath = dirname(location.href);
   // var fullPath = dirPath + "/shipping_method.html";
   var fullPath ="shipping_method.html";
    Page.redirect(fullPath, 'slide', 'down')
    //window.location = fullPath;
}

/*
 *Function call to save address and make payment
 *@param amount, previewdata, shiping_type, couponvalue, shippmethod
 *@return
 */

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

function parseProductData(quote_products) {
    console.error("Parsing Product");
    var products = new Array();
    var Ids = quote_products.id;
    console.log(Ids);
    var length = Ids.length;
    for (var i =0; i<length; i++) {
		var current = new Object();
		current["id"] = quote_products.id[i];
		current["sku"] = quote_products.sku[i];
		current["quantity"] = quote_products.qty[i];
		current["options"] = quote_products.customoptions[i];
		products.push(current);
     }
     console.error("Final Product");
     console.log(products);
     return products;
}

function saveForm_bak(previewdata) {
    var app_curr_code = config.data[0].app_currency;
    var place_order_url, paymethod;
    var validate_currency_url = BASE_URL + "?callback=?" + "&store=" + STORE + "&service=validate_currency&currency=" + app_curr_code + "&paymentgateway=" + previewdata['paymethod'];
    $.getJSON(validate_currency_url,
        function(validate_currency) {
            if (validate_currency['status'] == '0') {
                if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                    navigator.notification.alert(validate_currency['msg'],
                        function() {
                            redirectTopage('paymentmethod.html');
                        },
                        config.data[0].app_name,
                        locale.message.button["close"]
                    );
                    return false;
                } else {
                    alert(validate_currency['msg']);
                    redirectTopage('paymentmethod.html');
                    return;
                }
            }
            var paymethod, transid = 0;
            var address = previewdata['address'];
            var message_data = previewdata['message'];
            var shippmethod = previewdata["shippmethod"];
            var paymethod = previewdata['paymethod'];
            var paymethod_urlcode  = previewdata['paymethod_urlcode'];
            var saveaction = previewdata["saveaction"];
            var cart = previewdata["cart"];
            console.log(cart);
            var Product = new Object();
            Product['id'] = JSON.parse(localStorage[config.data[0].storage_key+'_pIds']);
            Product['sku'] = JSON.parse(localStorage[config.data[0].storage_key+'_pNames']);
            Product['qty'] = JSON.parse(localStorage[config.data[0].storage_key+'_pQuantities']);
            Product['customoptions'] = JSON.parse(localStorage[config.data[0].storage_key+'_pcustom_options']);
            var JProduct = JSON.stringify(Product);

              var pswd = generatePassword();
              try{
              var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
              if(Session != null){
              var customerid = Session["customer_id"];
              var user_email = Session["email"];
              }
              else{
              var customerid = "notlogin";
              var user_email = "";
              }
              }
              catch(ex){
              var customerid = "notlogin";
              var user_email = "";
              }
            var BASE_URL = config.data[0].baseurl;
            var STORE = config.data[0].storeid;
            var save_address_webservice_call = BASE_URL + "?callback=?" + "&store=" + STORE + "&service=setaddress&customerid=" + customerid + "&address=" + address + "&email=" + user_email + "&saveaction=" + saveaction;
            console.log(save_address_webservice_call);
             if ((customerid > 0 && customerid != null && customerid != "")|| customerid == "notlogin") {
                $.getJSON(save_address_webservice_call,
                    function(response) {
                        console.log(response);
                        try {
                            if (response) {
                                if ((response.shippaddress == "1" || response.shippaddress == 1) && (response.billaddress == "1" || response.billaddress == 1)) {
                                    console.log("Address Saved");
                                   // var Session1 = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
                                    //var email = Session1["email"];
                                    transid = 1234567;
                                    console.log("Payment Method "+paymethod);
                                    try {
                                    	coupon_code = cart.coupon.code;
                                    }
                                    catch(ex) {
                                    	coupon_code = "";
                                    }
                                    
                                   var app_currency_code = config.data[0].app_currency;
                                   var products = parseProductData(JSON.parse(JProduct));
                                   var place_order_url = BASE_URL + "?callback=?" + "&store=" + STORE + "&service=placeorder&customerid=" + customerid + "&address=" + address + "&paymentmethod=" + paymethod + "&shipmethod=" + shippmethod + "&currency=" + app_currency_code + "&transactionid=" + transid + "&products=" + Base64.encode(JSON.stringify(products)) + "&is_create_quote=1&theme=modern&couponCode=" +coupon_code;
                                    console.log(place_order_url);
                                    console.log("Calling Webservice..");
                                    $.getJSON(place_order_url,
                                        function(response) {
                                            console.log(response);
                                            if(response.status == "error" && response.type == "quantity") {
                                                navigator.notification.alert(locale.message.alert["products_out_of_stock_message"],
                                                    function() {
                                                       redirectTopage('cart.html');
                                                    },
                                                    config.data[0].app_name, 
                                                    locale.message.button['close']
                                                 );
                                                 return false;
                                            }
                                            else {
                                            var orderid;
                                            try {
                                                orderid = parseInt(response['orderid']);
                                            } catch (ex) {
                                                console.log(ex);
                                                orderid = -1;
                                            }
                                            console.log("Order Id "+orderid);
                                            if (orderid > 0) {
                                              console.log("Payment Method "+paymethod);
                                                if (paymethod == "secureebs_standard") {
                                                    var accountid = getPaymentInfo("ebs", "payment_method_account_id");
                                                    var secret_key = getPaymentInfo("ebs", "payment_method_account_key");
                                                    var mode = getPaymentInfo("ebs", "payment_method_mode");
                                                    var address =  JSON.parse(Base64.decode(localStorage[config.data[0].storage_key+'_address']));
                                                    var store_id = config.data[0].store_id;
                                                    var invoiceid = orderid;
                                                    var description = "Payments";
                                                    var currency = "INR";
                                                    var firstname = address.billing["firstname"];
                                                    var address1 = address.billing;
                                                    var address2 = address.shipping;
                                                    var postcode = address.shipping.postcode;
                                                    var country = "IN";
                                                    var phonenumber = address.shipping.phone;
                                                    var companyname = config.data[0].appname;
                                                    var basicurl = config.data[0].basicurl;
                                                    var return_url = BASE_URL + "?DR={DR}&service=mofluid_ebs_pgresponse&store=1&platform=" + config.data[0].platform;
                                                    var modetext = "TEST";
                                                    if (mode == "1") {
                                                        modetext = "LIVE";
                                                    }
                                                    var ebs_hash_raw = secret_key + "|" + accountid + "|" + cart.total_amount + "|" + invoiceid + "|" + return_url + "|" + modetext;
                                                    console.log(ebs_hash_raw);
                                                    var ebs_hash = MD5(ebs_hash_raw);
                                                    var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
                                                    var emailid = Session["email"];
                                                    var mofluid_ebs_pay = {};
                                                    mofluid_ebs_pay["hash"] = ebs_hash;
                                                    mofluid_ebs_pay["account_id"] = accountid;
                                                    mofluid_ebs_pay["return_url"] = base64_encode(return_url);
                                                    mofluid_ebs_pay["mode"] = modetext;
                                                    mofluid_ebs_pay["reference_no"] = invoiceid;
                                                    mofluid_ebs_pay["amount"] = cart.total_amount;
                                                    mofluid_ebs_pay["description"] = description;
                                                    mofluid_ebs_pay["name"] = address.billing.firstname;
                                                    mofluid_ebs_pay["address"] = address.billing.street;
                                                    mofluid_ebs_pay["city"] = address.billing.city;
                                                    mofluid_ebs_pay["state"] = address.billing.region;
                                                    mofluid_ebs_pay["postal_code"] = address.billing.postcode;
                                                    mofluid_ebs_pay["country"] = address.billing.country;
                                                    mofluid_ebs_pay["phone"] = address.billing.phone;
                                                    mofluid_ebs_pay["email"] = address.billing.email;
                                                    mofluid_ebs_pay["site_url"] = BASE_URL;
                                                    mofluid_ebs_pay["mofluid_ebskey"] = secret_key;
                                                    var mofluid_ebs_data = JSON.stringify(mofluid_ebs_pay);
                                                    var ebs_payment_url = encodeURI(BASE_URL + "?service=ebspayment&store=1&mofluid_paymentdata=" + mofluid_ebs_data);
                                                    iabRef = window.open(ebs_payment_url, '_blank', 'location=yes');
                                                    iabRef.addEventListener('exit',
                                                        function() {
                                                            redirectAfterPayment();
                                                        });
                                                } else if (paymethod == 'authorizenet') {
                                                    var data = {};
                                                    var invoiceid = orderid;
                                                    var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
                                                    var loginID = getPaymentInfo("authorizenet", "payment_method_account_id");
                                                    var transactionKey = getPaymentInfo("authorizenet", "payment_method_account_key");
                                                    var email = Session["email"];
                                                    var address =  JSON.parse(Base64.decode(localStorage[config.data[0].storage_key+'_address']));
                                                    try {
                                                       var total_ship_tax = parseFloat(parseFloat(cart.shipping_amount) + parseFloat(cart.tax_amount)).toFixed(2);
                                                    }
                                                    catch(er) {
                                                    	var total_ship_tax = 0;	
                                                    }
                                                    data["pay_bill"] = address.billing;
                                                    data["pay_shipp"] = address.shipping;
                                                    data["product_shipamt"] = total_ship_tax;
                                                    data["total_amount"] = cart.total_amount;
                                                    data["cust_id"] = customerid;
                                                    data["invoice"] = invoiceid;
                                                    data["email"] = email;
                                                    data["loginID"] = loginID;
                                                    data["transactionKey"] = transactionKey;
                                                    data["authorize_return_url"] = BASE_URL;
                                                    data["mode"] = getPaymentInfo("authorizenet", "payment_method_mode");
                                                    data["currency_code"] =  config.data[0].app_currency;
                                                    var pay_data = JSON.stringify(data);
                                                    pay_data = Base64.encode(pay_data);
                                                    var authorizenet_payment_url = encodeURI('authorize_net.html?pay_data=' + pay_data);
                                                    iabRef = window.open(authorizenet_payment_url, '_blank', 'location=yes');
                                                    iabRef.addEventListener('exit', function() {
                                                        redirectAfterPayment();
                                                    });
                                                } 
                                                else if (paymethod == "paypal_standard") {
                                                   var address =  JSON.parse(Base64.decode(localStorage[config.data[0].storage_key+'_address']));
                                                   if(config.data[0].platform == "android") {
                                                    var subtotal_amount = (parseFloat(cart.total_amount).toFixed(2)).toString(); 
                                                    var paymentdata = {
                                                        "address" : address,
                                                        "order" : {
                                                            "invoice" : orderid.toString(),
                                                            "currency": config.data[0].app_currency,
                                                            "description":"Order "+orderid,
                                                            "custom":"custom_text"
                                                        },
                                                        "config": {
                                                            "mode": getPaymentInfo("paypal", "payment_method_mode"),
                                                            "businessmail": getPaymentInfo("paypal", "payment_account_email"),
                                                            "api_key" : getPaymentInfo("paypal", "payment_method_account_key")
                                                        },
                                                        "app": {
                                                            "name":config.data[0].app_name,
                                                            "privacylink":config.data[0].baseurl,
                                                            "userlink":config.data[0].baseurl
                                                        },
                                                        "amount":{
                                                            "subtotal" : subtotal_amount,
                                                            "total":subtotal_amount,
                                                            "tax":"0",
                                                            "shipping":"0",
                                                            "discount":"0"
                                                        }
                                                    };
                                                    if(parseFloat(subtotal_amount) <=0) {
											  navigator.notification.alert(locale.message.text["message_for_invalid_payment_amount"], function() {
										            redirectTopage('index.html');
											  }, config.data[0].app_name, locale.message.button["close"]);
                                                    }
                                                    else {
                                                        console.log(paymentdata);
                                                        MofluidPaypal.initialize(paymentdata);
                                                    }
                                                    }
                                                    else {
                                                    console.log("Paypal iOS Payment");
                                                    var business_mail = getPaymentInfo("paypal", "payment_account_email");
                                                    var payment_mode = getPaymentInfo("paypal", "payment_method_mode");
                                                    var data = {};
                                                    var paypal_url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
                                                    if (payment_mode == "1") {
                                                        var paypal_url = "https://www.paypal.com/cgi-bin/webscr";
                                                    }
                                                    console.log(paypal_url);
                                                    data["business_mail"] = business_mail;
                                                    data["pay_url"] = paypal_url;
                                                    data["total_amount"] =parseFloat(cart.total_amount).toFixed(2);
                                                    data["firstname"] = address.billing.firstname;
                                                    data["lastname"] = address.billing.lastname;
                                                    data["mofluid_order_id"] = orderid;
                                                    console.log(data);
                                                    var pay_data = JSON.stringify(data);
                                                    pay_data = Base64.encode(pay_data);
                                                    var paypal_payment_url = encodeURI('pay.html?pay_data=' + pay_data);
                                                    console.log(paypal_payment_url);
                                                    iabRef = window.open(paypal_payment_url, '_blank', 'location=yes');
                                                    iabRef.addEventListener('exit', function() {
                                                        redirectAfterPayment();
                                                    });
                                                    
                                                   }  
                                                } 
                                                else if (paymethod == "cashondelivery" || paymethod == "cod" || paymethod == "banktransfer" || paymethod == "free") {
                                                    var address =  JSON.parse(Base64.decode(localStorage[config.data[0].storage_key+'_address']));
                                                    processInvoice(orderid, address, cart.coupon.amount);
                                                }
                                                else {
                                                      var payment_url = config.data[0].basicurl+"payment"+paymethod_urlcode;
                                                      try {
                                                       	var total_ship_tax = parseFloat(parseFloat(cart.shipping_amount) + parseFloat(cart.tax_amount)).toFixed(2);
                                                      }
                                                     catch(er) {
                                                    	var total_ship_tax = 0;	
                                                    }
                                                    var total_amount =  parseFloat(parseFloat(cart.total_amount)+total_ship_tax).toFixed(2);
                                                     var address =  JSON.parse(Base64.decode(localStorage[config.data[0].storage_key+'_address']));
                                                      var data = {};
                                                       data["orderid"] = orderid;
                                                       data["amount"] = total_amount;
                                                       data["shopid"] = "";
                                                       data["first_name"] =address.billing.firstname;
                                                       data["last_name"] = address.billing.lastname;
                                                       data["siteurl"] = config.data[0].basicurl;
                                                    
                                                      var pay_data = JSON.stringify(data);
                                                      pay_data = Base64.encode(pay_data);
                                                      var payment_process_url = encodeURI(payment_url+'?paymentdata='+pay_data);
                                                      console.log("total_amount " + total_amount);
                                                      console.log(payment_process_url);
                                                      //window.open(payment_process_url);
                                                      iabRef = window.open(payment_process_url, '_blank', 'location=yes');
                                                      iabRef.addEventListener('exit', function() {
                                                          redirectAfterPayment();
                                                      });
                                                }
                                            }
                                        }});
                                } else {
                                    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                        navigator.notification.alert(locale.message.alert["failure_message_for_address_save"],
                                            function() {},
                                            config.data[0].app_name,
                                            locale.message.button["close"]
                                        );
                                    } else {
                                        alert(locale.message.alert["failure_message_for_address_save"]);
                                    }
                                }
                            } else {
                                if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                    navigator.notification.alert(locale.message.alert["failure_message_for_address_save"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                                } else {
                                    alert(locale.message.alert["failure_message_for_address_save"]);
                                }
                            }
                        } catch (ex) {
                            if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                navigator.notification.alert(locale.message.alert["failure_message_for_address_save"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                            } else {
                                alert(locale.message.alert["failure_message_for_address_save"] + ex.message);
                            }
                        }
                    });
            }
        });
}


/*Function to save order and redirect for payment 1.17*/

function saveForm(previewdata) {
    var app_curr_code = config.data[0].app_currency;
    var place_order_url, paymethod;
    var validate_currency_url = BASE_URL + "?callback=?" + "&store=" + STORE + "&service=validate_currency&currency=" + app_curr_code + "&paymentgateway=" + previewdata['paymethod'];
    $.getJSON(validate_currency_url,
        function(validate_currency) {
            if (validate_currency['status'] == '0') {
                if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                    navigator.notification.alert(validate_currency['msg'],
                        function() {
                            redirectTopage('paymentmethod.html');
                        },
                        config.data[0].app_name,
                        locale.message.button["close"]
                    );
                    return false;
                } else {
                    alert(validate_currency['msg']);
                    redirectTopage('paymentmethod.html');
                    return;
                }
            }
            var paymethod, transid = 0;
            var address = previewdata['address'];
            var message_data = previewdata['message'];
            var shippmethod = previewdata["shippmethod"];
            var paymethod = previewdata['paymethod'];
            var paymethod_urlcode = previewdata['paymethod_urlcode'];
            var saveaction = previewdata["saveaction"];
            var cart = previewdata["cart"];
            //console.log(cart);
            var Product = new Object();
            Product['id'] = JSON.parse(localStorage[config.data[0].storage_key + '_pIds']);
            Product['sku'] = JSON.parse(localStorage[config.data[0].storage_key + '_pNames']);
            Product['qty'] = JSON.parse(localStorage[config.data[0].storage_key + '_pQuantities']);
            Product['customoptions'] = JSON.parse(localStorage[config.data[0].storage_key + '_pcustom_options']);
            var JProduct = JSON.stringify(Product);

            var pswd = generatePassword();
            try {
                var Session = JSON.parse(localStorage[config.data[0].storage_key + '_Session']);
                if (Session != null) {
                    var customerid = Session["customer_id"];
                    var user_email = Session["email"];
                } else {
                    var customerid = "notlogin";
                    var address_min = JSON.parse(Base64.decode(localStorage[config.data[0].storage_key + '_address']));
                    var user_email = address_min.billing["email"];
                }
            } catch (ex) {
                var customerid = "notlogin";
                var address_min = JSON.parse(Base64.decode(localStorage[config.data[0].storage_key + '_address']));
                var user_email = address_min.billing["email"];
            }
            var BASE_URL = config.data[0].baseurl;
            var STORE = config.data[0].storeid;
            var save_address_webservice_call = BASE_URL + "?callback=?" + "&store=" + STORE + "&service=setaddress&customerid=" + customerid + "&address=" + address + "&email=" + user_email + "&saveaction=" + saveaction;
            // console.log(save_address_webservice_call);
            if ((customerid > 0 && customerid != null && customerid != "") || customerid == "notlogin") {
                $.getJSON(save_address_webservice_call,
                    function(response) {
                        // console.log(response);
                        try {
                            if (response) {
                                if ((response.shippaddress == "1" || response.shippaddress == 1) && (response.billaddress == "1" || response.billaddress == 1)) {
                                    //  console.log("Address Saved");
                                    transid = 1234567;
                                    // console.log("Payment Method " + paymethod);
                                    try {
                                        coupon_code = cart.coupon.code;
                                    } catch (ex) {
                                        coupon_code = "";
                                    }

                                    var app_currency_code = config.data[0].app_currency;
                                    var products = parseProductData(JSON.parse(JProduct));
                                    var place_order_url = BASE_URL + "?callback=?" + "&store=" + STORE + "&service=placeorder&customerid=" + customerid + "&address=" + address + "&paymentmethod=" + paymethod + "&shipmethod=" + shippmethod + "&currency=" + app_currency_code + "&transactionid=" + transid + "&products=" + Base64.encode(JSON.stringify(products)) + "&is_create_quote=1&theme=modern&couponCode=" + coupon_code;
                                     console.log(place_order_url);
                                      console.log("Calling Webservice..");
                                    $.getJSON(place_order_url,
                                        function(response) {
                                            //  console.log(response);
                                            if (response.status == "error" && response.type == "quantity") {
                                                navigator.notification.alert(locale.message.alert["products_out_of_stock_message"],
                                                    function() {
                                                        redirectTopage('cart.html');
                                                    },
                                                    config.data[0].app_name,
                                                    locale.message.button['close']
                                                );
                                                return false;
                                            } else {
                                                var orderid;
                                                try {
                                                    orderid = parseInt(response['orderid']);
                                                } catch (ex) {
                                                    //     console.log(ex);
                                                    orderid = -1;
                                                }
                                                // console.log("Order Id " + orderid);
                                                if (orderid > 0) {
                                                    //   console.log("Payment Method " + paymethod);
                                                    if (paymethod == "secureebs_standard") {
                                                        var accountid = getPaymentInfo("ebs", "payment_method_account_id");
                                                        var secret_key = getPaymentInfo("ebs", "payment_method_account_key");
                                                        var mode = getPaymentInfo("ebs", "payment_method_mode");
                                                        var address = JSON.parse(Base64.decode(localStorage[config.data[0].storage_key + '_address']));
                                                        var store_id = config.data[0].store_id;
                                                        var invoiceid = orderid;
                                                        var description = "Payments";
                                                        var currency = "INR";
                                                        var firstname = address.billing["firstname"];
                                                        var address1 = address.billing;
                                                        var address2 = address.shipping;
                                                        var postcode = address.shipping.postcode;
                                                        var country = "IN";
                                                        var phonenumber = address.shipping.phone;
                                                        var companyname = config.data[0].appname;
                                                        var basicurl = config.data[0].basicurl;
                                                        var return_url = BASE_URL + "?DR={DR}&service=mofluid_ebs_pgresponse&store=1&platform=" + config.data[0].platform;
                                                        var modetext = "TEST";
                                                        if (mode == "1") {
                                                            modetext = "LIVE";
                                                        }
                                                        var ebs_hash_raw = secret_key + "|" + accountid + "|" + cart.total_amount + "|" + invoiceid + "|" + return_url + "|" + modetext;
                                                        //   console.log(ebs_hash_raw);
                                                        var ebs_hash = MD5(ebs_hash_raw);
                                                        var emailid = user_email;
                                                        var mofluid_ebs_pay = {};
                                                        mofluid_ebs_pay["hash"] = ebs_hash;
                                                        mofluid_ebs_pay["account_id"] = accountid;
                                                        mofluid_ebs_pay["return_url"] = base64_encode(return_url);
                                                        mofluid_ebs_pay["mode"] = modetext;
                                                        mofluid_ebs_pay["reference_no"] = invoiceid;
                                                        mofluid_ebs_pay["amount"] = cart.total_amount;
                                                        mofluid_ebs_pay["description"] = description;
                                                        mofluid_ebs_pay["name"] = address.billing.firstname;
                                                        mofluid_ebs_pay["address"] = address.billing.street;
                                                        mofluid_ebs_pay["city"] = address.billing.city;
                                                        mofluid_ebs_pay["state"] = address.billing.region;
                                                        mofluid_ebs_pay["postal_code"] = address.billing.postcode;
                                                        mofluid_ebs_pay["country"] = address.billing.country;
                                                        mofluid_ebs_pay["phone"] = address.billing.phone;
                                                        mofluid_ebs_pay["email"] = address.billing.email;
                                                        mofluid_ebs_pay["site_url"] = BASE_URL;
                                                        mofluid_ebs_pay["mofluid_ebskey"] = secret_key;
                                                        var mofluid_ebs_data = JSON.stringify(mofluid_ebs_pay);
                                                        var ebs_payment_url = encodeURI(BASE_URL + "?service=ebspayment&store=1&mofluid_paymentdata=" + mofluid_ebs_data);
                                                        iabRef = window.open(ebs_payment_url, '_blank', 'location=yes');
                                                        iabRef.addEventListener('exit',
                                                            function() {
                                                                redirectAfterPayment();
                                                            });
                                                    } else if (paymethod == 'authorizenet') {
                                                        var data = {};
                                                        var invoiceid = orderid;
                                                        var loginID = getPaymentInfo("authorizenet", "payment_method_account_id");
                                                        var transactionKey = getPaymentInfo("authorizenet", "payment_method_account_key");
                                                        var email = user_email;
                                                        var address = JSON.parse(Base64.decode(localStorage[config.data[0].storage_key + '_address']));
                                                        try {
                                                            var total_ship_tax = parseFloat(parseFloat(cart.shipping_amount) + parseFloat(cart.tax_amount)).toFixed(2);
                                                        } catch (er) {
                                                            var total_ship_tax = 0;
                                                        }
                                                        data["pay_bill"] = address.billing;
                                                        data["pay_shipp"] = address.shipping;
                                                        data["product_shipamt"] = total_ship_tax;
                                                        data["total_amount"] = cart.total_amount;
                                                        data["cust_id"] = customerid;
                                                        data["invoice"] = invoiceid;
                                                        data["email"] = email;
                                                        data["loginID"] = loginID;
                                                        data["transactionKey"] = transactionKey;
                                                        data["authorize_return_url"] = BASE_URL;
                                                        data["mode"] = getPaymentInfo("authorizenet", "payment_method_mode");
                                                        data["currency_code"] = config.data[0].app_currency;
                                                        var pay_data = JSON.stringify(data);
                                                        pay_data = Base64.encode(pay_data);
                                                        var authorizenet_payment_url = encodeURI('authorize_net.html?pay_data=' + pay_data);
                                                        iabRef = window.open(authorizenet_payment_url, '_blank', 'location=yes');
                                                        iabRef.addEventListener('exit', function() {
                                                            redirectAfterPayment();
                                                        });
                                                    } else if (paymethod == "paypal_standard") {
                                                        var address = JSON.parse(Base64.decode(localStorage[config.data[0].storage_key + '_address']));
                                                        if (config.data[0].platform == "android") {
                                                            var subtotal_amount = (parseFloat(cart.total_amount).toFixed(2)).toString();
                                                            var paymentdata = {
                                                                "address": address,
                                                                "order": {
                                                                    "invoice": orderid.toString(),
                                                                    "currency": config.data[0].app_currency,
                                                                    "description": "Order " + orderid,
                                                                    "custom": "custom_text"
                                                                },
                                                                "config": {
                                                                    "mode": getPaymentInfo("paypal", "payment_method_mode"),
                                                                    "businessmail": getPaymentInfo("paypal", "payment_account_email"),
                                                                    "api_key": getPaymentInfo("paypal", "payment_method_account_key")
                                                                },
                                                                "app": {
                                                                    "name": config.data[0].app_name,
                                                                    "privacylink": config.data[0].baseurl,
                                                                    "userlink": config.data[0].baseurl
                                                                },
                                                                "amount": {
                                                                    "subtotal": subtotal_amount,
                                                                    "total": subtotal_amount,
                                                                    "tax": "0",
                                                                    "shipping": "0",
                                                                    "discount": "0"
                                                                }
                                                            };
                                                            if (parseFloat(subtotal_amount) <= 0) {
                                                                navigator.notification.alert(locale.message.text["message_for_invalid_payment_amount"], function() {
                                                                    redirectTopage('index.html');
                                                                }, config.data[0].app_name, locale.message.button["close"]);
                                                            } else {
                                                                //    console.log(paymentdata);
                                                                MofluidPaypal.initialize(paymentdata);
                                                            }
                                                        } else {
                                                            //  console.log("Paypal iOS Payment");
                                                            var business_mail = getPaymentInfo("paypal", "payment_account_email");
                                                            var payment_mode = getPaymentInfo("paypal", "payment_method_mode");
                                                            var data = {};
                                                            var paypal_url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
                                                            if (payment_mode == "1") {
                                                                var paypal_url = "https://www.paypal.com/cgi-bin/webscr";
                                                            }
                                                            //    console.log(paypal_url);
                                                            data["business_mail"] = business_mail;
                                                            data["pay_url"] = paypal_url;
                                                            data["total_amount"] = parseFloat(cart.total_amount).toFixed(2);
                                                            data["firstname"] = address.billing.firstname;
                                                            data["lastname"] = address.billing.lastname;
                                                            data["mofluid_order_id"] = orderid;
                                                            //    console.log(data);
                                                            var pay_data = JSON.stringify(data);
                                                            pay_data = Base64.encode(pay_data);
                                                            var paypal_payment_url = encodeURI('pay.html?pay_data=' + pay_data);
                                                            //  console.log(paypal_payment_url);
                                                            iabRef = window.open(paypal_payment_url, '_blank', 'location=yes');
                                                            iabRef.addEventListener('exit', function() {
                                                                redirectAfterPayment();
                                                            });

                                                        }
                                                    } else if (paymethod == "cashondelivery" || paymethod == "cod" || paymethod == "banktransfer" || paymethod == "free") {
                                             
                                                        var address = JSON.parse(Base64.decode(localStorage[config.data[0].storage_key + '_address']));
                                                        processInvoice(orderid, address, cart.coupon.amount ,paymethod);
                                                    } else {
                                                        var payment_url = config.data[0].basicurl + "payment" + paymethod_urlcode;
                                                        try {
                                                            var total_ship_tax = parseFloat(parseFloat(cart.shipping_amount) + parseFloat(cart.tax_amount)).toFixed(2);
                                                        } catch (er) {
                                                            var total_ship_tax = 0;
                                                        }
                                                        var total_amount = parseFloat(parseFloat(cart.total_amount) + total_ship_tax).toFixed(2);
                                                        var address = JSON.parse(Base64.decode(localStorage[config.data[0].storage_key + '_address']));
                                                        var data = {};
                                                        data["orderid"] = orderid;
                                                        data["amount"] = total_amount;
                                                        data["shopid"] = "";
                                                        data["first_name"] = address.billing.firstname;
                                                        data["last_name"] = address.billing.lastname;
                                                        data["siteurl"] = config.data[0].basicurl;

                                                        var pay_data = JSON.stringify(data);
                                                        pay_data = Base64.encode(pay_data);
                                                        var payment_process_url = encodeURI(payment_url + '?paymentdata=' + pay_data);
                                                        // console.log("total_amount " + total_amount);
                                                        // console.log(payment_process_url);
                                                        //window.open(payment_process_url);
                                                        iabRef = window.open(payment_process_url, '_blank', 'location=yes');
                                                        iabRef.addEventListener('exit', function() {
                                                            redirectAfterPayment();
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                } else {
                                    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                        navigator.notification.alert(locale.message.alert["failure_message_for_address_save"],
                                            function() {},
                                            config.data[0].app_name,
                                            locale.message.button["close"]
                                        );
                                    } else {
                                        alert(locale.message.alert["failure_message_for_address_save"]);
                                    }
                                }
                            } else {
                                if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                    navigator.notification.alert(locale.message.alert["failure_message_for_address_save"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                                } else {
                                    alert(locale.message.alert["failure_message_for_address_save"]);
                                }
                            }
                        } catch (ex) {
                            if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                navigator.notification.alert(locale.message.alert["failure_message_for_address_save"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                            } else {
                                alert(locale.message.alert["failure_message_for_address_save"] + ex.message);
                            }
                        }
                    });
            }
        });
}



function getPaymentInfo(paymentcode, requiredinfo) {

    if (paymentcode == 'authorizenet') {
        paymentcode = 'authorize';
    }
    try {

        var payment_data = JSON.parse(localStorage[config.data[0].storage_key+"_Paymethod"]);
        var total = payment_data.length;
        var i = 0;
        var result_data = '';
        for (i = 0; i < total; i++) {
            if (payment_data[i].payment_method_code == "" || payment_data[i].payment_method_code == null) {
                continue;
            }
            if (payment_data[i].payment_method_code == paymentcode) {

                result_data = payment_data[i][requiredinfo];

            }
        }
    } catch (exc) {
        //alert('Error'+exc.message);

    }
    return result_data;


}




/*
 *Function call to register user
 *@param fname, lname, email, pswd
 *@return
 */
function registerUser(fname, lname, email, pswd) {
    var BASE_URL = config.data[0].baseurl;
    $.getJSON("" + BASE_URL + "?callback=?" + "&store=1&service=createuser&firstname=" + fname + "&lastname=" + lname + "&email=" + email + "&password=" + pswd + "",
        function(response) {
            try {
                var status = response["status"];
                if (response && status != 0) {
                    var customerid = response["id"];
                    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                        navigator.notification.alert(locale.message.alert["register_successfully_message"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                    } else {
                        alert(locale.message.alert["register_successfully_message"]);
                    }
                    return customerid;
                } else {
                    return -1;
                }
            } catch (ex) {
                return -1;
            }
        });
}

/*
 *Function call to generate password
 *@param
 *@return
 */
function generatePassword() {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        var charCount = 0;
        var numCount = 0;
        for (var i = 0; i < string_length; i++) {
            if ((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
                var rnum = Math.floor(Math.random() * 10);
                randomstring += rnum;
                numCount += 1;
            } else {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
                charCount += 1;
            }
        }
        return randomstring;
    }
    /*
     *Function to sort products according to selection
     *@param
     *@return
     */
function sortProductList() {
    var stock_status = "0";
    var order = $("#select-choice-1").val();
    var results = JSON.parse(localStorage[config.data[0].storage_key+"_last_products_list"]);
    var sorted_product_list = '';
    var temp;
    if (order == "PriceL2H") {
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results.length - i; j++) {
                try {
                    if (parseFloat(results[j]["price"].replace(/\,/g, '')) > parseFloat(results[j + 1]["price"].replace(/\,/g, ''))) {
                        temp = results[j];
                        results[j] = results[j + 1];
                        results[j + 1] = temp;
                    }
                } catch (ex) {}
            }
        }
    } else if (order == "PriceH2L") {
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results.length - i; j++) {
                try {
                    if (parseFloat(results[j]["price"].replace(/\,/g, '')) < parseFloat(results[j + 1]["price"].replace(/\,/g, ''))) {
                        temp = results[j];
                        results[j] = results[j + 1];
                        results[j + 1] = temp;
                    }
                } catch (ex) {}
            }
        }
    } else if (order == "NameA2Z") {
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results.length - i; j++) {
                try {
                    if (results[j]["name"] > results[j + 1]["name"]) {
                        temp = results[j];
                        results[j] = results[j + 1];
                        results[j + 1] = temp;
                    }
                } catch (ex) {}
            }
        }
    } else if (order == "NameZ2A") {
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results.length - i; j++) {
                try {
                    if (results[j]["name"] < results[j + 1]["name"]) {
                        temp = results[j];
                        results[j] = results[j + 1];
                        results[j + 1] = temp;
                    }
                } catch (ex) {}
            }
        }
    } else if (order == "Date") {
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results.length - i; j++) {
                try {
                    if (parseInt(results[j]["id"]) < parseInt(results[j + 1]["id"])) {
                        temp = results[j];
                        results[j] = results[j + 1];
                        results[j + 1] = temp;
                    }
                } catch (ex) {}
            }
        }
    } else {
        for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results.length - i; j++) {
                try {
                    if (results[j]["id"] > results[j + 1]["id"]) {
                        temp = results[j];
                        results[j] = results[j + 1];
                        results[j + 1] = temp;
                    }
                } catch (ex) {}
            }
        }
    }
    var i = 0;
    while (i < results.length) {
        var productName = results[i]["name"];
        var pid = results[i]["id"];
        var price = results[i]["price"];
        price = CurrencyFormatted(price);
        price = addThousandsSeparator(price);
        var imageURL = results[i]["imageurl"];
        var SKU = results[i]["sku"];
        var sprice = results[i]["spclprice"];
        var dirPath = dirname(location.href);
        var is_stock = '';
        if (parseInt(results[i]["is_in_stock"]) > 0 && results[i]["stock_quantity"] > 0) {
            is_stock = locale.message.text["in_stock"];
            stock_status = "1";
        } else {
            is_stock = locale.message.text["out_of_stock"];
            stock_status = "0";
        }
        var fullPath = "'" + dirPath + "/product_details.html?id=" + pid + "stock_status" + stock_status + "'";
        /*     if (config.data[0].default_currency == "INR") {
             if(stock_status == "1"){
             sorted_product_list += '<div class="product_outer_div"><div class="product_inner_div"><div class="product_img_container"><img src="'+imageURL+'" class="product_main_img" onerror="bad_image(this);"/></div><div class="product_name_div">'+productName+'</div>                                    <div class="product_name_div"><img class="productPrize" src="images/rupee_symbol.png" width="10px" height="12px"> '+price+'</div><div style="width:100%"><div class="detail_div" id="details"><input type="button" data-theme="c" value="Details" onclick="parent.location=' + fullPath + '" /></div><div class="cart_div" id="cart"><input type="button" data-theme="b" value="'+locale.message.button["add_to_cart"]+'" onclick="addDirectToCart('+pid+','+stock_status+')" />                                    </div></div></div></div>';
             }
             else{
             sorted_product_list += '<div class="product_outer_div"><div class="product_inner_div"><div class="product_img_container"><img src="'+imageURL+'" class="product_main_img" onerror="bad_image(this);"/></div><div class="product_name_div">'+productName+'</div>                                    <div class="product_name_div"><img class="productPrize" src="images/rupee_symbol.png" width="10px" height="12px"> '+price+'</div><div style="width:100%"><div class="detail_div" id="details"><input type="button" data-theme="c" value="Details" onclick="parent.location=' + fullPath + '" /></div><div class="cart_div" id="cart"><input type="button" data-theme="b" value="'+locale.message.button["add_to_cart"]+'" onclick="addDirectToCart('+pid+','+stock_status+')" />                                    </div></div></div></div>';
             }
             }
             else {*/
        if (stock_status == "1") {
            sorted_product_list += '<div class="product_outer_div"><div class="product_inner_div"><div class="product_img_container"><img src="' + imageURL + '" class="product_main_img" onerror="bad_image(this);"/></div><div class="product_name_div">' + productName + '</div><div class="product_name_div">' + app_curr_symbol + price + '</div><div style="width:100%"><div class="detail_div" id="details"><input type="button" data-theme="c" value="Details" onclick="parent.location=' + fullPath + '" /></div><div class="cart_div" id="cart"><input type="button" data-theme="b" value="' + locale.message.button["add_to_cart"] + '" onclick="addDirectToCart(' + pid + ',' + stock_status + ')" /></div></div></div></div>';
        } else {
            sorted_product_list += '<div class="product_outer_div"><div class="product_inner_div"><div class="product_img_container"><img src="' + imageURL + '" class="product_main_img" onerror="bad_image(this);"/></div><div class="product_name_div">' + productName + '</div><div class="product_name_div">' + app_curr_symbol + price + '</div><div style="width:100%"><div class="detail_div" id="details"><input type="button" data-theme="c" value="Details" onclick="parent.location=' + fullPath + '" /></div><div class="cart_div" id="cart"><input type="button" data-theme="b" value="' + locale.message.button["add_to_cart"] + '" onclick="addDirectToCart(' + pid + ',' + stock_status + ')" /></div></div></div></div>';
        }
        //   }
        i++;
    }
    $("#category").html(sorted_product_list);
    $("#category").trigger("create");
}

/*
 *Function to start login
 *@param
 *@return
 */
function loginStart(customerid, first_name, last_name, email, password) {
    var Session = new Object();
    localStorage[config.data[0].storage_key+'_Session'] = null;
    Session["customer_id"] = customerid;
    Session["first_name"] = first_name;
    Session["last_name"] = last_name;
    Session["email"] = email;
    Session["password"] = password;
    Session["login_status"] = "Active";
    var current_date = new Date();
    var login_date = current_date.getDate() + "/" + (current_date.getMonth() + 1) + "/" + current_date.getFullYear();
    var login_time = current_date.getHours() + ":" + current_date.getMinutes() + ":" + current_date.getSeconds();
    Session["login_date"] = login_date;
    Session["login_time"] = login_time;
    var JSession = JSON.stringify(Session);
    localStorage[config.data[0].storage_key+'_Session'] = JSession;
}

/*
 *Function call to logout
 *@param
 *@return
 */
function logOut() {
        localStorage[config.data[0].storage_key+'_Session'] = null;
        clearCart();
        var CouponDetail = new Object();
        CouponDetail["apply_to_shipping"] = "";
        CouponDetail["simple_action"] = "";
        CouponDetail["discount_amount"] = "";
        CouponDetail["discount_qty"] = "";
        CouponDetail["shipmyidonly"] = "";
        localStorage[config.data[0].storage_key+"_coupondetails"] = JSON.stringify(CouponDetail);
        localStorage[config.data[0].storage_key+"_couponapplied"] = "0";
        localStorage[config.data[0].storage_key+"_coupon_code"] = JSON.stringify("");
        if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
            navigator.notification.alert(locale.message.alert["sign_out_message"], function() {}, config.data[0].app_name, locale.message.button["close"]);
        } else {
            alert(locale.message.alert["sign_out_message"]);
        }
        visitHomePage();
    }
    /*
     *Function to redirect to login page
     *@param
     *@return
     */
function goLoginPage() {
    localStorage[config.data[0].storage_key+'_Session'] = null;
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/login.html";
    window.location = fullPath;
}

/*
 *Function to redirect to login page
 *@param
 *@return
 */
function goLogin(next) {
    var dirPath = dirname(location.href);
    localStorage[config.data[0].storage_key+"_nextpage"] = next;
    var fullPath = dirPath + "/login.html";
    window.location = fullPath;
}

/*
 *Function to redirect to invoice page
 *@param
 *@return
 */
function goInvPage() {
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/invoice.html";
    window.location = fullPath;
}

/*
 *Function to redirect to pay page
 *@param
 *@return
 */
function visitPayPage() {
    localStorage.clear();
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/pay.html";
    window.location = fullPath;
}

/*
 *Function to redirect to shipmyid page
 *@param
 *@return
 */
function visitShipMyIdPage() {
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/shiptomyid.html";
    window.location = fullPath;
}

/*
 *Function to redirect to cart page
 *@param
 *@return
 */
function visitCartPage() {
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/cart.html";
    window.location = fullPath;
}

/*
 *Function to redirect to home page
 *@param
 *@return
 */
function visitHomePage() {
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/index.html";
    window.location = fullPath;
}

/*
 *Function to redirect after payment
 *@param
 *@return
 */
function redirectAfterPayment() {
    clearCart();
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/index.html";
    window.location = fullPath;
}

/*
 *Function to redirect to home page
 *@param
 *@return
 */
function visitHomePageBuy() {
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/index.html";
    window.location = fullPath;
}

/*
 *Function to redirect to edit profile page
 *@param
 *@return
 */
function goEditProfile() {
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/editprofile.html";
    window.location = fullPath;
}

/*
 *Function to redirect to profile page
 *@param
 *@return
 */
function goMyProfile() {
    if (localStorage[config.data[0].storage_key+"_Session"] == null) {
        visitHomePage();
    } else {
        var Session = JSON.parse(localStorage[config.data[0].storage_key+"_Session"]);
        if (Session == null) {
            visitHomePage();
        } else {
            if (Session["login_status"] == "Active") {
                var dirPath = dirname(location.href);
                var fullPath = dirPath + "/profile.html";
                window.location = fullPath;
            } else {
                visitHomePage();
            }
        }
    }
}


/*
 *Function to redirect to my order page
 *@param
 *@return
 */
function goMyOrder() {
    if (localStorage[config.data[0].storage_key+"_Session"] == null) {
        visitHomePage();
    } else {
        var Session = JSON.parse(localStorage[config.data[0].storage_key+"_Session"]);
        if (Session == null) {
            visitHomePage();
        } else {
            if (Session["login_status"] == "Active") {
                var dirPath = dirname(location.href);
                var fullPath = dirPath + "/myorder.html";
                window.location = fullPath;
            } else {
                visitHomePage();
            }
        }
    }
}


/*
 *Function to show search box
 *@param
 *@return
 */
function goSearchPage() {
    display_serach_home();
    $("#navpanel").panel("close");
}

/*
 *Function to show search box
 *@param
 *@return
 */
function goSearch() {
    display_serach();
    $("#navpanel").panel("close");
}

/*
 *Function to show search box
 *@param
 *@return
 */
function display_serach() {
    $("#default_header_bar").css("display", "none");
    $("#search-product-div").css("display", "block");
}

/*
 *Function to show search box
 *@param
 *@return
 */
function display_serach_home() {
    $("#default_header_bar").css("display", "none");
    $("#search-product-div").css("display", "inline-block");
}


/*
 *Function to hide search box
 *@param
 *@return
 */
function hide_serach() {
    $("#default_header_bar").css("display", "block");
    $("#search-product-div").css("display", "none");
}


/*
 *Function to search product and redirect to search page
 *@param
 *@return
 */
function custom_search() {
    var searchdata = document.getElementById("searchFilter").value;
    if (searchdata == null || searchdata == "") {
        if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
            navigator.notification.alert(locale.message.alert["message_when_empty_search"], function() {}, config.data[0].app_name, locale.message.button["close"]);
        } else {
            alert(locale.message.alert["message_when_empty_search"]);
        }
    } else {
        searchdata = Base64.encode(searchdata);
        localStorage[config.data[0].storage_key+"_search_data_value"] = searchdata;
        var dirPath = dirname(location.href);
        var fullPath = dirPath + "/search.html?search-data=" + searchdata;
        window.location = fullPath;
    }
}


/*
 *Function to display term of use
 *@param
 *@return
 */
function termofuse() {
    window.open('http://www.mapmyid.com/terms-of-use', '_blank', 'location=yes');
}

/*
 *Function to display privacy link
 *@param
 *@return
 */
function privacyLink() {
    window.open('http://www.mapmyid.com/privacy', '_blank', 'location=yes');
}


/*
 *Function to cancel coupon
 *@param
 *@return
 */
function cancelCoupon() {
	var couponcode = localStorage[config.data[0].storage_key+"_coupon_code"];
    try {
        var cart =  JSON.parse(localStorage[config.data[0].storage_key+"_cart"]) ;
        var couponcode = cart.coupon.code;
        var coupon ={};
        coupon.applied = 0;
        coupon.code = "";
        coupon.amount = 0;
        cart["coupon"] = coupon; 
        localStorage[config.data[0].storage_key+"_cart"] = JSON.stringify(cart);
     
        //var couponcode = JSON.parse(localStorage[config.data[0].storage_key+"_coupon_code"]);
        localStorage[config.data[0].storage_key+"_couponapplied"] = "0";
        localStorage[config.data[0].storage_key+"_coupon_code"] = JSON.stringify("");
        if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
            navigator.notification.alert(locale.message.alert["coupon_canceled"].replace("{{coupon}}", couponcode), function() {}, config.data[0].app_name, locale.message.button["close"]);
        } else {
            alert(locale.message.alert["coupon_canceled"].replace("{{coupon}}", couponcode));
        }
        var CouponDetail = new Object();
        CouponDetail["apply_to_shipping"] = "";
        CouponDetail["simple_action"] = "";
        CouponDetail["discount_amount"] = "";
        CouponDetail["discount_qty"] = "";
        CouponDetail["shipmyidonly"] = "";
        localStorage[config.data[0].storage_key+"_coupondetails"] = JSON.stringify(CouponDetail);
        location.reload(true);
    } catch (ex) {
       if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
            navigator.notification.alert(locale.message.alert["coupon_canceled"].replace("{{coupon}}", couponcode), function() {}, config.data[0].app_name, locale.message.button["close"]);
        } else {
            alert(locale.message.alert["coupon_canceled"].replace("{{coupon}}", couponcode));
        }
        location.reload(true);
    }
}

/*
 *Function to cancel shipmyid coupon
 *@param
 *@return
 */
function cancelShipmyIDCoupon() {
    try {
        var couponcode = JSON.parse(localStorage[config.data[0].storage_key+"_coupon_code"]);
        localStorage[config.data[0].storage_key+"_couponapplied"] = "0";
        localStorage[config.data[0].storage_key+"_coupon_code"] = JSON.stringify("");
        if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
            navigator.notification.alert(locale.message.alert["coupon_canceled"].replace("{{coupon}}", couponcode), function() {}, config.data[0].app_name, locale.message.button["close"]);
        } else {
            alert(locale.message.alert["coupon_canceled"].replace("{{coupon}}", couponcode));
        }
        var CouponDetail = new Object();
        CouponDetail["apply_to_shipping"] = "";
        CouponDetail["simple_action"] = "";
        CouponDetail["discount_amount"] = "";
        CouponDetail["discount_qty"] = "";
        CouponDetail["shipmyidonly"] = "";
        localStorage[config.data[0].storage_key+"_coupondetails"] = JSON.stringify(CouponDetail);
        $("#cancelcoupon").hide();
        $("#coupon_code").val("");
    } catch (ex) {
        console.log(ex);
    }
}

/*
 *Function to apply shipmyid coupon
 *@param
 *@return
 */
function applyShipmyidCoupon() {
    var couponcode = $("#coupon_code").val();
    if (couponcode == "") {
        if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
            navigator.notification.alert(locale.message.text["coupon_code_text"], function() {}, config.data[0].app_name, locale.message.button["close"]);
        } else {
            alert(locale.message.text["coupon_code_text"]);
        }
        $("#coupon_code").focus();
    } else {
        var BASE_URL = config.data[0].baseurl;
        var STORE = config.data[0].storeid;
        var customeridd = "";
        try {
            var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
            customeridd = Session["customer_id"];
        } catch (ex) {
            console.log(ex);
        }
        $("#applybutton").html('<center><img src="images/spin.gif"></center>');
        //---Fetch Store Details from Mofluid Magento Web Service
        $.getJSON("" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=couponDetails&couponCode=" + couponcode,
            function(response) {
                if (response.status == "1") {
                    var is_active = response.is_active;
                    var shipmyidonly = response.shipmyidonly;
                    var apply_to_shipping = response.apply_to_shipping;
                    var simple_action = response.simple_action;
                    var discount_amount = response.discount_amount;
                    var discount_qty = response.discount_qty;
                    var CouponDetail = new Object();
                    if (is_active == "1") {
                        CouponDetail["apply_to_shipping"] = apply_to_shipping;
                        CouponDetail["shipmyidonly"] = shipmyidonly;
                        CouponDetail["simple_action"] = simple_action;
                        CouponDetail["discount_amount"] = Math.round(parseFloat(discount_amount) * 100) / 100;
                        CouponDetail["discount_qty"] = response.discount_qty;
                        $.getJSON("" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=validateCoupon&couponCode=" + couponcode + "&customerid=" + customeridd,
                            function(response) {
                                if (response.result == "1") {
                                    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                        navigator.notification.alert(locale.message.alert["coupon_applied"].replace("{{coupon}}", couponcode), function() {}, config.data[0].app_name, locale.message.button["close"]);
                                    } else {
                                        alert(locale.message.alert["coupon_applied"].replace("{{coupon}}", couponcode));
                                    }
                                    localStorage[config.data[0].storage_key+"_couponapplied"] = "1";
                                    localStorage[config.data[0].storage_key+"_coupon_code"] = JSON.stringify(couponcode);
                                    localStorage[config.data[0].storage_key+"_coupondetails"] = JSON.stringify(CouponDetail);
                                    $("#cancelcoupon").show();
                                    $("#applybutton").html('<input type="button" id="apply_coupon" class="cartButton2" class="content-secondry" data-role="button" data-theme="a" value="Apply Coupon" onclick="applyShipmyidCoupon();">');
                                    $("#applybutton").trigger("create");
                                    // location.reload(true);
                                } else {
                                    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                                        navigator.notification.alert(locale.message.alert["coupon_failed"].replace("{{coupon}}", couponcode), function() {}, config.data[0].app_name, locale.message.button["close"]);
                                    } else {
                                        alert(locale.message.alert["coupon_failed"].replace("{{coupon}}", couponcode));
                                    }
                                    var CouponDetaill = new Object();
                                    CouponDetaill["apply_to_shipping"] = "";
                                    CouponDetaill["simple_action"] = "";
                                    CouponDetaill["discount_amount"] = "";
                                    CouponDetaill["discount_qty"] = "";
                                    localStorage[config.data[0].storage_key+"_coupondetails"] = JSON.stringify(CouponDetaill);
                                    localStorage[config.data[0].storage_key+"_couponapplied"] = "0";
                                    localStorage[config.data[0].storage_key+"_coupon_code"] = JSON.stringify("");
                                    $("#cancelcoupon").hide();
                                    $("#applybutton").html('<input type="button" id="apply_coupon" class="cartButton2" class="content-secondry" data-role="button" data-theme="a" value="Apply Coupon" onclick="applyShipmyidCoupon();">');
                                    $("#applybutton").trigger("create");
                                    //  location.reload(true);
                                }
                            });
                    } else {
                        if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                            navigator.notification.alert(locale.message.alert["coupon_failed"].replace("{{coupon}}", couponcode), function() {}, config.data[0].app_name, locale.message.button["close"]);
                        } else {
                            alert(locale.message.alert["coupon_failed"].replace("{{coupon}}", couponcode));
                        }
                        //location.reload(true);
                        $("#applybutton").html('<input type="button" id="apply_coupon" class="cartButton2" class="content-secondry" data-role="button" data-theme="a" value="Apply Coupon" onclick="applyShipmyidCoupon();">');
                        $("#applybutton").trigger("create");
                    }
                } else {
                    if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                        navigator.notification.alert('Coupon code "' + couponcode + '" is not valid.', function() {}, config.data[0].app_name, locale.message.button["close"]);
                    } else {
                        alert('Coupon code "' + couponcode + '" is not valid.');
                    }
                    localStorage[config.data[0].storage_key+"_couponapplied"] = "0";
                    localStorage[config.data[0].storage_key+"_coupon_code"] = JSON.stringify("");
                    $("#cancelcoupon").hide();
                    $("#applybutton").html('<input type="button" id="apply_coupon" class="cartButton2" class="content-secondry" data-role="button" data-theme="a" value="Apply Coupon" onclick="applyShipmyidCoupon();">');
                    $("#applybutton").trigger("create");
                }
            });
    }
}


/*
 *Function to save state from dropdown to text field
 *@param
 *@return
 */
function savestate() {
    state = $("#states").val();
    $("#state").val(state);
}

/*
 *Function to print state and call webservice
 *@param
 *@return
 */
function printstate() {
    var BASE_URL = config.data[0].baseurl;
    var STORE = config.data[0].storeid;
    var Countrycode = $("#country").val();
    $.mobile.loading("show");
            
    $.getJSON("" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=mofluidappstates&country=" + Countrycode,
        function(response) {
            if (response.length == "0") {
                $("#state_textfield").show();
                $("#state_dropdown").hide();

            } else {
                $("#state_textfield").hide();
                $("#state_dropdown").show();
                print_state(response);
            }
            $.mobile.loading("hide");
            
        });
}

/*
 *Function to create state dropdown
 *@param state array
 *@return
 */
function print_state(state_arr) {
    var statearr = state_arr.mofluid_regions;
    var option_str1 = document.getElementById("states");
    option_str1.options = "";
    var i = 1,
        indexj = 0;
    option_str1.options[0] = new Option("Select", "Select");

    $.each(statearr, function() {
        option_str1.options[i++] = new Option(statearr[indexj].region_name, statearr[indexj].region_id);
        indexj++;
    });
    state = $("#state").val();
    if ($("#states option[value='" + state + "']").length > 0) {
        $("#states").val(state);
    } else {
        $("#states").val("Select");
    }
    $("#states").selectmenu("refresh", true);
}

/*
 *Function to save ship state from dropdown to text field
 *@param
 *@return
 */
function saveSstate() {
    state = $("#Sstates").val();
    $("#Sstate").val(state);
}

/*
 *Function to print ship state
 *@param
 *@return
 */
function printSstate() {
    var BASE_URL = config.data[0].baseurl;
    var STORE = config.data[0].storeid;
    var Countrycode = $("#Scountry").val();
    $.mobile.loading("show");
    $.getJSON("" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=mofluidappstates&country=" + Countrycode,
        function(response) {
            if (response.length == "0") {
                $("#Sstate_textfield").show();
                $("#Sstate_dropdown").hide();

            } else {
                $("#Sstate_textfield").hide();
                $("#Sstate_dropdown").show();
                print_Sstate(response);
            }
            $.mobile.loading("hide");
            
        });
}

/*
 *Function to create ship state dropdown
 *@param
 *@return
 */
function print_Sstate(state_arr) {
    var statearr = state_arr.mofluid_regions;
    var option_str1 = document.getElementById("Sstates");
    option_str1.options = "";
    var i = 1,
        indexjj = 0;
    option_str1.options[0] = new Option("Select", "Select");
    $.each(statearr, function() {
        option_str1.options[i++] = new Option(statearr[indexjj].region_name, statearr[indexjj].region_id);
        indexjj++;
    });
    state = $("#Sstate").val();
    if ($("#Sstates option[value='" + state + "']").length > 0) {
        $("#Sstates").val(state);
    } else {
        $("#Sstates").val("Select");
    }
    $("#Sstates").selectmenu("refresh", true);
}

/*
 *Function to show image on error
 *@param image
 *@return
 */
function bad_image(image) {
    image.src = "images/product_default_image.png";
}
function loadLogoBanner() {
    try {
    	   var store = JSON.parse(localStorage[config.data[0].storage_key+"_STORE"]);
        $(".navigation_logo").html(store.logo);
        $("#banner_slider").html(store.banner);
        var owl = $("#banner_slider");
        owl.owlCarousel({
		   items : 1, //10 items above 1000px browser width
		   itemsDesktop : [1000,1], //5 items between 1000px and 901px
		   itemsDesktopSmall : [900,1], // betweem 900px and 601px
		   itemsTablet: [600,1], //2 items between 600 and 0
		   itemsMobile : false,  // itemsMobile disabled - inherit from itemsTablet option
		   navigation : false,
		   pagination: false
	  });
    }
    catch(err) {
        console.log(store);
        console.log("Problem while loading Logo and Banner.");
    }
}

function badBannerImage(image) {
    image.src = 'images/' + config.data[0].banner;
}

function printLogo() {
    try {
    	   var store = JSON.parse(localStorage[config.data[0].storage_key+"_STORE"]);
    	   $(".navigation_logo").html(store.logo);
    }
    catch(err) {
        console.log("logo is missing");
    }
    
}
var search_flag=0;
$(document).ready(function() {
    printLogo();
                // alert("abc");
    $("#search_btn").click(function(){
        $("#searchBox").slideToggle(50);
                           if(search_flag==0){
                                $(".navigation_search").addClass("active");
                                search_flag=1;
                           }
                           else{
                                 $(".navigation_search").removeClass("active");
                                 search_flag=0;
                           }
    });
});


function addDirectToCart(PRODUCT_ID, stock_status) {
    var BASE_URL = config.data[0].baseurl;
    var STORE = config.data[0].storeid;
                          
    //---- Fetch Product Details from Magento Store via Mofluid Magento Webservice
    $.getJSON("" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=productdetail&productid=" + PRODUCT_ID,
        function(results) {
            console.log(results);
            pSKU = results["sku"];
            pShipp = results["shipping"];
            pName = results["name"];
            pPriceReal = results["price"];
            pPriceSpl = results["sprice"];
            pPriceDis = results["discount"];
            hasImage = results["image"];
            pColor = results["color"];
            pShipp = results["shipping"];
            pTotalQuant = results["quantity"];
            pSize = results["pSize"];

            if (pPriceSpl == "" || parseFloat(pPriceSpl) <= 0 || !pPriceSpl)
                pPriceSpl = 0;
            if (pPriceDis == "" || parseFloat(pPriceDis) <= 0 || !pPriceDis)
                pPriceDis = 0;
            if (pPriceReal == "" || parseFloat(pPriceReal) <= 0 || !pPriceReal)
                pPriceReal = 0;
            if (pPriceSpl == 0 && pPriceDis == 0)
                pPrice = pPriceReal;
            else if (pPriceSpl == 0)
                pPrice = pPriceDis;
            else if (pPriceDis == 0)
                pPrice = pPriceSpl;
            else if (pPriceSpl <= pPriceDis)
                pPrice = pPriceSpl;
            else if (pPriceDis <= pPriceSpl)
                pPrice = pPriceDis;
            else
                pPrice = pPriceReal;

            try {
                if (!hasImage[0])
                    imageURL = "images/product_default_image.png";
                else
                    imageURL = hasImage[0];
            } catch (ee) {}

            if (pTotalQuant == "" || !pTotalQuant || parseInt(pTotalQuant) < 1 || stock_status == "0")
                pStock = locale.message.text["out_of_stock"];
            else
                pStock = locale.message.text["in_stock"];

            if (pStock == locale.message.text["out_of_stock"]) {
                if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
                    navigator.notification.alert(locale.message.text["out_of_stock"], function() {}, config.data[0].app_name, locale.message.button["close"]);
                } else {
                    alert(locale.message.text["out_of_stock"]);
                }
                location.reload(true);
            } else {

                addToCart(PRODUCT_ID + "stock_status" + stock_status, pSKU, pPrice, pShipp, imageURL, pName, pSize, pColor);
            }
        });


}

function checkCart() {
    try {
        console.log(JSON.parse(localStorage[config.data[0].storage_key+'_pQuantities']).length);
        if (JSON.parse(localStorage[config.data[0].storage_key+'_pNames']) == "" || JSON.parse(localStorage[config.data[0].storage_key+'_pNames']) == null) {
            visitHomePage();
        } else if (JSON.parse(localStorage[config.data[0].storage_key+'_pQuantities']).length == 0) {
            visitHomePage();
        }
    } catch (ex) {
        console.log(ex);
        visitHomePage();
    }

}




function validateAddress(address) {
    var re = /^[a-zA-Z0-9\s,'/-]*$/;
    return re.test(address);
}


function CurrencyFormatted(amount) {
    var i = parseFloat(amount);
    if (isNaN(i)) {
        i = 0.00;
    }
    var minus = '';
    if (i < 0) {
        minus = '-';
    }
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;
    s = new String(i);
    if (s.indexOf('.') < 0) {
        s += '.00';
    }
    if (s.indexOf('.') == (s.length - 2)) {
        s += '0';
    }
    s = minus + s;
    return s;
}

function addThousandsSeparator(input) {
    var output = input
    if (parseFloat(input)) {
        input = new String(input); // so you can perform string operations
        var parts = input.split("."); // remove the decimal part
        parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
        output = parts.join(".");
    }

    return output;
}

function fireEmail(order_id) {
    var BASE_URL = config.data[0].baseurl;
    var STORE = config.data[0].storeid;

    var serr_url = "" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=mofluid_sendorder_mail&orderid=" + order_id;
    $.getJSON(serr_url,
        function(response) {

        });
}


function redirectToproductdetail(product_id) {

    var dirPath = dirname(location.href);

    var fullPath = "product_details.html?id="+product_id;
    Page.redirect(fullPath, 'slide', 'down')
                
   // window.location = fullPath;
}


function showBankDetails(value) {
    if (value == "banktransfer" && $("#bankdetails").text() != "") {
        $("#bankdetails").slideDown('slow');
    } else {
        $("#bankdetails").slideUp('slow');
    }
}
                
function ScaleContentToDevice(){

var headerHeights = 0,footerHeights = 0;

$('.ui-header').each(function(index, obj){
                     
                     var itm = $( this );
                     
                     if (itm)
                     
                     {
                     
                     headerHeights = headerHeights + itm.outerHeight();
                     
                     }
                     
                     });



header=headerHeights;

var screen = $.mobile.getScreenHeight();

var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
var content = screen - header -  contentCurrent;

$(".ui-content").height(content);

}
                

function toggle_password(target, self){
    if (document.getElementById(self).checked){
		 document.getElementById(target).setAttribute('type', 'text');
	} else {
		 document.getElementById(target).setAttribute('type', 'password');   
    }
}
                
function processInvoice(orderid, address, amount,paymethod) {
    //  var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
	 //var email = Session["email"];
  //   alert(paymethod);
                var payment_m='';
                if(paymethod == 'cashondelivery')
                {
                    payment_m='COD';
                } else if(paymethod=='banktransfer')
                {
                    payment_m='Bank Transfer';
                } else {
                payment_m=paymethod;
                }
                
     var Order = new Object();
                
     Order["payment_method"] = payment_m;
	 Order["orderid"] = orderid;
	 Order["name"] = address.billing.firstname + " " + address.billing.lastname;
	 Order["city"] = address.shipping.city;
	 Order["state"] = address.shipping.region;
	 Order["address"] = address.shipping.street;
	 Order["amount"] = amount;
	 Order["email"] = address.billing.email;
	 Order["phone"] = address.shipping.phone;
	 Order["pincode"] = address.shipping.postcode;
	 Order["transid"] = 111;
	 Order["ship_type"] = 1;
	 Order["recemail"] = address.shipping.email ? address.shipping.email : address.billing.email;
	 var JOrder = JSON.stringify(Order);
	 localStorage[config.data[0].storage_key+'_Order'] = JOrder;
	 clearCart();
	 goInvPage();
}
   function phoneDial(number) {
	phonedialer.dial(
  		number, 
  		function(err) {
    			if (err == "empty") 
    				console.error("Unknown phone number");
    			else 
    				console.error("Dialer Error:" + err);    
  		},
  		function(success) { 
  			console.log('Dialing '+number+' succeeded'); 
  		}
 	);
 }
 
function emailSend(email) {
    try {
	   cordova.plugins.email.open({
		  to:  email,
		  subject: config.data[0].app_name
	   });
    }
    catch(err) {
        window.location.href = "mailto:"+email+"?subject="+config.data[0].app_name;
    }    
}
var ref = null;
function openLink(url)
{
    try {
         ref = window.open(encodeURI(url),'_blank','location=no'); //encode is needed if you want to send a variable with your link if not you can use ref = window.open(url,'_blank','location=no');
         ref.addEventListener('loadstop', externalLinkLoadStop);
         ref.addEventListener('exit', externalLinkClose);
    }
    catch (err)    
    {
        console.error(err);
    }
}
function externalLinkLoadStop(event) {
    if(event.url == "http://www.mypage.com/closeInAppBrowser.html"){
        ref.close();
    }    
}
function externalLinkClose(event) {
    ref.removeEventListener('loadstop', externalLinkLoadStop);
    ref.removeEventListener('exit', externalLinkClose);
} 
//updateOrderStatus(MofluidPaypal.data.order.invoice, address, MofluidPaypal.data.amount.total, processInvoice);

function updateOrderStatus_bak(orderid, address, total) {
    var app_curr_code = config.data[0].app_currency;
    var customerid;
     try {
          var Session = JSON.parse(localStorage[config.data[0].storage_key+'_Session']);
          customerid = Session["customer_id"];
          var order_update =  config.data[0].baseurl + "?callback=?" + "&store=" + config.data[0].storeid + "&service=orderupdate&currency="+app_curr_code+"&theme="+config.data[0].theme+"&orderid="+orderid+"&customerid="+customerid;
	     console.log(order_update);
	     $.ajax({
		    url: order_update,
		    type: "get",
		    dataType: "jsonp",
		    beforeSend: function(){
			    console.log("Before Store Webservice");
		    },
		    error: function(){
			  console.log(locale.message.alert["try_again"])
		    },
		    complete: function(){
			    console.log("Complete Webservice");
		    },
		    success: function( response ){
			   processInvoice(orderid, address, total); 
		    }
	    });
     } catch (ex) {
           console.log(ex);
     }      
}
                
function updateOrderStatus(orderid, address, total) {
    var app_curr_code = config.data[0].app_currency;
    try {
        try {
            var Session = JSON.parse(localStorage[config.data[0].storage_key + '_Session']);
            if (Session != null) {
                var customerid = Session["customer_id"];
            }
            else {
                var customerid = "notlogin";
            }
        }
        catch (ex) {
            var customerid = "notlogin";
        }
        var order_update =  config.data[0].baseurl + "?callback=?" + "&store=" + config.data[0].storeid + "&service=orderupdate&currency="+app_curr_code+"&theme="+config.data[0].theme+"&orderid="+orderid+"&customerid="+customerid;
      $.ajax({
        url: order_update,
        type: "get",
        dataType: "jsonp",
        beforeSend: function(){
          console.log("Before Store Webservice");
        },
        error: function(){
               console.log(locale.message.alert["try_again"])
        },
        complete: function(){
          console.log("Complete Webservice");
        },
        success: function( response ){
         processInvoice(orderid, address, total); 
        }
      });
     } catch (ex) {
           console.log(ex);
     }      
}
  
var product_det_from_page = new function() {
//--------------------------------------Simple product detail function-------------------------------
    this.simple_product_info = function(response){
        
                
                localStorage.setItem('foo', 0);
        $(".ui-loader").show();
        var buyNowContent = selectSize = '';
        var pSizes = [];
        var params = JSON.parse(response);
                var results = params.result;
                global_results_configurable = results;
                stock_status = params.stock_status;
                pType = results["type"];
                pType = results["type"];
                pId = results["id"];
                custom_attr = results["custom_attribute"];
                custom_attr_len = custom_attr.total;
                custom_attr_data = custom_attr.data;
                
                console.log("This Product is Simple Product");
                pName = results["name"];
                localStorage[config.data[0].storage_key+"_Preview_Name"] = pName;
                pCat = results["category"][0];
                pSKU=results["sku"];
                description = results["description"];
                shortdes =results["shortdes"];
                pPriceReal= results["price"];
                pPriceSpl = results["sprice"];
                pPriceDis = results["discount"];
                has_custom_options = results["has_custom_option"];
                
                
                pMaterial = results["material"];
                pStyle = results["style"];
                pColor= results["color"];
                pShipp = results["shipping"];
                pTotalQuant = results["quantity"];
                pSize  = results["pSize"];
                
                
                //Stock data
             //   var stock = results['stock'];
              //  $("#manage_stock").val(stock['manage_stock']);
               // $("#use_config_manage_stock").val(stock['use_config_manage_stock']);
               // $("#max_sale_qty").val(stock['max_sale_qty']);
               // $("#config_manage_stock").val(stock['config_manage_stock']);
                
                
                
                
                
                
                
                $("#productdescription").show();
                //Create Custom Options
                if(has_custom_options) {
                var custom_options = results["custom_option"];
                var custom_options_length = custom_options.length;
                var custom_options_counter;
                var custom_options_table_data = '<table id="custom_options_table" width="100%" cellpadding="0" cellspacing="0" class="productDesc">';
                for(custom_options_counter=0;custom_options_counter<custom_options_length;custom_options_counter++) {
                var current_class_validation = 'notrequired';
                var current_option_type = custom_options[custom_options_counter].custom_option_type;
                if(current_option_type == 'file' || current_option_type == 'date_time'){
                }
                else {
                custom_options_table_data += '<tr>';
                custom_options_table_data += '<td>'+custom_options[custom_options_counter].custom_option_name;
                if(current_option_type == 'field' || current_option_type == 'area' || current_option_type == 'file' || current_option_type == 'date' || current_option_type == 'time' || current_option_type == 'date_time') {
                custom_options_table_data += ' &nbsp;+'+app_curr_symbol+parseFloat(custom_options[custom_options_counter]["all"].price).toFixed(2);
                }
                //apply required flag
                if(custom_options[custom_options_counter].custom_option_is_required == "1") {
                custom_options_table_data += '<span style="color:red">*</span>';
                current_class_validation = 'required';
                }
                custom_options_table_data += '</td>';
                
                //create custom options control
                var current_field_id = ((custom_options[custom_options_counter].custom_option_name+custom_options[custom_options_counter].custom_option_id).replace(/[^A-Z0-9]/ig, "")).toLowerCase();
                var custom_option_id = custom_options[custom_options_counter].custom_option_id;
                //if the control type is drop down
                if(custom_options[custom_options_counter].custom_option_type == 'drop_down') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                
                custom_options_table_data += '<select id="'+current_field_id+'" sort_order="'+custom_options[custom_options_counter].sort_order+'" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'">';
                if(current_class_validation == 'required') {
                custom_options_table_data += '<option disabled selected price="" value="">'+locale.message.text["select"]+'</option>';
                }
                else {
                custom_options_table_data += '<option selected  price="" sort_order="0" value="">'+locale.message.text["select"]+'</option>';
                }
                for (var key in custom_option_values){
                if (custom_option_values.hasOwnProperty(key)) {
                custom_options_table_data += '<option valueid='+custom_option_values[key].id+' sort_order_parent="'+custom_options[custom_options_counter].sort_order+'" sku="'+custom_option_values[key].sku+'" sort_order="'+custom_option_values[key].sort_order+'" price='+custom_option_values[key].price+'>'+custom_option_values[key].title+' &nbsp;+'+app_curr_symbol+parseFloat(custom_option_values[key].price).toFixed(2)+'</option>';
                }
                }
                custom_options_table_data += '</select>';
                custom_options_table_data += '</td>';
                }
                //if the control type is textfield
                else if(custom_options[custom_options_counter].custom_option_type == 'field') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<input type="text" id="'+current_field_id+'"  sort_order="'+custom_options[custom_options_counter].sort_order+'" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" maxlength='+custom_options[custom_options_counter]["all"].max_characters+' price='+custom_options[custom_options_counter]["all"].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'"></input>';
                custom_options_table_data += '</td>';
                }
                //if the control type is textarea
                else if(custom_options[custom_options_counter].custom_option_type == 'area') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<textarea id="'+current_field_id+'" name="'+current_field_id+'"  custom_option_id="'+custom_option_id+'" sort_order="'+custom_options[custom_options_counter].sort_order+'" price='+custom_options[custom_options_counter]["all"].price+' maxlength='+custom_options[custom_options_counter]["all"].max_characters+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" rows="2" cols="4"></textarea>';
                custom_options_table_data += '</td>';
                }
                //if the control type is radio
                else if(custom_options[custom_options_counter].custom_option_type == 'radio') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                if(current_class_validation == 'notrequired') {
                custom_options_table_data += '<input type="radio" valueid="0" id="'+current_field_id+key+'" sort_order_parent="'+custom_options[custom_options_counter].sort_order+'" sort_order ="0" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" price=0 class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" value="0" /> <label for="'+current_field_id+key+'">None </label>';
                }
                for (var key in custom_option_values){
                if (custom_option_values.hasOwnProperty(key)) {
                
                custom_options_table_data += '<input type="radio" valueid='+custom_option_values[key].id+'  sort_order_parent="'+custom_options[custom_options_counter].sort_order+'" sku="'+custom_option_values[key].sku+'" sort_order ="'+custom_option_values[key].sort_order+'" id="'+current_field_id+key+'" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" price='+custom_option_values[key].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" value="'+custom_option_values[key].price+'" /> <label for="'+current_field_id+key+'">'+custom_option_values[key].title+' &nbsp;+'+app_curr_symbol+parseFloat(custom_option_values[key].price).toFixed(2)+'</label>';
                }
                }
                custom_options_table_data += '</td>';
                }
                //if the control type is checkbox or multiple select
                else if(custom_options[custom_options_counter].custom_option_type == 'checkbox' || custom_options[custom_options_counter].custom_option_type == 'multiple') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                for (var key in custom_option_values){
                if (custom_option_values.hasOwnProperty(key)) {
                custom_options_table_data += '<input type="checkbox" id="'+current_field_id+key+'" name="'+current_field_id+'" valueid='+custom_option_values[key].id+' sort_order_parent="'+custom_options[custom_options_counter].sort_order+'" sku="'+custom_option_values[key].sku+'" sort_order ="'+custom_option_values[key].sort_order+'" price='+custom_option_values[key].price+' custom_option_id="'+custom_option_id+'" class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" value="'+custom_option_values[key].price+'" /> <label for="'+current_field_id+key+'">'+custom_option_values[key].title+' &nbsp;+'+app_curr_symbol+parseFloat(custom_option_values[key].price).toFixed(2)+'</label>';
                }
                }
                custom_options_table_data += '</td>';
                }
                //if the control type is file
                
                //if the control type is date
                else if(custom_options[custom_options_counter].custom_option_type == 'date') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<input type="text" sort_order="'+custom_options[custom_options_counter].sort_order+'" custom_option_id="'+custom_option_id+'"  id="'+current_field_id+'" name="'+current_field_id+'" onfocus="showDateTimePicker(this, \'date\')" price='+custom_options[custom_options_counter]["all"].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation +'" />';
                custom_options_table_data += '</td>';
                }
                //if the control type is time
                else if(custom_options[custom_options_counter].custom_option_type == 'time') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<input type="text" custom_option_id="'+custom_option_id+'" sku="'+custom_options[custom_options_counter].sku+'"  sort_order="'+custom_options[custom_options_counter].sort_order+'"  id="'+current_field_id+'" name="'+current_field_id+'" onfocus="showDateTimePicker(this, \'time\')" price='+custom_options[custom_options_counter]["all"].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation +'"/>';
                custom_options_table_data += '</td>';
                }
                //if the control type is datetime
                else {
                custom_options_table_data += '<td></td>';
                }
                
                custom_options_table_data += '</tr>';
                }
                }
                custom_options_table_data +='<tr><td id="finalprice" class="product_price_color">Price : '+app_curr_symbol+'0.00</td><td><button id="getcustomprice" onclick="calculateCustomPrice()" data-theme="b"><span>'+locale.message.button["get_price"]+'</span></button></td></tr>';
                custom_options_table_data += '</table>';
                $("#custom_options").html(custom_options_table_data);
                $("#custom_options").trigger('create');
                $("#custom_options_collapsible").css("display","block");
                }
                else {
                $("#custom_options_collapsible").css("display","none");
                }
                
                validate_input(pName,pCat,pColor,pSize,description,shortdes,pPriceSpl,pPriceDis,pPriceReal,pMaterial,pStyle,pShipp,pTotalQuant,custom_attr_len, custom_attr_data);
                $(".ui-loader").hide();
                simple_product_info_images(results["id"]);
                checkLoginStatus();
    },
//--------------------------------------Configurable product detail function-------------------------------
    this.configurable_product_function = function(response){
        localStorage.setItem('foo', 0);
        var params = JSON.parse(response);
        var results_configurable = params.result;
        stock_status = params.stock_status;
        var buyNowContent = selectSize = '';
        var pSizes = [];
        custom_attr = results_configurable["custom_attribute"];
        custom_attr_len = custom_attr.total;
        custom_attr_data = custom_attr.data;
                $(".ui-loader").show();
                
                
                global_results_configurable = results_configurable;
                relation_mapping = results_configurable["relation"];
                pName = results_configurable["parent"]["name"];
                localStorage[config.data[0].storage_key+"_Preview_Name"] = pName;
                pCat = results_configurable["parent"]["category"][0];
                pSKU=results_configurable["parent"]["sku"];
                description = results_configurable["parent"]["description"];
                shortdes =results_configurable["parent"]["shortdes"];
                pPriceReal= parseFloat(results_configurable["parent"]["price"]);
                pPriceSpl = parseFloat(results_configurable["parent"]["sprice"]);
                pPriceDis = 0;
                //pPriceDis = results_configurable["parent"]["discount"];
                
                /*hasImage = results_configurable["parent"]["image"];
                localStorage[config.data[0].storage_key+"_Preview_Image"] = hasImage[0];
                var image_slider = '';*/
                
                has_custom_options = 0; //results_configurable["parent"]["has_custom_option"];
                
                pMaterial = results_configurable["parent"]["material"];//
                pStyle = results_configurable["parent"]["style"];//
                pColor= results_configurable["parent"]["color"];//
                pShipp = results_configurable["parent"]["shipping"];
                pTotalQuant = results_configurable["parent"]["quantity"];
                pSize  = results_configurable["parent"]["pSize"];//
                product_final_price = pPriceReal;
                console.log("AA : "+has_custom_options);
                $("#productdescription").show();
                
                validate_input(pName,pCat,pColor,pSize,description,shortdes,pPriceSpl,pPriceDis,pPriceReal,pMaterial,pStyle,pShipp,pTotalQuant,custom_attr_len, custom_attr_data);
                //display table for select options
                $("#configurable_product").css('display','block');
                //create select options with values
                select_option_relation = [];
                create_select_options(results_configurable, select_option_relation);
                $("#custom_options_collapsible").css("display","none");
                configurable_product_images_function(results_configurable["parent"]["id"]);
                $(".ui-loader").hide();
                checkLoginStatus();
                /********* Custom Options Block Starts for Configurable Products ************/
                //Create Custom Options
                
                /*if(has_custom_options) {
                var custom_options = results_configurable["parent"]["custom_option"];
                var custom_options_length = custom_options.length;
                var custom_options_counter;
                var custom_options_table_data = '<table id="custom_options_table" width="100%" cellpadding="0" cellspacing="0" class="productDesc">';
                for(custom_options_counter=0;custom_options_counter<custom_options_length;custom_options_counter++) {
                var current_class_validation = 'notrequired';
                var current_option_type = custom_options[custom_options_counter].custom_option_type;
                if(current_option_type == 'file' || current_option_type == 'date_time'){
                }
                else {
                custom_options_table_data += '<tr>';
                custom_options_table_data += '<td>'+custom_options[custom_options_counter].custom_option_name;
                
                if(current_option_type == 'field' || current_option_type == 'area' ||  current_option_type == 'date' || current_option_type == 'time' ) {
                custom_options_table_data += ' &nbsp;+'+app_curr_symbol+parseFloat(custom_options[custom_options_counter]["all"].price).toFixed(2);
                }
                //apply required flag
                if(custom_options[custom_options_counter].custom_option_is_required == "1") {
                custom_options_table_data += '<span style="color:red">*</span>';
                current_class_validation = 'required';
                }
                custom_options_table_data += '</td>';
                
                //create custom options control
                var current_field_id = ((custom_options[custom_options_counter].custom_option_name+custom_options[custom_options_counter].custom_option_id).replace(/[^A-Z0-9]/ig, "")).toLowerCase();
                var custom_option_id = custom_options[custom_options_counter].custom_option_id;
                //if the control type is drop down
                if(custom_options[custom_options_counter].custom_option_type == 'drop_down') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                
                custom_options_table_data += '<select id="'+current_field_id+'" sort_order="'+custom_options[custom_options_counter].sort_order+'" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'">';
                if(current_class_validation == 'required') {
                custom_options_table_data += '<option disabled selected price="" value="">'+locale.message.text["select"]+'</option>';
                }
                else {
                custom_options_table_data += '<option selected  price="" sort_order="0" value="">'+locale.message.text["select"]+'</option>';
                }
                for (var key in custom_option_values){
                if (custom_option_values.hasOwnProperty(key)) {
                custom_options_table_data += '<option valueid='+custom_option_values[key].id+' sort_order_parent="'+custom_options[custom_options_counter].sort_order+'" sku="'+custom_option_values[key].sku+'" sort_order="'+custom_option_values[key].sort_order+'" price='+custom_option_values[key].price+'>'+custom_option_values[key].title+' &nbsp;+'+app_curr_symbol+parseFloat(custom_option_values[key].price).toFixed(2)+'</option>';
                }
                }
                custom_options_table_data += '</select>';
                custom_options_table_data += '</td>';
                }
                //if the control type is textfield
                else if(custom_options[custom_options_counter].custom_option_type == 'field') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<input type="text" id="'+current_field_id+'"  sort_order="'+custom_options[custom_options_counter].sort_order+'" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" maxlength='+custom_options[custom_options_counter]["all"].max_characters+' price='+custom_options[custom_options_counter]["all"].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'"></input>';
                custom_options_table_data += '</td>';
                }
                //if the control type is textarea
                else if(custom_options[custom_options_counter].custom_option_type == 'area') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<textarea id="'+current_field_id+'" name="'+current_field_id+'"  custom_option_id="'+custom_option_id+'" sort_order="'+custom_options[custom_options_counter].sort_order+'" price='+custom_options[custom_options_counter]["all"].price+' maxlength='+custom_options[custom_options_counter]["all"].max_characters+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" rows="2" cols="4"></textarea>';
                custom_options_table_data += '</td>';
                }
                //if the control type is radio
                else if(custom_options[custom_options_counter].custom_option_type == 'radio') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                console.log( custom_option_values);
                if(current_class_validation == 'notrequired') {
                custom_options_table_data += '<input type="radio" valueid="0" id="'+current_field_id+key+'" sort_order_parent="0" sort_order ="0" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" price=0 class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" value="0" /> <label for="'+current_field_id+key+'">None </label>';
                }
                for (var key in custom_option_values){
                if (custom_option_values.hasOwnProperty(key)) {
                
                custom_options_table_data += '<input type="radio" valueid='+custom_option_values[key].id+'  sort_order_parent="'+custom_options[custom_options_counter].sort_order+'" sku="'+custom_option_values[key].sku+'" sort_order ="'+custom_option_values[key].sort_order+'" id="'+current_field_id+key+'" custom_option_id="'+custom_option_id+'" name="'+current_field_id+'" price='+custom_option_values[key].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" value="'+custom_option_values[key].price+'" /> <label for="'+current_field_id+key+'">'+custom_option_values[key].title+' &nbsp;+'+app_curr_symbol+parseFloat(custom_option_values[key].price).toFixed(2)+'</label>';
                }
                }
                custom_options_table_data += '</td>';
                }
                //if the control type is checkbox or multiple select
                else if(custom_options[custom_options_counter].custom_option_type == 'checkbox' || custom_options[custom_options_counter].custom_option_type == 'multiple') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                for (var key in custom_option_values){
                if (custom_option_values.hasOwnProperty(key)) {
                custom_options_table_data += '<input type="checkbox" id="'+current_field_id+key+'" name="'+current_field_id+'" valueid='+custom_option_values[key].id+' sort_order_parent="'+custom_options[custom_options_counter].sort_order+'" sku="'+custom_option_values[key].sku+'" sort_order ="'+custom_option_values[key].sort_order+'" price='+custom_option_values[key].price+' custom_option_id="'+custom_option_id+'" class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation+'" value="'+custom_option_values[key].price+'" /> <label for="'+current_field_id+key+'">'+custom_option_values[key].title+' &nbsp;+'+app_curr_symbol+parseFloat(custom_option_values[key].price).toFixed(2)+'</label>';
                }
                }
                custom_options_table_data += '</td>';
                }
                //if the control type is file
                
                //if the control type is date
                else if(custom_options[custom_options_counter].custom_option_type == 'date') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<input type="text" sort_order="'+custom_options[custom_options_counter].sort_order+'" custom_option_id="'+custom_option_id+'"  id="'+current_field_id+'" name="'+current_field_id+'" onfocus="showDateTimePicker(this, \'date\')" price='+custom_options[custom_options_counter]["all"].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation +'" />';
                custom_options_table_data += '</td>';
                }
                //if the control type is time
                else if(custom_options[custom_options_counter].custom_option_type == 'time') {
                custom_options_table_data += '<td>';
                var custom_option_values = [];
                custom_option_values = custom_options[custom_options_counter].custom_option_value_array;
                custom_options_table_data += '<input type="text" custom_option_id="'+custom_option_id+'" sku="'+custom_options[custom_options_counter].sku+'"  sort_order="'+custom_options[custom_options_counter].sort_order+'"  id="'+current_field_id+'" name="'+current_field_id+'" onfocus="showDateTimePicker(this, \'time\')" price='+custom_options[custom_options_counter]["all"].price+' class="custom_option custom_'+custom_options[custom_options_counter].custom_option_type+' '+current_class_validation +'"/>';
                custom_options_table_data += '</td>';
                }
                //if the control type is datetime
                
                else {
                custom_options_table_data += '<td></td>';
                }
                
                custom_options_table_data += '</tr>';
                }
                }
                custom_options_table_data +='<tr><td id="finalprice" class="product_price_color">Price : '+app_curr_symbol+'0.00</td><td><button id="getcustomprice" onclick="calculateCustomPrice()" data-theme="b"><span>'+locale.message.button["get_price"]+'</span></button></td></tr>';
                custom_options_table_data += '</table>';
                $("#custom_options").html(custom_options_table_data);
                $("#custom_options").trigger('create');
                $("#custom_options_collapsible").css("display","block");
                }
                else {
                $("#custom_options_collapsible").css("display","none");
                }*/
                
                /********* Custom Options Block Ends for Configurable Products ************/

    }
    

}
                
function create_select_options(results_configurable, select_option_relation) {
array_size = results_configurable["size"];
number_of_select_box = [];
number_of_select_box_id = [];
select_option_1 = [];
select_option_1_price = [];
counter =0;
counter_option = 0;

//get number of select box for a product
for(i=0; i < array_size-2; i++) {
option_array_size = results_configurable[i].length;
for(j=0; j<option_array_size; j++) {
result = number_of_select_box.indexOf(results_configurable[i][j]["label"]);
if(result < 0) {
number_of_select_box[counter] = results_configurable[i][j]["label"];
//get attribute id
number_of_select_box_id[counter] = results_configurable[i][j]["data"]["attribute_code"];
counter++;
}
//get option for 1 select box
//leave option if stock status is 0
if(results_configurable[i][0]["is_in_stock"] == 0) {
continue;
}
$("#pStock").text(locale.message.text["in_stock"]);
result_option = select_option_1.indexOf(results_configurable[i][0]["data"]["label"]);
if(result_option < 0) {
select_option_1[counter_option] = results_configurable[i][0]["data"]["label"].replace(/ +/g, "");
//**********************
//select_option_1[counter_option] = results_configurable[i][0]["data"]["label"].replace(",","");
select_option_1_price[counter_option] = results_configurable[i][0]["data"]["pricing_value"];
counter_option++;
}
}
}

//create select options
for(i=counter-1; i>=0; i--) {
//create a table using js and add select box to it
var table = document.getElementById("configurable_product_table");
var footer = table.createTFoot();
var row = footer.insertRow(0);
var select_label = row.insertCell(0);
var select_box = row.insertCell(1);
select_label.innerHTML = "<p class='edit_heading'>" + number_of_select_box[i] + "<span style='color:red'>*</span></p>";
select_box.innerHTML = "<select required id=" + number_of_select_box_id[i] +" style='width: 330px;max-width: 100%;' onchange='change_option(this)'><option name='super_attribute' id='super_attribute' class='required-entry super-attribute-select'>Choose an Option....</option></select>";
}
//add options to 1 select box
for(i=0; i<counter_option; i++)
{
var select_option_id = document.getElementById(number_of_select_box_id[0]);
var option = document.createElement("option");
if(select_option_1_price[i] == 0)
option.text = select_option_1[i];
else
option.text = select_option_1[i]+'  + '+select_option_1_price[i];
option.setAttribute("price", select_option_1_price[i]);
select_option_id.add(option);
}
}
function validate_input(pName,pCat,pColor,pSize,description,shortdes,pPriceSpl,pPriceDis,pPriceReal,pMaterial,pStyle,pShipp,pTotalQuant,custom_attr_total, custom_attr_data,validate_input){
                $(".ui-loader").hide();
                if(!pName)
                pName = "N/A";
                if(!pCat)
                pCat = "N/A";
                if(!pColor)
                $('#pColorRow').css('display', 'none');
                if(!pSize)
                $('#pSizeRow').css('display', 'none');
                if(description=="" || !description) {
                if(shortdes!="")
                description = shortdes;
                else
                $('#pDesRow').css('display', 'none');
                }
                /*------------------ Price Set -------------------*/
                if(pPriceSpl==""||parseFloat(pPriceSpl)<0||!pPriceSpl)
                pPriceSpl = 0;
                if(pPriceDis==""||parseFloat(pPriceDis)<0||!pPriceDis)
                pPriceDis = 0;
                if(pPriceReal==""||parseFloat(pPriceReal)<0||!pPriceReal)
                pPriceReal = 0;
                if(pPriceSpl==0 && pPriceDis==0)
                pPrice = pPriceReal;
                else if(pPriceSpl == 0)
                //pPrice = pPriceDis;
                pPrice = pPriceReal;
                else if(pPriceDis == 0)
                pPrice = pPriceSpl;
                else if(pPriceSpl <= pPriceDis)
                pPrice = pPriceSpl;
                else if(pPriceDis<=pPriceSpl)
                pPrice = pPriceDis;
                else
                pPrice = pPriceReal;
                pCross=0;
                if(pPriceDis < pPriceReal && (pPriceDis!=0 && pPriceReal!=0))
                pCross = pPriceReal;
                else if (pPriceSpl < pPriceReal && (pPriceSpl!=0 && pPriceReal!=0))
                pCross = pPriceReal;
                if(!pPrice)
                pPrice = "0";
                if(pCross <= 0)
                $('#pCrossRow').css('display', 'none');
                /*------------------ Material Set -------------------*/
                if(!pMaterial)
                $('#pMaterialRow').css('display', 'none');
                if(!pStyle)
                $('#pStyleRow').css('display', 'none');
                if(pShipp==""||!pShipp)
                $('#pShippRow').css('display', 'none');
                else if(parseFloat(pShipp)<=0)
                $('#pShippRow').css('display', 'none');
                if (pTotalQuant == "" || !pTotalQuant || parseInt(pTotalQuant) < 1 || stock_status == "0")
                pStock = locale.message.text["out_of_stock"];
                else
                pStock = locale.message.text["in_stock"];
                
               
                $("#productName").html(pName);
                /*
                var stock=JSON.parse(stock);
                alert(stock['manage_stock']);
                
                $("#manage_stock").html(stock['manage_stock']);
                $("#use_config_manage_stock").html(stock['use_config_manage_stock']);
                */
                
                
                $("#pName").html(pName);
                custom_attr_html='';
                var i = 0;
                if(config.data[0].display_custom_attribute == "1"){
                if(custom_attr_total) {
                for(i = 0; i < custom_attr_total; i++) {
                if(custom_attr_data[i].attr_value) {
                custom_attr_html += '<tr id="mainattrlabel"><td id="attrlabel">'+custom_attr_data[i].attr_label+'</td><td id="attrvalue">'+custom_attr_data[i].attr_value+'</td></tr>';
                }
                }
                }
                }
                $("#pCat").html(pCat);
                $("#fulldescription").html(description);
                $("#sku_row").after(custom_attr_html);
                $("#pSKU").html(pSKU);
                $("#pColor").html(pColor);
                //alert(pTotalQuant);
                //alert(pStock);
                $("#pStock").html(pStock);
                //$("#pPrice").html(pPrice);
                //$("#pCross").html(pCross);
                
                if(pCross==0)
                {
                $("#finalprice").html('Price ('+app_curr_symbol+pPrice+')');
                $("#price_symbol").html(config.data[0].app_curr_symbol);
                $("#pPrice").html(pPrice);
                
                }
                else
                {
                
                if(pPriceSpl)
                {
                $("#price_symbol").html(config.data[0].app_curr_symbol);
                $("#pPrice").html(pPrice);
                $("#pCross").html(pCross);
                }
                else
                {
                $("#price_symbol").html(config.data[0].app_curr_symbol);
                $("#pPrice").html(pCross);
                $("#pCross").html(pPrice);
                }
                }
                $("#price_symbol").html(config.data[0].app_curr_symbol);
                $("#pPriceOrg").html(pPrice);
                $("#pPriceCrossOrg").html(pCross);
                
                }
            

                
function simple_product_info_images(idd){
var PRODUCT_ID=idd;
var BASE_URL  = config.data[0].baseurl;
var STORE = config.data[0].storeid;
var Simple_product_image_webservice = BASE_URL+"?callback=?"+"&store="+STORE+"&service=productdetailimage&productid="+PRODUCT_ID+"&currency="+app_curr_code;

console.log(Simple_product_image_webservice);
$.ajax({
       url:Simple_product_image_webservice,
       type: 'GET',
       contentType: 'application/json',
       dataType: 'json',
       async: false,
       error: function(){
       $(".ui-loader").hide();
       if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
       navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
       }
       else {
       alert(locale.message.alert["try_again"])
       }
       },
       success: function(results){
       
       hasImage = results["image"];
       localStorage[config.data[0].storage_key+"_Preview_Image"] = hasImage[0];
       imageValidation(hasImage);
       var image_len = hasImage.length;
       var i = 0;
       
       if(image_len <= 0 || image_len == null || image_len == "") {
       $("#product_image_slider").append('<div class="item"><img src="images/product_default_image.png" alt="" onerror="images/product_default_image.png" onclick="display_img_preview(this);"></div>');
       }
       else {
       for(i=0; i<image_len; i++) {
       
       $("#product_image_slider").append('<div class="item"><img src="'+hasImage[i]+'" alt="" onerror="images/product_default_image.png" onclick="display_img_preview(this);"></div>');
       }
       }
       $( "#hideit1" ).hide();
       $( "#product_image_slider" ).show();
       var owl = $("#product_image_slider");
       owl.owlCarousel({
                       items : 1, //10 items above 1000px browser width
                       itemsDesktop : [1000,1], //5 items between 1000px and 901px
                       itemsDesktopSmall : [900,1], // betweem 900px and 601px
                       itemsTablet: [600,1], //2 items between 600 and 0
                       itemsMobile : false,  // itemsMobile disabled - inherit from itemsTablet option
                       navigation : false,
                       pagination: false
                       });
       
       }
       });

}
                
function configurable_product_images_function(idd){
var PRODUCT_ID=idd;
var BASE_URL  = config.data[0].baseurl;
var STORE = config.data[0].storeid;
var Configurable_product_image_webservice = BASE_URL+"?callback=?"+"&store="+STORE+"&service=get_configurable_product_details_image&productid="+PRODUCT_ID+"&currency="+app_curr_code;

console.log(Configurable_product_image_webservice);
$.ajax({
       url:Configurable_product_image_webservice,
       type: 'GET',
       contentType: 'application/json',
       dataType: 'json',
       async: false,
       error: function(){
       $(".ui-loader").hide();
       if (config.data[0].platform == 'ios' || config.data[0].platform == 'android') {
       navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.data[0].app_name, locale.message.button["close"]);
       }
       else {
       alert(locale.message.alert["try_again"])
       }
       },
       success: function(results){
       
       hasImage = results["parent"]["image"];
       localStorage[config.data[0].storage_key+"_Preview_Image"] = hasImage[0];
       imageValidation(hasImage);
       var image_slider = '';
       var image_len = hasImage.length;
       //alert(image_len);
       var i = 0;
       if(image_len <= 0 || image_len == null || image_len == "") {
       image_slider += '<div class="item"><img src="images/product_default_image.png" alt="" onerror="images/product_default_image.png"  onclick="display_img_preview(this);"></div>';
       }
       else {
       for(i=0; i<image_len; i++) {
       //alert(+i+"  "+hasImage[i]);
       console.log(+i+"  "+hasImage[i]);
       image_slider += '<div class="item"><img src="'+hasImage[i]+'" alt="" onerror="images/product_default_image.png" onclick="display_img_preview(this);"></div>';
       }
       }
       
       $( "#hideit1" ).hide();
       $("#product_image_slider").html(image_slider);
       $( "#product_image_slider" ).show();
       var owl = $("#product_image_slider");
       owl.owlCarousel({
                       items : 1, //10 items above 1000px browser width
                       itemsDesktop : [1000,1], //5 items between 1000px and 901px
                       itemsDesktopSmall : [900,1], // betweem 900px and 601px
                       itemsTablet: [600,1], //2 items between 600 and 0
                       itemsMobile : false,  // itemsMobile disabled - inherit from itemsTablet option
                       navigation : false,
                       pagination: false
                       });
       
       }
       });

}
 
                
function imageValidation(hasImage){

imageURL2='';
imageURL3='';
imageURL4='';
imageURL5='';
try {
if(!hasImage[0])
imageURL = "images/product_default_image.png";
else
imageURL = hasImage[0];
if(hasImage[1])
imageURL2 = hasImage[1];
if(hasImage[2])
imageURL3 = hasImage[2];
if(hasImage[3])
imageURL4 = hasImage[3];
if(hasImage[4])
imageURL5 = hasImage[4];
}
catch (ee){
}

$("#product_image_full").attr("src",imageURL);
$("#pImage").attr("src", imageURL);
if(imageURL2 == '' || imageURL2 == null)
$("#pImage2-div").css('display', 'none');
else
$("#pImage2").attr("src", imageURL2);
if(imageURL3 == '' || imageURL3 == null)
$("#pImage3-div").css('display', 'none');
else
$("#pImage3").attr("src", imageURL3);
if(imageURL4 == '' || imageURL4 == null)
$("#pImage4-div").css('display', 'none');
else
$("#pImage4").attr("src", imageURL4);
if(imageURL5 == '' || imageURL5 == null)
$("#pImage5-div").css('display', 'none');
else
$("#pImage5").attr("src", imageURL5);


}
/* ----------------------------------- function.js Code Ends ------------------------------------ */
                
                
                function getFooter() {
               
                var footerText = '<fieldset class="ui-grid-c" style="text-align: center;background: orange;width:100%;height:100%;"><div class="ui-block-b css_footer"><a href="#" class="fa fa-home fa" onclick=\'Page.redirect("index.html", "slide", "down");\'></a></div><div class="ui-block-b css_footer"><a href="javascript:void(0);" onclick="new_search_btn()" id="new_search_btn"class="fa fa-search fa"></a></div><div class="ui-block-b css_footer"><a href="#" class="fa fa-user fa" onclick="footer_login()"></a></div><div class="ui-block-b css_footer"><a href="#" class="fa fa-shopping-cart fa" onclick=\'Page.redirect("cart.html", "slide", "down");\'> <div class="cartamount" style="display:block !important;"><div class="cartNew" id="cartProducts">0</div></div></a></div></fieldset>';
                $(".footer").html(footerText);
                updateCartQty();
                }
                
                function new_search_btn() {
                    if($("#searchBox").hasClass("myclass")){
                        $("#searchBox").slideUp('slow').removeClass('myclass');
                        $("#searchFilter").blur();
                    }
                    else{
                        $("#searchBox").slideDown('slow').addClass('myclass');
                        $("#searchFilter").focus();
                    }
                
                /*
               $("#searchBox").slideToggle(10);
                  if($("#searchBox").is(":visible"))
                    {
                
                        $("#searchFilter").attr("placeholder", locale.message.text["search"]);
                        $("#searchFilter").focus();
                    }
                
                */
                }
                
                
                
                
                function footer_login() {
                if (localStorage[config.data[0].storage_key + "_Session"] == null) {
                Page.redirect("login.html", "slide", "down");
                } else {
                var e = JSON.parse(localStorage[config.data[0].storage_key + "_Session"]);
                if (e != null && e.login_status == "Active") {
                Page.redirect("profile.html", "slide", "down");
                } else {
                
                    Page.redirect("login.html", "slide", "down");
                }
                }
                
                }
                function back_click_new() {
                
                localStorage.setItem('foo', 1);
               
                Page.redirect(history.back(), 'slide', 'right');
                }


 /*Footer fixed changes*/
 $(document).on('blur', 'input[type="text"],input[type="password"],input[type="number"],input, textarea, select', function () {
    setTimeout(function(){
        if($('input[type="text"],input[type="password"],input[type="number"], textarea, select').is(":focus")){
            $("[data-role=footer]").hide();
        }
        else{
            $("[data-role=footer]").show();
        }
    }, 500);
});
                
$(document).on('focus', 'input[type="text"],input[type="password"],input[type="number"], textarea,input, select', function () {
               if(this.id!="spin")
               {
                $("[data-role=footer]").hide();
               }
});
     
                jQuery("body").bind("click", function(e)
                                    {
                                    var obj = (e.target ? e.target : e.srcElement);
                                    // alert(obj.id);
                                    if (obj.id != 'new_search_btn')
                                    {
                                    $("#searchBox").slideUp('slow').removeClass('myclass');
                                    $("#searchFilter").blur();
                                    return false;
                                    }
                                    });
                
