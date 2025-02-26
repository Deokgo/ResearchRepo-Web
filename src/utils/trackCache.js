import api from "../services/api";

class FilterCache {
  constructor() {
    this.cache = {
      expiryTime: null,
      conferenceTitles: [],
      countries: [],
      cities: [],
      publicationNames: [],
      publicationFormats: [],
    };
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  }

  isExpired() {
    return !this.cache.expiryTime || Date.now() > this.cache.expiryTime;
  }

  set(data) {
    this.cache = {
      ...data,
      expiryTime: Date.now() + this.CACHE_DURATION,
    };
  }

  get() {
    return this.isExpired() ? null : this.cache;
  }

  clear() {
    this.cache = {
      expiryTime: null,
      conferenceTitles: [],
      countries: [],
      cities: [],
      publicationNames: [],
      publicationFormats: [],
    };
  }
}

// Create a singleton instance
export const filterCache = new FilterCache();

// Function to fetch and cache all filter data
export const fetchAndCacheFilterData = async () => {
  try {
    // Only fetch if cache is expired or empty
    if (filterCache.isExpired()) {
      const [
        conferencesResponse,
        publicationsResponse,
        pubFormatsResponse,
        countriesResponse,
      ] = await Promise.all([
        api.get("/track/fetch_data/conference"),
        api.get("/track/data_fetcher/publications/publication_name"),
        api.get("/track/fetch_data/pub_format"),
        api.get("https://countriesnow.space/api/v0.1/countries", {
          withCredentials: false,
        }),
      ]);

      // Process conference venues
      const venues = conferencesResponse.data
        .map((conf) => {
          if (conf.conference_venue) {
            const [city, country] = conf.conference_venue
              .split(",")
              .map((part) => part.trim());
            return { city, country };
          }
          return null;
        })
        .filter((venue) => venue !== null);

      // Extract unique conference titles
      const conferenceTitles = conferencesResponse.data
        .map((conf) => conf.conference_title)
        .filter((title) => title);

      // Process and cache the data
      filterCache.set({
        conferenceTitles,
        publicationNames: publicationsResponse.data,
        publicationFormats: pubFormatsResponse.data,
        countries: countriesResponse.data.data,
        venues,
        cities: venues.map((venue) => venue.city),
      });
    }

    return filterCache.get();
  } catch (error) {
    console.error("Error fetching filter data:", error);
    throw error;
  }
};
