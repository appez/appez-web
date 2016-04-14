/** 
 * 
 *	Utility class for generating data models from primitive types such as array and object.
 * 
 **/

appez.smartweb.util.ModelGenerator = appez.smartweb.createClass({
	className:"appez.smartweb.util.ModelGenerator",
    singleton:true,      
    
    //The 'modelClass' refers to the reference of the model in the client application
    getModel : function(jsonObject, rootTag, modelClass){
    	var rootNodeDepth = 0;
    	var rootTagDepthElements = null;
    	var modelClassRef = modelClass;
    	//Generic logic for parsing the JSON object received from the server and creating the model from it
    	var modelObject = jsonObject;
    	
    	if((rootTag!=undefined)&&(rootTag.length>0)){
    		this.rootTagDepthElements = rootTag.split('.');
    		this.rootNodeDepth = this.rootTagDepthElements.length;
        	for(var iter=0;iter<this.rootNodeDepth;iter++) {
        		if(modelObject == undefined) {
        			break;
        		}
        		modelObject = modelObject[this.rootTagDepthElements[iter]];
        	}
    	}
    	
    	if(modelObject == undefined) {
    		return null;
    	}
    	
    	//Check if the 'modelObject' is an 'Array'/'Object'
    	if(modelObject instanceof Array){
//    		eMob.log("modelObject instanceof Array->Total array elements:"+modelObject.length);
    		var totalModelObjects = modelObject.length;
    		var preparedModels = [];
    		for(var currentObj=0;currentObj<totalModelObjects;currentObj++){
    			preparedModels[currentObj] = this.populateModel(modelObject[currentObj],modelClassRef);
    			preparedModels[currentObj].init(modelObject[currentObj]);
    		}
    		//TODO need to check when the 'init()' of individual models will be called
    		
    		return preparedModels;
    	} else if(modelObject instanceof Object){
//    		eMob.log("modelObject instanceof Object");
    		var preparedModel = this.populateModel(modelObject,modelClassRef);
    		preparedModel.init(modelObject);
    		return preparedModel;
    	}
    },

    //Logic for filling the data in the model comes here
    populateModel : function(jsonObject,modelClassRef){
    	var modelObj = new modelClassRef();
    	for(var objElements in jsonObject){
    		if(modelObj.mapping[objElements]!=undefined){
    			//Need to call the setter for setting the value for this parameter
    			var paramName = modelObj.mapping[objElements];
    			
    			//The setter function should be of the form 'set<Parameter-Name>' where the '<Parameter-Name>' should be a class variable of the model starting with an upper case
    			var setterFunctionName = "set" + paramName.charAt(0).toUpperCase() + paramName.slice(1);
    			if(modelObj[setterFunctionName]!=undefined){
    				var setterFunction = modelObj[setterFunctionName];
    				setterFunction.call(modelObj,jsonObject[objElements]);
    			}
    		}
    	}
    	return modelObj;
    }
});