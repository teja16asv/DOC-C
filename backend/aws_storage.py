import boto3
import os
from dotenv import load_dotenv
import uuid
import json
from boto3.dynamodb.conditions import Attr

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
DYNAMODB_USERS_TABLE = os.getenv("DYNAMODB_USERS_TABLE", "Users")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def upload_file(file, filename):
    s3.upload_fileobj(file, S3_BUCKET_NAME, filename)
    return f"s3://{S3_BUCKET_NAME}/{filename}"

def add_item(table_name, item):
    table = dynamodb.Table(table_name)
    item['id'] = str(uuid.uuid4())
    table.put_item(Item=item)
    return item

def get_items(table_name):
    table = dynamodb.Table(table_name)
    response = table.scan()
    return response.get("Items", [])

def get_user_by_email(email):
    table = dynamodb.Table(DYNAMODB_USERS_TABLE)
    # Using scan because the table might not have a secondary index on email.
    # Note: Scan is less efficient than query for large tables.
    response = table.scan(
        FilterExpression=Attr('email').eq(email)
    )
    items = response.get('Items', [])
    if items:
        return items[0]
    return None
