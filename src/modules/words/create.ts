import uuid from "uuid";
import { APP_CONSTANTS } from '../../config/app_constants';
import * as AWS from "aws-sdk";

// DynamoDB Client 초기화
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    'region': 'ap-northeast-2'
});

export async function main(event, _context, callback) {
    const requestData = JSON.parse(event.body);    // 입력된 event.body 로 부터 data 요청 parse
    // DynamoDB put을 요청할 data 세팅
    //userId는 사용자가 인증 한 후에 AWS가 요청 컨텍스트에서 설정하게 될 사용자의 연합 ID입니다.
    //현재 우리는 무단 된 애플리케이션에 대해 사용자 인증을 설정하지 않으므로이 요청은 여기서 실패합니다. 
    //나중에 볼 수있는 것처럼 로컬 테스트를 위해 사용자 ID가 포함 된 모의 데이터를 제공합니다.
    const params = {
        TableName: APP_CONSTANTS.WORDS_TABLE,
        Item: {
            wordId: uuid.v1(),
            userId: event.requestContext.identity.cognitoIdentityId,
            createdAt: Date.now(),
            ...requestData 
        }
    };
    ;
    try {
        await dynamoDb.put(params).promise(); // params 로 지정된 새로운 데이터를 추가하기 위한 put 메소드 
        const response = {   // success에 대해, response 데이터를 만든다.
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true   
            },
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(err)
        };
    }  
}