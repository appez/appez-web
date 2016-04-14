/** 
 * 
 *	This class represents a generic class manager.
 *	Responsible for instantiating a class, access and its life cycle.
 * 
 **/

appez.smartweb.util.ClassManager = {
	className : "appez.smartweb.util.ClassManager",
	singleton : true,
	classes : {},
	init : function() {

	},                         	
	
	/*
	 * Name: createClass
	 * Description: create a basic class with member variables
	 * @Params  memberVariables: names of the member variables such as methods and object
	 * Returns: class object with member variables
	 * Details about if any exception is thrown
	 */
	
	createClass : function(memberVariables) {
		if (!(memberVariables.className != undefined && memberVariables.className != "")) {
			memberVariables.className = new Date().getTime();
		}
		this.classes[memberVariables.className] = function() {
			for ( var memberVar in memberVariables) {
				this[memberVar] = memberVariables[memberVar];
			}
		};
		if (memberVariables.extend != undefined && memberVariables.extend != "") {

			if (typeof (memberVariables.extend) == "function") {
				var parentClassObj = new memberVariables.extend();
				this.classes[memberVariables.className].prototype = parentClassObj;
				this.classes[memberVariables.className].constructor = this.classes[memberVariables.className];
				this.classes[memberVariables.className].prototype.parent = parentClassObj;
			} else if (typeof (memberVariables.extend) == "object") {
				var parentClassObj = new memberVariables.extend.constructor();
				this.classes[memberVariables.className].prototype = parentClassObj;
				this.classes[memberVariables.className].constructor = this.classes[memberVariables.className];
				this.classes[memberVariables.className].prototype.parent = parentClassObj;
			}
		}

		if (memberVariables.singleton != undefined
				&& memberVariables.singleton == true) {
			return new this.classes[memberVariables.className]();
		} else {
			return this.classes[memberVariables.className];
		}
	}

}