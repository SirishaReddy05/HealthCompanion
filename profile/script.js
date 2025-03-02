function updateProfile() {
    // Get values from input fields
    const fullName = document.getElementById('fullName').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const emergencyContactName = document.getElementById('emergencyContactName').value;
    const emergencyContactPhone = document.getElementById('emergencyContactPhone').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const bmi = document.getElementById('bmi').value;
    const allergies = document.getElementById('allergies').value;
  
    // Update displayed profile info
    document.getElementById('displayFullName').textContent = fullName || "-";
    document.getElementById('displayDob').textContent = dob || "-";
    document.getElementById('displayGender').textContent = gender || "-";
    document.getElementById('displayEmail').textContent = email || "-";
    document.getElementById('displayPhone').textContent = phone || "-";
    // Fixed the interpolation issue here
    document.getElementById('displayEmergencyContact').textContent = `${emergencyContactName} - ${emergencyContactPhone}` || "-";
    document.getElementById('displayHeight').textContent = height || "-";
    document.getElementById('displayWeight').textContent = weight || "-";
    document.getElementById('displayBmi').textContent = bmi || "-";
    document.getElementById('displayAllergies').textContent = allergies || "-";
}
