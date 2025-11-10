# 🧩 SUDOKOO - Interactive Sudoku Game

> AWS-powered Sudoku game with AI camera scanning capabilities

[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CloudFormation](https://img.shields.io/badge/CloudFormation-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/cloudformation/)

## 🚀 Live Demo

**Website:** [Coming Soon - Deploy with CloudFormation]
**Features:** Interactive gameplay, dark theme, camera scanning

## ✨ Features

- 🎮 **Interactive Sudoku gameplay** with unlimited fresh puzzles
- 📸 **Camera scanning** - photograph newspaper/book puzzles to play digitally
- 🎨 **Modern UI** with dark/light theme toggle
- ✏️ **Pencil marks** for advanced solving techniques
- 🧠 **AI-powered** puzzle validation using AWS Bedrock
- ☁️ **Serverless architecture** - scales automatically
- 💰 **Cost-optimized** - pay only for what you use

## 🏗️ Architecture
```
Frontend (S3 + CloudFront)
    ↓ Image Upload
API Gateway (/scan-sudoku)
    ↓ Triggers
AWS Lambda (Image Processing)
    ↓ AI Analysis
Amazon Bedrock (Claude Vision)
    ↓ Puzzle Recognition
Sudoku Engine (Validation)
    ↓ Structured Data
Game Interface (Play!)
```

## 🛠️ Tech Stack

**Frontend:**
- Vanilla HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid/Flexbox
- Local storage for theme preferences

**Backend & Infrastructure:**
- **AWS Lambda** - Serverless image processing
- **Amazon Bedrock** - AI vision model (Claude 3.5 Sonnet)
- **API Gateway** - RESTful API with CORS
- **S3** - Static website hosting
- **CloudFront** - Global CDN with HTTPS
- **IAM** - Security and access control
- **CloudFormation** - Infrastructure as Code

**DevOps:**
- One-command deployment scripts
- Automated CloudFront cache invalidation
- CloudWatch logging and monitoring

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured (`aws configure`)
- Node.js 18+ (for Lambda dependencies)
- Bash shell (macOS/Linux)

### Deploy Infrastructure
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/SUDOKOO.git
cd SUDOKOO

# Make scripts executable
chmod +x deploy.sh package-lambda.sh

# Deploy complete infrastructure
./deploy.sh

# Deploy camera scanning functionality
./package-lambda.sh
```

### Local Development
```bash
# Test locally
python3 -m http.server 3000
open http://localhost:3000
```

## 📁 Project Structure
```
SUDOKOO/
├── 📄 sudokoo-infrastructure.yaml    # CloudFormation template
├── 🚀 deploy.sh                      # Deployment automation
├── 📦 package-lambda.sh              # Lambda packaging
├── 🌐 index.html                     # Main game interface
├── ❌ error.html                     # 404 error page
├── 📁 css/
│   └── styles.css                    # Modern styling + themes
├── 📁 js/
│   ├── generator.js                  # Fresh puzzle generation
│   ├── puzzles.js                    # Puzzle management
│   ├── sudoku.js                     # Game engine & validation
│   └── app.js                        # UI controller + camera
├── 📁 lambda/
│   ├── index.js                      # Bedrock image processing
│   └── package.json                  # Dependencies
└── 📚 DEPLOYMENT-GUIDE.md            # Complete setup guide
```

## 🎮 How to Play

1. **🆕 New Puzzle** - Generate fresh puzzle
2. **📸 Scan Puzzle** - Upload photo of newspaper/book Sudoku
3. **🎯 Click cells** - Select cell to fill
4. **🔢 Enter numbers** - Use number pad or keyboard (1-9)
5. **✏️ Pencil Mode** - Toggle for marking possibilities
6. **🌙 Theme Toggle** - Switch between light/dark modes

## 🔬 Camera Scanning Technology

The camera feature uses cutting-edge AI to recognize Sudoku puzzles:

1. **📷 Image Upload** - Capture photo with phone camera
2. **🧠 AI Analysis** - AWS Bedrock (Claude Vision) processes image
3. **🔍 Grid Detection** - Identifies 9x9 Sudoku structure
4. **🔢 Number Recognition** - OCR extracts digits 1-9
5. **✅ Validation** - Ensures puzzle is solvable
6. **🎮 Digital Recreation** - Loads into interactive game

## 💰 Cost Analysis

**Monthly costs for moderate usage:**
- S3 Storage: ~$0.50
- CloudFront CDN: ~$1.00
- Lambda Execution: ~$0.20
- API Gateway: ~$0.35
- Bedrock AI: ~$5.00 (1000 scans)

**Total: ~$7/month** (includes free tier benefits)

## 🏆 Portfolio Highlights

This project demonstrates:

- ✅ **Full-stack web development**
- ✅ **AWS cloud architecture** (6+ services)
- ✅ **Infrastructure as Code** (CloudFormation)
- ✅ **Serverless computing** patterns
- ✅ **AI/ML integration** (computer vision)
- ✅ **RESTful API design**
- ✅ **Security best practices** (IAM, OAC)
- ✅ **Cost optimization** strategies
- ✅ **DevOps automation** (CI/CD ready)

Perfect for **AWS Solutions Architect** interviews and certification preparation!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and portfolios!

## 🙏 Acknowledgments

- Sudoku puzzle generation algorithms
- AWS documentation and best practices
- Modern web development patterns