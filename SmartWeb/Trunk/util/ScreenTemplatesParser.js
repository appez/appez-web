/** 
 * 
 *	Utility class for parsing screen templates (XML comments) into JSON object.
 *
 * NOTE : Some of the functionality in this class is 
 * 
 **/

appez.smartweb.util.ScreenTemplatesParser = appez.smartweb.createClass({
	className:"appez.smartweb.util.ScreenTemplatesParser",
    singleton:true,
    
    screenTemplateFile : null,
    
    setScreenTemplatesFileLoc : function(fileLocation) {
    	this.screenTemplateFile = fileLocation;
    },
    
    /*
    * Name: parseJson
    * Description: reads the screen definition fragments from XML and converts them to JSON
    * @Params: 
    *         screenJson: XML fragment to parse    
    * Returns: Parsed JSON object
    * 
    */
	
	parseJson: function(screenJson) {
		var screensJson = {};
		if(screenJson['screens']['screen'] instanceof Array){
			for(var screenJsonIterator =0;screenJsonIterator<screenJson.screens.screen.length;screenJsonIterator++) {
				var screen = screenJson.screens.screen[screenJsonIterator];
				screen.name = $.trim(screen.name);
				if(screen.content["__cdata"]!=undefined){
					screensJson[screen.name] = screen.content["__cdata"];
				}
				else {
					screensJson[screen.name] = screen.content;
				}
			}
		} else {
			//That means only 1 screen exists in the application
			var screen = screenJson.screens.screen;
			screen.name = $.trim(screen.name);
			if(screen.content["__cdata"]!=undefined){
				screensJson[screen.name] = screen.content["__cdata"];
			}
			else {
				screensJson[screen.name] = screen.content;
			}
		}
                                                  
		return screensJson;
	},
    
    /*
     * Name: parseWPJson
     * Description: reads the screen definition fragments from XML and converts them to JSON for WP
     * @Params: 
     *         screenJson: XML fragment to parse    
     * Returns: Parsed JSON object
     * 
     */	
	parseWPJson: function(screenJson) {
		var screensJson = {};
		for(var screenJsonIterator =0;screenJsonIterator<screenJson.screens.screen.length;screenJsonIterator++) {
			var screen = screenJson.screens.screen[screenJsonIterator];
			var screenName=$.trim(screen.name);
			screensJson[screenName] = screen.content.text;
		}
                                            
		return screensJson;
	},
    
    /*
     * Name: parse
     * Description: recursively parses XML document into JSON object
     * @Params: 
     *         xmlDocument: XML to parse    
     * Returns: Parsed screen JSON object
     * 
     */		
	parse: function(xmlDocument) {
		var screenJSON = {};
		screenJSON.SMARTPHONES_ANDROID = {};
		screenJSON.SMARTPHONES_IOS = {};
		var screenName = "";
		if(xmlDocument.childNodes.length > 0) {
			for(var nodeIteration =0;nodeIteration<xmlDocument.childNodes.length;nodeIteration++){
				var screensNode = xmlDocument.childNodes[nodeIteration];
				if(screensNode.nodeType == 1 && screensNode.nodeName == "screens") {
					for(var nodeIterationScreens =0;nodeIterationScreens<screensNode.childNodes.length;nodeIterationScreens++){
						var screenNode = screensNode.childNodes[nodeIterationScreens];
						if(screenNode.nodeType == 1 && screenNode.nodeName == "screen") {
							screenName = "";
							for(var nodeItearionsScreen=0;nodeItearionsScreen<screenNode.childNodes.length;nodeItearionsScreen++) {
								var node = screenNode.childNodes[nodeItearionsScreen];
								if(node.nodeType == 1) {
									if(node.nodeName == "name") {
										screenName = node.childNodes[0].nodeValue;	
									}
									else if(node.nodeName == "platforms") {
										screenPlatform = "";
										for(var nodeIterationsPlatforms=0;nodeIterationsPlatforms<node.childNodes.length;nodeIterationsPlatforms++) {
											var platformNode = node.childNodes[nodeIterationsPlatforms];
											if(platformNode.nodeType == 1 && platformNode.nodeName == "platform") {
												var screenPlatform = platformNode.attributes[0].value;
												for(var nodeIterationsPlatform=0;nodeIterationsPlatform<platformNode.childNodes.length;nodeIterationsPlatform++) {
													var platformChildNode = platformNode.childNodes[nodeIterationsPlatform];
													if(platformChildNode.nodeType == 1 && platformChildNode.nodeName == "content") {
														for(var nodeIterationsContent=0;nodeIterationsContent<platformChildNode.childNodes.length;nodeIterationsContent++) {
															var contentNode = platformChildNode.childNodes[nodeIterationsContent];
															if(contentNode.nodeType == 4) {
																screenJSON[screenPlatform][screenName] = contentNode.nodeValue;
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return screenJSON;
	}		
});