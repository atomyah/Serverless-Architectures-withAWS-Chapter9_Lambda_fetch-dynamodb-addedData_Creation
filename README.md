リアルタイムでDynamoDBのテーブル変更情報を取ってくるラムダ関数を作成😁


教科書の９章では、WebsiteのJavaScriptで直接Firebaseテーブルのリアルタイム変更情報を取ってこれる。

DynamoDB Streamの場合、どうしてもやり方がわからず（browserifyなどを使えば可能なのかも知れないけど、どうしてもnode.jsネイティブだけでなんとかしてみたかった）、とりあえずラムダ関数で取ってくることにした。


***


Created new lambda functon, fetch-dynamodb-addedData to fetch realtime update info using Dynamo Stream.😁


In the text book, local Website script can fetch Firebase realtime table update info.
I could not figure out the same measure using Dynamo Stream, then decided to create lambda function any way.



