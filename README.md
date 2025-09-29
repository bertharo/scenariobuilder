# Scenario Builder - Long Range Planning

A comprehensive Long Range Planning product with an advanced scenario builder, built with React, TypeScript, and integrated with Google Apps Script.

## Features

### 🎯 Core Functionality
- **Scenario Builder**: Create, edit, and manage multiple scenarios with variables and time series data
- **Variable Management**: Define and organize variables with different types (currency, percentage, boolean, etc.)
- **Projections**: Generate projections from scenarios with customizable time horizons
- **Scenario Comparison**: Compare multiple scenarios side by side
- **Google Sheets Integration**: Sync data with Google Sheets using Apps Script

### 📊 Advanced Features
- **Time Series Data**: Support for multi-year projections with confidence levels
- **Key Driver Variables**: Mark important variables that drive scenario outcomes
- **Dependencies**: Define relationships between variables
- **Formulas**: Support for calculated variables using mathematical expressions
- **Sensitivity Analysis**: Optimistic and pessimistic value ranges
- **Tagging System**: Organize scenarios with custom tags
- **Base Case Scenarios**: Mark primary scenarios for comparison

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Interactive Modals**: Intuitive forms for creating and editing scenarios
- **Search & Filtering**: Find scenarios and variables quickly
- **Dashboard**: Overview of workspace statistics and recent activity
- **Settings**: Configure workspace preferences and integrations

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Google account (for Sheets integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scenario-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Google Sheets Integration Setup

1. **Create a Google Spreadsheet**
   - Create a new Google Spreadsheet
   - Note the Spreadsheet ID from the URL

2. **Deploy Google Apps Script**
   - Go to [Google Apps Script](https://script.google.com)
   - Create a new project
   - Copy the code from `src/services/googleSheets.ts` (GOOGLE_APPS_SCRIPT_CODE)
   - Deploy as a web app with execute permissions for "Anyone"

3. **Configure Integration**
   - Go to Settings in the app
   - Enter your Spreadsheet ID, Sheet Name, and Apps Script URL
   - Save the configuration

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── ScenarioCard.tsx
│   ├── ScenarioModal.tsx
│   ├── VariableCard.tsx
│   ├── VariableModal.tsx
│   ├── ProjectionCard.tsx
│   ├── ProjectionModal.tsx
│   ├── ComparisonCard.tsx
│   └── ComparisonModal.tsx
├── contexts/           # React contexts
│   └── WorkspaceContext.tsx
├── pages/             # Main application pages
│   ├── Dashboard.tsx
│   ├── ScenarioBuilder.tsx
│   ├── Variables.tsx
│   ├── Projections.tsx
│   ├── Comparisons.tsx
│   └── Settings.tsx
├── services/          # External service integrations
│   └── googleSheets.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   ├── calculations.ts
│   └── cn.ts
└── App.tsx           # Main application component
```

## Usage

### Creating Scenarios

1. **Navigate to Scenarios**
   - Click on "Scenarios" in the sidebar
   - Click "New Scenario" button

2. **Define Scenario Details**
   - Enter scenario name and description
   - Set status (Draft, Active, Archived)
   - Add tags for organization
   - Mark as base case if needed

3. **Add Variables**
   - Select variables from your variable library
   - Define time series values for each year
   - Set assumptions and sensitivity ranges

4. **Save Scenario**
   - Click "Create Scenario" to save

### Managing Variables

1. **Navigate to Variables**
   - Click on "Variables" in the sidebar
   - Click "New Variable" button

2. **Define Variable Properties**
   - Enter variable name and description
   - Select type (Number, Percentage, Currency, Boolean, Text)
   - Set category and unit
   - Mark as key driver if important
   - Add dependencies on other variables
   - Define formula for calculated variables

3. **Save Variable**
   - Click "Create Variable" to save

### Creating Projections

1. **Navigate to Projections**
   - Click on "Projections" in the sidebar
   - Click "New Projection" button

2. **Configure Projection**
   - Enter projection name and description
   - Select scenarios to include
   - Choose metrics (variables) to project
   - Set time horizon (start and end years)

3. **Generate Projection**
   - Click "Create Projection" to save
   - Use "Run" button to generate results

### Comparing Scenarios

1. **Navigate to Comparisons**
   - Click on "Comparisons" in the sidebar
   - Click "New Comparison" button

2. **Select Scenarios and Metrics**
   - Choose scenarios to compare
   - Select metrics to analyze
   - Enter comparison name

3. **View Analysis**
   - Click "View" to see comparison results
   - Export data if needed

## Data Models

### Scenario
```typescript
interface Scenario {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  variables: ScenarioVariable[];
  tags: string[];
  isBaseCase: boolean;
  parentScenarioId?: string;
}
```

### Variable
```typescript
interface Variable {
  id: string;
  name: string;
  description?: string;
  type: 'number' | 'percentage' | 'currency' | 'boolean' | 'text';
  unit?: string;
  category: string;
  isKeyDriver: boolean;
  dependencies?: string[];
  formula?: string;
}
```

### TimeSeries
```typescript
interface TimeSeries {
  year: number;
  value: number;
  confidence?: 'low' | 'medium' | 'high';
  notes?: string;
}
```

## Google Apps Script Integration

The application includes a complete Google Apps Script implementation for data persistence:

- **Automatic Sync**: Sync scenarios and variables with Google Sheets
- **Real-time Updates**: Changes are reflected immediately
- **Data Backup**: All data is stored in your Google Drive
- **Collaboration**: Share spreadsheets with team members

### Apps Script Functions

- `loadScenarios()`: Load scenarios from Google Sheets
- `saveScenario()`: Save scenario to Google Sheets
- `loadVariables()`: Load variables from Google Sheets
- `saveVariables()`: Save variables to Google Sheets
- `exportWorkspace()`: Export entire workspace to Google Sheets
- `syncWorkspace()`: Sync workspace from Google Sheets

## Customization

### Adding New Variable Types

1. Update the `Variable` type in `src/types/index.ts`
2. Add type options in `VariableModal.tsx`
3. Update type icons in `VariableCard.tsx`
4. Add type-specific validation in `calculations.ts`

### Adding New Chart Types

1. Install chart library (e.g., Chart.js, D3.js)
2. Create chart components in `src/components/charts/`
3. Integrate charts in projection and comparison views
4. Add chart configuration options

### Customizing Calculations

1. Add new calculation functions in `src/utils/calculations.ts`
2. Update variable formulas to support new functions
3. Add validation for formula syntax
4. Test calculations with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## Roadmap

- [ ] Advanced visualization with charts and graphs
- [ ] Monte Carlo simulation capabilities
- [ ] Scenario optimization algorithms
- [ ] Real-time collaboration features
- [ ] Advanced export formats (PDF, Excel)
- [ ] API for external integrations
- [ ] Mobile application
- [ ] Advanced analytics and reporting
