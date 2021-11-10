var obj = db.getCollection("hx2car_output_test").find({}).addOption(DBQuery.Option.noTimeout);
while (obj.hasNext()) {
    var objupt = obj.next();
    var newobjupt = {};
    for (var lookup in objupt) {
        if (lookup == "CarName") {
             for (var fieldName in objupt) {
				 var value = objupt[fieldName]
				 if (fieldName == "CarName") {
					continue
					}
				 newobjupt[fieldName] = value;
			 }
			 db.getCollection("hx2car_output_test").deleteOne({"_id":objupt._id});
			 db.getCollection("hx2car_output_test").insertOne(newobjupt)
		}
    };
}