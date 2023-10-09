import validator from "validator"

// Define the fullname regular expression

// Define the password options
const passwordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1
};

// Define a function that validates the password, email, and fullname
export function isValidRegisterInput(password, email, fullname) {
  // Initialize an empty array to store the error messages
  let errors = [];

  // Check if the password is valid
  if (!validator.isStrongPassword(password, passwordOptions)) {
    // Push a message of the invalid password to the array
    errors.push("Invalid password");
  }

  // Check if the email is valid
  if (!validator.isEmail(email)) {
    // Push a message of the invalid email to the array
    errors.push("Invalid email: " + email);
  }

  // Check if the fullname is valid
  if (fullname.length<3) {
    // Push a message of the invalid fullname to the array
    errors.push("Invalid fullname: " + fullname);
  }

  // Return the array of error messages
  return {
    errors,
    isValid:errors.length<1?true:false
  };
};
