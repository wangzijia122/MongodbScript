function() {
	var collectionName = "hx2car_output_test"
    var object = db.getCollection(collectionName).find({}).addOption(DBQuery.Option.noTimeout);
	var fixField = ["AskingPrice","CarName","ColorId","Mileage","RegCityId","RegTime.","SellCityId","SoldLable","TransferTimes","TrimId","Type","Usage","DealerId","DealerName"];
    var fixNum = 0;
    while (object.hasNext()) {
      var outputdc = object.next();
	  for (var index in fixField) {
		  var fieldName = fixField[index]
		  var oldValue = outputdc[fieldName];
		  if (oldValue == null || oldValue == "null" || oldValue == "") {
				oldValue = null;
				} else if (oldValue.history != null) {
				    if (oldValue.current == "null") {
					oldValue = null;
					} else {continue}
		  }
			outputdc[fieldName] = {};
			outputdc[fieldName].current = oldValue;
			outputdc[fieldName].history = [];
			outputdc[fieldName].history.push({
				value:oldValue, gatherTime : outputdc.Time, selfName : outputdc.SourceVersion
					});
		  }
	db.getCollection(collectionName).deleteOne({"OrgCarId":outputdc.OrgCarId});
	db.getCollection(collectionName).insertOne(outputdc);
	fixNum = fixNum + 1;
	}
		object.close();
		print("修改完成，共有" + fixNum + "个文档被修改！");
	}
