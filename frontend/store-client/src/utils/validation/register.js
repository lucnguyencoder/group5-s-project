export const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
};

export const validateRegisterForm = (formData) => {
    const errors = {};

    // Full name validation
    if (!formData.full_name) {
        errors.full_name = "Full name is required";
    } else if (formData.full_name.trim().length < 2) {
        errors.full_name = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
    }

    // Password validation
    const passwordStrength = calculatePasswordStrength(formData.password);
    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 50) {
        errors.password =
            "Password is too weak. Include uppercase, lowercase, numbers, and symbols";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeTerms) {
        errors.agreeTerms = "You must agree to the terms and conditions";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
        passwordStrength,
    };
};
