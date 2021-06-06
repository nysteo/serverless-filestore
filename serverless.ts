import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-filestore',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          '*'
        ],
        Resource: ['*']
      }
    ]
  },
  
  functions: {
    upload: {
      handler: 'index.upload',
      events: [
        {
          httpApi: {
            method: 'post',
            path: 'files/upload'
          }
        }
      ]
    },
    files: {
      handler: 'index.files',
      events: [
        {
          httpApi: {
            method: 'get',
            path: '/files'
  
          }
        }
      ]
    },
    download: {
      handler: 'index.files',
      events: [
        {
          httpApi: {
            method: 'get',
            path: 'files/download/{id}'
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      FileTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            },
            {
              AttributeName: 'path',
              AttributeType: 'S'
            },
            {
              AttributeName: 'type',
              AttributeType: 'S'
            },
            {
              AttributeName: 'size',
              AttributeType: 'N'
            },
            {
              AttributeName: 'content',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: 'TrooperTable'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
