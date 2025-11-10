# 🚀 SUDOKOO CloudFormation Deployment Guide

Complete Infrastructure as Code deployment for your Sudoku game with camera scanning.

## 📁 File Structure

After downloading all files:

```
SUDOKOO/
├── sudokoo-infrastructure.yaml    ← CloudFormation template
├── deploy.sh                      ← Main deployment script
├── package-lambda.sh              ← Lambda packaging script
├── lambda-scan-sudoku.js          ← Lambda function code
├── package.json                   ← Lambda dependencies
├── index.html                     ← Updated with camera feature
├── error.html                     ← Error page
├── css/
│   └── styles.css                ← Updated with camera styles
└── js/
    ├── generator.js              ← Sudoku generator
    ├── puzzles.js                ← Puzzle manager  
    ├── sudoku.js                 ← Game engine
    └── app.js                    ← Updated with camera functionality
```

## 🔧 Prerequisites

### 1. AWS CLI Setup
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure AWS CLI
aws configure
# Enter your Access Key ID
# Enter your Secret Access Key
# Default region: us-east-1
# Default output format: json
```

### 2. Verify AWS Access
```bash
aws sts get-caller-identity
```
Should return your account details.

### 3. Make Scripts Executable
```bash
chmod +x deploy.sh
chmod +x package-lambda.sh
```

## 🚀 Deployment Steps

### Step 1: Deploy Infrastructure
```bash
./deploy.sh
```

**What this does:**
- ✅ Creates S3 bucket with proper security
- ✅ Sets up CloudFront distribution with OAC
- ✅ Creates Lambda function for camera scanning
- ✅ Sets up API Gateway with CORS
- ✅ Configures all IAM roles and policies
- ✅ Uploads your website files
- ✅ Updates app.js with real API endpoint

**Expected output:**
```
🚀 SUDOKOO Deployment Starting...
✅ AWS CLI configured
📦 Step 1: Deploying CloudFormation stack...
⏳ Waiting for stack creation to complete...
✅ CloudFormation stack deployed successfully!
📋 Step 2: Getting stack outputs...
✅ Stack outputs retrieved
📝 Step 3: Updating app.js with API endpoint...
✅ app.js updated with API endpoint
📤 Step 4: Uploading website files to S3...
✅ Website files uploaded successfully!
⚡ Step 5: Uploading Lambda function code...
⚠️  lambda/lambda-function.zip not found.
🔄 Step 6: Invalidating CloudFront cache...
✅ CloudFront cache invalidated!

🎉 DEPLOYMENT COMPLETE! 🎉

📋 Your SUDOKOO deployment details:
   🌐 Website URL: https://d111111abcdef8.cloudfront.net
   🔗 API URL: https://abcd123456.execute-api.us-east-1.amazonaws.com/prod/scan-sudoku
   📁 S3 Bucket: sudokoo-website-prod-123456789012
```

### Step 2: Package & Deploy Lambda Function
```bash
./package-lambda.sh
```

**What this does:**
- ✅ Creates lambda directory
- ✅ Installs Node.js dependencies
- ✅ Packages function code into zip file
- ✅ Updates Lambda function with real code

### Step 3: Test Your Deployment
1. **Wait 5-10 minutes** for CloudFront to fully deploy
2. **Visit your website URL** (from deploy.sh output)
3. **Test basic functionality:**
   - ✅ Game loads
   - ✅ New Puzzle works
   - ✅ Numbers can be placed
   - ✅ Dark theme toggle works

4. **Test camera feature:**
   - ✅ 📸 Scan Puzzle button appears
   - ✅ Clicking opens file picker
   - ✅ Uploading image shows processing modal
   - ✅ Should either scan puzzle or show error message

## 🏗️ Infrastructure Overview

### What Gets Created

**S3 + CloudFront:**
```
S3 Bucket (sudokoo-website-prod-XXXX)
└── Hosts static files (HTML, CSS, JS)
└── Secured with OAC (not public)

CloudFront Distribution
└── Global CDN for fast delivery
└── HTTPS only
└── Custom error pages
└── Caches content efficiently
```

**Lambda + API Gateway:**
```
Lambda Function (sudokoo-scanner-prod)
└── Processes images with Bedrock
└── Validates puzzles
└── Returns structured JSON

