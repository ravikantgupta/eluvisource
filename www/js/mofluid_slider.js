/*
 Mofluid Slider Plugin
 Contributor => mofluid.com
 Mofluid Team
 */
var app_curr_code = config.data[0].app_currency;
var app_curr_symbol = config.data[0].app_curr_symbol;
var database = config.data[0].storage_key;
var service_flag = 0;



var cache_expire_time=localStorage['c_time'];
var cache_expire_status=localStorage['c_status'];
var cache_time = parseInt(parseInt(cache_expire_time) * 60 *1000);
if(cache_expire_status==0 || cache_expire_status==null)
{
    var cache_time = parseInt(parseInt(config.data[0].cache_time) * 60 *1000);
}

function fetchFeaturesProduct() {
    var db = dbConnection();
    var current_time = new Date().getTime();
    var key = 'getFeaturedProducts';
    db.transaction(function(tx) {
                   tx.executeSql('CREATE TABLE IF NOT EXISTS m_cache (key text, data text, timestamp text)');
                   tx.executeSql("select * from m_cache where key='getFeaturedProducts';", [], function(tx, resdata) {
                                 if (resdata.rows.length > 0) {  //if table is not empty
                                 var diff=current_time - resdata.rows.item(0).timestamp;
                                 if (diff > cache_time) {
                                 tx.executeSql("DELETE FROM m_cache WHERE key=?", ["getFeaturedProducts"],
                                               function(tx, result) {
                                               console.log("delete data");
                                               }
                                               );
                                 console.log(BASE_URL + "?callback=?" + "&store=" + STORE + "&service=getFeaturedProducts&currency=" + app_curr_code);
                                 $.ajax({
                                        url: "" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=getFeaturedProducts&currency=" + app_curr_code,
                                        type: 'GET',
                                        contentType: 'application/json',
                                        dataType: 'json',
                                        async: false,
                                        error: function(jqXHR, textStatus, errorThrown) {
                                        console.log("Internal server Error! \n please try after some time.")
                                        },
                                        success: function(response) {
                                        localStorage.setItem(config.data[0].storage_key+'_feature_local_data', JSON.stringify(response));
                                        db.transaction(function(tx) {
                                                       tx.executeSql("INSERT INTO m_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(response) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                                                     console.log("ERROR in insert product: " + e);
                                                                     });
                                                       });
                                        feature_product_list(JSON.stringify(response));
                                        }
                                        });
                                 //End data insertion from mofluid
                                 } else {  //if time is not greter then given cache_time the the data will come from sqlite database
                                 localStorage.setItem(config.data[0].storage_key+'_feature_local_data', resdata.rows.item(0).data);
                                 var response = JSON.parse(resdata.rows.item(0).data);
                                 feature_product_list(resdata.rows.item(0).data);
                                 }
                                 }
                                 else { //if there is no row in the cache table then hte featured product came from webservice and also will be insert in cache table
                                 $.ajax({
                                        url: "" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=getFeaturedProducts&currency=" + app_curr_code,
                                        type: 'GET',
                                        contentType: 'application/json',
                                        dataType: 'json',
                                        async: false,
                                        error: function(jqXHR, textStatus, errorThrown) {
                                        
                                        console.log("Internal server Error! \n please try after some time.")
                                        },
                                        success: function(response) {
                                        localStorage.setItem(config.data[0].storage_key+'_feature_local_data', JSON.stringify(response));
                                        db.transaction(function(tx) {
                                                       tx.executeSql("INSERT INTO m_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(response) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                                                     console.log("ERROR in insert product: " + e);
                                                                     });
                                                       });
                                        feature_product_list(JSON.stringify(response));
                                        }
                                        });
                                 }
                                 });
                   });
}

