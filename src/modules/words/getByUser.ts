import { APP_CONSTANTS } from '../../config/app_constants';
import * as AWS from "aws-sdk";
import getResponse from '../../utils/responseUtils';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    'region': 'ap-northeast-2'
});

export async function main(event, _context, callback) {
    const params = {
        TableName: APP_CONSTANTS.WORDS_TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    };
    try {
        const data = await dynamoDb.query(params).promise();
        
        if (data.Items) {
            const response = getResponse(200, data.Items);
            callback(null, response);
        } else {
            throw new Error('Items not found');
        }
    } catch (error) {
        const errResponse = getResponse(500, error);
        callback(errResponse, null);
    }
}