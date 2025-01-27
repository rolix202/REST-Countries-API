import bcrypt from "bcryptjs"

export const hashPassword = async (pass) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(pass, salt)

        return hashedPassword;
    } catch (error) {
        console.log("Error hashing password", error.message);
        throw new Error("Error hashing password")
    }
}

export const verifyPassword = async (passUser, passDB) => {
    try {
        const passVerify = await bcrypt.compare(passUser, passDB)

        return passVerify;
    } catch (error) {
        console.log("Error hashing password", error.message);
        throw new Error("Error hashing password")
    }
}