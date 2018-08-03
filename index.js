// API Gateway（'https://k29gl6w9kl.execute-api.ap-northeast-1.amazonaws.com/dev'）からトリガーされるLambda関数
// DynamoDB StreamからトリガーされるLambda関数
/*
response表示例：（インサート時）
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*"
    },
    "body": {
        "key": "4afbe9f6a99e7d98e21325430fa9782c206b8cc1",
        "transcoding": "true"
    }
}
*/


'use strict';

var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();


function createSuccessResponse(result) {
  var response = {
    'statusCode': 200,
    'headers' : {'Access-Control-Allow-Origin' : '*'},
    'body' : result
  }
  console.log('responseは　' + JSON.stringify(response));
  return response;
}



exports.handler = function (event, context, callback) {
// console.log('イベントレコードは　' + event.Record); → テーブルの変更がないとundefined
// WebSiteでリアルタイムにDB変更情報を取ってくる方法が見つからず、今は用無しコードになっている（泣）↓
  if(event.Records) {
    event.Records.forEach((record) => {
        console.log('イベント種別:', record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);

        if(record.eventName == 'INSERT'){
            //項目が追加された時の処理
              var insertedItem = JSON.stringify(record.dynamodb.NewImage.id.S);
              var transcodingBool = JSON.stringify(record.dynamodb.NewImage.key.M.transcoding.BOOL)
              console.log('insertedItemは、　' + insertedItem);
              console.log('transcodingBoolは　' + transcodingBool);

              var result = {
                // ↓trimしないと""がダブル表示になってまう
                key: insertedItem.replace(/"/gi, ""),
                transcoding: transcodingBool
              }

              console.log('インサート時のresultは　' + JSON.stringify(result));
              callback(null, createSuccessResponse(result));
        }else if(record.eventName == 'MODIFY'){
            //項目が変更された時の処理
              var insertedItem = JSON.stringify(record.dynamodb.NewImage.id.S);
              var oldtranscodingBool = JSON.stringify(record.dynamodb.OldImage.key.M.transcoding.BOOL);//変更前
              var modifiedtranscodingBool = JSON.stringify(record.dynamodb.NewImage.key.M.transcoding.BOOL);//変更後

              console.log('oldtranscodingBoolは、　' + oldtranscodingBool);
              console.log('modifiedtranscodingBoolは、　' + modifiedtranscodingBool);

              var result = {
                key: insertedItem.replace(/"/gi, ""),
                transcoding: modifiedtranscodingBool
              }

              console.log('モディファイ時のresultは　' + JSON.stringify(result));
              callback(null, createSuccessResponse(result));
        }else if(record.eventName == 'REMOVE'){modified
              //項目が削除された時の処理
              var deletedItem = record.dynamodb.OldImage
        }else {

        }
      });

    }

// ブラウズするだけなら、上記のif文を抜けてテーブルをScanする。

    console.log('バカボンのパパ');

    var params = {
          TableName: '24-hour-video',
          ProjectionExpression: "id, transcoding" // だめだ、transcodingデータは取ってこない。key.transcodingとすると”keyは予約語です”のエラー（泣）テーブル設計ミス
    };
    docClient.scan(params, function(err, data){
        if(err){
              console.log(err);
        }else{
              var result = data;
              console.log('Scanデータは　' + result);
              callback(null, createSuccessResponse(result));
        }
    });


};
