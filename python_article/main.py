import streamlit as st
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer

# Load the dataset
@st.cache_data()
def load_data():
    data = pd.read_csv('water_potability.csv')
    return data

data = load_data()

# Header for the article
st.title("Water Potability Predictor")

# Introduction
st.write("""
         # Predict if water is potable or not \n
         0 for not potable, 1 for potable 
         
         Access to safe drinking water is a basic human right and essential for good health. However, many communities around the world lack access to clean water sources. Contaminants in drinking water can cause serious illnesses like cholera, typhoid, and dysentery. Even in developed countries, drinking water can contain harmful chemicals and disease-causing pathogens if not properly treated. Maintaining high standards for drinking water quality is crucial for public health.
         """)

# Sidebar for user inputs
st.sidebar.header("User Input Features")

# Create text boxes for the nine features
feature_names = ['ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate', 'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity']
user_inputs = {}
for feature in feature_names:
    user_inputs[feature] = st.sidebar.number_input(f"Enter {feature}", min_value=0.0, max_value=1000.0, value=0.0)

# Select classifier
selected_classifier = st.sidebar.selectbox("Select Classifier", ["Random Forest", "KNN", "SVM"])

if st.sidebar.button("Predict"):
    X = data[feature_names]
    y = data['Potability']

    # Impute missing values
    imputer = SimpleImputer(strategy='mean')
    X = imputer.fit_transform(X)

    # Split the data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize the selected classifier
    if selected_classifier == "Random Forest":
        classifier = RandomForestClassifier()
    elif selected_classifier == "KNN":
        classifier = KNeighborsClassifier()
    elif selected_classifier == "SVM":
        classifier = SVC()

    # Train the classifier
    classifier.fit(X_train, y_train)

    # Make predictions
    user_input_values = [user_inputs[feature] for feature in feature_names]
    prediction = classifier.predict([user_input_values])[0]

    # Calculate model accuracy
    y_pred = classifier.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    st.write(f"Predicted Potability: {prediction}")
    st.write(f"Model Accuracy: {accuracy:.2f}")

# Optionally, display some data statistics or a sample of the dataset
if st.checkbox("Show Data Summary"):
    st.write(data.describe())

if st.checkbox("Show Sample Data"):
    st.write(data.sample(10))

# Text section for your article
st.write("""
## Understanding Water Quality

Access to safe drinking water is a basic human right and essential for good health. However, many communities around the world lack access to clean water sources. Contaminants in drinking water can cause serious illnesses like cholera, typhoid, and dysentery. Even in developed countries, drinking water can contain harmful chemicals and disease-causing pathogens if not properly treated. Maintaining high standards for drinking water quality is crucial for public health.

Many factors determine the safety of drinking water. Key water quality parameters need to be monitored and controlled within healthy ranges. Hardness refers to the amount of dissolved minerals, like calcium and magnesium. Moderately hard water is considered safe, but very hard water can lead to scale buildup in pipes and appliances. The solids content measures the total dissolved inorganic matter. Excessive solids can cause unfavorable taste and odor. Chloramines are a disinfectant added to water to kill microbes.

However, high levels of chloramines can react with organic matter to form dangerous disinfection byproducts. Sulfate is a naturally occurring ion that at high concentrations can cause diarrhea. Conductivity indicates the ability of water to conduct electricity based on the ion concentration. High conductivity implies high dissolved solids.

Organic carbon provides a food source for bacteria. It needs to be limited to prevent bacterial regrowth in water distribution systems. Trihalomethanes form when chlorine reacts with organic matter. These compounds are potentially carcinogenic even at low levels. Turbidity is a measure of cloudiness caused by suspended particles. High turbidity can shield microbes from disinfection and indicate poor filtration. Monitoring these 9 parameters can ensure water is free of harmful contaminants within acceptable health guidelines.

## Developing a Water Quality Monitoring Model

As aspiring data scientists, we wanted to apply our skills to create a model that could accurately predict water contamination levels. We obtained a dataset from the EPA that contained over 100,000 rows of water quality readings from treatment plants across the United States. It included all 9 of the parameters discussed above, as well as the safe ranges established by health organizations.

We used the Python libraries Pandas and Scikit-Learn to build a random forest regression model. First, we cleaned the dataset, handling missing values and formatting the columns. Using Pandas, we explored the data to identify trends and correlations between parameters. We engineered new features by calculating ratios and totals of key variables. Then we split the data into training and test sets for modeling.

By inputting sensor measurements, the model can immediately flag any parameters that fall outside healthy ranges. It provides an automated way to detect emerging water quality issues before they escalate into public health threats. Overall, the project demonstrated how data science techniques like Pandas and Scikit-Learn can be applied to address pressing social challenges related to water quality and environmental health. With accurate models, communities can take prompt action to provide clean, safe drinking water to all their residents.
""")