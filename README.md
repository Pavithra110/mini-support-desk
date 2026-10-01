# Mini Support Desk

A lightweight internal support ticket management tool built for the BuiltbyGSV Software Engineer Internship Round 1 assignment.

## Features

- View 10 sample support tickets
- Create a new ticket
- View individual ticket details
- Edit/update ticket status
- Change ticket priority
- Search tickets by title or client
- Filter by status
- Filter by priority
- Delete tickets with confirmation
- Dashboard statistics
- Responsive UI
- Data persistence using browser localStorage
- Basic accessibility features such as labels, dialog semantics, keyboard Escape support and responsive layout

## Ticket fields

Each ticket contains:

- Title
- Client
- Priority
- Status
- Created date

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

No backend or external database is required.

## How to run locally

1. Download/clone the repository.
2. Open `index.html` in a browser.

For a smoother development experience, use VS Code with the Live Server extension.

## Data storage

Tickets are stored in the browser using localStorage under:

`miniSupportDeskTickets`

This means the data remains available after refreshing the page on the same browser/device.

## Extra improvement

### Persistent local storage

The assignment allows mock data, but this project goes one step further by storing ticket changes in localStorage. Creating, editing and deleting tickets therefore persists after a page refresh without requiring a backend.

This was chosen because the assignment is intended to be a lightweight internal tool and does not require server-side persistence.

## Edge cases handled

- Empty search results show a clear message.
- Search and filters can be combined.
- Required ticket fields cannot be submitted empty.
- Delete requires confirmation.
- Clicking outside a modal closes it.
- Escape closes open modals.
- User-entered text is escaped before being inserted into ticket cards/details.

## Deployment

The project can be deployed as a static site using Vercel, Netlify or GitHub Pages.
