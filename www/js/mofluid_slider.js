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
            
            featured_pro += '<li class="item"><div class="sku">E13</div><div class="hover-action"><div class="cartactions"><button  class="button btn-cart" title="Add to Cart" type="button"><span><span>Add to Cart</span></span></button><ul class="wish-add-to-links"><li><a class="link-wishlist" title="Wishlist" ><i class="fa fa-heart"></i></a></li><li><a class="link-compare" title="Compare" ><i class="fa fa-exchange"></i></a></li><\ul></div></div></li>';
            
          //  featured_pro +='<div class="child" >child '+i+'</div>';
            i++;
        }
        $('#feature_products_inner_div1').html(locale.message.text.featured_products);
        localStorage.setItem(config.data[0].storage_key+'_featured_products_html',featured_pro);
        
        $("#feature_products_outer_div1").show();
        $("#fproductslide").html(featured_pro);
       // $("#fproductslide").trigger("create");
    } else {
        $('#feature_products_outer_div1').hide();
        $("#fproductslide").hide();
    }
	
	
	
  						 
							
   
}



function setfourBox() {
	
	    	
	       	  alert('ram');
                                 $.ajax({
                                        url: "" + BASE_URL + "?callback=?" + "&store=" + STORE + "&service=getFourBox&currency=" + app_curr_code,
                                        type: 'GET',
                                        contentType: 'application/json',
                                        dataType: 'json',
                                        async: false,
                                        error: function(jqXHR, textStatus, errorThrown) {
                                        console.log("Internal server Error! \n please try after some time.")
                                        },
                                        success: function(response) {
                                       
                                          var resdata=JSON.stringify(response);
									      var response = JSON.parse(resdata);
										   										
											 $("#buttombox").html(response.four_boxes.content);
											 $("#ready_revamp").html(response.ready_revamp.content);
											 $("#secondstaticbanner").html(response.second_static_banner.content);
											 
											
                                        }
                                        });
	
	
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
    
   
   
    $("#footer_content").show();
}
