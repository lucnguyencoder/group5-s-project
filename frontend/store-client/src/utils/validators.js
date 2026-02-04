import { isValid } from "date-fns";
import { formatString } from "./formatter";
import commonValidator from "./commonValidator";

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email is required';
    }
    if (email.length > 254) {
        return 'Email must not exceed 254 characters';
    }
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
};


export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return '';
};

export const validateFullName = (fullName) => {
    // if (![...fullName].every((char) => /^[\p{L}\s]+$/u.test(char))) {
    //     return 'Full name must contain only letters';
    // }
    fullName = fullName.trim().replace(/\s+/g, ' ');
    if (!fullName) {
        return 'Full name is required';
    }
    if (!/^[\p{L}\s]+$/u.test(fullName)) {
        return 'Full name must contain only letters and spaces';
    }
    const validatedLength = commonValidator.validateStringLengthRange(fullName, 2, 50);
    if (!validatedLength) {
        return 'Full name must be at least 2 characters long and not exceed 50 characters';
    }
    return '';
};


export const validatePhone = (phone) => {
    const phoneRegex = /^(0)\d{9}$/;
    if (!phone) {
        return 'Phone number is required';
    }
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        return 'Please enter a valid phone number (10 digits)';
    }
    return '';
};


export const validateDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) {
        return '';
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 13) {
        return 'You must be at least 13 years old';
    }
    if (age > 120) {
        return 'Please enter a valid date of birth';
    }

    return '';
};


