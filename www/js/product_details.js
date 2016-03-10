






//----------------------------------Add to cart-----------------------------------------------------
function addTocartDetail(){
    
    if($("#pStock").html()==locale.message.text["out_of_stock"] && pType != "grouped"){
        if (config.data[0].platform=='ios' || config.data[0].platform=='android') {
            navigator.notification.alert(locale.message.alert["out_of_stock_message"],function () {},config.data[0].app_name, locale.message.button["close"]);
        }
        else{
            alert(locale.message.alert["out_of_stock_message"]);
        }
        location.reload(true);
    }
    else{
        if(pType == "configurable") {
            //check whether all the options are selected or not
            var flag = 1;
            for(i=0; i<number_of_select_box_id.length; i++) {
                var result = document.getElementById(number_of_select_box_id[i]).selectedIndex;
                if(!result) {
                    flag = 0;
                    navigator.notification.alert(locale.message.alert["configurable_options_validation"] +" "+ number_of_select_box[i] ,function () {},config.data[0].app_name, locale.message.button["close"]);
                    break;
                }
            }
            //if flag =1 then all options are set are proceed forward for add to cart functionality
            if(flag) {
                //get sku as per selected options, returns an array of same sku with index selected of sku
                var return_result = get_sku();
                var selected_i = return_result.index_1;
                var selected_j = return_result.index_2;
                var selected_product_id = global_results_configurable[selected_i][selected_j]["id"];
                var new_product_id = global_results_configurable["parent"]["id"];
                var selected_product_stock = global_results_configurable[selected_i][selected_j]["stock_quantity"];
                //alert(selected_product_stock);
                var selected_option_array = [];
                pSKU = return_result.sku;
                //get all options selected in array and pass it to add to cart function
                for(i=0; i<=selected_j; i++) {
                    selected_option_array[global_results_configurable[selected_i][i]["label"]] = global_results_configurable[selected_i][i]["data"]["label"];
                }
                var stock_status="stock_status1";
                if(selected_product_stock < 0 || selected_product_stock == null) {
                    stock_status="stock_status0";
                }
                stock_status = selected_product_id + stock_status;
                if(has_custom_options) {
                    var custom_options_results = validateCustomOptions();
                }
                else {
                    var custom_options_results = [];
                    custom_options_results["error"] = 0;
                    custom_options_results["customoptions"] = '';
                    custom_options_results["custom_choice"] = '';
                }
                if(custom_options_results["error"] == 0) {
                    console.log('[Configurable] Before Add to Cart');
                    console.log(custom_options_results);
                    var customoptions = $.extend({}, custom_options_results["customoptions"]);
                    var product_choice='';
                    var product_custom_price='';
                    console.log(customoptions);
                    var additional = calculateCustomPrice();
                    pPrice = parseFloat($("#pPrice").text());
                    if(pPrice == "" || pPrice == null ) {
                        pPrice = '0';
                    }
                    else if(isNaN(pPrice)) {
                        pPrice = '0';
                    }
                    else {
                        pPrice =  ((parseFloat(pPrice) + parseFloat(additional)).toFixed(2))+'';
                    }
                    console.log(custom_options_results);
                    if(custom_options_results["custom_choice"] == '' || custom_options_results["custom_choice"] == null ) {
                        product_updated_sku = pSKU;
                        
                    }
                    else {
                        product_updated_sku = pSKU + custom_options_results["custom_choice"];
                    }
                    var new_pro_data = {};
                    new_pro_data["pro_type"] = pType;
                    new_pro_data["parent_id"] = global_results_configurable.parent.id;
                    
                   
                    addToCart(selected_product_id,product_updated_sku,pPrice,pShipp,imageURL,pName,selectSize,selectColor,selected_option_array, customoptions,1,new_pro_data);
                    
                    //Code comment of Sumit
                    //addToCart(new_product_id,stock_status,product_updated_sku,pPrice,pShipp,imageURL,pName,selectSize,selectColor,selected_option_array, customoptions);
                }
            }
        }
        else if(pType == "grouped"){
        
            var counter = 0;
            var isValid = 0;
            var options = new Array();
            var gpid=$("#gpid").val();
            var group_pro_status=$("#group_pro_status").val();
            
            
            $("#groped_list input").each(function(){
                                         
                                         var isValidCurrent = 0;
                                         var current_selected_quantity = $(this).val();
                                         options[counter] = new Object();
                                         options[counter]["id"] = $(this).attr("pro_id");
                                         options[counter]["sku"] = $(this).attr("pro_sku");
                                         options[counter]["type"] = $(this).attr("pro_type");
                                         options[counter]["name"] = $(this).attr("pro_name");
                                         options[counter]["price"] = $(this).attr("pro_price");
                                         options[counter]["image"] = $(this).attr("pro_image");
                                         options[counter]["stock_quantity"] = parseInt($(this).attr("max"));
                                         options[counter]["quantity"] = current_selected_quantity;
                                         options[counter]["isValid"] = isValidCurrent;
                                         if(current_selected_quantity > 0) {
                                         isValid = 1;
                                         options[counter]["isValid"] = 1;
                                         }
                                         counter++;
                                         });
           
                                        var new_pro_data = {};
                                        new_pro_data["pro_type"] = pType;
                                        new_pro_data["parent_id"] = gpid;
            
            if(isValid){
                console.log("Adding group product in cart");
                if(options){
                    $.each(options,function(key,value){
                        if(value.isValid){
                          
                           addToCart(value.id,value.sku,value.price,"",value.image,value.name,"","","","",value.quantity,new_pro_data);
                        
                        }
                    });
                    redirectTopage("cart.html");
                }
            }
            else{
                if (config.data[0].platform=='ios' || config.data[0].platform=='android') {
                    
                    if(parseInt(group_pro_status)==0)
                    {
                            navigator.notification.alert(locale.message.alert["out_of_stock_message"],function () {},config.data[0].app_name, locale.message.button["close"]);
                    }
                    else
                    {
                    navigator.notification.alert(locale.message.alert["group_pro_validation"],function () {},config.data[0].app_name, locale.message.button["close"]);
                    }
                
                }
                else{
                    if(parseInt(group_pro_status)==0)
                    {
                        alert(locale.message.alert["out_of_stock_message"]);
                    }
                    else
                    {
                        alert(locale.message.alert["group_pro_validation"]);
                    }
                }
            }
        }
        else {
            
         
         /*   var manage_stock=$("#manage_stock").val();
            var use_config_manage_stock=$("#use_config_manage_stock").val();
            var use_config_manage_stock=$("#use_config_manage_stock").val();
            var max_sale_qty=$("#max_sale_qty").val();
            var config_manage_stock=$("#config_manage_stock").val(); */
           
            
            var selectSize = pSize;
            var selectColor = pColor;
            selected_option_array = '';
            if(has_custom_options) {
                var custom_options_results = validateCustomOptions();
            }
            else {
                var custom_options_results = [];
                custom_options_results["error"] = 0;
                custom_options_results["customoptions"] = '';
                custom_options_results["custom_choice"] ='';
            }
            if(custom_options_results["error"] == 0) {
                console.log('----[Simple] Before Add to Cart ----');
                console.log(custom_options_results);
                var customoptions = $.extend({}, custom_options_results["customoptions"]);
                console.log(customoptions);
                var additional = calculateCustomPrice();
                pPrice = parseFloat($("#pPrice").text());
                if(pPrice == "" || pPrice == null ) {
                    pPrice = '0';
                }
                else if(isNaN(pPrice)) {
                    pPrice = '0';
                }
                else {
                    pPrice =  ((parseFloat(pPrice) + parseFloat(additional)).toFixed(2))+'';
                }
                if(custom_options_results["custom_choice"] == '' || custom_options_results["custom_choice"] == null ) {
                    
                    product_updated_sku = pSKU;
                    product_choice='';
                    product_custom_price='';
                }
                else {
                    product_updated_sku = pSKU + custom_options_results["custom_choice"];
                    product_choice=custom_options_results["custom_choice"];
                    product_custom_price=parseFloat(additional).toFixed(2);
                }
                console.log(custom_options_results);
                //addToCart(queryValue(),pSKU,pPrice,pShipp,imageURL,pName,selectSize,selectColor, selected_option_array, customoptions);
                var selected_product_id = global_results_configurable["id"];
                var selected_product_stock = global_results_configurable["quantity"];
                //alert(selected_product_id);alert(selected_product_id);
                var stock_status="stock_status1";
                if(selected_product_stock < 0 || selected_product_stock == null || selected_product_stock == "") {
                    stock_status="stock_status0";
                }
                stock_status = selected_product_id + stock_status;
                var new_product_id = selected_product_id;
                //alert(stock_status);
                var new_pro_data = {};
                new_pro_data["pro_type"] = pType;
                new_pro_data["parent_id"] = global_results_configurable.id;
               /* new_pro_data["manage_stock"] = manage_stock;
                new_pro_data["use_config_manage_stock"] = use_config_manage_stock;
                new_pro_data["max_sale_qty"] = max_sale_qty;
                new_pro_data["config_manage_stock"] = config_manage_stock; */
                
                
                
                
                
                
                
                
                addToCart(global_results_configurable.id, pSKU, pPrice, pShipp, imageURL,pName,selectSize,selectColor, selected_option_array, customoptions,1,new_pro_data);
                    
               //Sumit code commented
             //   addToCart(new_product_id,stock_status,product_updated_sku,pPrice,pShipp,imageURL,pName,selectSize,selectColor, selected_option_array, customoptions,product_choice,product_custom_price);
            }
        }
    }
}







