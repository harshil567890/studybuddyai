import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints } from "../apis";

const {
  GET_ADMIN_STATS_API,
  GET_ALL_USERS_API,
  UPDATE_USER_ROLE_API,
  TOGGLE_USER_STATUS_API,
  DELETE_USER_API,
  GET_ADMIN_COURSES_API,
  TOGGLE_COURSE_STATUS_API,
  CREATE_CATEGORY_API,
  DELETE_CATEGORY_API,
} = adminEndpoints;

export const fetchAdminStats = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ADMIN_STATS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.log("FETCH_ADMIN_STATS_ERROR", error);
  }
  return null;
};

export const fetchAllUsers = async (token, search = "", role = "") => {
  try {
    let url = `${GET_ALL_USERS_API}?search=${encodeURIComponent(search)}`;
    if (role) url += `&role=${role}`;
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.log("FETCH_ALL_USERS_ERROR", error);
  }
  return [];
};

export const updateUserRole = async (userId, newRole, token) => {
  const toastId = toast.loading("Updating role...");
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_USER_ROLE_API,
      { userId, newRole },
      { Authorization: `Bearer ${token}` }
    );
    toast.dismiss(toastId);
    if (response.data.success) {
      toast.success(response.data.message);
      return response.data.data;
    }
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed to update role");
  }
  return null;
};

export const toggleUserStatus = async (userId, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      TOGGLE_USER_STATUS_API,
      { userId },
      { Authorization: `Bearer ${token}` }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      return { success: true, active: response.data.active };
    }
  } catch (error) {
    toast.error("Failed to update status");
  }
  return null;
};

export const deleteUserByAdmin = async (userId, token) => {
  const toastId = toast.loading("Deleting user...");
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_USER_API}/${userId}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    toast.dismiss(toastId);
    if (response.data.success) {
      toast.success(response.data.message);
      return true;
    }
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Could not delete user");
  }
  return false;
};

export const fetchAllCoursesAdmin = async (token, search = "") => {
  try {
    const url = `${GET_ADMIN_COURSES_API}?search=${encodeURIComponent(search)}`;
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.log("FETCH_ADMIN_COURSES_ERROR", error);
  }
  return [];
};

export const toggleCoursePublishStatus = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      TOGGLE_COURSE_STATUS_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      return response.data.status;
    }
  } catch (error) {
    toast.error("Failed to update course status");
  }
  return null;
};

export const createCategoryAdmin = async (name, description, token) => {
  const toastId = toast.loading("Creating category...");
  try {
    const response = await apiConnector(
      "POST",
      CREATE_CATEGORY_API,
      { name, description },
      { Authorization: `Bearer ${token}` }
    );
    toast.dismiss(toastId);
    if (response.data.success) {
      toast.success(response.data.message);
      return response.data.data;
    }
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed to create category");
  }
  return null;
};

export const deleteCategoryAdmin = async (categoryId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_CATEGORY_API}/${categoryId}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      return true;
    }
  } catch (error) {
    toast.error("Could not delete category");
  }
  return false;
};

// Aliases for component convenience
export const fetchAdminCourses = fetchAllCoursesAdmin;
export const toggleCourseStatus = toggleCoursePublishStatus;
export const deleteUser = deleteUserByAdmin;
export const createCategory = createCategoryAdmin;
export const deleteCategory = deleteCategoryAdmin;

