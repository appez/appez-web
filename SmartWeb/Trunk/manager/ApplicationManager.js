/** 
 * 
 *	This class represents a generic application manager.
 *	Responsible for reading and parsing screens from Screen Templates.
 * 
 **/


appez.smartweb.manager.ApplicationManager = appez.smartweb.createClass({
	className : "appez.smartweb.manager.ApplicationManager",
	extend : appez.smartweb.swcore.BaseManager,
	singleton: true,
    application: {},
	
    init : function() {

	},
	
   initApplication:function(appConfig){
       this.application = new appez.smartweb.model.Application();
       this.application.appName = appConfig.appName;
       this.application.appVersion = appConfig.appVersion;
       this.application.config = appConfig.config;
       
       return this.application;
   },
                                                   
   initScreenTemplates:function(){
	   var smartEvent = null;
	   //var screenTemplatesFilePath = '../js/view/ScreenTemplates.xml';
	   var indexPageLocation = document.location.href;
	   var screenTemplatesFilePath = 'app/smartphone/js/view/ScreenTemplates.xml';
	   if(indexPageLocation.indexOf("indexTab.html")>-1){
		   screenTemplatesFilePath = 'app/tablet/js/view/ScreenTemplates.xml';
	   }
	   var fileReadReq = {
			   'requestUrl' : screenTemplatesFilePath
	   };
	   if (appez.isWindowsPhone()) {
	   	appez.smartweb.util.Ajax.performAjaxOperation(this.afterScreenTemplatesRead,this.afterErrorScreenTemplatesRead, this,fileReadReq,true);
	   }
	   else{
	   	appez.smartweb.util.Ajax.performAjaxOperation(this.afterScreenTemplatesRead,this.afterErrorScreenTemplatesRead, this,fileReadReq,false);	   	
	   }
   },
                                                   
   afterScreenTemplatesRead: function(response,textStatus,jqXHR) {
       var xmlToJson = new X2JS();
       var jsonObj;
       if (appez.isWindowsPhone()) {
           // For WP change string to xmlDoc
           var xmlDoc = xmlToJson.parseXmlString(response);
           jsonObj = xmlToJson.xml2json(xmlDoc);
       } else {
           var jsonObj = xmlToJson.xml2json(response);
       }
	   var screenTemplateData = JSON.stringify(jsonObj);
	   var templatesData="";
	   
	 templatesData = appez.smartweb.util.ScreenTemplatesParser.parseJson(jsonObj);
	
     
       for(var screenKey in templatesData) {
    	   appez.smartweb.getApplication().view[screenKey] = templatesData[screenKey];
       }  
   },
  
   afterErrorScreenTemplatesRead : function(jqXHR,textStatus,error){
	   console.log('Error reading ScreenTemplates file');
	   //TODO add better handling for this scenario whwrein the ScreenTemplates.xml file could not be read properly
   }
});