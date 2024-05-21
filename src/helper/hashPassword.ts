import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    if (!password) {
      throw new Error('Password is empty or undefined');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error:any) {
    throw new Error(`Error in hashing password: ${error.message}`);
  }
};




export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error:any) {
    console.error("Error verifying password:");
    throw error;
  }
};
