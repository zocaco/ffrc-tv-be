require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// AWS SDK config
AWS.config.update({
  region: process.env.AWS_REGION
});

console.log("1");
const dynamodb = new AWS.DynamoDB.DocumentClient();

app.get('/headlines', async (req, res) => {
  const params = {
    TableName: 'NewsHeadlines',
    ProjectionExpression: 'title'
  };

  try {
    const data = await dynamodb.scan(params).promise();
    console.log(data);
    const articles = data.Items.map(item => ({ title: item.title }));
    res.json({ articles });
  } catch (err) {
    console.error('Error fetching from DynamoDB:', err);
    res.status(500).json({ error: 'Failed to fetch headlines' });
  }
});

app.get('/report-panel', async (req, res) => {
  const params = {
    TableName: 'NewsHighlights', // Replace with your actual table name
    ProjectionExpression: 'title, imageUrl, newsContent, qrCodeUrl'
  };

  try {
    const data = await dynamodb.scan(params).promise();

    if (!data.Items || data.Items.length === 0) {
      return res.status(404).json({ message: 'No panel data found' });
    }

    // Send back all items for frontend to rotate through
    res.json({ reports: data.Items });
  } catch (err) {
    console.error('Error fetching panel data:', err);
    res.status(500).json({ error: 'Failed to fetch report panel data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
