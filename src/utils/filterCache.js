import api from "../services/api";

const CACHE_KEY = "filterDropdownData";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const filterCache = {
  set: (data) => {
    try {
      console.log("[FilterCache] Caching new data");
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("[FilterCache] Error saving to cache:", error);
    }
  },

  get: () => {
    try {
      console.log("[FilterCache] Checking cache");
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        console.log("[FilterCache] Cache miss");
        return null;
      }

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        console.log("[FilterCache] Cache expired");
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      console.log("[FilterCache] Cache hit");
      return data;
    } catch (error) {
      console.error("[FilterCache] Error reading from cache:", error);
      return null;
    }
  },

  clear: () => {
    localStorage.removeItem(CACHE_KEY);
  },
};

export const fetchAndCacheFilterData = async () => {
  try {
    const [collegesRes, programsRes, researchAreasRes, researchTypesRes] =
      await Promise.all([
        api.get("/deptprogs/college_depts"),
        api.get("/deptprogs/fetch_programs"),
        api.get("/paper/research_areas"),
        api.get("/paper/research_types"),
      ]);

    const data = {
      colleges: collegesRes.data.colleges,
      programs: programsRes.data.programs,
      researchAreas: researchAreasRes.data.research_areas,
      researchTypes: researchTypesRes.data.research_types,
    };

    filterCache.set(data);
    return data;
  } catch (error) {
    console.error("Error fetching filter data:", error);
    throw error;
  }
};