function feature_product_list(results){
    
    var response = JSON.parse(results);
    var featured_pro = "";
    var i = 0;
    var stock_status = "";
    if (response.status[0].Show_Status == "1") {
        console.log(response.products_list.length);
        while (i < response.products_list.length) {
            if (response.products_list[i].is_stock_status == "1") {
                stock_status = "1";
            } else {
                stock_status = "0";
            }
            //var pid = response.products_list[i].id + "stock_status" + stock_status;
            var pid = response.products_list[i].id;
            var ptype = response.products_list[i].type;
            var price_html ="";
            if (parseFloat(response.products_list[i].special_price) > 0) {
                
                if(ptype=="grouped")
                {
                   // price_html +='<div class="starting_text_home">'+locale.message.text["starting_at"]+'</div>';
                }
                price_html += '<div class="producth4">\
                <span style="text-decoration: line-through;" class="product_special_cut_price_color">\
                '+app_curr_symbol+parseFloat(response.products_list[i].price.replace(",", "")).toFixed(2) + '\
                </span>&nbsp;\
                <span style="font-weight:bold;" class="product_price_color">\
                ' + app_curr_symbol + parseFloat(response.products_list[i].special_price).toFixed(2) + '\
                </span>\
                </div>';
            }
            else{
                if(ptype=="grouped")
                {
                  //  price_html +='<div class="starting_text_home">'+locale.message.text["starting_at"]+'</div>';
                }
                price_html += '<h4 class="producth4 product_price_color">' + app_curr_symbol + parseFloat(response.products_list[i].price.replace(",", "")).toFixed(2) + '</h4>';
            }
            
            featured_pro += '<div class="child">\
            <div class="slider_products" >\
            <div style="display:table;width:100%">\
            <div class="home_page_product_list_div" style="height:120px;display:table-cell;vertical-align:middle;" onclick="getProDetail('+pid+','+stock_status+',\''+ptype+'\')">\
            <img src="' + response.products_list[i].image + '" onerror="this.src=\'images/product_default_image.png\'" />\
            </div>\
            </div>\
			<div class="new_header_product_list">\
            <h2 class="producth2">' + response.products_list[i].name + '</h2>\
            '+price_html+'\
            </div>\
            </div>\
            </div>';
            
          //  featured_pro +='<div class="child" >child '+i+'</div>';
            i++;
        }
        $('#feature_products_inner_div').html(locale.message.text.featured_products);
        localStorage.setItem(config.data[0].storage_key+'_featured_products_html',featured_pro);
        
        $("#feature_products_outer_div").show();
        $("#featured_owl").html(featured_pro);
        $("#featured_owl").trigger("create");
    } else {
        $('#feature_products_outer_div').hide();
        $("#featured_owl").hide();
    }
   // var owl_featured = $("#featured_owl");
   
    /*owl_featured.owlCarousel({
                             items : 1, //10 items above 1000px browser width
                             itemsDesktop : [1000,3], //5 items between 1000px and 901px
                             itemsDesktopSmall : [900,4], // betweem 900px and 601px
                             itemsTablet: [600,3], //2 items between 600 and 0
							 itemsMobile :[360,1], 
                             itemsMobile : true,  // itemsMobile disabled - inherit from itemsTablet option
                             navigation : true,
                             pagination: false,
                             autoPlay:true
                             });
    */
    
}

//------------------------------------------------New product list----------------------------------------
function optional_products_slide(){
    var db = dbConnection();
    var current_time = new Date().getTime();
    var key = 'getOptionalProducts';
    db.transaction(function(tx) {
                   //tx.executeSql('DROP TABLE IF EXISTS m_cache');
                   tx.executeSql('CREATE TABLE IF NOT EXISTS m_cache (key text, data text, timestamp text)');
                   tx.executeSql("select * from m_cache where key='getOptionalProducts';", [], function(tx, resdata) {
                                 if (resdata.rows.length > 0) {  //if table is not empty
                                 var diff=current_time - resdata.rows.item(0).timestamp;
                                 //Delete data if time is maximum from given cache time
                                 if (diff > cache_time) {
                                 tx.executeSql("DELETE FROM m_cache WHERE key=?", ["getOptionalProducts"],
                                               function(tx, result) {
                                               console.log("delete data");
                                               }
                                               );
                                 //Insert new data after deletion of data
                                 $.ajax({
                                        url: "" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=getNewProducts&currency=" + app_curr_code,
                                        type: 'GET',
                                        contentType: 'application/json',
                                        dataType: 'json',
                                        async: false,
                                        error: function(jqXHR, textStatus, errorThrown) {
                                        
                                        console.log("Internal server Error! \n please try after some time.")
                                        },
                                        success: function(response) {
                                        localStorage.setItem(config.data[0].storage_key+'_new_local_data', JSON.stringify(response));
                                        db.transaction(function(tx) {
                                                       tx.executeSql("INSERT INTO m_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(response) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                                                     console.log("ERROR in insert product: " + e);
                                                                     });
                                                       });
                                        new_product_list(JSON.stringify(response));
                                        }
                                        });
                                 //End data insertion from mofluid
                                 } else {  //if time is not greter then given cache_time the the data will come from sqlite database
                                 localStorage.setItem(config.data[0].storage_key+'_new_local_data', resdata.rows.item(0).data);
                                 var response = JSON.parse(resdata.rows.item(0).data);
                                 new_product_list(resdata.rows.item(0).data);
                                 }
                                 }
                                 else { //if there is no row in the cache table then hte featured product came from webservice and also will be insert in cache table
                                 $.ajax({
                                        url: "" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=getNewProducts&currency=" + app_curr_code,
                                        type: 'GET',
                                        contentType: 'application/json',
                                        dataType: 'json',
                                        async: false,
                                        error: function(jqXHR, textStatus, errorThrown) {
                                        
                                        console.log("Internal server Error! \n please try after some time.")
                                        },
                                        success: function(response) {
                                        localStorage.setItem(config.data[0].storage_key+'_new_local_data', JSON.stringify(response));
                                        db.transaction(function(tx) {
                                                       tx.executeSql("INSERT INTO m_cache (key,data,timestamp) VALUES (?,?,?)", ["" + key + "", "" + JSON.stringify(response) + "", "" + current_time + ""], function(tx, res) {}, function(e) {
                                                                     console.log("ERROR in insert product: " + e);
                                                                     });
                                                       });
                                        new_product_list(JSON.stringify(response));
                                        }
                                        });
                                 }
                                 });
                   });
}

