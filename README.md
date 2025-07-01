# ResearchRepo-Web

ResearchRepo-Web is a web application designed to manage, track, and share research projects and papers within an academic or institutional environment. It provides an organized repository for research outputs, user account management, research tracking, audit logging, and administrative operations such as backups and account archiving.

## Features

- **Research Repository:** Upload, store, filter, and search research papers and related data by college, program, date, format, keywords, and SDGs.
- **User Management:** Manage user accounts, roles, and permissions. Archive inactive accounts after 2 years, with the ability to restore from SQL backup.
- **Research Tracking:** Track research outputs, including publication formats, download counts, and metadata. Update tracking information and view detailed info for each research item.
- **Audit Logs:** View and filter audit logs of system operations and account activities for security and compliance.
- **Database & File Backup:** Generate and restore full backups of the research repository and its associated files. Restores replace the entire database and repository content.
- **Access Control:** Role-based filtering and permissions (e.g., college deans and program heads see only relevant research).
- **Download Tracking:** Automatically count and track downloads of research papers and extended abstracts.

## Technology Stack

- **Frontend:** React (bootstrapped with [Create React App](https://github.com/facebook/create-react-app))
- **Backend/API:** Not included in this repository (API endpoints are referenced throughout the code)
- **State Management:** React state/hooks
- **UI:** Material-UI (MUI)
- **Other:** Axios for API communication, localStorage for session/user data

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (>=14)
- npm (>=6)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Deokgo/ResearchRepo-Web.git
    cd ResearchRepo-Web
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```
   The app will run on [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm start` — Runs the app in development mode.
- `npm test` — Launches the test runner in interactive watch mode.
- `npm run build` — Builds the app for production to the `build` folder.
- `npm run eject` — Ejects the configuration (one-way operation; not recommended unless necessary).

You can find more details in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

## Usage

- **Uploading/Managing Research:** Navigate to the relevant section to upload new research, update tracking info, and view/download manuscripts and abstracts.
- **Filtering:** Use provided filters to narrow down research items by college, program, year, format, keywords, and SDGs.
- **User Management:** Admin users can manage, archive, and restore user accounts.
- **Backups:** Always generate a full backup before restoring, as restores will completely replace the existing database and files.

## Important Notes

- **Backup/Restore:** Restoring a backup will fully overwrite the current database and research files. This operation cannot be undone.
- **Archiving:** Inactive accounts (2+ years) are archived and removed from the active database but can be restored from archive files.
- **Download Tracking:** The system increments download counts for each research paper accessed.
- **Role-based Access:** Some features and filters are available only to users with specific roles (e.g., deans, program heads).

## Notice

This repository is not open for public modification. Making some changes is prohibited.

## Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Create React App](https://github.com/facebook/create-react-app)
