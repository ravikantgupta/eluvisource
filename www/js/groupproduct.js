/*
 This file is created to deal wih Group type product mainly dealing with Fuorisella client custom requirement
 */

/*
 *Function to getProductInfoById
 *@param
 *@return
 */

function getgroupproductdetail(product_id){
    
    
    checkLoginStatus();
    var BASE_URL  = config.data[0].baseurl;
    var STORE = config.data[0].storeid;
    var app_curr_code = config.data[0].app_currency;
    var app_curr_symbol = config.data[0].app_curr_symbol;
    
     if(localStorage.getItem('foo') == 1)
     {
         
         var prodata=JSON.parse(localStorage.getItem('groupproductDetailslocal'));
         showgroupproductdata(prodata,product_id);
         $("#hideit1").hide();
     }
    else
    {
    var product_webservice = BASE_URL + "?callback=?" + "&store=" + STORE + "&service=productinfo&productid="+product_id+"&currency="+ app_curr_code;
    console.log("abc"+product_webservice);
    $.ajax({
        url: product_webservice,
        type: "get",
        dataType: "jsonp",
        async:false,
        beforeSend: function(){
           console.log("Before Product Webservice");
        },
        error: function(){
            if (config.app.platform == 'ios' || config.app.platform == 'android')
                navigator.notification.alert(locale.message.alert["try_again"], function() {}, config.app.name, locale.message.button["close"]);
            else
               alert(locale.message.alert["try_again"])
            console.log("Error  on Product Webservice");
        },
        complete: function(){
            console.log("Complete Product Webservice");
        },
        success: function(data){
           var params = new Object();
           params["stock_status"] = 1;
           params["ptype"] = "grouped";
           params["pid"] = product_id;
           
           
            localStorage.setItem('productDetailslocal', JSON.stringify(params));
           
           
           localStorage.setItem('groupproductDetailslocal', JSON.stringify(data));
           showgroupproductdata(data,product_id);
           $("#hideit1").hide();
        }
    });
        
    }
    
    
}

/*
 *Function to show data of group product
 *@param
 *@return
 */

function showgroupproductdata(results , product_id){
    $(".ui-loader").hide();
    $("#productdescription").show();
    pName = results.general.name;
    localStorage[config.data[0].storage_key + "_Preview_Name"] = pName;
    pCat = results["category"][0];
    pSKU = results.general.sku;
    description = Base64.decode(results.description.full);
    shortdes = Base64.decode(results.description.short);
    hasImage = results["image"];
    has_custom_options = results["has_custom_option"];
    localStorage[config.data[0].storage_key + "_Preview_Image"] = hasImage[0];
    productdefaultprice = results.price.regular;
    productspecialprice = results.price.final;
    var image_slider = '';
    var image_len = hasImage.length;
    var i = 0;
    if (image_len <= 0 || image_len == null || image_len == "") {
        image_slider += '<div class="item"><img src="images/product_default_image.png" alt="" onerror="bad_image(this);" onclick="display_img_preview(this);"></div>';
    }
    else {
        for (i = 0; i < image_len; i++) {
            image_slider += '<div class="item"><img src="' + hasImage[i] + '" alt="" onerror="bad_image(this);" onclick="display_img_preview(this);"></div>';
        }
    }
    $("#product_image_slider").html(image_slider);
    var owl = $("#product_image_slider");
    owl.owlCarousel({
        items: 1, //10 items above 1000px browser width
        itemsDesktop: [1000, 1], //5 items between 1000px and 901px
        itemsDesktopSmall: [900, 1], // betweem 900px and 601px
        itemsTablet: [600, 1], //2 items between 600 and 0
        itemsMobile: false, // itemsMobile disabled - inherit from itemsTablet option
        navigation: false,
        pagination: true
    });
    
    //If all child product is out of stock then parent product will be out of stock
 
    
    var is_in_stock = locale.message.text.out_of_stock;
    if(parseInt(results.stock.is_in_stock) > 0 && parseInt(results.show_stock_status)>0) {
        is_in_stock = locale.message.text.in_stock;
    }
    else
    {
        is_in_stock = locale.message.text.out_of_stock;
    }
    /*else if(parseInt(results.stock.manage_stock) <= 0 ) {
        is_in_stock = locale.message.text.out_of_stock;
    }*/
    if(description=="" || !description) {
        if(shortdes!="")
            description = shortdes;
    }
    
    $("#gpid").val(product_id);
    $("#group_pro_status").val(results.stock.status);
    $("#fulldescription").html(description);
    $("#pName").html(pName);
    $("#productName").html(pName);
    $("#pCat").html(pCat);
    $("#fulldescription").html(description);
    $("#pSKU").html(pSKU);
    $("#pStock").html(is_in_stock);
    $("#pPrice").html(pPrice);
    $("#pCross").html(pCross);
    $("#pPriceOrg").html(pPrice);
    $("#pPriceCrossOrg").html(pCross);
    $("#pPriceRow").hide();
    $("#pStockRow").show();
    /*  var group_html='';
    if(parseInt(results.all_group_disable)==0)
    {
        $("#pStock").html(locale.message.text.out_of_stock);
       group_html +=locale.message.text['no_grouped_product'];
    }
    else
    {
        group_html += getGropedOptionsHtml(results);
    }
   */
   var group_html = getGropedOptionsHtml(results);
    $("#group_product_div").html(group_html);
    $("#group_product_div").trigger("create");
    //$("#product_image_slider").css({"border-bottom": "2px solid #aaaaaa"});
    //$("#productspecialprice").html(app_curr_symbol + " " + parseFloat(productspecialprice).toFixed(2));
    //$("#productdefaultprice").html(app_curr_symbol + " " + parseFloat(productdefaultprice).toFixed(2));
}