export const validateRegisterForm = (formData) => {
    const errors = {};

    errors.fullName = validateFullName(formData.full_name);
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    errors.phone = validatePhone(formData.phone);
    errors.dateOfBirth = validateDateOfBirth(formData.date_of_birth);


    Object.keys(errors).forEach(key => {
        if (!errors[key]) {
            delete errors[key];
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


export const validateLoginForm = (formData) => {
    const errors = {};

    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);


    Object.keys(errors).forEach(key => {
        if (!errors[key]) {
            delete errors[key];
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


export const validateFoodName = (foodName) => {
    if (!foodName) {
        return 'Food name is required';
    }
    if (foodName.trim().length < 2) {
        return 'Food name must be at least 2 characters long';
    }
    if (foodName.trim().length > 100) {
        return 'Food name must not exceed 100 characters';
    }
    return '';
};

export const validateDescription = (description) => {
    if (!description) {
        return 'Description is required';
    }
    if (description.trim().length < 10) {
        return 'Description must be at least 10 characters long';
    }
    if (description.trim().length > 1000) {
        return 'Description must not exceed 1000 characters';
    }
    return '';
};

export const validatePrice = (price, fieldName = 'Price') => {
    if (!price && price !== 0) {
        return `${fieldName} is required`;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
        return `${fieldName} must be a valid positive number`;
    }
    if (numPrice > 100000000) {
        return `${fieldName} must under 100M VND`;
    }
    return '';
};

export const validatePreparationTime = (time) => {
    if (!time && time !== 0) {
        return 'Preparation time is required';
    }
    const numTime = parseInt(time);
    if (isNaN(numTime) || numTime < 1) {
        return 'Preparation time must be at least 1 minute';
    }
    if (numTime > 60) {
        return 'Preparation time must under 1 hour';
    }
    return '';
};

export const validateMaxQuantity = (quantity) => {
    if (!quantity && quantity !== 0) {
        return 'Max allowed quantity is required';
    }
    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity < 1) {
        return 'Max allowed quantity must be at least 1';
    }
    if (numQuantity > 1000) {
        return 'Max allowed quantity must not exceed 1000';
    }
    return '';
};

export const validateImageUrl = (url) => {
    if (!url) {
        return 'Image is required';
    }
    try {
        new URL(url);
        return '';
    } catch {
        return 'Please enter a valid URL';
    }
};

export const validateCustomizationGroup = (group) => {
    const errors = {};

    if (!group.name || group.name.trim().length < 2) {
        errors.name = 'Group name must be at least 2 characters long';
    }

    if (group.allowMultiple && group.minOptions > group.maxOptions) {
        errors.minOptions = 'Minimum options cannot exceed maximum options';
    }

    if (group.options.length === 0) {
        errors.options = 'At least one option is required';
    }

    for (const option of group.options) {
        if (!option.name || option.name.trim().length < 2) {
            errors[`o${option.id}-name`] = `Option ${option.sort_order}: Name must be at least 2 characters long`;
        }
        if (isNaN(option.price) || parseFloat(option.price) < 0) {
            errors[`o${option.id}-price`] = `Option ${option.sort_order}: Price must be a valid positive number`;
        }
    }


    return errors;
};

export const validateFoodForm = (formData) => {
    const errors = {};

    errors.food_name = validateFoodName(formData.food_name);
    errors.description = validateDescription(formData.description);
    errors.base_price = validatePrice(formData.base_price, 'Base price');
    errors.preparation_time = validatePreparationTime(formData.preparation_time);
    errors.max_allowed_quantity = validateMaxQuantity(formData.max_allowed_quantity);
    errors.image_url = validateImageUrl(formData.image_url);

    if (formData.is_on_sale) {
        errors.salePrice = validatePrice(formData.sale_price, 'Sale price');
        if (!errors.salePrice && parseFloat(formData.sale_price) >= parseFloat(formData.base_price)) {
            errors.salePrice = 'Sale price must be less than base price';
        }
    }

    Object.keys(errors).forEach(key => {
        if (!errors[key]) {
            delete errors[key];
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


export const validateDiscount = (formData) => {
    let err = [];
    const reqF = ['is_active', 'discount_type', 'discount_sale_type', 'max_discount_amount', 'usage_limit', 'allow_usage_per_user', 'valid_from', 'valid_to', 'code', 'discount_name'];

    for (const field of reqF) {
        if (!formData[field]) {
            err.push(`${formatString(field)} is required`);
        }
    }

    if (formData.discount_type === "percentage") {
        if (!formData.discount_value) {
            err.push('Discount value is required for percentage discounts');
        }
        else if (commonValidator.validateNumber(formData.discount_value, 100, 1) === false) {
            err.push('Discount value must between 1 and 100');
        }

        if (commonValidator.validateNumber(formData.max_discount_amount, 10000000, 1) === false) {
            err.push('Max discount amount must between 1 and 10 million');
        }
    }
    else {
        if (commonValidator.validateNumber(formData.discount_value, 10000000, 1) === false) {
            err.push('Discount value must between 1 and 10 million');
        }
    }



    if (commonValidator.validateNumber(formData.usage_limit, 10000, 1) === false) {
        err.push('Usage limit must between 1 and 10000');
    }

    if (formData.is_price_condition) {
        if (commonValidator.validateNumber(formData.min_price_condition, 10000000, 1) === false) {
            err.push('Minimum price condition must between 1 and 10 million');
        }
    }

    if (formData.is_limit_usage_per_user) {
        if (commonValidator.validateNumber(formData.allow_usage_per_user, formData.usage_limit, 1) === false) {
            err.push('Allowed usage per user must be lower than usage limit');

        }
    }

    if (!formData.valid_from || !isValid(new Date(formData.valid_from))) {
        err.push('Valid from date is invalid');
    }

    if (!formData.valid_to || !isValid(new Date(formData.valid_to))) {
        err.push('Valid to date is invalid');
    }

    if (new Date(formData.valid_from) >= new Date(formData.valid_to)) {
        err.push('Valid from date must be before valid to date');
    }

    if (!formData.code || commonValidator.validateStringLengthRange(formData.code, 3, 12) === false) {
        err.push('Discount code must be between 3 and 12 characters long');
    }

    if (formData.code && !commonValidator.validateStringRegex(formData.code, /^[A-Z0-9]+$/)) {
        err.push('Discount code must contain only uppercase chars and numbers');
    }
    if (!formData.discount_name || commonValidator.validateStringLengthRange(formData.discount_name, 3, 50) === false) {
        err.push('Discount name must be between 3 and 50 characters long');
    }

    return {
        isValid: err.length === 0,
        errors: err
    }

}