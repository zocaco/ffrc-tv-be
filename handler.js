// handler.js
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'eu-north-1' });

module.exports.headlines = async (event) => {
  const params = {
    TableName: 'NewsHeadlines',
    ProjectionExpression: 'title'
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    const articles = data.Items.map(item => ({ title: item.title }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ articles })
    };
  } catch (err) {
    console.error('DynamoDB error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch headlines' })
    };
  }
};

module.exports.reportPanel = async (event) => {
    const params = {
      TableName: 'NewsHighlights',
      ProjectionExpression: 'title, imageUrl, newsContent, qrCodeUrl'
    };
  
    try {
      const data = await dynamoDb.scan(params).promise();
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ reports: data.Items })
      };
    } catch (err) {
      console.error('Error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch panel data' })
      };
    }
  };