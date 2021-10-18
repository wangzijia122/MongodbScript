db.getCollection("hx2car_output_test").find({"SellCityId.history" : null}).size();
db.hx2car_output_test.find({OnDate : {$lt : ISODate("2021-01-01T16:00:00.000+0000")}}).size()
db.loadServerScripts();
fix_sellcity();

db.system.js.save({
	_id : "fix_sellcity",
	value : function () {
				var object = db.hx2car_output_test.find({
				  "SellCityId.history":null
				}).limit(5).addOption(DBQuery.Option.noTimeout).batchSize(100);
				print("已获取所有需要修改的文档...")
				var n = 0;
				while (object.hasNext()) {
				  var outputdc = object.next();
				  var orgsell = outputdc.SellCityId;
				  outputdc.SellCityId = {
				  };
				  if (orgsell == null || orgsell == "null" || orgsell == "") {
					orgsell = null;
				  }
				  ;
				  try {
				  outputdc.SellCityId.current = orgsell;
				  outputdc.SellCityId.history = [];
				  outputdc.SellCityId.history.push({
					value:orgsell, gatherTime:outputdc.Time, selfName:outputdc.SourceVersion
				  });
				  db.hx2car_output_test.deleteOne({
					"OrgCarId":outputdc.OrgCarId
				  });
				  db.hx2car_output_test.insertOne(outputdc);
				  n = n + 1;
				  print("OrgCarId : " + outputdc.OrgCarId + " 的文档修改成功！");
				} catch (e) {
					print("OrgCarId : " + outputdc.OrgCarId + " 的文档修改失败...");
					continue;
				} 
			}
			object.close();
			print("修改完成，共有" + n + "个文档被修改！");
			}
});