function showHideDiv1(id){
    var obj = document.getElementById(id);
    if (obj.style.display=="none"){
        obj.style.display='block';
    } else if(obj.style.display=="block"){
        obj.style.display='none';
    }
}

function get_sku() {
    var length_result = global_results_configurable["size"];
    var selected_sku =[];
    var inner_array_size, temp, result, num =0, counter =0;
    var check = [];
    for(i=0; i<length_result-2; i++) {
        inner_array_size = global_results_configurable[i].length;
        for(j=0; j<inner_array_size; j++) {
            //get id of select options
            var select_option_id = document.getElementById(number_of_select_box_id[j]);
            //check if all the above select options are there in array or not, if yes then increment the counter till inner_array_size
            var sel_option_value_tmp = select_option_id.value.split('+');
            var select_option_id_value  = sel_option_value_tmp[0].trim();
            if(global_results_configurable[i][j]["data"]["store_label"].replace(/ +/g, "") == select_option_id_value) {
                counter ++;
            }
            if(counter == inner_array_size) {
                counter = 0;
                return {
                sku: global_results_configurable[i][j]["sku"],
                    index_1 : i,
                    index_2 : j
                };
            }
        }
        counter = 0;
    }
}



function change_option(select_box_id) {
    var select_box_2_id;
    var select_option_id;
    var option;
    var attribute;
    var attribute_price;
    var attribute_option = [];
    var check =1;
    var result= 0;
    size_select_box = global_results_configurable["size"];
    // delete values form select box if Choose an Option is selected
    if(select_box_id.value == "Choose an Option....") {
        reset_select_box(select_box_id);
    }
    if(select_box_id.value == "Reset") {
        location.reload();
    }
    var curr_el = '#'+select_box_id.id+' option:contains("Choose an Option....")';
    $(curr_el).text('Reset');
    
    $('#configurable_product select').each(function(){
                                           if(!first_select_id) {
                                           first_select_id = this.id;
                                           }
                                           return;
                                           });
    $('#configurable_product select').each(function(){
                                           
                                           if(this.value == "" || this.value == "Choose an Option...." || this.value == null) {
                                           //   selected_value_data = '';
                                           }
                                           else {
                                           var selected_value_arr = this.value.split('+');
                                           console.log("SVALUE " + selected_value_arr);
                                           if (first_select_id == this.id) {
                                           selected_value_data = selected_value_arr[0].trim();
                                           
                                           if(select_box_id.id == first_select_id)
                                           return false;
                                           }
                                           else {
                                           selected_value_data += ', '+selected_value_arr[0].trim();
                                           }
                                           }
                                           console.error('Selected Value '+selected_value_data);
                                           });
    
    
    var select_relation_arr = find_relation_mapping(selected_value_data, relation_mapping);
    //add values to below select box based upon selected value from previous select box
    try {
        for(i=0;i<size_select_box-2;i++) {
            size_of_inner_array = global_results_configurable[i].length;
            for(j=0;j<size_of_inner_array;j++) {
                var selectboxvalue_temp = select_box_id.value.split("+");
                var selectboxvalue = selectboxvalue_temp[0].trim();
                var  stock_avail;
                console.log(selectboxvalue);
                if((global_results_configurable[i][j]["data"]["label"].replace(/[^a-zA-Z0-9]/g, "")) == (selectboxvalue.replace(/[^a-zA-Z0-9]/g, ""))) {
                    //******************
                    //if((global_results_configurable[i][j]["data"]["label"].replace(",","")) == selectboxvalue) {
                    attribute = global_results_configurable[i][j+1]["data"]["label"];
                    console.log("ATTRIBUTE " + attribute);
                    //***********************
                    //attribute = global_results_configurable[i][j+1]["data"]["label"].replace(",","");
                    attribute_price = global_results_configurable[i][j+1]["data"]["pricing_value"];
                    stock_avail = global_results_configurable[i][j+1]["is_in_stock"];
                    select_box_2_id = global_results_configurable[i][j+1]["data"]["attribute_code"];
                    if(check) {
                        //delete all the values present in select box
                        delete_select_box(select_box_2_id);
                        check =0;
                    }
                    
                    //add values to select box leaving the 1 select box
                    //remove if redundant values are present
                    result = attribute_option.indexOf(attribute);
                    
                    is_in_relation_mapping = check_in_relation(attribute, select_relation_arr);
                    console.log("is_in_relation_mapping " + is_in_relation_mapping);
                    if(result < 0) {
                        if(stock_avail == 1 && is_in_relation_mapping == 1) {
                            select_option_id = document.getElementById(select_box_2_id);
                            option = document.createElement("option");
                            if(attribute_price == 0)
                                option.text = attribute ;
                            else
                                option.text = attribute + '  + '+attribute_price;
                            
                            option.setAttribute("price",attribute_price);
                            select_option_id.add(option);
                        }
                        else {
                            continue;
                        }
                    }
                    
                    attribute_option[i] = attribute;
                    
                    //delete all options from select after select number 2
                    num = j+2;
                    for(;num<size_of_inner_array;num++) {
                        attribute = global_results_configurable[i][num]["data"]["label"];
                        //********************
                        //attribute = global_results_configurable[i][num]["data"]["label"].replace(",","");
                        select_box_2_id = global_results_configurable[i][num]["data"]["attribute_code"];
                        delete_select_box(select_box_2_id);
                    }
                }
            }
        }
    }
    catch(err) {
        console.log(err.message);
    }
    
    //add total to price from above selected select box
    add_total_price();
    if (select_box_id.id != first_select_id) {
        var ele = '#'+select_box_id.id;
        $(ele).attr("disabled", true);
    }
    else {
        $('#configurable_product select').each(function(){
                                               $(this).attr("disabled", false);
                                               });
    }
}
function find_relation_mapping(selected_value_data, relation_mapping) {
    var i=0, j=0;
    var len1 = relation_mapping.length;
    var result_str = '';
    var result_arr = [];
    selected_value_data = selected_value_data.replace(/ +/g, "");
    for(i=0;i<len1;i++) {
        var current = relation_mapping[i];
        current = current.replace(/ +/g, "");
        var split_current = current.split(selected_value_data);
        var next_current = split_current[1];
        if(split_current[0]== '' || split_current[0]== null || split_current[0]== ',') {
            try {
                result_curr_str = next_current.trim();
                //result_curr_str_arr = result_curr_str.split(',');
                console.log("result_curr_str  "+ result_curr_str);
                //result_curr_str_arr = result_curr_str.replace(/[^a-zA-Z0-9]/g, "");
                result_curr_str_arr = result_curr_str.replace(",", "");
                console.log("result_curr_str_arr " + result_curr_str_arr);
                console.log("result_curr_str_arr[1] " + result_curr_str_arr[1]);
                result_arr.push(result_curr_str_arr);
            }
            catch(err) {
                if(i<len1-1) {
                    location.reload();
                    //console.log("find_relation_mapping : "+err.message);
                    console.log("find_relation_mapping : "+err.message);
                }
            }
        }
    }
    //console.error( result_str);
    
    console.error(result_arr);
    return result_arr;
}
function check_in_relation(attribute, select_relation_arr) {
    var current_val_arr = attribute.split('+');
    var current_val = current_val_arr[0].replace(/^\,/, "").replace(/ /g,'');
    var result = -1;
    for(var incr=0; incr<select_relation_arr.length;incr++) {
        result = select_relation_arr[incr].indexOf(current_val);
        if(result>=0) {
            return 1;
        }
    }
    if(result<0) {
        return -1;
    }
}
function add_total_price() {
    var len = number_of_select_box_id.length;
    var selected_price = [];
    var total_select_price = 0;
    for(i=0; i<len; i++) {
        var selected_option = document.getElementById(number_of_select_box_id[i]);
        var price =parseFloat(selected_option.options[selected_option.selectedIndex].getAttribute("price"));
     			if(isNaN(price))
                    selected_price[i] = 0;
                else
                    selected_price[i] = price;
    }
    try {
        pPrice =  pPrice.replace(",", "");
    }
    catch(err) {
        console.log(err.message);
    }
    for(i=0;i<len;i++) {
        total_select_price = total_select_price + selected_price[i];
    }
    var total_price = (parseFloat(pPrice) + parseFloat(total_select_price)).toFixed(2);
    $("#price_symbol").html(config.data[0].app_curr_symbol);
    $("#pPrice").html(total_price);
    $("#pPriceOrg").html(total_price);
    
}


