const ValidateInput = {
    username: (value) => {
        if (!value) {
            return {
                isValid: false,
                message: "Username is required"
            };
        }
        if (value.length < 3 || value.length > 20) {
            return {
                isValid: false,
                message: "Username must be between 3 and 20 characters"
            }
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return {
                isValid: false,
                message: "Username can only contain letters, numbers, and underscores"
            }
        }
        return {
            isValid: true
        }
    },
    password: (password) => {
        const validations = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        const messages = [];
        if (!validations.length) messages.push("At least 8 characters");
        if (!validations.uppercase) messages.push("One uppercase letter");
        if (!validations.lowercase) messages.push("One lowercase letter");
        if (!validations.number) messages.push("One number");
        if (!validations.special) messages.push("One special character");

        return {
            isValid: Object.values(validations).every(Boolean),
            message: messages.join(", "),
        };
    },

    email: (email) => {
    if (!email) {
        return {
            isValid: false,
            message: "Email is required"
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (/\s/.test(email)) {
        return {
            isValid: false,
            message: "Email cannot contain spaces"
        };
    } else if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: "Invalid email format"
        };
    }

    return {
        isValid: true
    };
}

};

export default ValidateInput;
