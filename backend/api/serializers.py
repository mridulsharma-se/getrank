from rest_framework import serializers


class PredictionInputSerializer(serializers.Serializer):
    """Serializer for rating prediction input validation"""
    
    avg_rating_delta = serializers.FloatField(
        required=True,
        help_text="Average rating change in recent contests"
    )
    best_gain = serializers.FloatField(
        required=True,
        help_text="Best rating gain in recent contests"
    )
    worst_loss = serializers.FloatField(
        required=True,
        help_text="Worst rating drop in recent contests"
    )
    num_contests = serializers.IntegerField(
        required=True,
        min_value=1,
        help_text="Number of recent contests"
    )
    recent_trend = serializers.FloatField(
        required=True,
        help_text="Recent trend of rating changes"
    )

    def validate_num_contests(self, value):
        """Validate that num_contests is reasonable"""
        if value > 1000:
            raise serializers.ValidationError(
                "Number of contests cannot exceed 1000"
            )
        return value

    def validate(self, data):
        """Additional cross-field validation"""
        # Check if any critical values are extreme
        if abs(data['avg_rating_delta']) > 500:
            raise serializers.ValidationError(
                "Average rating delta seems unusually large"
            )
        return data


class PredictionOutputSerializer(serializers.Serializer):
    """Serializer for rating prediction output"""
    
    predicted_rating_delta = serializers.FloatField(
        help_text="Predicted rating delta for next contest"
    )