function reset_select_box(select_box_id) {
    var select_box_2_id;
    var select_option_id;
    var option;
    var attribute;
    var check =1;
    var size_select_box = global_results_configurable["size"];
    var option_location;
    //function to get the occurance of option in array
    option_location = find_index_of_selected_option(select_box_id);
    //based upon got occurance delete all values from select box
    //first - remove all
    if(option_location == "first") {
        for(i=0;i<size_select_box-2;i++) {
            var size_of_inner_array = global_results_configurable[i].length;
            for(j=0;j<size_of_inner_array;j++) {
                try {
                    if(global_results_configurable[i][j]["data"]["label"] != select_box_id.value) {
                        attribute = global_results_configurable[i][j+1]["data"]["label"];
                        //select_box_2_id = global_results_configurable[i][j+1]["label"];
                        select_box_2_id = global_results_configurable[i][j+1]["data"]["attribute_code"];
                        delete_select_box(select_box_2_id);
                        check =0;
                    }
                }
                catch(err) {
                }
            }
        }
    }
    //middle - leave first and remove all
    else if(option_location == "middle")  {
        for(i=0;i<size_select_box-2;i++) {
            var size_of_inner_array = global_results_configurable[i].length;
            for(j=1;j<size_of_inner_array;j++) {
                try {
                    if(global_results_configurable[i][j]["data"]["label"] != select_box_id.value) {
                        attribute = global_results_configurable[i][j+1]["data"]["label"];
                        select_box_2_id = global_results_configurable[i][j+1]["data"]["attribute_code"];
                        delete_select_box(select_box_2_id);
                        check =0;
                    }
                }
                catch(err) {
                }
            }
        }
    }
    //last - do nothing
    else {
        //skip all for last option
    }
}

