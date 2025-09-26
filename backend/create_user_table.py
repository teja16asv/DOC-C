import boto3
import os
from dotenv import load_dotenv

load_dotenv()

# Get credentials from environment
AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
DYNAMODB_USERS_TABLE = os.getenv("DYNAMODB_USERS_TABLE", "Users")

# Create a DynamoDB client
dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def create_users_table():
    """Creates the DynamoDB table for users with a GSI on email."""
    try:
        table = dynamodb.create_table(
            TableName=DYNAMODB_USERS_TABLE,
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                }
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'email-index',
                    'KeySchema': [
                        {
                            'AttributeName': 'email',
                            'KeyType': 'HASH'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        print(f"Creating table {DYNAMODB_USERS_TABLE}... Please wait.")
        table.wait_until_exists()
        print(f"Table {DYNAMODB_USERS_TABLE} created successfully.")
    except dynamodb.meta.client.exceptions.ResourceInUseException:
        print(f"Table {DYNAMODB_USERS_TABLE} already exists.")

if __name__ == "__main__":
    create_users_table()