function new_product_list(results){
	
	alert('siya ram');
    var response = JSON.parse(results);
    var featured_pro = "";
    var i = 0;
    var stock_status = "";
    if (response.status[0].Show_Status == "1") {
        
        while (i < response.products_list.length) {
            if (response.products_list[i].is_stock_status == "1") {
                stock_status = "1";
            } else {
                stock_status = "0";
            }
            //var pid = response.products_list[i].id + "stock_status" + stock_status;
            var pid = response.products_list[i].id;
            var ptype = response.products_list[i].type;
            var price_html="";
            
            /*if (parseFloat(response.products_list[i].special_price) > 0) {
             featured_pro += '<div class="item"><div style="display:table;width:100%"><div style="height:140px;display:table-cell;vertical-align:middle;" onclick="getProDetail('+pid+','+stock_status+',\''+ptype+'\')"><img src="' + response.products_list[i].image + '" onerror="this.src=\'images/product_default_image.png\'"/></div></div><h2 class="producth2">' + response.products_list[i].name + '</h2><h4 class="producth4"><span style="text-decoration: line-through;" class="product_special_cut_price_color">' + app_curr_symbol + parseFloat(response.products_list[i].price.replace(",", "")).toFixed(2) + '</span>&nbsp;<span style="font-weight:bold;" class="product_price_color">' + app_curr_symbol + response.products_list[i].special_price + '</span></h4><p class="cart_Button secondary_btn_foreground secondary_btn_background" onclick="getProDetail('+pid+','+stock_status+',\''+ptype+'\')" >' + locale.message.button["details"] + '</p></div>';
             } else {
             featured_pro += '<div class="item"><div style="display:table;width:100%"><div style="height:140px;display:table-cell;vertical-align:middle;" onclick="getProDetail('+pid+','+stock_status+',\''+ptype+'\')"><img src="' + response.products_list[i].image + '" onerror="this.src=\'images/product_default_image.png\'"/></div></div><h2 class="producth2">' + response.products_list[i].name + '</h2><h4 class="producth4 product_price_color">' + app_curr_symbol + parseFloat(response.products_list[i].price.replace(",", "")).toFixed(2) + '</h4><p class="cart_Button secondary_btn_foreground secondary_btn_background" onclick="getProDetail('+pid+','+stock_status+',\''+ptype+'\')" >' + locale.message.button["details"] + '</p></div>';
             }
             i++;*/
            
            
            
            
            
            
            
            
            
            if (parseFloat(response.products_list[i].special_price) > 0) {
                
                if(ptype=="grouped")
                {
                  //  price_html +='<div class="starting_text_home">'+locale.message.text["starting_at"]+'</div>';
                }
                
                
                price_html += '<h4 class="producth4">\
                <span style="text-decoration: line-through;" class="product_special_cut_price_color">\
                '+app_curr_symbol+parseFloat(response.products_list[i].price.replace(",", "")).toFixed(2) + '\
                </span>&nbsp;\
                <span style="font-weight:bold;" class="product_price_color">\
                ' + app_curr_symbol + parseFloat(response.products_list[i].special_price).toFixed(2)+ '\
                </span>\
                </h4>';
            }
            else{
                if(ptype=="grouped")
                {
                   // price_html +='<div class="starting_text_home">'+locale.message.text["starting_at"]+'</div>';
                }
                price_html += '<h4 class="producth4 product_price_color">' + app_curr_symbol + parseFloat(response.products_list[i].price.replace(",", "")).toFixed(2) + '</h4>';
            }
            featured_pro += '<div class="child">\
            <div class="slider_products">\
            <div class="new_header_product_list">\
            <h2 class="producth2">' + response.products_list[i].name + '</h2>\
            '+price_html+'\
            </div>\
            <div style="display:table;width:100%">\
            <div class="home_page_product_list_div" style="height:120px;display:table-cell;vertical-align:middle;" onclick="getProDetail('+pid+','+stock_status+',\''+ptype+'\')">\
            <img src="' + response.products_list[i].image + '" onerror="this.src=\'images/product_default_image.png\'" />\
            </div>\
            </div>\
            </div>\
            </div>';
            
            i++;
        }
        
        localStorage.setItem(config.data[0].storage_key+'_new_products_html' , featured_pro);
        $("#new_products_inner_div").html(locale.message.text.new_products);
        $("#new_products_outer_div").show();
        $("#new_owl").html(featured_pro);
        $("#new_owl").trigger("create");
    } else {
        $('#new_products_outer_div').hide();
        $("#new_owl").hide();
    }
    //printRootCategory();
  //  var owl_new = $("#new_owl");
 /*   owl_new.owlCarousel({
                        items : 3, //10 items above 1000px browser width
                        itemsDesktop : [1000,3], //5 items between 1000px and 901px
                        itemsDesktopSmall : [900,4], // betweem 900px and 601px
                        itemsTablet: [600,3], //2 items between 600 and 0
                        itemsMobile : false,  // itemsMobile disabled - inherit from itemsTablet option
                        navigation : false,
                        pagination: false,
                        autoPlay :false
                        }); */
    $("#footer_content").show();
}
