# Demo Overview
Refer to the [README](../README.md) for the production project outline and flow.

## This Demo Application
The demo uses a modified tech stack to provide a client-only implementation. The demo has session only storage and will not persist data after page refresh.

# Workflow
See workflow in the [README Workflow](../README.md#workflow).

# Technology
## Frontend Technology
The Frontend is built with React and TypeScript. Routing and API requests use the Tanstack libraries. The GraphQL hooks are generated using the React Native Codegen library. The UI design uses Material UI components. 

The UI follows a Container-Presentational pattern.

SurveyJS schema and responses are used for form artifacts. The SurveyJS
Creator/Designer is **not** used; a basic MUI-based survey builder provides
authoring for a limited set of question types (text, radio, checkbox, select),
and the SurveyJS runtime renders forms for preview and completion. See
[UI/UX §6](./04-ui-ux.md#6-form-artifacts--survey-builder--runtime).

### Tech list
- Vite
- React
- TypeScript
- Tanstack Router
- Tanstack Query
- React Native Codegen
- Material UI components
- SurveyJS

## Backend Technology
The backend functionality is mocked. The client application will mock endpoints so that a backend could be hooked in at a future date. Data will not persist and be stored in memory.

# Data Structures
## Project
- Project Area
- Descriptive Name
- Estimated Value in dollars
- Project outline
- Project Scope
- Open and close dates (When vendors can sign up)
- Assigned Procurement Lead
- Project segment nodes
    - Segment nodes may overlap dates
- Artifacts

### Project Segment
- Open date
- Close date
- title
- order

## Project Artifact
- Title
- Description
- Type (Form, Document)

### Form Type
- SurveyJS Schema

## Vendor solicitation
- Project
- Vendor

## Vendor Proposal
- Project
- Vendor
- Artifact Submissions

## Artifact Submission
- Vendor
- Type (Form, Document)

### Form Type
- SurveyJS Responses

### Document Type
- Document Name

## Users
- Roles: Lead and Officer may be held by the same user.
    - Lead
    - Officer
    - Vendor
- Name
- Contact info
    - email
    - phone

### Vendor User
- Company Name
- Operating Jurisdiction (State/Country)

# Access and Security
See access and security info in the [README Access and Security](../README.md#access-and-security).


# UI
## Color Palette
| Color | Hex | RGB |
|---|---|---|
| <span style="background-color: #ff580f; padding: 3px 16px; border-radius: 3px;"></span> | #ff580f | (255,88,15) |
| <span style="background-color: #ff7e26; padding: 3px 16px; border-radius: 3px;"></span> | #ff7e26 | (255,126,38) |
| <span style="background-color: #ff9c59; padding: 3px 16px; border-radius: 3px;"></span> | #ff9c59 | (255,156,89) |
| <span style="background-color: #ffa472; padding: 3px 16px; border-radius: 3px;"></span> | #ffa472 | (255,164,114) |
| <span style="background-color: #ffc99d; padding: 3px 16px; border-radius: 3px;"></span> | #ffc99d | (255,201,157) |

## Pages
### About This Demo
Page that outlines the Production system. Describes the differences for the demo. Link back to demo landing route.

### General Layout
- Header bar docked to top
    - | Left aligned Logo | Separator | Left aligned, Role dependent, Navigation tabs | Right aligned User Icon (with dropdown menu) |
- Screen Page contents, scrolls
- Footer docked to bottom of screen
    - Center aligned
    - | BSS copyright | BSS site link | Github repo link | About this demo link |

### Procurement Users
#### Navigation
| Dashboard | Projects | Vendors | Artifacts |

#### Dashboard
Overall System data: Top, full width section
- Active Projects count
- Active Projects total Estimated Value
- Active Vendor count
- Projects in legal count

Cards with various data
- Pie graph with % Projects by active segment node
- List top 5 vendor count projects
- Time graph for next 60 days, project segment open/close dates
- Bar graph Estimated value closing for next 6 months
- Top 10 vendors with Estimated total projects sum
- Top 8 Procurement officers by estimated total project sum

#### Projects
3 Page tabs
- Tab 1: Active Projects order by next segment end date
- Tab 2: Projects in development (not active) ordered by solicitation open date
- Tab 3: Create New Project form

Each project row in the list is a link to a Project page.

#### Project (Procurement)
4 Page Tabs
- Tab 1: Setup
    - Shows Vendor count and active Segments at top.
    - All the project data that can be edited.
    - Data locked once the Project is publicly accessible.
- Tab 2: Artifacts
    - List of artifacts in the Project. 
    - Can always add new Artifacts.
    - Removed artifacts are shown as inactive with strike-through, soft deleted.
    - Artifacts list has a sub-row for each vendor's submission.
- Tab 3: Vendors
    - List of all vendors
    - Shows a status for if they were solicited, signed up, or if their proposal has been declined.
    - The vendors has a sub-row for each of their Artifact submissions.
    - Vendors have a sub-row for each additional uploaded item.
- Tab 4: Finalists
    - Ranked list of vendors that are selected for potential win.
    - Shows status of vendor as sent to legal, waiting, or declined.

#### Vendors
List of all vendors with name, last active, estimated total projects won, currently signed up for count, etc.

#### Artifacts
List of shared artifacts that can be added to Projects.
Form Artifacts are viewable in a modal.
**Procurement Leads** can add, edit, or remove these artifacts.
**Procurement Officers** can view artifacts.

#### Vendor
View vendor information.
View graphs of estimated totals, statuses, last active date, etc.
View all the projects they have signed up for.

### Vendor Users
#### Navigation
| Dashboard | Projects | Proposals | Not Interested | Shared Artifacts |

#### Dashboard
Shows the same type of information as in the **Procurement** [Vendor](#vendor) section.
Vendor can edit demographic type information.

#### Projects
List of Projects that the Vendor has not signed up for.
Projects that they were solicited by the **Procurement Officer** are at the top of the List.
Following list order is by solicitation closing date, descending.

#### Proposals
List of Proposals that they signed up for.
Links to the Project page.

#### Project (Vendor)
View similar to **Procurement** [Project](#project-procurement).
Vendor can complete artifacts.

#### Not Interested
List of Projects the Vendor has reviewed and decided not to sign up.
Do not show up in Projects or Proposal pages.
User may reconsider if they wish to sign up.

#### Shared Artifacts
List of the shared artifacts that are on Projects.
Can provide submissions that will get applied to any Projects they sign up for.
