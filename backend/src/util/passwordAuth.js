const bcrypt = require("bcrypt");

const BCRYPT_PREFIXES = ["$2a$", "$2b$", "$2y$"];

const isPasswordHashed = (value) =>
    typeof value === "string" && BCRYPT_PREFIXES.some((prefix) => value.startsWith(prefix));

const hashPassword = async (password) => bcrypt.hash(String(password || ""), 10);

const verifyPasswordAndUpgrade = async (document, plainTextPassword, fieldName = "password") => {
    const storedPassword = String(document?.[fieldName] || "");

    if (!storedPassword) {
        return false;
    }

    let isValid = false;

    if (isPasswordHashed(storedPassword)) {
        isValid = await bcrypt.compare(String(plainTextPassword || ""), storedPassword);
    } else {
        isValid = storedPassword === String(plainTextPassword || "");
    }

    if (isValid && !isPasswordHashed(storedPassword)) {
        document[fieldName] = await hashPassword(plainTextPassword);
        await document.save();
    }

    return isValid;
};

module.exports = {
    hashPassword,
    isPasswordHashed,
    verifyPasswordAndUpgrade,
};
