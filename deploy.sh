#!/bin/bash

# Set environment variables
export PROJECT_ID="your-project-id"
export REGION="us-central1"

# Build and push Docker image
gcloud builds submit --tag gcr.io/$PROJECT_ID/business-website-builder

# Deploy to Cloud Run
gcloud run deploy business-website-builder \
  --image gcr.io/$PROJECT_ID/business-website-builder \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --port 8080

# Set up Cloud SQL
gcloud sql instances create business-website-db \
  --database-version=MYSQL_5_7 \
  --tier=db-f1-micro \
  --region=$REGION

# Create database
gcloud sql databases create website_builder \
  --instance=business-website-db

# Create user
gcloud sql users create website_builder \
  --instance=business-website-db \
  --password=your-password

# Set up Cloud Storage
gsutil mb -l $REGION gs://$PROJECT_ID-website-builder

# Set up Cloud CDN
gcloud compute backend-buckets create website-builder-cdn \
  --gcs-bucket-name=$PROJECT_ID-website-builder \
  --enable-cdn

# Set up monitoring
gcloud monitoring uptime-checks create http website-builder-health \
  --uri=https://business-website-builder-$PROJECT_ID.a.run.app/api/health \
  --display-name="Website Builder Health Check"

# Set up cost optimization
gcloud services enable cloudbilling.googleapis.com
gcloud services enable billingbudgets.googleapis.com

# Create budget alert
gcloud billing budgets create \
  --billing-account=$BILLING_ACCOUNT_ID \
  --display-name="Website Builder Budget" \
  --budget-amount=1000USD \
  --threshold-rule=percent=0.8 \
  --threshold-rule=percent=0.9 \
  --threshold-rule=percent=1.0

# Set up automatic scaling
gcloud compute instance-groups managed set-autoscaling website-builder-group \
  --min-num-replicas=1 \
  --max-num-replicas=10 \
  --target-cpu-utilization=0.7 \
  --target-memory-utilization=0.8

# Set up Cloud SQL instance sizing
gcloud sql instances patch website-builder-db \
  --tier=db-custom-1-4 \
  --storage-size=10GB \
  --storage-type=SSD

# Enable automatic backups
gcloud sql instances patch website-builder-db \
  --backup-start-time=02:00 \
  --enable-bin-log

# Set up Cloud Armor
gcloud compute security-policies create website-builder-policy \
  --description="Security policy for website builder"

gcloud compute security-policies rules update 1000 \
  --security-policy=website-builder-policy \
  --expression="evaluatePreconfiguredExpr('sqli-stable')" \
  --action=deny-403

# Set up monitoring
gcloud monitoring dashboards create \
  --config-from-file=monitoring.yaml

# Set up logging
gcloud logging sinks create website-builder-logs \
  --destination=bigquery.googleapis.com/projects/$PROJECT_ID/datasets/website_builder_logs \
  --log-filter="resource.type=cloud_run_revision OR resource.type=cloudsql_database" 