//function to get the occurance of option in array
function find_index_of_selected_option(select_box_id, sno_in_array) {
    var size_select_box = global_results_configurable["size"];
    var size_of_inner_array;
    var option_location = [];
    for(i=0;i<size_select_box-2;i++) {
        size_of_inner_array = global_results_configurable[i].length;
        for(j=0;j<size_of_inner_array;j++) {
            if(global_results_configurable[i][j]["data"]["attribute_code"] == select_box_id.id) {
                if(j == size_of_inner_array-1) {
                    option_location = "last";
                    return option_location;
                }
                else if	(j == 0) {
                    option_location = "first";
                    return option_location;
                }
                else{
                    option_location = "middle";
                    return option_location;
                }
                break;
            }
        }
    }
}

function delete_select_box(select_box_id) {
    var selectbox = document.getElementById(select_box_id);
    var i;
    for(i=selectbox.options.length-1;i>=0;i--)
    {
        selectbox.remove(i);
    }
    var option = document.createElement("option");
    option.text = "Choose an Option....";
    selectbox.add(option);
}




/*
 *Function call Native Date Time Picker
 *@param : element => source input element
 *@param : type => required input type like date, time or datetime
 *@return : None
 */
function showDateTimePicker(element, type) {
    var options = {
    date: new Date(),
    mode: type
    };
    datePicker.show(options, function(date){
                    if(type == "date") {
                    element.value = getFormatDate(date);
                    }
                    else {
                    element.value = getFormatTime(date);
                    }
                    });
    $(element).blur();
}

