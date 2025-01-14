import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  IconButton,
  InputAdornment,
  Pagination,
  Slider,
  TextField,
  Typography,
  useMediaQuery,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import homeBg from "../assets/home_bg.png";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { Virtuoso } from "react-virtuoso";
import DummyKG from "../assets/dummy_kg_keyword.png";
import Modal from "@mui/material/Modal";
import { useModalContext } from "../context/modalcontext";
import AddPaperModal from "../components/addpapermodal";
import { useAuth } from "../context/AuthContext";
import { filterCache } from "../utils/filterCache";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderWithBackButton from "../components/Header";
import sdgGoalsData from "../data/sdgGoals.json";

// Debounce function to limit rapid state updates
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const buildKnowledgeGraph = (research) => {
  const graph = {
    nodes: new Map(),
    edges: new Map(),
    weights: new Map(),
  };

  research.forEach((paper) => {
    // Add paper node
    const paperId = `paper_${paper.research_id}`;
    graph.nodes.set(paperId, {
      type: "paper",
      data: paper,
      connections: new Set(),
    });

    // Add SDG nodes and edges
    if (paper.sdg) {
      paper.sdg.split(";").forEach((sdg) => {
        const sdgId = `sdg_${sdg.trim()}`;
        if (!graph.nodes.has(sdgId)) {
          graph.nodes.set(sdgId, {
            type: "sdg",
            data: { name: sdg.trim() },
            connections: new Set(),
          });
        }
        // Create bidirectional edges
        graph.nodes.get(paperId).connections.add(sdgId);
        graph.nodes.get(sdgId).connections.add(paperId);

        // Increment edge weight
        const edgeKey = [paperId, sdgId].sort().join("-");
        graph.weights.set(edgeKey, (graph.weights.get(edgeKey) || 0) + 1);
      });
    }

    // Add Research Area nodes and edges
    if (paper.research_areas) {
      paper.research_areas.forEach((area) => {
        const areaId = `area_${area.research_area_id}`;
        if (!graph.nodes.has(areaId)) {
          graph.nodes.set(areaId, {
            type: "area",
            data: area,
            connections: new Set(),
          });
        }
        // Create bidirectional edges
        graph.nodes.get(paperId).connections.add(areaId);
        graph.nodes.get(areaId).connections.add(paperId);

        // Increment edge weight
        const edgeKey = [paperId, areaId].sort().join("-");
        graph.weights.set(edgeKey, (graph.weights.get(edgeKey) || 0) + 1);
      });
    }
  });

  return graph;
};

const findRelatedPapers = (graph, paperId, maxDepth = 2) => {
  const visited = new Set();
  const related = new Map();

  const traverse = (currentId, depth) => {
    if (depth > maxDepth || visited.has(currentId)) return;
    visited.add(currentId);

    const node = graph.nodes.get(currentId);
    node.connections.forEach((connectedId) => {
      const connectedNode = graph.nodes.get(connectedId);

      if (connectedNode.type === "paper" && connectedId !== paperId) {
        const edgeKey = [currentId, connectedId].sort().join("-");
        const weight = graph.weights.get(edgeKey) || 0;
        related.set(connectedId, (related.get(connectedId) || 0) + weight);
      }

      traverse(connectedId, depth + 1);
    });
  };

  traverse(paperId, 0);
  return Array.from(related.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => graph.nodes.get(id).data);
};

