#!/bin/bash
set -e

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"your-project-id"}
REGION=${GOOGLE_CLOUD_REGION:-"us-central1"}
SERVICE_NAME="business-website-builder"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting production deployment..."

# Enable required APIs
echo "📦 Enabling required Google Cloud APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com

# Create secrets if they don't exist
echo "🔐 Setting up secrets..."
if ! gcloud secrets describe db-credentials &>/dev/null; then
  echo "Creating database credentials secret..."
  echo -n "mysql://user:password@/cloudsql/${PROJECT_ID}:${REGION}:business-website-db/website_builder" | \
    gcloud secrets create db-credentials --data-file=-
fi

if ! gcloud secrets describe auth-secrets &>/dev/null; then
  echo "Creating NextAuth secret..."
  echo -n "your-nextauth-secret" | \
    gcloud secrets create auth-secrets --data-file=-
fi

# Authenticate Docker with Google Cloud Registry
gcloud auth configure-docker

# Build and push the image
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME:latest .

echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_NAME:latest

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 100 \
  --port 8080 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars "NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_REGION=$REGION" \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest,REDIS_URL=REDIS_URL:latest" \
  --add-cloudsql-instances $PROJECT_ID:$REGION:business-website-db

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo "✅ Deployment completed!"
echo "🌐 Service URL: $SERVICE_URL"

# Run health check
echo "🏥 Running health check..."
sleep 30  # Wait for service to start

HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/api/health")
if [ "$HEALTH_STATUS" = "200" ]; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed (HTTP $HEALTH_STATUS)"
    exit 1
fi

echo "🎉 Deployment successful!"
echo "Your application is live at: $SERVICE_URL" 