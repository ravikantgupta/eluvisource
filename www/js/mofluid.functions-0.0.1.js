var Page = new function() {
  this.redirect = function(page, transition, direction) {
      
      localStorage.setItem(config.data[0].storage_key+"_params","");
    var options = {
      "href" : page,
      "direction"        : direction, // 'left|right|up|down', default 'left' (which is like 'next')
      "duration"         :  500, // in milliseconds (ms), default 400
      "slowdownfactor"   :    3, // overlap views (higher number is more) or no overlap (1), default 4
      "iosdelay"         :  100, // ms to wait for the iOS webview to update before animation kicks in, default 60
      "androiddelay"     :  150, // same as above but for Android, default 70
      "winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
      "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      "fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    };
    try {
      switch(transition) {
        case "slide":
          window.plugins.nativepagetransitions.slide(
            options,
            function (msg) {console.log("success: " + msg)}, // called when the animation has finished
            function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
          );
          break;
        case "flip":
          window.plugins.nativepagetransitions.flip(
            options,
            function (msg) {console.log("success: " + msg)}, // called when the animation has finished
            function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
          );
          break;
      }
    }
    catch(err) {
      var dirPath = location.href.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
      fullPath = dirPath + "/"+page;
      window.location=fullPath;
    }
  };
  this.getParams = function() {
    var page_data;
    try {
      page_data = JSON.parse(Base64.decode(localStorage.getItem(config.data[0].storage_key+"_params")));
	  
	  
    }
    catch(err) {
      console.error(err.message);
    }
    return page_data;
  };
  this.redirectWithParams = function(page, transition, direction, params) {
    try {
		
		alert('ttt:'+JSON.stringify(params));
		
		alert('ttt1:'+ JSON.parse(params['result']);
		
		
		if(jQuery('#currentpage').val()==1)
		{
		  
		  
		  $("#cms-page-detail").html(params['result']);
		}
      localStorage.setItem(config.data[0].storage_key+"_params", Base64.encode(JSON.stringify(params)));
       
    }
    catch(err) {
      console.error(err.message);
        alert("params function "+err.message);
    }
    var options = {
      "href" : page,
      "direction"        : direction, // 'left|right|up|down', default 'left' (which is like 'next')
      "duration"         :  900, // in milliseconds (ms), default 400
      "slowdownfactor"   :    1, // overlap views (higher number is more) or no overlap (1), default 4
      "iosdelay"         :  600, // ms to wait for the iOS webview to update before animation kicks in, default 60
      "androiddelay"     :  150, // same as above but for Android, default 70
      "winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
      "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      "fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    };
    try {
      switch(transition) {
        case "slide":
          window.plugins.nativepagetransitions.slide(
            options,
            function (msg) {console.log("success: " + msg)}, // called when the animation has finished
            function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
          );
          break;
        case "flip":
          window.plugins.nativepagetransitions.flip(
            options,
            function (msg) {console.log("success: " + msg)}, // called when the animation has finished
            function (msg) {console.log("error: " + msg)} // called in case you pass in weird values
          );
          break;
      }
    }
    catch(err) {
      var dirPath = location.href.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
      fullPath = dirPath + "/"+page;
      window.location=fullPath;
    }
  };
}

var Notification = new function() {
  this.alert = function(msg, callback) {
    try {
      navigator.notification.alert(msg, callback, config.data[0].app_name, "Close");
    }
    catch(err) {
      alert(msg);
      callback();
    }
  };
  this.confirm = function(msg, callback) {
    try {
      navigator.notification.confirm(msg, callback, config.data[0].app_name, "Close");
    }
    catch(err) {
      confirm(msg);
      callback();
    }
  };
}
