#!/bin/bash

# SUDOKOO Deployment Script
# Deploys complete infrastructure and uploads website files

set -e  # Exit on any error

# Configuration
STACK_NAME="sudokoo-infrastructure"
PROJECT_NAME="sudokoo"
ENVIRONMENT="prod"
REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 SUDOKOO Deployment Starting...${NC}"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS CLI not configured. Please run: aws configure${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

# Get current AWS account and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${BLUE}📋 Account ID: ${ACCOUNT_ID}${NC}"
echo -e "${BLUE}📋 Region: ${REGION}${NC}"
echo ""

# Step 1: Deploy CloudFormation Stack
echo -e "${YELLOW}📦 Step 1: Deploying CloudFormation stack...${NC}"

if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION > /dev/null 2>&1; then
    echo -e "${BLUE}🔄 Stack exists, updating...${NC}"
    aws cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-body file://sudokoo-infrastructure.yaml \
        --parameters ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
                    ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
        --capabilities CAPABILITY_NAMED_IAM \
        --region $REGION
        
    echo -e "${BLUE}⏳ Waiting for stack update to complete...${NC}"
    aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $REGION
else
    echo -e "${BLUE}🆕 Creating new stack...${NC}"
    aws cloudformation create-stack \
        --stack-name $STACK_NAME \
        --template-body file://sudokoo-infrastructure.yaml \
        --parameters ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME \
                    ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
        --capabilities CAPABILITY_NAMED_IAM \
        --region $REGION
        
    echo -e "${BLUE}⏳ Waiting for stack creation to complete...${NC}"
    aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION
fi

echo -e "${GREEN}✅ CloudFormation stack deployed successfully!${NC}"
echo ""

# Step 2: Get stack outputs
echo -e "${YELLOW}📋 Step 2: Getting stack outputs...${NC}"

BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

API_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayURL`].OutputValue' \
    --output text)

LAMBDA_FUNCTION=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`LambdaFunctionName`].OutputValue' \
    --output text)

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

echo -e "${GREEN}✅ Stack outputs retrieved:${NC}"
echo -e "   🪣 S3 Bucket: ${BUCKET_NAME}"
echo -e "   🌐 Website URL: ${WEBSITE_URL}"
echo -e "   🔗 API URL: ${API_URL}"
echo -e "   ⚡ Lambda Function: ${LAMBDA_FUNCTION}"
echo ""

# Step 3: Update app.js with API endpoint
echo -e "${YELLOW}📝 Step 3: Updating app.js with API endpoint...${NC}"

if [ -f "js/app.js" ]; then
    # Create a backup
    cp js/app.js js/app.js.backup
    
    # Replace the API endpoint
    sed -i.tmp "s|const apiEndpoint = '/api/scan-sudoku';|const apiEndpoint = '${API_URL}';|g" js/app.js
    rm -f js/app.js.tmp
    
    echo -e "${GREEN}✅ app.js updated with API endpoint${NC}"
else
    echo -e "${YELLOW}⚠️  js/app.js not found. You'll need to update the API endpoint manually:${NC}"
    echo -e "   Replace: const apiEndpoint = '/api/scan-sudoku';"
    echo -e "   With:    const apiEndpoint = '${API_URL}';"
fi
echo ""

# Step 4: Upload website files to S3
echo -e "${YELLOW}📤 Step 4: Uploading website files to S3...${NC}"

# Upload HTML files
aws s3 cp index.html "s3://${BUCKET_NAME}/" --content-type "text/html" --region $REGION
aws s3 cp error.html "s3://${BUCKET_NAME}/" --content-type "text/html" --region $REGION

# Upload CSS files
aws s3 cp css/ "s3://${BUCKET_NAME}/css/" --recursive --content-type "text/css" --region $REGION

# Upload JS files
aws s3 cp js/ "s3://${BUCKET_NAME}/js/" --recursive --content-type "application/javascript" --region $REGION

echo -e "${GREEN}✅ Website files uploaded successfully!${NC}"
echo ""

# Step 5: Upload Lambda function code
echo -e "${YELLOW}⚡ Step 5: Uploading Lambda function code...${NC}"

if [ -f "lambda/lambda-function.zip" ]; then
    aws lambda update-function-code \
        --function-name $LAMBDA_FUNCTION \
        --zip-file fileb://lambda/lambda-function.zip \
        --region $REGION
    
    echo -e "${GREEN}✅ Lambda function code updated!${NC}"
else
    echo -e "${YELLOW}⚠️  lambda/lambda-function.zip not found.${NC}"
    echo -e "   The Lambda function was deployed with placeholder code."
    echo -e "   Follow the deployment guide to upload the real code later."
fi
echo ""

# Step 6: Invalidate CloudFront cache
echo -e "${YELLOW}🔄 Step 6: Invalidating CloudFront cache...${NC}"

aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_ID \
    --paths "/*" \
    --region $REGION > /dev/null

echo -e "${GREEN}✅ CloudFront cache invalidated!${NC}"
echo ""

# Success summary
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE! 🎉${NC}"
echo ""
echo -e "${BLUE}📋 Your SUDOKOO deployment details:${NC}"
echo -e "   🌐 Website URL: ${WEBSITE_URL}"
echo -e "   🔗 API URL: ${API_URL}"
echo -e "   📁 S3 Bucket: ${BUCKET_NAME}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "   1. Wait 5-10 minutes for CloudFront to fully deploy"
echo "   2. Visit your website URL to test the basic game"
echo "   3. Upload Lambda function code to enable camera scanning"
echo "   4. Test camera scanning feature"
echo ""
echo -e "${BLUE}🛠️  Useful commands:${NC}"
echo "   View stack: aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION"
echo "   Delete stack: aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
echo "   View logs: aws logs tail /aws/lambda/$LAMBDA_FUNCTION --follow --region $REGION"
echo ""
echo -e "${GREEN}✨ Infrastructure deployed successfully! ✨${NC}"