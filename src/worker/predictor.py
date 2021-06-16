# Import load from joblib to use the trained model.
from joblib import load
from sys import argv, stdout

# Use the existing trained model from a joblib file.
model = load(argv[1])

# Make the model predict the class feature value given a data from the arguments.
class_feature_prediction = model.predict([argv[2:7]])

# Display the class feature prediction of the model.
print(class_feature_prediction[0])

# Flush for node
stdout.flush()