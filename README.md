# Real-Time Sports Analytics Dashboard

A real-time basketball analytics dashboard built with AWS services and Next.js.

## Architecture

- **Data Ingestion**: Kinesis Data Streams for live game events
- **Processing**: Lambda functions for real-time metrics calculation
- **Storage**: DynamoDB for live stats, S3 for historical data
- **ML**: SageMaker for win probability predictions
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Real-time**: WebSockets via API Gateway

## Project Structure

```
├── apps/
│   ├── frontend/     # Next.js dashboard
│   └── backend/      # Lambda functions
├── infra/            # AWS CDK infrastructure
├── shared/
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Shared utilities
└── docs/             # Documentation
```

## Setup

### Prerequisites

- Node.js 18+
- AWS CLI configured with credentials
- AWS CDK v2 installed globally

### Installation

```bash
npm install
```

### Development

```bash
npm run dev    # Start frontend development server
```

### Deployment

```bash
npm run deploy # Deploy AWS infrastructure
```

## Key Features

- Live game event ingestion and processing
- Real-time basketball analytics (pace, efficiency, ratings)  
- ML-powered win probability predictions
- Historical data analysis
- WebSocket-based live updates

## 💰 Cost-Effective
- **~$5.50/month** for complete AWS infrastructure
- Serverless architecture scales to zero
- Most services within AWS free tier limits