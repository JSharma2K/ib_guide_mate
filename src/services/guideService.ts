export interface SubjectGuide {
  id: string;
  subjectName: string;
  group: string;
  description: string;
  topics: string[];
  assessment: string;
  content: string;
  lastUpdated: string;
  pdfUrl?: string;
}

// In-memory storage
let guides: SubjectGuide[] = [];

export const guideService = {
  // Get all guides
  async getAllGuides(): Promise<SubjectGuide[]> {
    return guides;
  },

  // Get a single guide by ID
  async getGuideById(id: string): Promise<SubjectGuide | null> {
    return guides.find(guide => guide.id === id) || null;
  },

  // Add a new guide
  async addGuide(guide: Omit<SubjectGuide, 'id' | 'lastUpdated'>): Promise<boolean> {
    try {
      const newGuide: SubjectGuide = {
        ...guide,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      };
      guides.push(newGuide);
      return true;
    } catch (error) {
      console.error('Error adding guide:', error);
      return false;
    }
  },

  // Update an existing guide
  async updateGuide(id: string, guide: Partial<SubjectGuide>): Promise<boolean> {
    try {
      const index = guides.findIndex(g => g.id === id);
      if (index === -1) return false;
      
      guides[index] = {
        ...guides[index],
        ...guide,
        lastUpdated: new Date().toISOString()
      };
      return true;
    } catch (error) {
      console.error('Error updating guide:', error);
      return false;
    }
  },

  // Delete a guide
  async deleteGuide(id: string): Promise<boolean> {
    try {
      const index = guides.findIndex(g => g.id === id);
      if (index === -1) return false;
      
      guides.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error deleting guide:', error);
      return false;
    }
  },

  // Search guides
  async searchGuides(queryText: string): Promise<SubjectGuide[]> {
    const searchTerm = queryText.toLowerCase();
    return guides.filter(guide => 
      guide.subjectName.toLowerCase().includes(searchTerm) ||
      guide.description.toLowerCase().includes(searchTerm) ||
      guide.topics.some(topic => topic.toLowerCase().includes(searchTerm))
    );
  }
}; 