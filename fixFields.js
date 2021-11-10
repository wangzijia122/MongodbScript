db.getCollection("system.js").save({"_id" : "fixFileds", 
    "value" : function() {
    var collectionName = "hx2car_output"
    var object = db.getCollection(collectionName).find().addOption(DBQuery.Option.noTimeout);
	var fixField = ["AskingPrice","CarName","ColorId","Mileage","RegCityId","RegTime","SellCityId","SoldLable","TransferTimes","TrimId","Type","Usage","DealerId","DealerName"];
	while (object.hasNext()) {
	   	var outputdc = object.next();
		var newoutputdc = outputdc;
	   	for (var Index in fixField) {
	   	    var fieldName = fixField[Index];
	   	    var oldValue = newoutputdc[fieldName];
	   	    //1.如果oldValue或oldValue.history为空，直接打包
	   	    //2.否则如果oldValue.current为"null"，oldValue 赋值为 null并重新打包
	   	    if (oldValue == null || oldValue.history == null) {
	   	        if (oldValue == "null" || oldValue == "") {
	   	            oldValue = null;
	   	        };
	   	    	newoutputdc[fieldName] = {};
				newoutputdc[fieldName].current = oldValue;
				newoutputdc[fieldName].history = [];
				newoutputdc[fieldName].history.push({
					value:oldValue, gatherTime : newoutputdc.Time, selfName : newoutputdc.SourceVersion
					});
	   	    } else if (oldValue.current == "null"){
	   	        oldValue = null;
	   	        newoutputdc[fieldName] = {};
				newoutputdc[fieldName].current = oldValue;
				newoutputdc[fieldName].history = [];
				newoutputdc[fieldName].history.push({
					value:oldValue, gatherTime : newoutputdc.Time, selfName : newoutputdc.SourceVersion
					});
	   	    };
	   	};
	if (newoutputdc == outputdc) {continue};
	db.getCollection(collectionName).deleteOne({"OrgCarId":newoutputdc.OrgCarId});
	db.getCollection(collectionName).insertOne(newoutputdc);
}
}})