const Collection2 = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)"); // Checks if the screen is 600px or smaller (mobile)
  const [userDepartment, setUserDepartment] = useState(null);
  const [research, setResearch] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([2010, 2025]); // Default min and max year
  const [sliderValue, setSliderValue] = useState([2010, 2025]); // Initial slider value
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [publicationFormats, setPublicationFormats] = useState([]);
  const [selectedResearchItem, setSelectedResearchItem] = useState(null);
  const [response, setReponse] = useState(null);
  const itemsPerPage = 5;
  const { isAddPaperModalOpen, openAddPaperModal, closeAddPaperModal } =
    useModalContext();
  const { user } = useAuth();
  const [otherSectionsVisible, setOtherSectionsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedColleges = useDebounce(selectedColleges, 300);
  const [researchAreas, setResearchAreas] = useState([]);
  const [researchAreaCounts, setResearchAreaCounts] = useState({});
  const [selectedSDG, setSelectedSDG] = useState(null);
  const [sdgAreaMapping, setSDGAreaMapping] = useState({});
  const [sdgCounts, setSDGCounts] = useState({});
  const [collegeColors, setCollegeColors] = useState({});
  const [knowledgeGraph, setKnowledgeGraph] = useState(null);
  const [relatedPapers, setRelatedPapers] = useState([]);
  const [selectedResearchArea, setSelectedResearchArea] = useState(null);

  const handleNavigateKnowledgeGraph = () => {
    navigate("/knowledgegraph");
  };

  // Fetch publication formats from the API
  useEffect(() => {
    const fetchPublicationFormats = async () => {
      try {
        const response = await axios.get("/paper/publication_format");
        setPublicationFormats(response.data.publication_formats);
      } catch (error) {
        console.error("Error fetching publication formats:", error);
      }
    };

    fetchPublicationFormats();
  }, []);

  const handleResearchItemClick = async (item) => {
    try {
      const currentTime = Date.now(); // Get the current timestamp
      const lastViewedTimeKey = `lastViewedTime_${item.research_id}`;
      const lastViewedTime = parseInt(
        localStorage.getItem(lastViewedTimeKey),
        10
      );
      const userId = localStorage.getItem("user_id");

      // Determine if increment is needed
      const isIncrement =
        !lastViewedTime || currentTime - lastViewedTime > 30000;

      // Update the view count in the backend
      const response = await axios.put(
        `/paper/increment_views/${item.research_id}?is_increment=${isIncrement}`,
        {
          user_id: userId,
        }
      );

      // Update the item with new data
      const updatedItem = {
        ...item,
        view_count: response.data.updated_views,
        download_count: response.data.download_count,
      };

      // Find related papers using the knowledge graph
      if (knowledgeGraph) {
        const paperId = `paper_${item.research_id}`;
        const related = findRelatedPapers(knowledgeGraph, paperId);
        setRelatedPapers(related);
      }

      navigate(`/displayresearchinfo/${updatedItem.research_id}`, {
        state: {
          id: updatedItem.research_id,
          relatedPapers: relatedPapers,
        },
      });

      // Save the current timestamp to localStorage if incremented
      if (isIncrement) {
        localStorage.setItem(lastViewedTimeKey, currentTime);
      }
    } catch (error) {
      console.error("Error handling research item click:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedResearchItem(null);
  };

  const getUserId = () => {
    const userId = localStorage.getItem("user_id");
    return userId;
  };
  const fetchUserData = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await axios.get(`/accounts/users/${userId}`);
        const data = response.data;
        setUserDepartment(data.researcher.college_id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchAllResearchData = async () => {
    try {
      const response = await axios.get(`/dataset/fetch_ordered_dataset`);
      const fetchedResearch = response.data.dataset;
      setResearch(fetchedResearch);
      setFilteredResearch(fetchedResearch);
    } catch (error) {
      console.error("Error fetching all research data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Only read from cache, don't fetch
        const cached = filterCache.get();
        if (cached) {
          console.log("[Collection] Using cached filter data");
          setColleges(cached.colleges);
          setPrograms(cached.programs);
          setAllPrograms(cached.programs);
        }

        // Fetch other data specific to collection page
        await fetchUserData();
        await fetchAllResearchData();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const cached = filterCache.get();
      if (cached) {
        // Get programs from selected colleges
        let filteredPrograms =
          debouncedColleges.length === 0
            ? cached.programs
            : cached.programs.filter((program) =>
                debouncedColleges.includes(String(program.college_id))
              );

        // Add any selected programs that aren't in the filtered list
        const selectedProgramObjects = cached.programs.filter((program) =>
          selectedPrograms.includes(program.program_name)
        );

        // Combine and remove duplicates
        filteredPrograms = [
          ...new Map(
            [...filteredPrograms, ...selectedProgramObjects].map((program) => [
              program.program_name,
              program,
            ])
          ).values(),
        ];

        setPrograms(filteredPrograms);
      }
    }
  }, [debouncedColleges, isLoading, selectedPrograms]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...research];

      // Apply SDG filter
      if (selectedSDG) {
        filtered = filtered.filter(
          (item) =>
            item.sdg &&
            item.sdg
              .split(";")
              .map((s) => s.trim())
              .includes(selectedSDG)
        );
      }

      // Apply research area filter
      if (selectedResearchArea) {
        filtered = filtered.filter(
          (item) =>
            item.research_areas &&
            item.research_areas.some(
              (area) => area.research_area_id === selectedResearchArea
            )
        );
      }

      // Handle college and program filtering
      if (selectedColleges.length > 0 || selectedPrograms.length > 0) {
        filtered = filtered.filter((item) => {
          // Check if item matches any selected program
          const matchesProgram =
            selectedPrograms.length > 0 &&
            selectedPrograms.includes(item.program_name);

          // Check if item's college is selected
          const matchesCollege =
            selectedColleges.length > 0 &&
            selectedColleges.includes(String(item.college_id));

          // Show items that either:
          // 1. Match any selected program (regardless of college), OR
          // 2. Belong to a selected college (if no program from that college is selected)
          return (
            matchesProgram ||
            (matchesCollege &&
              !selectedPrograms.some((prog) => {
                // Find the college of this selected program
                const programCollege = programs.find(
                  (p) => p.program_name === prog
                )?.college_id;
                // Only apply college filter if no program from this college is selected
                return String(programCollege) === String(item.college_id);
              }))
          );
        });
      }

      // Apply remaining filters
      if (sliderValue[0] !== dateRange[0] || sliderValue[1] !== dateRange[1]) {
        filtered = filtered.filter(
          (item) => item.year >= sliderValue[0] && item.year <= sliderValue[1]
        );
      }

      if (selectedFormats.length > 0) {
        filtered = filtered.filter((item) =>
          selectedFormats.some(
            (format) => format.toLowerCase() === item.journal.toLowerCase()
          )
        );
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((item) => {
          const titleMatch = item.title.toLowerCase().includes(query);
          const authorMatch = item.authors.some(
            (author) =>
              author.name.toLowerCase().includes(query) ||
              author.email.toLowerCase().includes(query)
          );
          return titleMatch || authorMatch;
        });
      }

      setFilteredResearch(filtered);
      setCurrentPage(1);
    };

    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [
    research,
    selectedColleges,
    selectedPrograms,
    programs,
    sliderValue,
    selectedFormats,
    searchQuery,
    dateRange,
    selectedSDG,
    selectedResearchArea,
  ]);

  // Handle change in search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to fetch the year range dynamically
  useEffect(() => {
    async function fetchDateRange() {
      try {
        const response = await axios.get("/dataset/fetch_date_range"); // API endpoint
        const { min_year, max_year } = response.data.date_range;

        // Update the date range and initialize the slider values
        setDateRange([min_year, max_year]);
        setSliderValue([min_year, max_year]);
      } catch (error) {
        console.error("Failed to fetch date range:", error);
      }
    }

    fetchDateRange();
  }, []);

  // Handle change in date range filter
  const handleDateRangeChange = (event, newValue) => {
    setSliderValue(newValue);
  };
  const handleCollegeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColleges((prev) => {
      const newSelection = checked
        ? [...prev, value]
        : prev.filter((item) => item !== value);
      return newSelection;
    });
  };
  // Handle change in selected programs filter
  const handleProgramChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPrograms((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Handle change in selected formats filter
  const handleFormatChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFormats((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Get the paginated research outputs
  const paginatedResearch = filteredResearch.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewManuscript = async (researchItem) => {
    const { research_id } = researchItem;
    if (research_id) {
      try {
        // Make the API request to get the PDF as a Blob
        const response = await axios.get(
          `/paper/view_manuscript/${research_id}`,
          {
            responseType: "blob",
          }
        );

        // Create a URL for the Blob and open it in a new tab
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");

        // Increment the download count after successfully displaying the Blob
        const userId = localStorage.getItem("user_id");
        const incrementResponse = await axios.put(
          `/paper/increment_downloads/${research_id}`,
          {
            user_id: userId,
          }
        );

        // Update the download count in the researchItem object
        const updatedItem = {
          ...researchItem,
          download_count: incrementResponse.data.updated_downloads,
        };
        setSelectedResearchItem(updatedItem);
      } catch (error) {
        console.error("Error handling manuscript:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          item: researchItem,
        });
        alert("Failed to retrieve the manuscript. Please try again.");
      }
    } else {
      alert("No manuscript available for this research.");
    }
  };

  useEffect(() => {
    // If the screen is mobile, hide the other sections
    setOtherSectionsVisible(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cached = filterCache.get();
        // Properly set research areas from cache
        if (cached.researchAreas) {
          setResearchAreas(cached.researchAreas);
        }

        const researchResponse = await axios.get("/dataset/fetch_dataset");
        const papers = researchResponse.data.dataset;

        const sdgMapping = {};
        const sdgPaperCounts = {};
        const areaCountsBySDG = {};
        const collegeSDGCounts = {};
        const totalCollegePapers = {};

        // Initialize counts
        cached.colleges.forEach((college) => {
          collegeSDGCounts[college.college_id] = {};
          totalCollegePapers[college.college_id] = 0;
        });

        papers.forEach((paper) => {
          const collegeId = paper.college_id;
          totalCollegePapers[collegeId]++;

          if (paper.sdg && paper.sdg !== "Not Specified") {
            const sdgs = paper.sdg.split(";").map((s) => s.trim());
            sdgs.forEach((sdg) => {
              if (!sdgMapping[sdg]) {
                sdgMapping[sdg] = new Set();
                areaCountsBySDG[sdg] = {};
                sdgPaperCounts[sdg] = 0;
              }

              sdgPaperCounts[sdg]++;
              collegeSDGCounts[collegeId][sdg] =
                (collegeSDGCounts[collegeId][sdg] || 0) + 1;

              if (paper.research_areas) {
                paper.research_areas.forEach((area) => {
                  sdgMapping[sdg].add(area.research_area_id);
                  areaCountsBySDG[sdg][area.research_area_id] =
                    (areaCountsBySDG[sdg][area.research_area_id] || 0) + 1;
                });
              }
            });
          }
        });

        console.log("Research Areas from cache:", cached.researchAreas); // Debug log
        console.log("SDG Mapping:", sdgMapping); // Debug log

        // Calculate colors
        const sdgColors = {};
        Object.keys(sdgMapping).forEach((sdg) => {
          let maxConcentration = 0;
          let dominantCollege = null;

          cached.colleges.forEach((college) => {
            const sdgCount = collegeSDGCounts[college.college_id][sdg] || 0;
            const totalPapers = totalCollegePapers[college.college_id];
            const concentration = totalPapers > 0 ? sdgCount / totalPapers : 0;

            if (concentration > maxConcentration) {
              maxConcentration = concentration;
              dominantCollege = college;
            }
          });

          sdgColors[sdg] = dominantCollege
            ? dominantCollege.color_code
            : "#F17B7B";
        });

        setCollegeColors(sdgColors);
        setSDGAreaMapping(sdgMapping);
        setSDGCounts(sdgPaperCounts);
        setResearchAreaCounts(areaCountsBySDG);
        setResearchAreas(cached.researchAreas); // Make sure to set research areas
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSDGClick = (sdg) => {
    // If clicking the same SDG, clear the filter
    if (selectedSDG === sdg) {
      setSelectedSDG(null);
      setSelectedResearchArea(null); // Clear research area when clearing SDG
      setFilteredResearch(research);
    } else {
      setSelectedSDG(sdg);
      setSelectedResearchArea(null); // Clear research area when selecting new SDG

      // Filter research papers by the selected SDG
      const filtered = research.filter(
        (paper) =>
          paper.sdg &&
          paper.sdg
            .split(";")
            .map((s) => s.trim())
            .includes(sdg)
      );
      setFilteredResearch(filtered);
    }
  };

  const handleFieldClick = (areaId) => {
    // If clicking the same area, clear the filter
    if (selectedResearchArea === areaId) {
      setSelectedResearchArea(null);
      // If there's a selected SDG, reapply its filter, otherwise show all
      if (selectedSDG) {
        const filtered = research.filter(
          (paper) =>
            paper.sdg &&
            paper.sdg
              .split(";")
              .map((s) => s.trim())
              .includes(selectedSDG)
        );
        setFilteredResearch(filtered);
      } else {
        setFilteredResearch(research);
      }
    } else {
      setSelectedResearchArea(areaId);

      // Filter papers by both selected SDG (if any) and research area
      let filtered = research;
      if (selectedSDG) {
        filtered = filtered.filter(
          (paper) =>
            paper.sdg &&
            paper.sdg
              .split(";")
              .map((s) => s.trim())
              .includes(selectedSDG)
        );
      }
      filtered = filtered.filter(
        (paper) =>
          paper.research_areas &&
          paper.research_areas.some((area) => area.research_area_id === areaId)
      );
      setFilteredResearch(filtered);
    }
  };

  useEffect(() => {
    const initializeKnowledgeGraph = async () => {
      try {
        const response = await axios.get(`/dataset/fetch_ordered_dataset`);
        const fetchedResearch = response.data.dataset;
        const graph = buildKnowledgeGraph(fetchedResearch);
        setKnowledgeGraph(graph);
        setResearch(fetchedResearch);
        setFilteredResearch(fetchedResearch);
      } catch (error) {
        console.error("Error initializing knowledge graph:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeKnowledgeGraph();
  }, []);

  const renderRelatedPapers = (currentPaper) => {
    if (!knowledgeGraph) return null;

    const paperId = `paper_${currentPaper.research_id}`;
    const related = findRelatedPapers(knowledgeGraph, paperId, 1).slice(0, 3);

    return related.length > 0 ? (
      <Box sx={{ mt: 1 }} onClick={(e) => e.stopPropagation()}>
        <Typography variant='caption' sx={{ color: "#666" }}>
          Related Papers:
        </Typography>
        {related.map((paper) => (
          <Typography
            key={paper.research_id}
            variant='caption'
            sx={{
              display: "block",
              color: "#0A438F",
              cursor: "pointer",
              width: "fit-content",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleResearchItemClick(paper);
            }}
          >
            {paper.title}
          </Typography>
        ))}
      </Box>
    ) : null;
  };

  // Update the research areas section title and back navigation
  const renderSidebarTitle = () => {
    if (selectedSDG) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton
            onClick={() => {
              setSelectedSDG(null);
              setSelectedResearchArea(null);
              setFilteredResearch(research);
            }}
            sx={{ mr: 1 }}
          >
            <ArrowBackIosIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
          <Typography
            variant='h6'
            sx={{
              color: "#666",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Research Areas in {selectedSDG}
          </Typography>
        </Box>
      );
    }
    return (
      <Typography
        variant='h6'
        sx={{
          color: "#666",
          fontSize: "1rem",
          fontWeight: 500,
          mb: 1,
        }}
      >
        Browse by SDG
      </Typography>
    );
  };

  // Update the sidebar content section
  const renderSidebarContent = () => {
    const contentBox = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "calc(100vh - 300px)",
          overflowY: "auto",
          padding: "0.5rem",
          paddingTop: selectedSDG || selectedResearchArea ? "0.5rem" : "0.5rem", // Reduced padding
          marginTop: "0", // Remove margin
        }}
      >
        {selectedSDG
          ? // Research areas content
            Array.from(sdgAreaMapping[selectedSDG] || [])
              .map((areaId) =>
                researchAreas.find((a) => String(a.id) === String(areaId))
              )
              .filter((area) => area)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((area, index) => (
                <Box
                  key={area.id}
                  onClick={() => handleFieldClick(area.id)}
                  sx={{
                    backgroundColor:
                      selectedResearchArea === area.id
                        ? "#d45d5d"
                        : index % 2 === 0
                        ? "#F17B7B"
                        : "#F1A77B",
                    borderRadius: 2,
                    padding: 2,
                    cursor: "pointer",
                    transition: "transform 0.2s, background-color 0.2s",
                    transform:
                      selectedResearchArea === area.id ? "scale(1.02)" : "none",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {area.name}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{ color: "white", opacity: 0.9 }}
                  >
                    {researchAreaCounts[selectedSDG]?.[area.id] || 0} papers
                  </Typography>
                </Box>
              ))
          : // SDG list content
            sdgGoalsData.sdgGoals.map((sdg) => (
              <Box
                key={sdg.id}
                onClick={() => handleSDGClick(sdg.id)}
                sx={{
                  backgroundColor: collegeColors[sdg.id] || "#F17B7B",
                  borderRadius: 2,
                  padding: 2,
                  cursor: "pointer",
                  transition: "transform 0.2s, background-color 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography variant='subtitle2' sx={{ color: "white" }}>
                  {sdg.id}
                </Typography>
                <Typography
                  variant='subtitle1'
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {sdg.title}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: "white", opacity: 0.9 }}
                >
                  {sdgCounts[sdg.id] || 0} papers
                </Typography>
              </Box>
            ))}
      </Box>
    );

    return (
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "white",
            py: 1, // Reduced padding
            borderBottom:
              selectedSDG || selectedResearchArea ? "1px solid #eee" : "none",
          }}
        >
          {activeFiltersSection}
        </Box>
        {contentBox}
      </Box>
    );
  };

  // Update the active filters section
  const activeFiltersSection = (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        alignItems: "center",
        py: 1, // Reduced padding
      }}
    >
      {(selectedSDG || selectedResearchArea) && (
        <Typography variant='body2' sx={{ color: "#666", mr: 1 }}>
          Active filters:
        </Typography>
      )}
      {selectedSDG && (
        <Chip
          label={`${selectedSDG}`}
          onDelete={() => handleSDGClick(selectedSDG)}
          sx={{ backgroundColor: "#0A438F", color: "white" }}
        />
      )}
      {selectedResearchArea && (
        <Chip
          label={`${
            researchAreas.find((a) => a.id === selectedResearchArea)?.name
          }`}
          onDelete={() => handleFieldClick(selectedResearchArea)}
          sx={{ backgroundColor: "#F17B7B", color: "white" }}
        />
      )}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: { xs: "3.5rem", sm: "4rem", md: "5rem" },
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton
            title='Collections2'
            onBack={() => navigate(-1)}
          />

          {/* Main content area */}
          <Box
            sx={{
              flex: 1,
              padding: 3,
              overflow: "hidden",
              height: "calc(100% - 48px)",
            }}
          >
            <Grid2
              container
              spacing={4}
              sx={{
                height: "100%",
                flexWrap: "nowrap",
              }}
            >
              {/* Filters Section */}
              {!isMobile && (
                <Grid2 size={3}>
                  <Box
                    sx={{
                      border: "1px solid #0A438F",
                      height: "100%",
                      borderRadius: 3,
                      padding: 3,
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ mb: 2, fontWeight: "bold", color: "#F40824" }}
                    >
                      Filters
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant='body1'
                        sx={{
                          mb: 2,
                          color: "#08397C",
                          position: "relative",
                          zIndex: 2,
                          fontSize: {
                            xs: "0.5rem",
                            md: "0.5rem",
                            lg: "0.9rem",
                          },
                        }}
                      >
                        Year Range:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "100%",
                          mt: 4,
                        }}
                      >
                        <Slider
                          value={sliderValue}
                          onChange={handleDateRangeChange}
                          valueLabelDisplay='on'
                          min={dateRange[0]}
                          max={dateRange[1]}
                          sx={{
                            width: "90%",
                            "& .MuiSlider-valueLabel": {
                              backgroundColor: "#08397C",
                            },
                            "& .MuiSlider-rail": {
                              backgroundColor: "#ccc",
                            },
                            "& .MuiSlider-track": {
                              backgroundColor: "#08397C",
                            },
                            "& .MuiSlider-thumb": {
                              backgroundColor: "#08397C",
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          sx={{
                            color: "#08397C",
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.5rem",
                              lg: "0.9rem",
                            },
                          }}
                        >
                          College
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
                          {colleges.map((college) => (
                            <FormControlLabel
                              key={college.college_id}
                              control={
                                <Checkbox
                                  checked={selectedColleges.includes(
                                    college.college_id
                                  )}
                                  onChange={handleCollegeChange}
                                  value={college.college_id}
                                />
                              }
                              label={college.college_name}
                              sx={{
                                "& .MuiTypography-root": {
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.75rem",
                                    lg: "0.9rem",
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          sx={{
                            color: "#08397C",
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.5rem",
                              lg: "0.9rem",
                            },
                          }}
                        >
                          Program
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
                          {programs.map((program) => (
                            <FormControlLabel
                              key={program.program_id}
                              control={
                                <Checkbox
                                  checked={selectedPrograms.includes(
                                    program.program_name
                                  )}
                                  onChange={handleProgramChange}
                                  value={program.program_name}
                                />
                              }
                              label={program.program_name}
                              sx={{
                                "& .MuiTypography-root": {
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.75rem",
                                    lg: "0.9rem",
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          sx={{
                            color: "#08397C",
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.5rem",
                              lg: "0.9rem",
                            },
                          }}
                        >
                          Publication Format
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
                          {publicationFormats.map((format) => (
                            <FormControlLabel
                              key={format.id}
                              control={
                                <Checkbox
                                  checked={selectedFormats.includes(
                                    format.name
                                  )}
                                  onChange={handleFormatChange}
                                  value={format.name}
                                />
                              }
                              label={format.name}
                              sx={{
                                "& .MuiTypography-root": {
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.75rem",
                                    lg: "0.9rem",
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Grid2>
              )}

              {/* Research List Section */}
              <Grid2 size={otherSectionsVisible ? 6 : 12}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <TextField
                        variant='outlined'
                        placeholder='Search by Title or Authors'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ flex: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                      {!isMobile && user?.role === "05" && (
                        <Button
                          variant='contained'
                          color='primary'
                          sx={{
                            backgroundColor: "#08397C",
                            color: "#FFF",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: { xs: "0.875rem", md: "1rem" },
                            padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                            marginLeft: "2rem",
                            borderRadius: "100px",
                            maxHeight: "3rem",
                            "&:hover": {
                              backgroundColor: "#072d61",
                            },
                          }}
                          onClick={openAddPaperModal}
                        >
                          + Add New Paper
                        </Button>
                      )}
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        backgroundColor: "#F7F9FC",
                        borderRadius: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ flex: 1, overflow: "hidden" }}>
                        {loading ? (
                          <Typography>Loading...</Typography>
                        ) : (
                          <Virtuoso
                            style={{ height: "100%" }}
                            data={paginatedResearch}
                            itemContent={(index, researchItem) => (
                              <Box
                                key={researchItem.research_id}
                                sx={{
                                  p: 3,
                                  cursor: "pointer",
                                  minHeight: "calc((100% - 48px) / 5)",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                }}
                                onClick={() =>
                                  handleResearchItemClick(researchItem)
                                }
                              >
                                <Typography
                                  variant='h6'
                                  sx={{
                                    mb: 1,
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.75rem",
                                      lg: "1rem",
                                    },
                                    fontWeight: 500,
                                  }}
                                >
                                  {researchItem.title}
                                </Typography>
                                <Typography
                                  variant='body2'
                                  sx={{
                                    mb: 0.5,
                                    color: "#666",
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.5rem",
                                      lg: "0.75rem",
                                    },
                                  }}
                                >
                                  {researchItem.program_name} |{" "}
                                  {researchItem.authors
                                    .map((author) => author.name)
                                    .join("; ")}{" "}
                                  | {researchItem.year}
                                </Typography>
                                <Typography
                                  variant='caption'
                                  sx={{
                                    color: "#0A438F",
                                    fontWeight: 500,
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.5rem",
                                      lg: "0.75rem",
                                    },
                                  }}
                                >
                                  {researchItem.journal}
                                </Typography>
                                {renderRelatedPapers(researchItem)}
                              </Box>
                            )}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 1,
                          backgroundColor: "#fff",
                          borderTop: "1px solid #eee",
                        }}
                      >
                        <Pagination
                          count={Math.ceil(
                            filteredResearch.length / itemsPerPage
                          )}
                          page={currentPage}
                          onChange={handleChangePage}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid2>

              {/* Research Areas Section */}
              <Grid2
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginBottom: "1rem",
                }}
              >
                {renderSidebarTitle()}
                {renderSidebarContent()}
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Box>
      <AddPaperModal
        isOpen={isAddPaperModalOpen}
        handleClose={closeAddPaperModal}
        onPaperAdded={fetchAllResearchData}
      />
    </>
  );
};

export default Collection2;
