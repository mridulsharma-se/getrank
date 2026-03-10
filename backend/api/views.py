import lightgbm as lgb
import pandas as pd
import logging
from pathlib import Path
from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from curl_cffi import requests as cffi_requests

from .serializers import PredictionInputSerializer, PredictionOutputSerializer

# Configure logging
logger = logging.getLogger(__name__)

# Load model once when server starts
MODEL_PATH = settings.BASE_DIR / "ml" / "rating_model.txt"

model = None
model_error = None

try:
    model = lgb.Booster(model_file=str(MODEL_PATH))
    logger.info(f"✅ Successfully loaded model from {MODEL_PATH}")
except FileNotFoundError:
    model_error = f"Model file not found at {MODEL_PATH}"
    logger.error(f"❌ {model_error}")
except Exception as e:
    model_error = f"Failed to load model: {str(e)}"
    logger.error(f"❌ {model_error}")


@api_view(["GET"])
def health_check(request):
    """
    Health check endpoint to verify API status.
    
    Returns:
        - status: 'ok' if healthy, 'error' if model not loaded
        - model_loaded: boolean
        - message: status message
    """
    if model is None:
        return Response(
            {
                "status": "error",
                "model_loaded": False,
                "message": model_error or "Model not loaded"
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    return Response(
        {
            "status": "ok",
            "model_loaded": True,
            "message": "API is healthy and ready to accept predictions"
        },
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
def predict_rating(request):
    """
    Predict rating delta based on user statistics.
    
    This endpoint uses a pre-trained LightGBM model to predict the expected
    rating change based on recent contest performance metrics.
    
    Request Body:
    {
        "avg_rating_delta": number,      # Average rating change from recent contests
        "best_gain": number,             # Best rating gain
        "worst_loss": number,            # Worst rating drop (negative)
        "num_contests": number,          # Number of recent contests
        "recent_trend": number           # Average of 2 most recent changes
    }
    
    Response (200):
    {
        "predicted_rating_delta": number  # Predicted rating change
    }
    
    Error Responses:
    - 400: Bad Request (invalid input)
    - 503: Service Unavailable (model not loaded)
    """
    try:
        # Check if model is loaded
        if model is None:
            logger.error("Prediction request received but model not loaded")
            return Response(
                {
                    "error": "Model not loaded",
                    "details": model_error or "Unknown error occurred"
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Validate input using serializer
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Invalid prediction request: {serializer.errors}")
            return Response(
                {
                    "error": "Invalid input data",
                    "details": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get validated data
        data = serializer.validated_data

        # Create DataFrame with features in correct order
        # Important: Features must match training data order
        df = pd.DataFrame([{
            'avg_rating_delta': data['avg_rating_delta'],
            'best_gain': data['best_gain'],
            'worst_loss': data['worst_loss'],
            'num_contests': data['num_contests'],
            'recent_trend': data['recent_trend']
        }])

        logger.debug(f"Input features: {data}")

        # Make prediction
        prediction = model.predict(df)
        predicted_delta = float(prediction[0])

        logger.info(f"✅ Prediction successful: {predicted_delta}")

        # Serialize output
        output_serializer = PredictionOutputSerializer(
            {"predicted_rating_delta": predicted_delta}
        )

        return Response(
            output_serializer.data,
            status=status.HTTP_200_OK
        )

    except ValueError as ve:
        logger.error(f"Validation error in prediction: {str(ve)}")
        return Response(
            {
                "error": "Invalid data format",
                "details": str(ve)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.exception(f"Unexpected error during prediction: {str(e)}")
        return Response(
            {
                "error": "Prediction failed",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["GET"])
def get_rating_history(request):
    handle = request.GET.get('handle')
    if not handle:
        return Response({"error": "Handle is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        response = cffi_requests.get(
            f"https://codeforces.com/api/user.rating?handle={handle}",
            impersonate="safari17_0"
        )
        try:
            data = response.json()
            return Response(data, status=response.status_code)
        except Exception:
            # Print the failed Cloudflare HTML
            logger.error(f"Cloudflare returned HTML on Codeforces primary: {response.text[:200]}")
            return Response({"error": "Failed to decode Codeforces JSON primary url"}, status=500)
    except Exception as e:
        logger.error(f"Error fetching rating history: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_user_info(request):
    handle = request.GET.get('handles')
    if not handle:
        return Response({"error": "Handles parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        response = cffi_requests.get(
            f"https://codeforces.com/api/user.info?handles={handle}",
            impersonate="safari17_0"
        )
        try:
            return Response(response.json(), status=response.status_code)
        except Exception:
            mirror = cffi_requests.get(
                f"https://codeforces.js.org/api/user.info?handles={handle}",
                impersonate="safari17_0"
            )
            return Response(mirror.json(), status=mirror.status_code)
    except Exception as e:
        logger.error(f"Error fetching user info: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
