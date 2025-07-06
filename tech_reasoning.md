##### **Tech Stack I Used**

###### **Frontend Framework**

* React 18 with Hooks (useState, useEffect)



###### **Styling**

* Vanilla CSS3 with CSS Custom Properties
* CSS Grid \& Flexbox for layouts
* Media Queries for responsive design



###### **Language**

* ES6+ JavaScript



###### **Data Storage**

* localStorage (browser-based persistence)



###### **Build Tools**

* Create React App (Webpack + Babel bundled)



###### **File Organization**

* Component-scoped CSS files
* Modular JavaScript components





##### **Why I Picked This Stack**



I chose React because task management apps are all about real-time interactions:

1. State updates when marking tasks complete
2. Dynamic filtering and sorting
3. Form handling for adding/editing tasks
4. Component reusability - same TaskList used in different views

React's hooks made state management clean and simple without needing Redux for this scope.



I went with plain CSS instead of CSS-in-JS or frameworks because:

1. Zero runtime overhead - faster than styled-components
2. Full control over styling without learning new syntax
3. CSS Custom Properties gave me a design system (--z-modal, --header-height)
4. Native responsive design with media queries
5. No build complexity - works directly in browsers
6. localStorage - Rapid Prototyping



For this assessment, localStorage was perfect because:



1. No backend setup required - focus on frontend features
2. Instant persistence - data survives page refreshes
3. Zero latency - immediate read/write operations
4. Offline-first - works without internet
5. Perfect for MVP - validates core functionality quickly
6. Create React App - Speed \& Simplicity



I used CRA because:



1. Zero configuration - up and running in minutes
2. Hot reloading - instant feedback during development
3. Modern tooling - Webpack, Babel, ESLint pre-configured
4. Focus on features - not build setup



###### **Component-Scoped CSS - Organization**

I kept CSS files next to components because:

* Clear ownership - Dashboard.css belongs to Dashboard.js
* Easy maintenance - find styles quickly
* No naming conflicts - each component has its own styles
* Scalable structure - easy to add new components



###### **Bottom Line**

This stack let me build a fully functional task manager in the shortest time while demonstrating modern frontend skills. Every choice prioritized speed of development and feature completeness over complexity.





###### **Data Schema:**

**Storage Structure:**



**'''**

// localStorage key: "smart-tasks"

// Value: JSON Array of Task objects



\[

&nbsp; {

&nbsp;   id: "string",           // Unique identifier (timestamp-based)

&nbsp;   title: "string",        // Task title (required)

&nbsp;   description: "string",  // Optional description

&nbsp;   category: "string",     // Work|Personal|Learning|Health|Finance

&nbsp;   priority: "string",     // low|medium|high

&nbsp;   deadline: "string",     // ISO datetime string (optional)

&nbsp;   completed: "boolean",   // Completion status

&nbsp;   createdAt: "string"     // ISO timestamp of creation

&nbsp; }

]

'''