/*
 *Function to create html content of childrens of group product
 *@param
 *@return
 */
function getGropedOptionsHtml(product) {
    var grouped_html = '';
   
    grouped_html = '<div id="groped_list" >';
    for (key in product.products.grouped) {
        if (product.products.grouped.hasOwnProperty(key) && product.products.grouped[key].status==1) {
            var current_product_item =  product.products.grouped[key];
            current_product_item.image = current_product_item.image.concat(product.image);
            console.error(current_product_item);
            grouped_html += '<div class="groped_pro_data">';
            grouped_html += '<div class="group_pro_image">';
            grouped_html += '<img src="'+current_product_item.image[0]+'" onerror="bad_image(this);" class="group_pro_img">';
            grouped_html += '</div>';
            grouped_html += '<div class="group_pro_name">';
            grouped_html += '<p>'+current_product_item.general.name+'</p>';
            
            if(parseInt(current_product_item.stock.qty) && parseInt(product.stock.is_in_stock)) {
                
                if(parseInt(current_product_item.stock.is_in_stock)==1)
                {
                
                    if(parseInt(current_product_item.stock.manage_stock)==0)
                    {
                        grouped_html += '<input type="text" data-role="spinbox" data-mini="true" data-type="horizontal" name="spin" id="spin" value="0" min="0" max="'+parseInt(current_product_item.stock.qty)+'" pro_id="'+current_product_item.id+'" pro_sku="'+current_product_item.sku+'" pro_type="'+current_product_item.type+'" pro_name="'+current_product_item.general.name+'" pro_price="'+current_product_item.price.final+'" pro_image="'+current_product_item.image[0]+'" readonly/>';
                        
                    }
                    else
                    {
                        grouped_html += '<input type="text" data-role="spinbox" data-mini="true" data-type="horizontal" name="spin" id="spin" value="0" min="0" max="'+parseInt(current_product_item.stock.qty)+'" pro_id="'+current_product_item.id+'" pro_sku="'+current_product_item.sku+'" pro_type="'+current_product_item.type+'" pro_name="'+current_product_item.general.name+'" pro_price="'+current_product_item.price.final+'" pro_image="'+current_product_item.image[0]+'" readonly/>';
                    }
                    
                
                }
                else
                {
                    
                     grouped_html += '<p>'+locale.message.text['out_of_stock']+'</p>';
                }
                
                
            }
            else {
                
                if(parseInt(product.stock.is_in_stock))
                {
                    grouped_html += '<p>'+locale.message.text['out_of_stock']+'</p>';
                }
                else
                {
                    grouped_html += '<p></p>';
                }
            }
         /*   grouped_html += '<p class="custom_stock_status">'+current_product_item.custom_stock_status+'</p>'; */
            grouped_html += '</div>';
            if(current_product_item.price.final == current_product_item.price.regular) {
                grouped_html += '<div class="group_pro_price"><div class="pprice">'+app_curr_symbol+parseFloat(current_product_item.price.final).toFixed(2)+'</div></div>';
            }
            else {
                grouped_html += '<div class="group_pro_price"><span class="pCross" style="text-decoration: line-through;">'+app_curr_symbol+parseFloat(current_product_item.price.regular).toFixed(2)+'</span><div class="pprice">'+app_curr_symbol+parseFloat(current_product_item.price.final).toFixed(2)+'</div></div>';
            }
            grouped_html +='</div>';
        }
    }
    grouped_html +='</div>';
  
    return grouped_html;
}
/*
function add_grouped_to_cart(productid, productName, productPrice, shippCharge, productImage,pTitle,selectSize,selectColor, selected_option_array, custom_options, quan_sel) {
    
    var cartValue;
    var names = [];
    var images = [];
    var titles = [];
    var prices = [];
    var quantities = [];
    var sizes = [];
    var colors = [];
    var ids = [];
    var ShippCharge = [];
    var customoptions = [];
    if(localStorage[config.data[0].storage_key+'_pNames'] === null) {
        cartValue = 0;
    }
    else {
        try {
            cartValue = JSON.parse(localStorage[config.data[0].storage_key+'_pNames']).length;
            names = JSON.parse(localStorage[config.data[0].storage_key+'_pNames']);
            prices = JSON.parse(localStorage[config.data[0].storage_key+'_pPrices']);
            sizes = JSON.parse(localStorage[config.data[0].storage_key+'_pSizes']);
            quantities = JSON.parse(localStorage[config.data[0].storage_key+'_pQuantities']);
            images = JSON.parse(localStorage[config.data[0].storage_key+'_pImages']);
            ids = JSON.parse(localStorage[config.data[0].storage_key+'_pIds']);
            colors=  JSON.parse(localStorage[config.data[0].storage_key+'_pColor']);
            titles=JSON.parse(localStorage[config.data[0].storage_key+'_pTitles']);
            customoptions = JSON.parse(localStorage[config.data[0].storage_key+'_pcustom_options']);
        }
        catch(err) {
            cartValue = 0;
        }
    }
    if($.inArray( productid, ids) == "-1"){
        names[cartValue] = productName;
        prices[cartValue] = productPrice.replace(/\,/g, '');
        images[cartValue] = productImage;
        sizes[cartValue] = selectSize;
        colors[cartValue] = selectColor;
        titles[cartValue]=pTitle;
        customoptions[cartValue] = custom_options;
        ids[cartValue] = productid;
        quantities[cartValue] = quan_sel;
    }
    else{
        var location = $.inArray(productid,ids);
        quantities[location] = parseInt(quantities[location])+parseInt(quan_sel);
    }
    console.log("names"+names);
    localStorage[config.data[0].storage_key+'_pNames']=JSON.stringify(names);
    localStorage[config.data[0].storage_key+'_pPrices']=JSON.stringify(prices);
    
    localStorage[config.data[0].storage_key+'_pImages']=JSON.stringify(images);
    
    localStorage[config.data[0].storage_key+'_pSizes']=JSON.stringify(sizes);
    
    localStorage[config.data[0].storage_key+'_pColor']=JSON.stringify(colors);
    
    localStorage[config.data[0].storage_key+'_pQuantities']=JSON.stringify(quantities);
    
    localStorage[config.data[0].storage_key+'_pTitles']=JSON.stringify(titles);
    
    localStorage[config.data[0].storage_key+'_pIds'] = JSON.stringify(ids);
    
    localStorage[config.data[0].storage_key+'_pcustom_options'] = JSON.stringify(customoptions);
}
*/