/*
 *Function call to preview image
 *@param
 *@return
 */
function display_img_preview(image){
    localStorage[config.data[0].storage_key+"_Preview_Image"] = image.src;
    var PRODUCT_ID = queryValue();
    var dirPath = dirname(location.href);
    var fullPath = dirPath + "/product_img_view.html?id="+PRODUCT_ID;
    window.location=fullPath;
}
/*
 *Function call to go login
 *@param
 *@return
 */
function gotoLogin() {
    var PRODUCT_ID = queryValue();
    var next = "product_details.html?id="+PRODUCT_ID;
    goLogin(next);
}
/**
 *Function get final sku of the product
 *
 */
function getFinalSKU(currentsku){
    
}

/**
 *Function calculate additional price depending on custom options
 *
 */
function calculateCustomPrice(){
    var total_additional_price = 0;
    try {
        if(has_custom_options) {
            var custom_options_results = validateCustomOptions();
        }
        else {
            var custom_options_results = [];
            custom_options_results["error"] = 0;
            custom_options_results["customoptions"] = '';
            custom_options_results["custom_choice"] = '';
        }
        console.log(custom_options_results);
        if(custom_options_results["error"] == 0) {
            console.log('[Get Price] Before Add to Cart');
            console.log('Pass 1');
            console.log(custom_options_results);
            console.log('Pass 2');
            total_additional_price = parseFloat(custom_options_results["total_additional_price"]).toFixed(2);
            console.log('Pass 3');
            console.log('Additional Price '+total_additional_price);
            
            var productrealprice = parseFloat($("#pPriceOrg").text().replace(",","")).toFixed(2);
            console.log('Pass 4');
            var productcrossprice = parseFloat($("#pPriceCrossOrg").text().replace(",","")).toFixed(2);
            console.log('Pass 5');
            var updated_product_price = parseFloat(productrealprice) + parseFloat(total_additional_price);
            console.log('Pass 6');
            var updated_product_price_cross = parseFloat(productcrossprice) + parseFloat(total_additional_price);
            console.log('Pass 7');
            updated_product_price = parseFloat(updated_product_price).toFixed(2);
            updated_product_price_cross = parseFloat(updated_product_price_cross).toFixed(2);
            //$("#pPrice").html(updated_product_price);
            //$("#pCross").html(updated_product_price_cross);
            $("#finalprice").html('Price ('+app_curr_symbol+productrealprice+' + '+app_curr_symbol+total_additional_price+') : '+app_curr_symbol+updated_product_price);
            
        }
    } catch(err) {
        console.log(err.message);
    }
    try {
        total_additional_price = parseFloat(total_additional_price.replace(/,/g,""));
    } catch(err) {
        console.log(err.message+'Additional '+total_additional_price);
    }
    if(total_additional_price == "" || total_additional_price == null) {
        total_additional_price = 0;
    }
    else if(isNaN(total_additional_price)) {
        total_additional_price = 0;
    }
    total_additional_price = total_additional_price.toFixed(2);
    return total_additional_price;
}
/**
 *Function validate custom options
 *
 */
