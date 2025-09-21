# Local Development Guide

This guide will walk you through setting up and running this React dashboard project on your local machine.

---

## Prerequisites

Before you begin, ensure you have Node.js installed on your computer. Installing Node.js will also automatically install `npm` (Node Package Manager), which is required to manage project dependencies.

You can verify your installation by opening your terminal or command prompt and running:

```
node -v  
npm -v
```
---

## Dependencies

Your project uses a few external libraries for charting and state management. Install them by running:

`npm install recharts zustand`

- `recharts`: The library used to create charts in your widgets.  
- `zustand`: A simple state management library used in your `WidgetCard.jsx` component.

---

## Clone the Repository

Clone the project repository to your local machine:

`git clone https://github.com/kanishka-commits/AccuKnox-DashBoard.git`

Navigate into the project directory:

`cd AccuKnox-DashBoard`

Install all required packages:

`npm install`

---

## Run the Development Server

Start the development server by running:

`npm run dev`

Your terminal will display a local URL, usually:

`http://localhost:5173`

Open this URL in your browser to see your responsive dashboard application. Any changes made to the source code will automatically update in the browser.

---

## Troubleshooting

- **Port already in use:** Run the dev server on a different port:

`npm run dev -- --port 3000`

- **Missing dependencies:** Delete `node_modules` and reinstall:

```
rm -rf node_modules
npm install
```

- **Dev server fails to start:** Ensure Node.js and npm are correctly installed and try running `npm install` again.

---

## Congratulations

Your local React dashboard is now running and ready for development!
