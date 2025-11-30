# Admin Application PRD (Product Requirements Document)

> **Document Information**
>
> - **Created**: 2025-01-XX
> - **Version**: 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization-prd)
3. [Dashboard](#dashboard-prd)
4. [Test Management](#test-management-prd)
5. [Category Management](#category-management-prd)
6. [User Management](#user-management-prd)
7. [User Response Management](#user-response-management-prd)
8. [Feedback Management](#feedback-management-prd)
9. [Analytics](#analytics-prd)
10. [Growth Analysis](#growth-analysis-prd)
11. [Common Components & Layout](#common-components--layout-prd)

---

# Overview

## 1. Purpose

This document outlines the product requirements for the Admin Application of the Pickid service. The admin application is a management dashboard designed for administrators to create, manage, and analyze tests, users, and content on the platform.

## 2. Target Users

The admin application is designed for:

- **Administrators**: Staff members responsible for content creation, user management, and platform operations
- **Content Managers**: Users who create and manage tests, categories, and other content
- **Analysts**: Users who monitor analytics and performance metrics

## 3. System Architecture

The admin application follows a **Layered Architecture** pattern:

- **Presentation Layer**: Pages and UI components
- **Business Logic Layer**: React hooks and state management
- **Data Access Layer**: Service layer for API calls
- **Infrastructure Layer**: Utilities, types, and shared libraries

## 4. Technology Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router
- **State Management**: TanStack Query, React Hook Form
- **UI Components**: Custom components based on shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Validation**: Zod

---

# Authentication & Authorization PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/auth`
- **Page Type**: Authentication page
- **Access Permission**: Public access, but authenticated users are redirected to dashboard

### 1.2. Page Purpose

The Admin Login Page provides secure access to the admin dashboard. It ensures that only authorized administrators can access the management interface.

### 1.3. User Scenarios

- **Admin Login**: An administrator enters their email and password to access the dashboard
- **Auto-redirect**: An already authenticated admin is automatically redirected to the dashboard
- **Failed Login**: An administrator enters incorrect credentials and receives an error message

---

## 2. Login Form

### 2.1. Functional Requirements

- **Email Input**: Users must enter their registered email address
- **Password Input**: Users must enter their password
- **Password Visibility Toggle**: Users can toggle password visibility
- **Form Validation**: Both fields are required before submission
- **Submit Action**: Form submission triggers authentication

### 2.2. UI Requirements

- **Form Layout**: Centered form with email and password fields
- **Input Fields**: Email and password inputs with icons
- **Password Toggle**: Eye icon button to show/hide password
- **Submit Button**: Primary action button for login
- **Error Display**: Error messages displayed below the form

### 2.3. Interaction Requirements

- **Auto-fill**: Form supports browser auto-fill for saved credentials
- **Enter Key**: Pressing Enter in password field submits the form
- **Error Handling**: Invalid credentials display error message
- **Loading State**: Submit button shows loading state during authentication

---

## 3. Authentication Flow

### 3.1. Functional Requirements

- **Session Management**: Successful login creates a session
- **Auto-redirect**: Authenticated users are redirected to dashboard
- **Route Protection**: Unauthenticated users are redirected to login page
- **Session Persistence**: User session persists across page refreshes

### 3.2. Error Handling

- **Invalid Credentials**: Display error message for incorrect email/password
- **Network Errors**: Display error message for connection issues
- **Server Errors**: Display generic error message for server-side issues

---

# Dashboard PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/` (root path)
- **Page Type**: Dashboard/Overview page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Dashboard provides administrators with a comprehensive overview of the platform's key metrics and quick access to important actions. It serves as the central hub for monitoring activity and managing content.

### 1.3. User Scenarios

- **Daily Check**: An administrator logs in and checks today's key metrics to understand platform activity
- **Quick Action**: An administrator wants to quickly create a new test from the dashboard
- **Performance Monitoring**: An administrator reviews popular tests and completion rates

---

## 2. Page Structure

### 2.1. Overall Layout

The dashboard is composed of the following sections:

1. **Page Header**: Title, description, and quick action button
2. **KPI Cards**: Four key performance indicator cards
3. **Real-time Activity Notice**: Information about accessing real-time data
4. **Popular Tests Card**: Top 3 tests by today's responses
5. **Quick Actions Card**: Shortcuts to common tasks

---

## 3. KPI Cards

### 3.1. Functional Requirements

- **Active Tests**: Displays count of published tests with total tests as subtitle
- **Today's Responses**: Shows today's response count with growth indicator
- **Today's Visitors**: Displays today's visitor count with growth indicator
- **Completion Rate**: Shows weekly average completion rate percentage

### 3.2. UI Requirements

- **Card Layout**: Four cards displayed in a grid
- **Icons**: Each card displays a relevant icon
- **Values**: Large, prominent numbers for key metrics
- **Growth Indicators**: Trend icons and percentage for metrics with growth data
- **Subtitles**: Additional context information below main values

### 3.3. Interaction Requirements

- **Clickable Cards**: Cards may link to detailed views (optional)
- **Data Refresh**: Data updates automatically or on page refresh

---

## 4. Real-time Activity Notice

### 4.1. Functional Requirements

- **Information Display**: Informs administrators that real-time data is available in Google Analytics
- **Navigation Hint**: Provides guidance on where to find real-time data in GA4

### 4.2. UI Requirements

- **Notice Card**: Prominent card with informational content
- **Clear Messaging**: Explains that GA4 provides more accurate real-time data

---

## 5. Popular Tests Card

### 5.1. Functional Requirements

- **Top Tests Display**: Shows top 3 tests by today's response count
- **Test Information**: Displays test title, response count, and start count
- **Ranking**: Shows rank number (1, 2, 3) for each test
- **Navigation**: "View All" button links to test list page
- **Empty State**: Displays message when no test data is available

### 5.2. UI Requirements

- **Card Layout**: Card with header and content sections
- **List Display**: Each test shown in a row with rank, title, and metrics
- **Trend Icons**: Visual indicators for performance trends
- **Empty State**: Friendly message with icon when no data exists

### 5.3. Interaction Requirements

- **Test Click**: Clicking a test navigates to test detail (optional)
- **View All**: Button navigates to test list page

---

## 6. Quick Actions Card

### 6.1. Functional Requirements

- **Action Links**: Provides quick access to common tasks
- **Common Tasks**: Links to frequently used pages or actions

### 6.2. UI Requirements

- **Card Layout**: Card displaying action buttons or links
- **Clear Labels**: Each action has a descriptive label

### 6.3. Interaction Requirements

- **Action Navigation**: Clicking actions navigates to relevant pages

---

## 7. Data Refresh

### 7.1. Functional Requirements

- **Initial Load**: Data loads when page is accessed
- **Last Updated**: Displays timestamp of last data update
- **Auto Refresh**: Data may refresh automatically at intervals (optional)

---

# Test Management PRD

## 1. Overview

### 1.1. Page Information

- **Test List Path**: `/tests`
- **Test Create Path**: `/tests/create`
- **Test Edit Path**: `/tests/:testId/edit`
- **Page Type**: Content management pages
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Test Management section allows administrators to view, create, edit, and manage all tests on the platform. It provides comprehensive tools for content creation and management.

### 1.3. User Scenarios

- **Test Creation**: An administrator creates a new test through a multi-step wizard
- **Test Editing**: An administrator updates an existing test's information, questions, or results
- **Test Management**: An administrator searches, filters, and manages multiple tests
- **Bulk Operations**: An administrator publishes or deletes multiple tests at once

---

## 2. Test List Page

### 2.1. Overview

The Test List Page displays all tests in the system with filtering, searching, and management capabilities.

### 2.2. Statistics Cards

#### 2.2.1. Functional Requirements

- **Total Tests**: Displays count of all tests
- **Published**: Shows count of published tests
- **Draft**: Displays count of draft tests
- **Scheduled**: Shows count of scheduled tests
- **Total Responses**: Displays total response count across all tests

#### 2.2.2. UI Requirements

- **Card Grid**: Five statistics cards displayed horizontally
- **Clear Labels**: Each card has a descriptive label
- **Large Numbers**: Prominent display of metric values

---

### 2.3. Search & Filters

#### 2.3.1. Functional Requirements

- **Search**: Text input to search tests by title or description
- **Status Filter**: Dropdown to filter by test status (all, published, draft, scheduled)
- **Real-time Filtering**: Results update as filters are applied

#### 2.3.2. UI Requirements

- **Filter Bar**: Horizontal bar containing search and filter controls
- **Search Input**: Text field with placeholder text
- **Filter Dropdown**: Select dropdown with status options

---

### 2.4. Bulk Actions

#### 2.4.1. Functional Requirements

- **Selection**: Users can select multiple tests via checkboxes
- **Publish Action**: Bulk publish selected tests
- **Unpublish Action**: Bulk unpublish selected tests
- **Delete Action**: Bulk delete selected tests
- **Clear Selection**: Button to deselect all tests

#### 2.4.2. UI Requirements

- **Action Bar**: Appears when tests are selected
- **Action Buttons**: Buttons for each bulk action
- **Selection Count**: Displays number of selected tests
- **Confirmation**: Delete action requires confirmation

---

### 2.5. Test Table

#### 2.5.1. Functional Requirements

- **Test Display**: Table showing all filtered tests
- **Column Information**:
  - Test name/title
  - Test type (psychology, balance, quiz, etc.)
  - Status (published, draft, scheduled)
  - Response count
  - Creation date
  - Actions (edit, status change, delete)
- **Row Selection**: Checkbox for selecting individual tests
- **Row Click**: Clicking a row opens test detail modal

#### 2.5.2. UI Requirements

- **Table Layout**: Responsive table with sortable columns
- **Status Badges**: Visual badges for test status
- **Type Badges**: Visual indicators for test types
- **Action Menu**: Dropdown or button group for actions

---

### 2.6. Test Detail Modal

#### 2.6.1. Functional Requirements

- **Test Information**: Displays comprehensive test details
- **Quick Actions**: Toggle publish status, delete test
- **Navigation**: Link to edit page

#### 2.6.2. UI Requirements

- **Modal Overlay**: Full-screen or centered modal
- **Information Sections**: Organized display of test data
- **Action Buttons**: Clear action buttons at bottom

---

### 2.7. Pagination

#### 2.7.1. Functional Requirements

- **Page Navigation**: Navigate between pages of test results
- **Page Size**: Configurable items per page
- **Page Indicators**: Current page and total pages displayed

---

## 3. Test Creation Page

### 3.1. Overview

The Test Creation Page uses a multi-step wizard to guide administrators through creating a new test.

### 3.2. Step Indicator

#### 3.2.1. Functional Requirements

- **Step Display**: Visual indicator showing current step and total steps
- **Step Navigation**: Clickable steps to jump between completed steps
- **Progress Indication**: Clear visual indication of progress

#### 3.2.2. UI Requirements

- **Progress Bar**: Horizontal or vertical step indicator
- **Active Step**: Highlighted current step
- **Completed Steps**: Visual indication of completed steps
- **Disabled Steps**: Future steps are disabled until previous steps are completed

---

### 3.3. Step 1: Type Selection

#### 3.3.1. Functional Requirements

- **Type Selection**: User selects one of six test types:
  - **Psychology**: MBTI, personality analysis tests
  - **Balance**: Two-choice or multi-choice selection games
  - **Character Matching**: Character/IP matching tests
  - **Quiz**: Knowledge-based tests with correct answers
  - **Meme**: Meme/emoji matching tests
  - **Lifestyle**: Preference-based lifestyle tests
- **Type Information**: Each type displays description, features, and examples
- **Selection Validation**: Type must be selected before proceeding

#### 3.3.2. UI Requirements

- **Type Cards**: Grid or list of type option cards
- **Type Details**: Each card shows type name, description, features, and examples
- **Selection State**: Visual indication of selected type

---

### 3.4. Step 2: Basic Information

#### 3.4.1. Functional Requirements

- **Test Title**: Required text input for test name
- **Test Code**: Optional short code for sharing (auto-generatable)
- **Test Description**: Text area for test description
- **Start Text**: Optional introductory text shown before test starts
- **Thumbnail Upload**: Image upload for test thumbnail
- **Category Selection**: Multi-select for test categories
- **Estimated Time**: Number input for estimated completion time
- **Max Score**: Number input for maximum possible score
- **Gender Required**: Toggle for requiring gender selection
- **Publish Status**: Toggle for immediate publication or draft

#### 3.4.2. UI Requirements

- **Form Layout**: Two-column or single-column form layout
- **Required Fields**: Visual indication of required fields
- **Image Preview**: Preview of uploaded thumbnail
- **Category Checkboxes**: Multi-select interface for categories
- **Toggle Switches**: Visual switches for boolean options

---

### 3.5. Step 3: Question Creation

#### 3.5.1. Functional Requirements

- **Question Management**: Add, delete, and reorder questions
- **Question Text**: Text input for question content
- **Question Image**: Optional image upload for questions
- **Question Type**: Select between multiple choice or short answer
- **Choice Management**: Add, delete, and reorder choices for each question
- **Choice Text**: Text input for each choice
- **Choice Score**: Number input for choice scoring
- **Correct Answer**: Mark correct answers for quiz-type tests
- **Explanation**: Optional text for answer explanations

#### 3.5.2. UI Requirements

- **Question List**: Expandable or accordion-style question list
- **Question Editor**: Form for editing individual questions
- **Choice List**: List of choices with drag-and-drop reordering
- **Image Upload**: Upload interface for question images
- **Validation**: Visual feedback for required fields and minimum requirements

---

### 3.6. Step 4: Result Configuration

#### 3.6.1. Functional Requirements

- **Result Management**: Add, delete, and reorder results
- **Result Name**: Text input for result title
- **Result Description**: Text area for result description
- **Background Image**: Optional image upload for result background
- **Theme Color**: Color picker for result theme color
- **Match Conditions**: Configure how results are matched:
  - Score range matching
  - Choice code matching
- **Result Features**: Configure additional result features
- **Gender Targeting**: Optional gender-specific targeting

#### 3.6.2. UI Requirements

- **Result List**: List of results with management controls
- **Result Editor**: Form for editing individual results
- **Color Picker**: Interface for selecting theme colors
- **Condition Builder**: UI for setting match conditions
- **Image Upload**: Upload interface for background images

---

### 3.7. Step 5: Preview & Publish

#### 3.7.1. Functional Requirements

- **Test Information Preview**: Display all basic information
- **Question Preview**: List all questions with choices
- **Result Preview**: List all results with descriptions
- **Checklist**: Validation checklist before publishing
- **Save & Publish**: Button to save and publish test
- **Save as Draft**: Option to save without publishing

#### 3.7.2. UI Requirements

- **Preview Sections**: Organized display of all test components
- **Checklist Items**: List of validation checks with status indicators
- **Action Buttons**: Clear buttons for save and publish actions
- **Validation Feedback**: Visual indication of any missing required information

---

## 4. Test Edit Page

### 4.1. Overview

The Test Edit Page allows administrators to modify existing tests using the same multi-step wizard as creation.

### 4.2. Functional Requirements

- **Data Loading**: Existing test data loads into the form
- **5-Step Process**: Same wizard steps as creation
- **Preview Link**: Link to view test on public site
- **Update Action**: Save changes to existing test
- **Navigation**: Back button to return to test list

### 4.3. UI Requirements

- **Page Header**: Test title and back navigation
- **Preview Button**: External link button to view test
- **Same Wizard**: Identical step structure as creation page

---

# Category Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/categories`
- **Page Type**: Content management page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Category Management page allows administrators to create, edit, organize, and manage test categories. Categories help organize and filter tests for users.

### 1.3. User Scenarios

- **Category Creation**: An administrator creates a new category
- **Category Organization**: An administrator reorders categories by drag-and-drop
- **Bulk Management**: An administrator activates or deactivates multiple categories

---

## 2. Category List Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Total Categories**: Displays total count of categories
- **Active Categories**: Shows count of active categories
- **Inactive Categories**: Displays count of inactive categories

---

### 2.2. Search & Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search categories by name
- **Status Filter**: Filter by active/inactive status
- **Action Buttons**: "Sort Order" and "Add" buttons

---

### 2.3. Bulk Actions

#### 2.3.1. Functional Requirements

- **Selection**: Select multiple categories via checkboxes
- **Bulk Activate**: Activate all selected categories
- **Bulk Deactivate**: Deactivate all selected categories
- **Clear Selection**: Deselect all categories

---

### 2.4. Category Table

#### 2.4.1. Functional Requirements

- **Category Display**: Table showing all categories
- **Column Information**:
  - Category name
  - Sort order
  - Status (active/inactive)
  - Creation date
  - Actions (edit, status change, delete)
- **Row Selection**: Checkbox for selecting categories

---

### 2.5. Category Create/Edit Modal

#### 2.5.1. Functional Requirements

- **Category Name**: Required text input
- **Slug**: Auto-generated or manual slug input
- **Sort Order**: Number input for display order
- **Status**: Toggle for active/inactive status
- **Save Action**: Create new or update existing category

#### 2.5.2. UI Requirements

- **Modal Form**: Centered modal with form fields
- **Validation**: Required field validation
- **Action Buttons**: Save and cancel buttons

---

### 2.6. Category Sort Modal

#### 2.6.1. Functional Requirements

- **Drag and Drop**: Reorder categories by dragging
- **Visual Feedback**: Clear indication during drag operation
- **Save Order**: Button to save new sort order
- **Cancel**: Option to cancel without saving

#### 2.6.2. UI Requirements

- **Sortable List**: List with drag handles
- **Preview**: Visual preview of new order
- **Save Button**: Confirm changes button

---

# User Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/users`
- **Page Type**: User management page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The User Management page allows administrators to view, manage, and analyze user accounts on the platform.

### 1.3. User Scenarios

- **User Search**: An administrator searches for a specific user by email
- **Status Management**: An administrator changes a user's status (active/inactive/deleted)
- **User Analysis**: An administrator views user details and participation history

---

## 2. User List Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Active Users**: Count of active users
- **Inactive Users**: Count of inactive users
- **Deleted Users**: Count of deleted users

---

### 2.2. User Sync

#### 2.2.1. Functional Requirements

- **Sync Button**: Button to synchronize user data
- **Sync Process**: Updates user data from authentication system
- **Loading State**: Shows sync progress

---

### 2.3. Search & Filters

#### 2.3.1. Functional Requirements

- **Search**: Text input to search users by email or name
- **Status Filter**: Filter by user status
- **Provider Filter**: Filter by sign-up method (email, Kakao, etc.)

---

### 2.4. Bulk Actions

#### 2.4.1. Functional Requirements

- **Selection**: Select multiple users
- **Bulk Activate**: Activate selected users
- **Bulk Deactivate**: Deactivate selected users
- **Bulk Delete**: Mark selected users as deleted

---

### 2.5. User Table

#### 2.5.1. Functional Requirements

- **User Display**: Table showing all users
- **Column Information**:
  - Email address
  - Name (with avatar)
  - Sign-up method
  - Status
  - Registration date
  - Actions (status change, delete)
- **Row Click**: Opens user detail modal

---

### 2.6. User Detail Modal

#### 2.6.1. Functional Requirements

- **User Information**: Displays user basic information
- **Test Participation**: Shows tests user has participated in
- **Response Statistics**: Displays user's response statistics

#### 2.6.2. UI Requirements

- **Modal Layout**: Organized sections for different information types
- **Data Tables**: Tables for participation and statistics

---

# User Response Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/responses`
- **Page Type**: Analytics page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The User Response Management page provides comprehensive analysis of user responses to tests, including completion rates, device distribution, and time metrics.

### 1.3. User Scenarios

- **Response Analysis**: An administrator analyzes overall response patterns
- **Device Analysis**: An administrator reviews device distribution for responses
- **Performance Monitoring**: An administrator monitors completion rates and average completion times

---

## 2. Response Analysis Page

### 2.1. Page Header

#### 2.1.1. Functional Requirements

- **Page Title**: "Response Analysis" heading
- **Description**: Brief description of page purpose

---

### 2.2. Response Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search responses
- **Test Filter**: Dropdown to filter by specific test
- **Category Filter**: Dropdown to filter by category
- **Device Filter**: Filter by device type (mobile/desktop/tablet)
- **Date Range**: Date picker for filtering by date range
- **Export**: Button to export filtered data

---

### 2.3. Response Statistics Cards

#### 2.3.1. Functional Requirements

- **Total Responses**: Count of all responses
- **Completed Responses**: Count of completed responses
- **Completion Rate**: Percentage of completed vs total responses
- **Average Completion Time**: Average time to complete tests
- **Mobile Ratio**: Percentage of mobile device responses
- **Unique Users**: Count of unique users who responded

---

### 2.4. Detailed Statistics

#### 2.4.1. Functional Requirements

- **Device Distribution**: Breakdown by device type
- **Completion Status**: Detailed completion statistics
- **Time Analysis**: Average completion time breakdown

---

# Feedback Management PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/feedbacks`
- **Page Type**: Content management page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Feedback Management page allows administrators to view, manage, and respond to user feedback and suggestions submitted through the platform.

### 1.3. User Scenarios

- **Feedback Review**: An administrator reviews new feedback submissions
- **Status Management**: An administrator updates feedback status (pending, in progress, completed, rejected)
- **Response**: An administrator replies to user feedback

---

## 2. Feedback List Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Total**: Count of all feedback
- **Pending**: Count of pending feedback
- **In Progress**: Count of in-progress feedback
- **Completed**: Count of completed feedback
- **Replied**: Count of feedback with admin replies
- **Rejected**: Count of rejected feedback

---

### 2.2. Search & Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search feedback by title or content
- **Status Filter**: Filter by feedback status
- **Category Filter**: Filter by feedback category

---

### 2.3. Bulk Actions

#### 2.3.1. Functional Requirements

- **Selection**: Select multiple feedback items
- **Bulk Status Change**: Change status of selected items
- **Actions Available**:
  - Mark as "In Progress"
  - Mark as "Completed"
  - Reject

---

### 2.4. Feedback Table

#### 2.4.1. Functional Requirements

- **Feedback Display**: Table showing all feedback
- **Column Information**:
  - Title (with content preview)
  - File attachment indicator
  - Category
  - Author name
  - Status
  - Creation date
  - View count
  - Actions (reply, status change, delete)
- **Row Click**: Opens feedback detail modal

---

### 2.5. Feedback Detail Modal

#### 2.5.1. Functional Requirements

- **Feedback Information**: Displays full feedback content
- **File Attachments**: Shows attached files if any
- **Reply Button**: Button to open reply modal
- **Status Display**: Current feedback status

---

### 2.6. Feedback Reply Modal

#### 2.6.1. Functional Requirements

- **Reply Form**: Text area for admin reply
- **Save Reply**: Button to save and send reply
- **Reply Display**: Shows existing reply if already replied

---

# Analytics PRD

## 1. Overview

### 1.1. Page Information

- **Analytics Overview Path**: `/analytics`
- **Test Analytics Detail Path**: `/analytics/tests/:testId`
- **Page Type**: Analytics and reporting pages
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Analytics section provides comprehensive performance analysis for tests, including response rates, completion rates, trends, and funnel analysis.

### 1.3. User Scenarios

- **Performance Overview**: An administrator reviews overall test performance metrics
- **Test Analysis**: An administrator analyzes specific test performance in detail
- **Trend Analysis**: An administrator reviews performance trends over time
- **Funnel Analysis**: An administrator analyzes drop-off rates at each question

---

## 2. Analytics Overview Page

### 2.1. Statistics Cards

#### 2.1.1. Functional Requirements

- **Total Tests**: Count of all tests
- **Published**: Count of published tests
- **Draft**: Count of draft tests
- **Scheduled**: Count of scheduled tests
- **Total Responses**: Total response count across all tests
- **Completion Rate**: Overall completion rate percentage

---

### 2.2. Search & Filters

#### 2.2.1. Functional Requirements

- **Search**: Text input to search tests
- **Status Filter**: Filter by test status
- **Category Filter**: Filter by category
- **Time Range Filter**: Filter by time period (7 days, 30 days, 90 days)

---

### 2.3. Test Analytics Table

#### 2.3.1. Functional Requirements

- **Test Display**: Table showing all tests with analytics
- **Column Information**:
  - Test name
  - Status
  - Response count
  - Completion rate (with visual progress bar)
  - Average completion time
  - Creation date
- **Row Click**: Navigates to test analytics detail page

---

## 3. Test Analytics Detail Page

### 3.1. Analytics Header

#### 3.1.1. Functional Requirements

- **Test Information**: Displays test title and basic info
- **Time Range Selector**: Dropdown to change analysis time period
- **Back Button**: Returns to analytics overview page

---

### 3.2. Analytics Statistics Cards

#### 3.2.1. Functional Requirements

- **Responses**: Total response count
- **Completions**: Total completion count
- **Completion Rate**: Percentage of completions vs responses
- **Average Time**: Average completion time
- **Average Score**: Average test score (if applicable)
- **Device Distribution**: Breakdown by device type

---

### 3.3. Analytics Tabs

#### 3.3.1. Overview Tab

- **Completion Rate Chart**: Visual chart showing completion rates
- **Result Distribution**: Chart showing distribution of results
- **Share Performance**: Statistics on test sharing

#### 3.3.2. Trends Tab

- **Trend Summary**: Summary of performance trends
- **Trend Chart**: Visual chart showing trends over time

#### 3.3.3. Funnel Tab

- **Funnel Summary**: Overview of funnel metrics
- **Funnel Visualization**: Visual representation of user flow
- **Question Detail**: Detailed analysis for each question including:
  - Reached count
  - Completed count
  - Drop-off rate
  - Average time spent

---

# Growth Analysis PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/growth`
- **Page Type**: Information and navigation page
- **Access Permission**: Authenticated administrators only

### 1.2. Page Purpose

The Growth Analysis page provides guidance and links to Google Analytics for advanced growth metrics, user acquisition, and traffic analysis.

### 1.3. User Scenarios

- **GA Navigation**: An administrator wants to access Google Analytics for detailed analysis
- **Analysis Guidance**: An administrator needs guidance on where to find specific metrics in GA4

---

## 2. Growth Page

### 2.1. Page Header

#### 2.1.1. Functional Requirements

- **Page Title**: "Growth Analysis" heading
- **Description**: Brief explanation that GA4 provides more powerful analysis

---

### 2.2. GA Guide Cards

#### 2.2.1. Functional Requirements

- **Traffic Acquisition**: Information about traffic acquisition analysis
- **User Acquisition**: Information about user acquisition analysis
- **Real-time Analysis**: Information about real-time monitoring

#### 2.2.2. UI Requirements

- **Card Layout**: Three cards with icons and descriptions
- **GA Navigation**: Instructions on where to find each metric in GA4

---

### 2.3. Additional Analysis Guide

#### 2.3.1. Functional Requirements

- **Technical Analysis**: Information about device, browser, OS analysis
- **Demographics Analysis**: Information about geographic and demographic data

---

### 2.4. Google Analytics Link

#### 2.4.1. Functional Requirements

- **External Link**: Button to open Google Analytics in new tab
- **Clear Call-to-Action**: Prominent button for accessing GA

---

# Common Components & Layout PRD

## 1. Overview

### 1.1. Purpose

This section defines the common components and layout structure used throughout the admin application to ensure consistency and usability.

---

## 2. Admin Layout

### 2.1. Sidebar

#### 2.1.1. Functional Requirements

- **Sidebar Toggle**: Button to collapse/expand sidebar
- **Navigation Menu**: List of navigation items organized by sections
- **Section Groups**: Navigation items grouped into logical sections:
  - Dashboard
  - Content Management (Tests, Categories)
  - Data & Analytics (Responses, Analytics, Growth)
  - User & Community (Users, Feedback)
- **Active State**: Visual indication of current page
- **Collapsed State**: Icon-only view when collapsed

#### 2.1.2. UI Requirements

- **Persistent State**: Sidebar collapse state persists across sessions
- **Section Headers**: Clear section dividers
- **Icons**: Icons for each navigation item
- **Hover Effects**: Visual feedback on hover

---

### 2.2. Header

#### 2.2.1. Functional Requirements

- **User Information**: Displays logged-in admin user information
- **Logout Button**: Button to log out of admin session
- **Sidebar Toggle**: Button to toggle sidebar (on mobile/tablet)

#### 2.2.2. UI Requirements

- **Fixed Position**: Header remains visible while scrolling
- **User Avatar**: User profile image or initial
- **Clear Actions**: Prominent logout button

---

### 2.3. Main Content Area

#### 2.3.1. Functional Requirements

- **Content Container**: Main area for page content
- **Responsive Layout**: Adapts to sidebar state
- **Padding**: Consistent padding around content

---

## 3. Common UI Components

### 3.1. DataTable

#### 3.1.1. Functional Requirements

- **Data Display**: Table for displaying structured data
- **Sorting**: Column sorting capability
- **Selection**: Row selection with checkboxes
- **Pagination**: Built-in pagination support
- **Actions**: Action column for row-specific actions

---

### 3.2. FilterBar

#### 3.2.1. Functional Requirements

- **Search Input**: Text search field
- **Filter Dropdowns**: Multiple filter dropdowns
- **Filter Values**: Displays current filter values
- **Clear Filters**: Option to reset all filters

---

### 3.3. BulkActions

#### 3.3.1. Functional Requirements

- **Selection Count**: Displays number of selected items
- **Action Buttons**: Multiple action buttons
- **Clear Selection**: Button to deselect all
- **Conditional Display**: Only shows when items are selected

---

### 3.4. StatsCards

#### 3.4.1. Functional Requirements

- **Multiple Cards**: Grid of statistic cards
- **Configurable Columns**: Adjustable number of columns
- **Card Content**: Label and value for each card
- **Optional Colors**: Color coding for different metrics

---

### 3.5. DataState

#### 3.5.1. Functional Requirements

- **Loading State**: Displays loading indicator
- **Error State**: Displays error message
- **Empty State**: Displays message when no data
- **Success State**: Renders data when available

---

### 3.6. AdminCard

#### 3.6.1. Functional Requirements

- **Card Container**: Reusable card component
- **Variants**: Different card styles (default, gradient, step)
- **Padding Options**: Configurable padding sizes
- **Header/Content**: Optional header and content sections

---

### 3.7. Pagination

#### 3.7.1. Functional Requirements

- **Page Navigation**: Previous/next buttons
- **Page Numbers**: Clickable page numbers
- **Current Page**: Visual indication of current page
- **Total Pages**: Display of total page count

---

## 4. Form Components

### 4.1. DefaultInput

#### 4.1.1. Functional Requirements

- **Text Input**: Standard text input field
- **Label**: Optional label above input
- **Placeholder**: Placeholder text
- **Validation**: Error message display
- **Required Indicator**: Visual indicator for required fields

---

### 4.2. DefaultTextarea

#### 4.2.1. Functional Requirements

- **Multi-line Input**: Text area for longer text
- **Label**: Optional label
- **Rows**: Configurable number of rows
- **Validation**: Error message display

---

### 4.3. DefaultSelect

#### 4.3.1. Functional Requirements

- **Dropdown**: Select dropdown component
- **Options**: List of selectable options
- **Label**: Optional label
- **Placeholder**: Placeholder text
- **Search**: Optional search within options

---

### 4.4. Switch

#### 4.4.1. Functional Requirements

- **Toggle**: On/off toggle switch
- **Label**: Optional label
- **State**: Current on/off state
- **Change Handler**: Callback on state change

---

### 4.5. Image Upload

#### 4.5.1. Functional Requirements

- **File Upload**: Image file selection
- **Preview**: Preview of uploaded image
- **Remove**: Option to remove uploaded image
- **Validation**: File type and size validation

---

## 5. Modal Components

### 5.1. Test Detail Modal

#### 5.1.1. Functional Requirements

- **Test Information**: Comprehensive test details
- **Quick Actions**: Toggle publish, delete, edit
- **Close**: Close button or overlay click

---

### 5.2. User Detail Modal

#### 5.2.1. Functional Requirements

- **User Information**: User profile details
- **Participation History**: List of tests user participated in
- **Statistics**: User response statistics

---

### 5.3. Feedback Detail Modal

#### 5.3.1. Functional Requirements

- **Feedback Content**: Full feedback text
- **Attachments**: Display attached files
- **Reply Action**: Button to open reply modal
- **Status Display**: Current feedback status

---

### 5.4. Feedback Reply Modal

#### 5.4.1. Functional Requirements

- **Reply Form**: Text area for admin reply
- **Submit**: Save and send reply
- **Cancel**: Close without saving

---

### 5.5. Category Create/Edit Modal

#### 5.5.1. Functional Requirements

- **Category Form**: Form fields for category creation/editing
- **Save**: Create or update category
- **Cancel**: Close without saving

---

### 5.6. Category Sort Modal

#### 5.6.1. Functional Requirements

- **Sortable List**: Drag-and-drop category list
- **Save Order**: Save new sort order
- **Cancel**: Close without saving

---

## 6. Error Handling

### 6.1. Form Validation

- **Required Fields**: Validation for required inputs
- **Format Validation**: Email, URL, number format validation
- **Custom Validation**: Business logic validation
- **Error Messages**: Clear, actionable error messages

---

### 6.2. API Error Handling

- **Network Errors**: Handling of connection issues
- **Server Errors**: Handling of server-side errors
- **Error Messages**: User-friendly error messages
- **Retry Options**: Option to retry failed operations

---

### 6.3. User Feedback

#### 6.3.1. Success Messages

- **Action Confirmation**: Success messages for completed actions
- **Auto-dismiss**: Messages automatically disappear after timeout

#### 6.3.2. Error Messages

- **Error Display**: Clear error messages
- **Actionable**: Messages suggest next steps

#### 6.3.3. Loading States

- **Loading Indicators**: Visual feedback during operations
- **Button States**: Disabled state during processing
- **Progress Indicators**: Progress bars for long operations

---

## 7. Accessibility

### 7.1. Keyboard Navigation

- **Tab Order**: Logical tab order through interactive elements
- **Keyboard Shortcuts**: Common shortcuts for frequent actions
- **Focus Indicators**: Clear visual focus indicators

---

### 7.2. Screen Readers

- **ARIA Labels**: Appropriate ARIA labels for all interactive elements
- **Alt Text**: Descriptive alt text for images
- **Semantic HTML**: Proper use of semantic HTML elements

---

### 7.3. Visual Feedback

- **Loading States**: Clear indication of loading operations
- **Success Feedback**: Visual confirmation of successful actions
- **Error Feedback**: Clear indication of errors

---

## 8. Performance

### 8.1. Data Loading

- **Lazy Loading**: Load data as needed
- **Pagination**: Limit data loaded at once
- **Caching**: Cache frequently accessed data

---

### 8.2. Image Optimization

- **Image Formats**: Use optimized image formats
- **Lazy Loading**: Load images on demand
- **Compression**: Compress images for web

---

**Created**: 2025-01-XX  
**Version**: 1.0.0
