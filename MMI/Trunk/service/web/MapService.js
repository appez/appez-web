/** Provides support for the map service at the web layer. 
 * At web layer, this service makes use of Google maps API's for getting maps data.
 * 
 */
appez.mmi.service.web.MapService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.MapService",     	// Contains Class Name
	singleton:true,                              		// specify whether the class is singleton object or not ,By default service classes are singleton
	extend:appez.mmi.service.SmartEventService,       	// Contains Base Class Name
	map : null,
	mapLocations : [],
	currentUserLocationMarker : null,
	currentUserLocation : null,
	shouldShowDirectionsScreen : false,
	
	callbackFunction : null,
	callbackFunctionScope : null,
	smartEvent : null,
	
//	isMapControllerInit : false,
	mapScreenDiv : null,
		
    /*
	 * Name: processRequest Description: Execute SmartEventRequest object for
	 * native communication smartEventRequest: SmartEventRequest object Returns:
	 * None , transfer control to callBack method. Details about if any
	 * exception is thrown.
	 */
	processRequest: function(smEvent, callbackFunc, callbackFuncScope){
		appez.mmi.log('MapService(web)->processRequest->IS_MAP_CONTROLLER_INIT:'+appez.mmi.constant.IS_MAP_CONTROLLER_INIT);
		this.smartEvent = smEvent;
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		var smartEventRequest = smEvent.getSmartEventRequest();
		this.parent.smEventRequest = smEvent.getSmartEventRequest();
		
		this.initMapLocations();
		
		switch(smartEventRequest.getServiceOperationId()){
		case appez.mmi.constant.MAPVIEW_SHOW:
			this.showMap();
			break;
			
		case appez.mmi.constant.MAPVIEW_SHOW_WITH_DIRECTIONS:
			this.showMapWithDirections();
			break;
			
		case appez.mmi.constant.MAPVIEW_SHOW_WITH_ANIMATION:
			// Currently this sub-service is not supported at the web layer
			this.prepareResponse(false, null, appez.mmi.constant.SERVICE_TYPE_NOT_SUPPORTED_EXCEPTION, appez.mmi.constant.UNABLE_TO_PROCESS_MESSAGE);
			break;	
		}
	},
   
	/*
	 * Prepares the modified SmartEvent model by adding the response to it
	 *  
	 */
	prepareResponse : function(isOperationComplete, serviceResponse, exceptionType, exceptionMessage){
		//TODO to set the response of this action in the SmartEventResponse object and return the controller using the 'processResponse' method
		var smartEventResponse = new appez.mmi.model.SmartEventResponse();
		smartEventResponse.setOperationComplete(isOperationComplete);
		smartEventResponse.setServiceResponse(serviceResponse);
		smartEventResponse.setExceptionType(exceptionType);
		smartEventResponse.setExceptionMessage(exceptionMessage);
		this.processResponse(smartEventResponse);
	},
	
	/*
	 * Name: processResponse
	 * Description: Here we get control after SmartEventRequest object processed.
	 * smartEventResponse: SmartEventResponse object
	 * Returns: None 
	 * Details about if any exception is thrown.
	 */
	processResponse: function(smartEventResponse){
		//Send the response directly to the calling scope and the specified callback function
		this.callbackFunction.call(this.callbackFunctionScope, smartEventResponse);
	},
	
	showMap : function(smartEventRequest){
		this.shouldShowDirectionsScreen = false;
		this.drawMap();
	},
	
	showMapWithDirections : function(smartEventRequest){
		this.shouldShowDirectionsScreen = true;
		this.drawMap();
	},
	
	initMapLocations : function(){
		var reqData = this.parent.smEventRequest.getServiceRequestData();
		reqData = appez.mmi.util.Base64.decode(reqData);
		reqData = JSON.parse(reqData);
//		var mapRequest = JSON.stringify(reqData);
		this.mapLocations = reqData[appez.mmi.constant.MMI_REQUEST_PROP_LOCATIONS];
	},
	
	checkCurrentUserLocation : function(bounds,map){
		var me = this;
		var marker = null;
		var infowindow = new google.maps.InfoWindow();
		// Check to see if this browser supports geolocation.
		if (navigator.geolocation) {
			// Get the location of the user's browser using the
			// native geolocation service. When we invoke this method
			// only the first callback is required. The second
			// callback - the error handler - and the third
			// argument - our configuration options - are optional.
			navigator.geolocation.getCurrentPosition(function( position ){
					// Check to see if there is already a location.
					// There is a bug in FireFox where this gets
					// invoked more than once with a cached result.
					appez.mmi.log("Initial Position Found->Latitude:" +position.coords.latitude+",Longitude:"+position.coords.longitude);
					 
					// Add a marker to the map using the position.
					me.currentUserLocation = position;
					me.markCurrentLocationOnMap(position, bounds, map);
					currentLocation = position;
				},
				function( error ){
					appez.mmi.log( "Something went wrong: ", error );
					//TODO throw an error here
					me.prepareResponse(false, null, appez.mmi.constant.UNKNOWN_CURRENT_LOCATION_EXCEPTION, appez.mmi.constant.UNKNOWN_CURRENT_LOCATION_EXCEPTION_MESSAGE);
				},				
				{
					timeout: (5 * 1000),
					maximumAge: (1000 * 60 * 15),
					enableHighAccuracy: true
				}
			);
		}
	},
	
	markCurrentLocationOnMap : function(position, bounds, map){
		var infowindow = new google.maps.InfoWindow({
		      maxWidth: 200
		  });
		/*-var image = {
				url: this.mapPins['currentLocation'],
				// This marker is 20 pixels wide by 32 pixels tall.
			    size: new google.maps.Size(20, 32),
			    // The origin for this image is 0,0.
			    origin: new google.maps.Point(0,0),
			    // The anchor for this image is the base of the flagpole at 0,32.
			    anchor: new google.maps.Point(0, 32)
		};*/
		
		// Shapes define the clickable region of the icon.
		// The type defines an HTML &lt;area&gt; element 'poly' which
		// traces out a polygon as a series of X,Y points. The final
		// coordinate closes the poly by connecting to the first
		// coordinate.
		var shape = {
				coord: [1, 1, 1, 20, 18, 20, 18 , 1],
				type: 'poly'
		};
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
			map: map,
			/*icon: image,*/
	        shape: shape
		});
		bounds.extend(marker.position);
		google.maps.event.addListener(marker, 'click', (function(marker) {
			return function() {
				infowindow.setContent("You are here");
				infowindow.open(map, marker);
			}
		})(marker));
		
		//now fit the map to the newly inclusive bounds
		map.fitBounds(bounds);
	},
	
	drawMap : function(){
		var me = this;	
		//create empty LatLngBounds object
		var bounds = new google.maps.LatLngBounds();
		
		var reqData = this.parent.smEventRequest.getServiceRequestData();
		reqData = appez.mmi.util.Base64.decode(reqData);
		reqData = JSON.parse(reqData);
//		var mapRequest = JSON.stringify(reqData);
		var currentMapDiv = reqData[appez.mmi.constant.MMI_REQUEST_PROP_MAP_DIV];
		var map = new google.maps.Map(document.getElementById(currentMapDiv), {
			zoom: 10,
			center: new google.maps.LatLng(22, 76),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		
		var marker, mapLocation;
		for (mapLocation = 0; mapLocation < me.mapLocations.length; mapLocation++) { 
			/*-var image = {
					url: me.mapPins[''+me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_MARKER]],
					// This marker is 20 pixels wide by 32 pixels tall.
				    size: new google.maps.Size(20, 32),
				    // The origin for this image is 0,0.
				    origin: new google.maps.Point(0,0),
				    // The anchor for this image is the base of the flagpole at 0,32.
				    anchor: new google.maps.Point(0, 32)
			};*/
			
			// Shapes define the clickable region of the icon.
			// The type defines an HTML &lt;area&gt; element 'poly' which
			// traces out a polygon as a series of X,Y points. The final
			// coordinate closes the poly by connecting to the first
			// coordinate.
			var shape = {
					coord: [1, 1, 1, 20, 18, 20, 18 , 1],
					type: 'poly'
			};
			 
			appez.mmi.log('MapService(web):Latitude:'+me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_LATITUDE]+',Longitude:'+me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_LONGITUDE]);
			var markerPosition = new google.maps.LatLng(me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_LONGITUDE], me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_LONGITUDE]);

			marker = new google.maps.Marker({
				position: markerPosition,
				map: map
				/*-icon: image,
		        shape: shape*/
			});
			
			appez.mmi.log('MapService(web):Title:'+me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_TITLE]+',Description:'+me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_DESCRIPTION]);
			var infowindow = new google.maps.InfoWindow({
				maxWidth: 200,
				content :'<h1>'+me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_TITLE]+'</h1><p>'+me.mapLocations[mapLocation][appez.mmi.constant.MMI_REQUEST_PROP_LOC_DESCRIPTION]+'</p><button type="button" id="myBtn" onclick="appez.mmi.service.web.MapService.showDirectionsScreen('+markerPosition.lat()+","+markerPosition.lng()+');">Get directions to here</button>'
			});
			
			//extend the bounds to include each marker's position
			bounds.extend(marker.position);

			google.maps.event.addListener(marker, 'click', (function(marker, mapLocation) {
				return function() {
					infowindow.open(map, marker);
				}
			})(marker, mapLocation));
			
			google.maps.event.addListener(infowindow, 'domready', function() {
			      appez.mmi.log('InfoWindow DOM ready');
			});
		}
		
		this.checkCurrentUserLocation(bounds,map);
		this.prepareResponse(true, {}, 0, null);
	},
	
	//LOGIC FOR CREATING THE DIRECTIONS SCREEN 
	//TODO add the logic for calling this function when the info window is clicked and also provide the position of the point
	showDirectionsScreen : function(destLatitude,destLongitude){
		appez.mmi.log('show direction screen');
		if((this.currentUserLocation!=null)&&(this.currentUserLocation!=undefined)){
			//TODO Un-comment this code in actual implementation
//			this.getDirectionsData(this.currentUserLocation.coords.latitude, this.currentUserLocation..coords.longitude, destLatitude, destLongitude);
		}	
		this.getDirectionsData(22.06,78.1,22.66, 78.11);
	},
	
	getDirectionsData : function(sourceLat,sourceLong,destLat,destLong){
		appez.mmi.log('MapService->getDirectionsData');
		
		var urlString = appez.mmi.constant.MAP_DIRECTION_API_URL;
		urlString = urlString.replace("{ORIGIN_LATITUDE}",sourceLat);
		urlString = urlString.replace("{ORIGIN_LONGITUDE}",sourceLong);
		urlString = urlString.replace("{DESTINATION_LATITUDE}",destLat);
		urlString = urlString.replace("{DESTINATION_LONGITUDE}",destLong);
		appez.mmi.log('getDirectionsData->urlString:'+urlString);
		
		var reqData = this.parent.smEventRequest.getServiceRequestData();
		reqData = appez.mmi.util.Base64.decode(reqData);
		reqData = JSON.parse(reqData);
		var serverProxyAddress = reqData[appez.mmi.constant.MMI_REQUEST_PROP_REQ_SERVER_PROXY];
		
		var mapDirectionRequest = {
				'requestMethod':'GET',
				'requestUrl':urlString,
				'serverProxyAddress':serverProxyAddress
		};
		appez.mmi.executeHttpRequest(mapDirectionRequest, this.getDirectionsCallback, this);
	},
	
	getDirectionsCallback : function(smartEventResponse){
		var directionsData = smartEventResponse.getServiceResponse()[appez.mmi.constant.MMI_RESPONSE_PROP_HTTP_RESPONSE];
		appez.mmi.log('getDirectionsCallback->direction data:'+directionsData);
		directionsData = JSON.parse(directionsData);
		if(smartEventResponse.getOperationComplete()==true){
			var routesArray = directionsData['routes'];
			if (routesArray.length >= 0) {
				var htmlString = '<div class="list"> {DIRECTION-ROWS} </div>';
				var legsArray = routesArray[0]['legs'];
				var stepsArray = legsArray[0]['steps'];
				var directionRows = '';
				for (var i = 0; i < stepsArray.length; i++) {
					var json = stepsArray[i];
					var directionRow = '<div id="1001" class="listrow"> <span> <p>{DIRECTION}</p> </span> </div>';
					directionRow = directionRow.replace('{DIRECTION}',json['html_instructions']);
//					htmlString += "<li style='border-bottom:#999 thin solid; padding:10px 0px 10px 10px;'>";
//					htmlString += json['html_instructions'];
//					htmlString += "</li>";
					directionRows+=directionRow;
				}
//				htmlString += "</ul></div>";
				htmlString = htmlString.replace('{DIRECTION-ROWS}',directionRows);
				var reqData = this.parent.smEventRequest.getServiceRequestData();
				reqData = appez.mmi.util.Base64.decode(reqData);
				reqData = JSON.parse(reqData);
				var directionDiv = reqData[appez.mmi.constant.MMI_REQUEST_PROP_DIRECTION_DIV];
				$('#'+directionDiv).html(htmlString);
			}
			this.prepareResponse(true, {}, 0, null);
		} else {
			this.prepareResponse(false, null, appez.mmi.constant.UNKNOWN_EXCEPTION, appez.mmi.constant.UNABLE_TO_PROCESS_MESSAGE);
		}
	}
});
