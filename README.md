# Job Finder - React Native App

A modern, feature-rich job search application built with React Native and Expo. Find, save, and apply for jobs with an intuitive interface and powerful search and filtering capabilities.

## Features

### Core Functionality
- **Job Search** - Search jobs by title, company, location, or description with real-time suggestions
- **Advanced Filtering** - Filter by salary, location, job type, work model, seniority level, and category
- **Save Jobs** - Bookmark jobs for later review with confirmation dialogs
- **Apply for Jobs** - Submit applications with a comprehensive form (name, email, contact, reason)
- **Application Tracking** - Track all your job applications with persistent storage
- **Job Details** - View full job information with collapsible descriptions and HTML content rendering

### User Experience
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Search History** - Quick access to recent searches (max 5, persisted)
- **Pull to Refresh** - Update job listings on all screens
- **Persistent Data** - All saved jobs, applications, and search history persist across sessions
- **Safe Area Support** - Proper spacing on devices with notches and rounded corners
- **Confirmation Modals** - Prevent accidental deletion of saved jobs
- **Badge Indicators** - See count of saved and applied jobs at a glance
- **Unified Headers** - Consistent design across all screens with dynamic components

### Advanced Features
- **Smart Job Matching** - Uses stable identifiers (applicationLink or title+company) to persist jobs across API refreshes
- **Filter Persistence** - Applied filters work across all screens (Job Finder, Saved Jobs, Applied Jobs)
- **Read More/Less** - Collapsible job descriptions for better readability
- **HTML Stripping** - Clean display of job descriptions with proper formatting
- **Responsive Modals** - Filter and application modals with proper safe area handling

### Performance
- **Optimized Rendering** - Memoized components and useMemo for smooth scrolling
- **Efficient Lists** - FlatList optimization for large datasets
- **Smart Caching** - Jobs cached locally for faster loading and offline access
- **Stable Job IDs** - Handles API ID changes gracefully with fallback matching

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   cd midterm-project-react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Usage

### Searching for Jobs
1. Tap the search bar on the Job Finder screen
2. Type your search query (job title, company, location)
3. View real-time suggestions
4. Tap a suggestion or press enter to search

### Filtering Jobs
1. Tap the filter icon in the header
2. Set minimum salary, location, or job type
3. Apply filters to refine results

### Saving Jobs
1. Find a job you're interested in
2. Tap the "Save" button on the job card
3. Access saved jobs from the "Saved" tab

### Applying for Jobs
1. Tap "Apply" on any job card
2. Fill out the application form (name, email, contact, reason)
3. Submit your application
4. Track it in the "Applied" tab

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ApplicationForm.tsx      # Job application form with validation
│   ├── FilterModal.tsx          # Advanced filter modal with chips
│   ├── JobItem.tsx              # Job card component
│   ├── SearchBar.tsx            # Search input with suggestions
│   ├── ScreenHeader.tsx         # Unified header component
│   └── ThemeToggleButton.tsx    # Theme switcher button
├── contexts/           # React Context providers
│   ├── JobContext.tsx           # Job data and state management
│   └── ThemeContext.tsx         # Theme state management
├── navigation/         # Navigation configuration
│   ├── AppNavigator.tsx         # Tab navigator setup
│   └── JobStackNavigator.tsx    # Stack navigator for job screens
├── screens/           # Screen components
│   ├── AppliedJobsScreen.tsx    # Applied jobs with filtering
│   ├── JobDetailsScreen.tsx     # Detailed job view
│   ├── JobFinderScreen.tsx      # Main job search screen
│   └── SavedJobsScreen.tsx      # Saved jobs with filtering
├── styles/            # Theme and styling
│   ├── components/              # Component-specific styles
│   ├── globalStyles.ts          # Global style definitions
│   └── theme.ts                 # Theme colors and spacing
├── types/             # TypeScript type definitions
│   ├── Job.ts                   # Job interface
│   └── Navigation.ts            # Navigation types
├── constants/         # App constants and configuration
│   └── index.ts                 # API config and storage keys
├── utils/             # Utility functions
│   ├── api.ts                   # API client with retry logic
│   └── clearStorage.ts          # Storage management utilities
├── App.tsx            # Root component with SafeAreaProvider
└── index.ts           # Entry point
```

## Technologies

### Core
- **React Native** - Mobile app framework (v0.76.5)
- **Expo** - Development platform (SDK 52)
- **TypeScript** - Type safety (v5.9.2)

### Navigation & UI
- **React Navigation** - Bottom tabs and stack navigation (v7.x)
- **React Native Safe Area Context** - Safe area handling
- **Expo Vector Icons** - Icon library (Ionicons)

### State & Storage
- **React Context API** - Global state management
- **AsyncStorage** - Local data persistence
- **React Hooks** - useState, useEffect, useMemo, useCallback

### Development
- **Expo Router** - File-based routing
- **UUID** - Unique identifier generation

## Configuration

### API Configuration
Edit `src/constants/index.ts` to modify API settings:
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://empllo.com/api/v1',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

### App Configuration
Adjust app behavior in `src/constants/index.ts`:
```typescript
export const APP_CONFIG = {
  SEARCH_DEBOUNCE_MS: 300,
  MAX_SEARCH_HISTORY: 5,
  CACHE_EXPIRY_MS: 5 * 60 * 1000,
};
```

## Data Persistence

The app persists the following data using AsyncStorage:
- **Saved Jobs** - Full job objects bookmarked by the user
- **Applied Jobs** - Full job objects of applications submitted (not just IDs)
- **Search History** - Recent search queries (max 5)
- **Cached Jobs** - Latest job listings for offline access

### Storage Keys
```typescript
STORAGE_KEYS = {
  SAVED_JOBS: '@job_finder:saved_jobs',
  APPLIED_JOBS: '@job_finder:applied_jobs',
  SEARCH_HISTORY: '@job_finder:search_history',
  CACHED_JOBS: '@job_finder:cached_jobs',
}
```

### Smart Persistence
Jobs are matched using stable identifiers to handle API ID changes:
1. Primary: `applicationLink` (most stable)
2. Fallback: `title + company` combination

## Theming

The app supports dark and light themes. Toggle between them using the theme button in the header. Theme preference is managed via React Context.

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test -- --watch
```

## Future Enhancements

- [ ] Share job functionality (share via social media, email)
- [ ] Sort options (by salary, date posted, relevance)
- [ ] Application status tracking (pending, reviewed, rejected)
- [ ] Resume/CV upload and management
- [ ] Push notifications for new matching jobs
- [ ] Network state detection with NetInfo
- [ ] Unit and integration tests
- [ ] Job recommendations based on search history
- [ ] Company profiles and reviews
- [ ] Salary insights and trends

## Known Issues

- None currently! All major issues have been resolved:
  - ✅ Applied jobs now persist through refresh
  - ✅ Saved jobs now persist through refresh
  - ✅ Button states (Applied/Saved) maintain correctly
  - ✅ Filters work across all screens
  - ✅ Safe area handling on all devices
  - ✅ Consistent header styling across screens

## License

This project is licensed under the 0BSD License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the repository.