API Gateway (sudokoo-api-prod)
└── /scan-sudoku endpoint
└── CORS enabled
└── Triggers Lambda function
```

**IAM Security:**
```
Lambda Execution Role
└── Bedrock:InvokeModel permission
└── CloudWatch Logs access
└── Minimal required permissions only
```

## 💰 Cost Breakdown

**Monthly costs (estimated):**
- **S3 Storage:** $0.50 (1GB)
- **CloudFront:** $1.00 (10GB transfer)
- **Lambda:** $0.20 (1000 executions)
- **API Gateway:** $0.35 (1000 requests)
- **Bedrock:** $5.00 (1000 image scans)

**Total: ~$7/month for moderate usage**

## 🛠️ Useful Commands

### View Stack Status
```bash
aws cloudformation describe-stacks --stack-name sudokoo-infrastructure --region us-east-1
```

### View Lambda Logs
```bash
aws logs tail /aws/lambda/sudokoo-scanner-prod --follow --region us-east-1
```

### Update Lambda Code Only
```bash
./package-lambda.sh
```

### Update Infrastructure
```bash
# Modify sudokoo-infrastructure.yaml
./deploy.sh  # Updates existing stack
```

### Complete Cleanup
```bash
# Delete all resources
aws cloudformation delete-stack --stack-name sudokoo-infrastructure --region us-east-1

# Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name sudokoo-infrastructure --region us-east-1
```

## 🐛 Troubleshooting

### CloudFormation Issues

**Stack creation failed:**
```bash
# View events
aws cloudformation describe-stack-events --stack-name sudokoo-infrastructure --region us-east-1

# Common issues:
# - IAM permissions insufficient
# - Resource name conflicts
# - Invalid parameter values
```

**Update failed:**
```bash
# Check drift
aws cloudformation detect-stack-drift --stack-name sudokoo-infrastructure --region us-east-1
```

### Lambda Issues

**Function errors:**
```bash
# View logs
aws logs tail /aws/lambda/sudokoo-scanner-prod --region us-east-1

# Common issues:
# - Missing dependencies in package
# - Timeout (increase in template)
# - Memory issues (increase in template)
# - Bedrock permissions
```

### Website Issues

**Site not loading:**
- Wait 10-15 minutes for CloudFront deployment
- Check S3 bucket has files
- Verify CloudFront distribution is "Deployed"

**Camera not working:**
- Check API Gateway URL in browser console
- Verify Lambda function has latest code
- Check CORS configuration

### Bedrock Issues

**Model access denied:**
```bash
# Check if model is enabled in Bedrock console
aws bedrock list-foundation-models --region us-east-1
```

## 🎯 What You've Built

This CloudFormation template creates a **production-ready, enterprise-grade** Sudoku application demonstrating:

### **AWS Services Integration:**
- ✅ **S3** - Static website hosting
- ✅ **CloudFront** - Global CDN with security
- ✅ **Lambda** - Serverless compute
- ✅ **API Gateway** - RESTful API
- ✅ **Bedrock** - AI/ML services
- ✅ **IAM** - Security and access control
- ✅ **CloudWatch** - Logging and monitoring

### **Best Practices:**
- ✅ **Infrastructure as Code** (CloudFormation)
- ✅ **Security first** (OAC, minimal IAM permissions)
- ✅ **Scalability** (serverless, pay-per-use)
- ✅ **Monitoring** (CloudWatch logs)
- ✅ **Cost optimization** (efficient resource sizing)

### **Portfolio Value:**
- 🏆 **Professional deployment process**
- 🏆 **Enterprise architecture patterns** 
- 🏆 **Modern web application stack**
- 🏆 **AI/ML integration showcase**
- 🏆 **Solutions Architect skill demonstration**

## 🎉 Congratulations!

You've built a complete, professional AWS application using Infrastructure as Code. This showcases exactly the kind of skills AWS Solutions Architects need in the real world!

Perfect for interviews, portfolio demonstrations, and AWS certification preparation! 🚀