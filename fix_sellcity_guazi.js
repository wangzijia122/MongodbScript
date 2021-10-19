function() {
	var collectionName = "guazi_output"
	var countAll = db.getCollection(collectionName).find({}).size()
	var countFix = db.getCollection(collectionName).find({"SellCityId.history":null}).size()
    var object = db.getCollection(collectionName).find({
				"SellCityId.history":null}).addOption(DBQuery.Option.noTimeout).batchSize(100);
	print("文档总数为：" + countAll + "，需要修改的文档数量为：" + countFix);
    if (countFix > 0) {
    var n = 0;
    while (object.hasNext()) {
      var outputdc = object.next();
      var dcsell = outputdc.SellCityId;
      outputdc.SellCityId = {
      };
      if (dcsell == null || dcsell == "null" || dcsell == "") {
        dcsell = null;
      }
      ;
      try {
        outputdc.SellCityId.current = dcsell;
        outputdc.SellCityId.history = [];
        outputdc.SellCityId.history.push({
          value:dcsell, gatherTime : outputdc.Time, selfName : outputdc.SourceVersion
        });
        db.getCollection(collectionName).deleteOne({
          "OrgCarId":outputdc.OrgCarId
        });
        db.getCollection(collectionName).insertOne(outputdc);
        n = n + 1;
        //print("OrgCarId : " + outputdc.OrgCarId + " 的文档修改成功！");
      } catch (e) {
        print("OrgCarId : " + outputdc.OrgCarId + " 的文档修改失败...");
        continue;
      }
    }
    object.close();
    print("修改完成，共有" + n + "个文档被修改！");
    } else { 
        print("没有需要修改的文档，修改结束！")}
}