function validateCustomOptions() {
    var my_custom_choice = '';
    var total_custom_option_validation_error = 0;
    var total_additional_price = 0;
    var custom_options_results = [];
    $('#custom_options_collapsible :input').each(function(){
                                                 var element_type = $(this).attr("type");
                                                 if(element_type == 'undefined' || element_type == null || element_type == '') {
                                                 element_type = $(this).prop('tagName').toLowerCase();
                                                 if(element_type == 'undefined' || element_type == null || element_type == '') {
                                                 element_type = $(this)[0].tagName.toLowerCase();
                                                 }
                                                 }
                                                 custom_option_id = $(this).attr("custom_option_id");
                                                 
                                                 if($(this).hasClass("required")) {
                                                 if(element_type == 'text' || element_type == 'textarea') {
                                                 var curr_value = $(this).val().trim();
                                                 if(curr_value == null || curr_value == '' || curr_value == 'undefined') {
                                                 if (config.data[0].platform=='ios' || config.data[0].platform=='android') {
                                                 navigator.notification.alert(locale.message.alert["required_validation"],function () {},config.data[0].app_name, locale.message.button["close"]);
                                                 }
                                                 else{
                                                 alert(locale.message.alert["required_validation"]);
                                                 }
                                                 total_custom_option_validation_error++;
                                                 $(this).focus();
                                                 return false;
                                                 }
                                                 my_custom_choice += ' '+curr_value;
                                                 total_additional_price += parseFloat($(this).attr("price").replace(",",""));
                                                 custom_options_results[custom_option_id] = curr_value;
                                                 console.log('Text Box Adding Price  : '+$(this).attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                 }
                                                 else if(element_type == 'datetime') {
                                                 var curr_value = $(this).val().trim();
                                                 if(curr_value == null || curr_value == '' || curr_value == 'undefined') {
                                                 if (config.data[0].platform=='ios' || config.data[0].platform=='android') {
                                                 navigator.notification.alert(locale.message.alert["required_validation"],function () {},config.data[0].app_name, locale.message.button["close"]);
                                                 }
                                                 else{
                                                 alert(locale.message.alert["required_validation"]);
                                                 }
                                                 total_custom_option_validation_error++;
                                                 $(this).focus();
                                                 return false;
                                                 }
                                                 my_custom_choice += ' '+curr_value;
                                                 total_additional_price += parseFloat($(this).attr("price").replace(",",""));
                                                 custom_options_results[custom_option_id] = curr_value;
                                                 console.log('Date Time Adding Price  : '+$(this).attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                 }
                                                 else if(element_type == 'select') {
                                                 try {
                                                 var curr_value = $(this).children("option").filter(":selected").text().trim();
                                                 } catch(err) {
                                                 console.error('Select Error '.err.message);
                                                 }
                                                 if(curr_value == locale.message.text["select"] || curr_value == null || curr_value == '' || curr_value == 'undefined') {
                                                 if (config.data[0].platform=='ios' || config.data[0].platform=='android') {
                                                 navigator.notification.alert(locale.message.alert["required_validation"],function () {},config.data[0].app_name, locale.message.button["close"]);
                                                 }
                                                 else{
                                                 alert(locale.message.alert["required_validation"]);
                                                 }
                                                 
                                                 total_custom_option_validation_error++;
                                                 
                                                 $(this).focus();
                                                 return false;
                                                 }
                                                 
                                                 custom_options_results[custom_option_id] = $(this).children("option").filter(":selected").attr("valueid");
                                                 curr_label = curr_value.split('+');
                                                 my_custom_choice += ' '+curr_label[0];
                                                 total_additional_price += parseFloat($(this).children("option").filter(":selected").attr("price").replace(",",""));
                                                 console.log('Select Adding Price  : '+$(this).children("option").filter(":selected").attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                 }
                                                 else if(element_type == 'radio') {
                                                 var ele_name = $(this).attr("name");
                                                 if($('input[name='+ele_name+']:checked').length<=0) {
                                                 if (config.data[0].platform=='ios' || config.data[0].platform=='android') {
                                                 navigator.notification.alert(locale.message.alert["required_validation"],function () {},config.data[0].app_name, locale.message.button["close"]);
                                                 }
                                                 else{
                                                 alert(locale.message.alert["required_validation"]);
                                                 }
                                                 total_custom_option_validation_error++;
                                                 $(this).focus();
                                                 return false;
                                                 }
                                                 
                                                 $('input[name='+ele_name+']:checked').each(function(){
                                                                                            custom_options_results[custom_option_id] = new Array();
                                                                                            custom_options_results[custom_option_id].push($(this).attr("valueid"));
                                                                                            my_custom_choice += ' '+$(this).attr("value");
                                                                                            var curr_label = $("label[for='"+$(this).attr("id")+"']").text().split('+');
                                                                                            console.log(curr_label);
                                                                                            my_custom_choice += ' '+curr_label[0];
                                                                                            });
                                                 }
                                                 else if(element_type == 'checkbox') {
                                                 var ele_name = $(this).attr("name");
                                                 var len = $('input[name='+ele_name+']:checked').length;
                                                 if(len<=0) {
                                                 if (config.data[0].platform=='ios' || config.data[0].platform=='android') {
                                                 navigator.notification.alert(locale.message.alert["required_validation"],function () {},config.data[0].app_name, locale.message.button["close"]);
                                                 }
                                                 else{
                                                 alert(locale.message.alert["required_validation"]);
                                                 }
                                                 total_custom_option_validation_error++;
                                                 $(this).focus();
                                                 return false;
                                                 }
                                                 else {
                                                 $('input[name='+ele_name+']:checked').each(function(){
                                                                                            try {
                                                                                            var inarray_flag = $.inArray($(this).attr("valueid"), custom_options_results[custom_option_id]);
                                                                                            if(inarray_flag == -1) {
                                                                                            try {
                                                                                            custom_options_results[custom_option_id].push($(this).attr("valueid"));
                                                                                            total_additional_price += parseFloat($(this).attr("price").replace(",",""));
                                                                                            }
                                                                                            catch(err) {
                                                                                            custom_options_results[custom_option_id] = new Array();
                                                                                            custom_options_results[custom_option_id].push($(this).attr("valueid"));
                                                                                            total_additional_price += parseFloat($(this).attr("price").replace(",",""));
                                                                                            console.log('Check Price : '+parseFloat($(this).attr("price").replace(",","")));
                                                                                            
                                                                                            }
                                                                                            console.log('Checkbox Adding Price  : '+$(this).attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                                                            var curr_label = $("label[for='"+$(this).attr("id")+"']").split('+');
                                                                                            my_custom_choice += ' '+curr_label[0];
                                                                                            }
                                                                                            else {
                                                                                            //do nothing
                                                                                            }
                                                                                            }
                                                                                            catch(err) {
                                                                                            console.log(err.message);
                                                                                            }
                                                                                            });
                                                 }
                                                 }
                                                 }
                                                 else {
                                                 if(element_type == 'text' || element_type == 'textarea') {
                                                 var curr_value = $(this).val().trim();
                                                 if(curr_value == null || curr_value == '' || curr_value == 'undefined') {
                                                 
                                                 }
                                                 else {
                                                 custom_options_results[custom_option_id] = curr_value;
                                                 total_additional_price += parseFloat($(this).attr("price").replace(",",""));
                                                 my_custom_choice += ' '+curr_value;
                                                 }
                                                 
                                                 console.log('Text2 Adding Price  : '+$(this).attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                 }
                                                 else if(element_type == 'datetime') {
                                                 var curr_value = $(this).val().trim();
                                                 if(curr_value == null || curr_value == '' || curr_value == 'undefined') {
                                                 
                                                 }
                                                 else {
                                                 custom_options_results[custom_option_id] = curr_value;
                                                 my_custom_choice += ' '+curr_value;
                                                 total_additional_price += parseFloat($(this).attr("price").replace(",",""));
                                                 }
                                                 console.log('Date Time2 Adding Price  : '+$(this).attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                 }
                                                 else if(element_type == 'select') {
                                                 try {
                                                 var curr_value = $(this).children("option").filter(":selected").text().trim();
                                                 } catch(err) {
                                                 console.error('Select Error '.err.message);
                                                 }
                                                 if(curr_value == locale.message.text["select"] || curr_value == null || curr_value == '' || curr_value == 'undefined') {
                                                 
                                                 }
                                                 else {
                                                 custom_options_results[custom_option_id] = $(this).children("option").filter(":selected").attr("valueid");
                                                 curr_label =  curr_value.split('+');
                                                 my_custom_choice += ' '+curr_label[0];
                                                 total_additional_price += parseFloat($(this).children("option").filter(":selected").attr("price").replace(",",""));
                                                 console.log('Select 2 Adding Price  : '+$(this).children("option").filter(":selected").attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                 }
                                                 }
                                                 else if(element_type == 'radio') {
                                                 var ele_name = $(this).attr("name");
                                                 if($('input[name='+ele_name+']:checked').length<=0) {
                                                 
                                                 }
                                                 else {
                                                 $('input[name='+ele_name+']:checked').each(function(){
                                                                                            try {
                                                                                            custom_options_results[custom_option_id].push($(this).attr("valueid"));
                                                                                            }
                                                                                            catch(err) {
                                                                                            custom_options_results[custom_option_id] = new Array();
                                                                                            custom_options_results[custom_option_id].push($(this).attr("valueid"));
                                                                                            
                                                                                            }
                                                                                            var curr_label = $("label[for='"+$(this).attr("id")+"']").text().split('+'); 
                                                                                            my_custom_choice += ' '+curr_label[0];
                                                                                            });
                                                 }
                                                 }
                                                 else if(element_type == 'checkbox') {
                                                 var ele_name = $(this).attr("name");
                                                 var len = $('input[name='+ele_name+']:checked').length;
                                                 if(len<=0) {
                                                 //do nothing    
                                                 }
                                                 else {
                                                 $('input[name='+ele_name+']:checked').each(function(){
                                                                                            try {
                                                                                            var inarray_flag = $.inArray($(this).attr("valueid"), custom_options_results[custom_option_id]);
                                                                                            if(inarray_flag == -1) {
                                                                                            try {    
                                                                                            custom_options_results[custom_option_id].push($(this).attr("valueid"));
                                                                                            total_additional_price += parseFloat($(this).attr("price"));
                                                                                            }
                                                                                            catch(err) {
                                                                                            custom_options_results[custom_option_id] = new Array();
                                                                                            custom_options_results[custom_option_id].push($(this).attr("valueid"));
                                                                                            total_additional_price += parseFloat($(this).attr("price").replace(",",""));
                                                                                            }
                                                                                            curr_label =  $("label[for='"+$(this).attr("id")+"']").split('+');
                                                                                            my_custom_choice = ' '+ curr_label[0]; 
                                                                                            console.log('Checkbox 2  Time Adding Price  : '+$(this).attr("price").replace(",","")+' Additional Total : '+total_additional_price);
                                                                                            }
                                                                                            else {
                                                                                            //do nothing
                                                                                            }
                                                                                            }
                                                                                            catch(err) {
                                                                                            console.log(err.message);
                                                                                            }
                                                                                            });  
                                                 }
                                                 }
                                                 }
                                                 });
    var additional_radio = 0;
    $('input[type="radio"]:checked').each(function(){
                                          additional_radio += parseFloat($(this).attr("price").replace(",",""));
                                          });
    console.log('Radio Price '+additional_radio);
    total_additional_price += additional_radio;
    var  final_custom_options_results = [];
    final_custom_options_results["error"] = total_custom_option_validation_error;
    final_custom_options_results["customoptions"] = custom_options_results;
    final_custom_options_results["total_additional_price"] = total_additional_price;
    final_custom_options_results["custom_choice"] = my_custom_choice;
    return final_custom_options_results;
}
function showHideDiv1(id){
    var obj = document.getElementById(id);
    if (obj.style.display=="none"){
        obj.style.display='block';
    } else if(obj.style.display=="block"){
        obj.style.display='none';
    }
}
