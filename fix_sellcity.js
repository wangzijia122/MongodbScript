db.system.js.save({
	_id : "fix_sellcity",
	value : function () {
				try {
				var object = db.hx2car_output_test.find({
				  "SellCityId.history":null
				}).limit(5).addOption(DBQuery.Option.noTimeout).batchSize(100);
				print("已获取指定文档...")
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
				  print("已修改"+ n +"个文档...")
				};
				object.close();
				print("修改完成！")
				} catch (e) {
					print("修改失败...")
			}
			}
});