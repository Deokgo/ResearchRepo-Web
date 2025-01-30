import axios from 'axios';

class FilterCache {
  constructor() {
    this.cache = {
      expiryTime: null,
      conferenceTitles: [],
      countries: [],
      cities: [],
      publicationNames: [],
      publicationFormats: []
    };
    this.CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds
  }

  isExpired() {
    return !this.cache.expiryTime || Date.now() > this.cache.expiryTime;
  }

  set(data) {
    this.cache = {
      ...data,
      expiryTime: Date.now() + this.CACHE_DURATION
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
      publicationFormats: []
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
        countriesResponse
      ] = await Promise.all([
        axios.get('/track/fetch_data/conference'),
        axios.get('/track/data_fetcher/publications/publication_name'),
        axios.get('/track/fetch_data/pub_format'),
        axios.get('https://countriesnow.space/api/v0.1/countries', { withCredentials: false })
      ]);

      // Process conference venues
      const venues = conferencesResponse.data
        .map((conf) => {
          if (conf.conference_venue) {
            const [city, country] = conf.conference_venue
              .split(',')
              .map(part => part.trim());
            return { city, country };
          }
          return null;
        })
        .filter(venue => venue !== null);

      // Extract unique conference titles
      const conferenceTitles = conferencesResponse.data
        .map(conf => conf.conference_title)
        .filter(title => title);

      // Process and cache the data
      filterCache.set({
        conferenceTitles,
        publicationNames: publicationsResponse.data,
        publicationFormats: pubFormatsResponse.data,
        countries: countriesResponse.data.data,
        venues,
        cities: venues.map(venue => venue.city)
      });
    }

    return filterCache.get();
  } catch (error) {
    console.error('Error fetching filter data:', error);
    throw error;
  }
};

// Function to get cities for a specific country
export const getCitiesForCountry = (country) => {
  const cached = filterCache.get();
  if (!cached) return [];

  const countryData = cached.countries.find(c => c.country === country);
  const venueData = cached.venues.filter(v => v.country === country);
  
  if (!countryData) return [];

  // Return only cities that exist in both the API data and venue data
  return countryData.cities.filter(city => 
    venueData.some(venue => venue.city === city)
  );
};

// Function to search countries
export const searchCountries = (searchText) => {
  const cached = filterCache.get();
  if (!cached || !searchText) return [];

  const normalizedSearch = searchText.toLowerCase();
  return cached.countries
    .filter(c => c.country.toLowerCase().includes(normalizedSearch))
    .map(c => c.country);
};

// Function to search cities within a country
export const searchCities = (country, searchText) => {
  const cached = filterCache.get();
  if (!cached || !country || !searchText) return [];

  const normalizedSearch = searchText.toLowerCase();
  const countryData = cached.countries.find(c => c.country === country);
  
  if (!countryData) return [];

  return countryData.cities.filter(city => 
    city.toLowerCase().includes(normalizedSearch)
  );
};