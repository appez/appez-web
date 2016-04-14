/**
 * Contains helper functions for using services of appez native containers(Android, iOS, WP)
 * 
 */
appez.mmi = {
		manager : {
			"android":{},
			"ios":{},
			"wp":{},
			"web":{}
		},
		model : {},
		notifier : {},
		service : {
			"nativePlatform": {},
			"web": {}
		},
		util : {
			
		},
		
		logManager : null,
		mobiletManager : null,
		platformService : null,
		isProgressDialogShown : false,
		
		nativeEventListenerScope : null,
		nativeEventListenerFunction : null,
		
		originalViewportHeight : 0,
		
		isSmartEventUnderExec : false,
		
		init : function(){
			//TODO Initialise services JSON object so that directly service objects can be obtained
			//TODO initialise the platform specific managers such as LogManager and MobiletManager
			this.logManager = appez.mmi.manager[appez.getDevice().getOsString()].LogManager;
			this.mobiletManager = appez.mmi.manager[appez.getDevice().getOsString()].MobiletManager;
			if(appez.getDevice().deviceOS!=appez.getDevice().DEVICE_OS.WEB){
				//In case of web version, the web equivalent of the services will get loaded
				this.platformService = appez.mmi.service.nativePlatform;
			} else{
				this.platformService = appez.mmi.service.web;
			}
			
			//Determine the original height of the page viewport
			this.originalViewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			var me = this;
			//Register the window resize listener so as to capture the soft keyboard show/hide
			window.onresize = function() { 
				appez.mmi.log('Window resize');
				//Specify the action to be taken on window resize. Remember to add the following entry ' android:windowSoftInputMode="adjustResize"' in the AndroidManifest.xml for Android platform
				var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
				if(viewportHeight==me.originalViewportHeight){
					appez.mmi.log('keyboard hidden');
					appez.mmi.manager.MobiletManager.notificationFromNative(appez.mmi.constant.NATIVE_EVENT_SOFT_KB_HIDE);
				} else if(viewportHeight<me.originalViewportHeight){
					appez.mmi.log('keyboard shown');
					appez.mmi.manager.MobiletManager.notificationFromNative(appez.mmi.constant.NATIVE_EVENT_SOFT_KB_SHOW);
				}

			};
		},
		
		createClass : function(memberVariables) {
			return appez.mmi.util.ClassManager.createClass(memberVariables);
		},
		
		base64Encode : function(stringToEncode) {
			return appez.mmi.util.Base64.encode(stringToEncode);
		},

		base64Decode : function(stringToDecode) {
			return appez.mmi.util.Base64.decode(stringToDecode);
		},
		
		getLogManager : function(){
			return this.logManager;
		},
		
		getMobiletManager : function(){
			return this.mobiletManager;
		},
		
		log : function(message, logLevel){
			this.getLogManager().log(message, logLevel);
		},
		
		/**
		 * This method can be used when the user wants to access the entire 'SmartEvent' object. 
		 * This might be needed, since the completion of service would be returning only 'SmartEventResponse' and user might need to access 'SmartEventRequest' also.
		 * 
		 * @return SmartEvent
		 * 
		 * */
		getCurrentSmartEvent : function(){
			//TODO add handling as to what will this function return when run on Web platform 
			return appez.mmi.manager.MobiletManager.getCurrentSmartEvent();
		},
		
		/**
		 * Checks whether or not a SmartEvent is currently under execution or not. 
		 * Returns 'true' if one of the events is under execution at the native layer, returns 'false' otherwise 
		 * 
		 * */
		isSmartEventUnderExecution : function(){
			return this.isSmartEventUnderExec;
		},
		
		/**
		 * Set the status of SmartEvent under execution as 'true' or 'false'
		 *
		 * @param isEventUnderExec
		 * */
		setSmartEventUnderExecution : function(isEventUnderExec){
			if(isEventUnderExec!=undefined){
				this.isSmartEventUnderExec = isEventUnderExec;
			}
		},
		
		/**
		 * 
		 * User application can register a listener for listening to native events like Back key pressed, system notifications(such as low battery, network change etc.) 
		 * */
		registerNativeEventListener : function(listenerScope, listenerFunction){
			this.nativeEventListenerScope = listenerScope;
			this.nativeEventListenerFunction = listenerFunction;
		},
		
		getNativeListenerScope : function(){
			return this.nativeEventListenerScope;
		},
		
		getNativeListenerFunction : function(){
			return this.nativeEventListenerFunction;
		},
		
		//Helper functions for accessing UI service
		showProgressDialog : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			if(!this.isProgressDialogShown){
				this.isProgressDialogShown = true;
				smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_ACTIVITY_INDICATOR);
			} else {
				smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_UPDATE_LOADING_MESSAGE);
			}

			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showProgressIndicator : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_INDICATOR);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},

		hideProgressDialog : function(requestData, callbackFunc, callbackFuncScope){
			if(this.isProgressDialogShown){
				this.isProgressDialogShown = false;
				var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_HIDE_ACTIVITY_INDICATOR);
				this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
			} else {
				//TODO send the response back to the user that the dialog is currently not shown
			}
		},
		
		hideProgressIndicator : function(requestData, callbackFunc, callbackFuncScope) {
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_HIDE_INDICATOR);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showInformationDialog : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_MESSAGE);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showDecisionDialog : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_MESSAGE_YESNO);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showSelectionList : function(requestData, callbackFunc, callbackFuncScope) {
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_DIALOG_SINGLE_CHOICE_LIST);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showSelectionListRadio : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_DIALOG_SINGLE_CHOICE_LIST_RADIO_BTN);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showMultiSelectionList : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_DIALOG_MULTIPLE_CHOICE_LIST_CHECKBOXES);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showDatePicker : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SHOW_DATE_PICKER);
			this.platformService[appez.mmi.constant.SERVICE_UI].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		//Helper functions for accessing HTTP service
		executeHttpRequest : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_HTTP_REQUEST);
	
			this.platformService[appez.mmi.constant.SERVICE_HTTP].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		executeHttpRequestWithSaveData : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_HTTP_REQUEST_SAVE_DATA);
	
			this.platformService[appez.mmi.constant.SERVICE_HTTP].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		executeAjaxRequest : function(requestData, callbackFunc, callbackFuncScope){
			//TODO handle this request
		},
		
		//Helper functions for accessing Persistence service
		saveData : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SAVE_DATA_PERSISTENCE);
	
			this.platformService[appez.mmi.constant.SERVICE_PERSISTENCE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		retrieveData : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_RETRIEVE_DATA_PERSISTENCE);
	
			this.platformService[appez.mmi.constant.SERVICE_PERSISTENCE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		deleteData : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_DELETE_DATA_PERSISTENCE);
	
			this.platformService[appez.mmi.constant.SERVICE_PERSISTENCE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		//Helper functions for accessing Database service
		
		//This function provides the application object for initialising the database. Since, the MMI layer is separated from the SmartWeb, thus the MMI layer on its own is unable to determine the application object in case, the user has used SmartWeb
		//Also, this method is meant for supporting DB service in the web layer and not the native layer.
		initDb : function(applicationObj){
			appez.mmi.service.web.DatabaseService.initDb(applicationObj);
		},
		
		openDatabase : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			if(requestData!=null && requestData !=undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_SERVICE_SHUTDOWN] = false;
				smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_OPEN_DATABASE);
				
				this.platformService[appez.mmi.constant.SERVICE_DATABASE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
			}
		},
		
		//TODO Can have a helper function like 'isTableExists(tableName)' that can check the presence of a table. User can instantly check the presence of table with it 
		
		executeDbQuery : function(requestData, callbackFunc, callbackFuncScope) {
			var smartEvent = null;
			if(requestData!=null && requestData !=undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_SERVICE_SHUTDOWN] = false;
				smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_EXECUTE_DB_QUERY);
		
				this.platformService[appez.mmi.constant.SERVICE_DATABASE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
			}
		},
		
		executeReadDbQuery : function(requestData, callbackFunc, callbackFuncScope) {
			var smartEvent = null;
			if(requestData!=null && requestData !=undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_SERVICE_SHUTDOWN] = false;
				smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_EXECUTE_DB_READ_QUERY);
		
				this.platformService[appez.mmi.constant.SERVICE_DATABASE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
			}
		},
		
		closeDatabase : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_CLOSE_DATABASE);
			
			this.platformService[appez.mmi.constant.SERVICE_DATABASE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		//Helper functions for accessing Co-event service
		//TODO need to check whether there would be any helper functions for this service
		
		//Helper functions for accessing App-event service
		//TODO need to check whether there would be any helper functions for this service
		
		//Helper functions for accessing Map service
		showMap : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.MAPVIEW_SHOW);
	
			this.platformService[appez.mmi.constant.SERVICE_MAP].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showMapWithDirections : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.MAPVIEW_SHOW_WITH_DIRECTIONS);
	
			this.platformService[appez.mmi.constant.SERVICE_MAP].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		showMapWithAnimation : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.MAPVIEW_SHOW_WITH_ANIMATION);
	
			this.platformService[appez.mmi.constant.SERVICE_MAP].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		//Helper functions for using File service
		readFileContents : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_READ_FILE_CONTENTS);
	
			this.platformService[appez.mmi.constant.SERVICE_FILE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		readFolderContents : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_READ_FOLDER_CONTENTS);
	
			this.platformService[appez.mmi.constant.SERVICE_FILE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		}, 
		
		unarchiveFile : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_UNZIP_FILE_CONTENTS);
	
			this.platformService[appez.mmi.constant.SERVICE_FILE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		archiveResource : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_ZIP_CONTENTS);
	
			this.platformService[appez.mmi.constant.SERVICE_FILE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		//Helper functions for accessing Camera service
		captureImageFromCamera : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			if(requestData!=null && requestData!=undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_SRC] = appez.mmi.constant.LAUNCH_CAMERA;
			}
			//Add the default value of the service parameters if the user has not provided them
			if(requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_COMPRESSION]==undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_COMPRESSION] = 0;
			}
			if(requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_ENCODING]==undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_ENCODING] = appez.mmi.constant.IMAGE_JPEG;
			}
			if(requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_FILTER]==undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_FILTER] = appez.mmi.constant.STANDARD;
			}
			//---------------------------------------------------------------------------------
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_CAMERA_OPEN);
	
			this.platformService[appez.mmi.constant.SERVICE_CAMERA].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		captureImageFromGallery : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			if(requestData!=null && requestData!=undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_IMG_SRC] = appez.mmi.constant.LAUNCH_GALLERY;
			}
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_IMAGE_GALLERY_OPEN);
	
			this.platformService[appez.mmi.constant.SERVICE_CAMERA].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		//Location service helper function(s)
		getLocation : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_USER_CURRENT_LOCATION);
	
			this.platformService[appez.mmi.constant.SERVICE_LOCATION].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		//---------------------------------------------------------------
		
		//Signature service helper function(s)
		captureAndSaveUserSign : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			//If the user has not provided pen color, the set the default to BLACK color
			if(requestData[appez.mmi.constant.MMI_REQUEST_PROP_SIGN_PENCOLOR]==undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_SIGN_PENCOLOR] = "#000000";
			}
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SIGNATURE_SAVE_IMAGE);
	
			this.platformService[appez.mmi.constant.SERVICE_SIGNATURE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		
		captureAndGetUserSign : function(requestData, callbackFunc, callbackFuncScope){
			var smartEvent = null;
			//If the user has not provided pen color, the set the default to BLACK color
			if(requestData[appez.mmi.constant.MMI_REQUEST_PROP_SIGN_PENCOLOR]==undefined){
				requestData[appez.mmi.constant.MMI_REQUEST_PROP_SIGN_PENCOLOR] = "#000000";
			}
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, true, appez.mmi.constant.WEB_SIGNATURE_IMAGE_DATA);
	
			this.platformService[appez.mmi.constant.SERVICE_SIGNATURE].processRequest(smartEvent, callbackFunc, callbackFuncScope);
		},
		//---------------------------------------------------------------
		
		//Service independent helper functions for accessing native features
		showNativeMenuOptions : function(){
			//TODO add the handling for showing the overflow/traditional menu items(Android) or action sheets(iOS) or Application bar(WP)
		},
		
		/**
		 * Can be called by the application after the first page is ready to be shown
		 * 
		 * */
		showWebView : function(){
			appez.mmi.log('appez-mmi->showWebView');
			var smartEvent = null;
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent({}, true, appez.mmi.constant.CONTEXT_WEBVIEW_SHOW);
	
			this.platformService[appez.mmi.constant.SERVICE_CO_EVENT].processRequest(smartEvent, this.showWebViewCallback, this);
		},
		
		showWebViewCallback : function(response){
			appez.mmi.log('appez-mmi->showWebViewCallback');
		},
		
		
		/**
		 * Send AppEvent to the native layer of the client code to be handled by the client
		 * 
		 * @param eventData : String message that needs to be communicated to the native layer. 
		 * @param notification: Should be a notification >30000
		 * 
		 * */
		sendAppEvent : function(eventData, notification){
			appez.mmi.log('appez-mmi->sendAppEvent');
			var smartEvent = null;
			var requestData = {
					"message" : eventData
			}
			smartEvent = appez.mmi.util.FrameworkUtil.prepareSmartEvent(requestData, false, notification);
	
			this.platformService[appez.mmi.constant.SERVICE_APP_EVENT].processRequest(smartEvent, null, null);
		},
		
		/**
		 * Sends the menu ID's specified by the user to the native layer
		 * 
		 * @param menuItems : JSON array containing the menu ID's(and other details) required by the native layer to show on overflow menu item(Android), UIActionSheet(iOS)
		 * 
		 * */
		setCurrentMenuItems : function(menuItems){
			this.sendAppEvent(menuItems, appez.mmi.constant.APP_NOTIFY_MENU_ACTION);
		},
		
		/**
		 * Helper function for showing the UiActionSheet in iOS devices
		 * 
		 * */
		showMenu : function(){
			//First check if the platform is iOS. Send the notification to native only in case the platform is iOS
			if(appez.isIPhone()||appez.isIPad()){
				//Send the notification to the iOS native container for showing the UIActionSheet
				this.sendAppEvent({}, appez.mmi.constant.APP_NOTIFY_CREATE_MENU);
			}
		},
		
		//Notifier event methods
		registerNetworkStateNotifier : function(registerParams, callbackFunc, callbackFuncScope){
			var notifierEvent = appez.mmi.util.FrameworkUtil.prepareNotifierEvent(registerParams, appez.mmi.constant.NETWORK_STATE_NOTIFIER, appez.mmi.constant.NOTIFIER_ACTION_REGISTER);
			appez.mmi.notifier.NetworkStateNotifier.register(notifierEvent,callbackFunc, callbackFuncScope);
		},
		
		unregisterNetworkStateNotifier : function(registerParams, callbackFunc, callbackFuncScope){
			var notifierEvent = appez.mmi.util.FrameworkUtil.prepareNotifierEvent(unregisterParams, appez.mmi.constant.NETWORK_STATE_NOTIFIER, appez.mmi.constant.NOTIFIER_ACTION_UNREGISTER);
			appez.mmi.notifier.NetworkStateNotifier.unregister(notifierEvent,callbackFunc, callbackFuncScope);
		}
		//-----------------------------------------
}
