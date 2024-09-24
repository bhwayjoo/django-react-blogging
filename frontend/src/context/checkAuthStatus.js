import customAxios from "../services/api";

export const checkAuthStatus = async () => {
  try {
    const response = await customAxios.head("account/userinfo/");
    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};
