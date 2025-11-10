#!/bin/bash

# Package Lambda Function for SUDOKOO Scanner
# Creates a deployment package with dependencies

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📦 Packaging Lambda Function...${NC}"

# Create lambda directory if it doesn't exist
mkdir -p lambda

# Copy function code
echo -e "${YELLOW}📝 Copying function code...${NC}"
cp lambda-scan-sudoku.js lambda/index.js
cp package.json lambda/

# Install dependencies
echo -e "${YELLOW}📚 Installing dependencies...${NC}"
cd lambda
npm install --production

# Create deployment package
echo -e "${YELLOW}🗜️  Creating deployment package...${NC}"
zip -r lambda-function.zip . -x "*.DS_Store*" "node_modules/.cache/*"

echo -e "${GREEN}✅ Lambda function packaged as lambda/lambda-function.zip${NC}"
echo -e "${BLUE}📋 Package contents:${NC}"
unzip -l lambda-function.zip | head -20

cd ..

# Deploy to Lambda if function exists
LAMBDA_FUNCTION="sudokoo-scanner-prod"

if aws lambda get-function --function-name $LAMBDA_FUNCTION --region us-east-1 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚡ Updating Lambda function...${NC}"
    
    aws lambda update-function-code \
        --function-name $LAMBDA_FUNCTION \
        --zip-file fileb://lambda/lambda-function.zip \
        --region us-east-1
    
    echo -e "${GREEN}✅ Lambda function updated successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Lambda function not found. Deploy infrastructure first.${NC}"
    echo -e "   Run: ./deploy.sh"
fi

echo ""
echo -e "${GREEN}🎉 Lambda packaging complete!${NC}"