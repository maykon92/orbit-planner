import { useState } from "react";
import { searchProfiles } from "../services/userService";

const useUserSearch = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchProfiles(value);

      setUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setUsers([]);
  };

  return {
    query,
    users,
    loading,

    setQuery,
    setUsers,

    handleSearch,
    clearSearch,
  };
};

export default useUserSearch;