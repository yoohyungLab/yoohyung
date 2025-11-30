# Web Application PRD (Product Requirements Document)

> **Document Information**
>
> - **Created**: 2025-11-30
> - **Version**: 1.0.0

---

## Table of Contents

1. [Home Page](#home-page-prd)
2. [Category Page](#category-page-prd)
3. [Test Detail/Progress Page](#test-detailprogress-page-prd)
4. [Test Result Page](#test-result-page-prd)
5. [Authentication Page](#authentication-page-prd)
6. [Feedback Page](#feedback-page-prd)
7. [Common Components & Layout](#common-components--layout-prd)

---

# Home Page PRD

## 1. Overview

### 1.1. Page Information

This document outlines the product requirements for the Home Page of the Pickid service.

- **Page Path**: The page will be accessible at the root path: `/`.
- **Page Type**: It serves as the primary Landing Page for all users.
- **Access Permission**: All users, whether logged in or not, can access this page.

### 1.2. Page Purpose

The Home Page is the main entry point for the Pickid service. Its primary goal is to introduce users to the wide array of psychological tests, personality analyses, and balance games available on the platform, and to provide clear pathways for exploration.

The key objectives are:

- To effectively showcase the service's core content, which is its collection of tests.
- To help users quickly find tests that align with their personal interests.
- To present the different types of tests in a well-organized manner, allowing users to understand the variety at a glance.
- To incorporate interactive elements that drive user engagement and participation.

### 1.3. User Scenarios

- **New User**: A first-time visitor lands on the home page, explores the content through the main banner or category navigation, and selects a test that catches their interest.
- **Existing User**: A returning user visits the home page to check for popular or recommended tests, looking to discover new content they haven't tried before.
- **Repeat User**: A frequent user comes to the page, participates in the latest balance game, and checks the Hall of Fame section to see top-rated tests.

---

## 2. Page Structure

### 2.1. Overall Layout

The home page will be composed of several distinct sections, arranged vertically in the following order to guide the user's journey through the content:

1.  **Banner Carousel**: A full-width carousel to highlight featured tests.
2.  **Category Filter Navigation**: A horizontal navigation bar for filtering tests by category.
3.  **Popular Tests Section**: A carousel showcasing the most engaged-with tests.
4.  **Balance Game Section**: An interactive module featuring a random balance game.
5.  **New Tests Section**: A carousel displaying recently added tests.
6.  **Advertisement Banner**: A full-width banner for promotional content.
7.  **Recommended Tests Section**: A carousel for curated or personalized test recommendations.
8.  **Hall of Fame Section**: A carousel highlighting the all-time best tests.

### 2.2. Section Spacing

Consistent vertical spacing (padding and margins) must be applied between each section to ensure a clean and organized layout. The visual separation between sections should be clear and distinct, helping users to process each content block independently.

---

## 3. Banner Carousel

### 3.1. Functional Requirements

- **Auto-Sliding**: The carousel will automatically transition between banners at a predefined time interval to expose users to multiple featured items.
- **Manual Navigation**: Users can take control of the carousel using left and right arrow buttons to browse the banners at their own pace.
- **Position Indicator**: A series of dots will be displayed, typically at the bottom of the carousel, to indicate the total number of banners and the position of the currently active one.
- **Click Action**: Each banner will be clickable. A click will navigate the user to the corresponding test's detail page.
- **Infinite Loop**: The carousel should loop infinitely. When the user navigates past the last banner, it should seamlessly transition back to the first one, and vice-versa.

### 3.2. UI Requirements

- **Banner Size**: Banners will span the full width of the viewport.
- **Image Aspect Ratio**: All banner images must maintain a consistent aspect ratio to prevent layout shifts during transitions.
- **Loading State**: The image for the first banner must be prioritized for loading (e.g., no lazy loading) to ensure the initial view is rendered quickly.
- **Mobile Gestures**: On touch-enabled devices, users must be able to navigate the carousel by swiping left and right.

### 3.3. Interaction Requirements

- **Hover Behavior**: The auto-sliding functionality will pause when the user's mouse cursor is hovering over a banner.
- **Click Navigation**: Clicking on a banner will redirect the user to the detailed page of that specific test.
- **Indicator Navigation**: Clicking on a dot indicator will immediately transition the carousel to the corresponding banner.

---

## 4. Category Filter Navigation

### 4.1. Functional Requirements

- **Category Display**: All available test categories will be displayed in a horizontal list.
- **Category Selection**: Clicking on a category will navigate the user to that category's specific page, displaying a filtered list of tests.
- **"All" Option**: An "All" or "Overall" option may be included to allow users to view all tests without a filter. (Optional)
- **Active State**: The currently selected or active category will be visually distinguished from the others.

### 4.2. UI Requirements

- **Layout**: The navigation will be a horizontally scrollable bar.
- **Category Buttons**: Each category will be presented as a distinct button or clickable element.
- **Scrolling**: If the number of categories exceeds the available viewport width, the bar will be scrollable horizontally.
- **Sticky Position**: The navigation bar may be fixed to the top of the screen as the user scrolls down the page, providing persistent access. (Optional)

### 4.3. Interaction Requirements

- **Click Navigation**: A click on a category button will take the user to the respective category page.
- **Hover Feedback**: A visual feedback effect (e.g., change in background color or text style) will occur on mouse hover.

---

## 5. Popular Tests Section

### 5.1. Functional Requirements

- **Test List Display**: This section will display a list of popular tests in a horizontal carousel.
- **Test Card Interaction**: Each test card within the carousel will be clickable, navigating the user to the test's detail page.
- **Carousel Navigation**: Left and right arrow buttons will allow users to scroll through the list of tests.
- **Section Title**: The section will be clearly labeled with the title "Popular Tests" and a "HOT" badge to draw attention.

### 5.2. UI Requirements

- **Section Header**: The header will contain the title and a "HOT" badge.
- **Test Card**: Each test will be represented by a card with the following elements:
  - A thumbnail image for the test.
  - The title of the test.
  - Up to two tags associated with the test.
- **Carousel Layout**: The cards will be arranged in a horizontally scrollable carousel.
- **Navigation Buttons**: The left and right navigation arrows will only be displayed if there are more tests than can fit in the visible area at once (e.g., more than 2).

### 5.3. Interaction Requirements

- **Hover Effect**: Hovering over a test card will trigger a visual feedback effect.
- **Click Action**: Clicking a test card will navigate to the test's detail page.
- **Carousel Control**: Clicking the arrow buttons will scroll the list of tests.

---

## 6. Balance Game Section

### 6.1. Functional Requirements

- **Game Display**: A single, randomly selected balance game will be displayed on the homepage.
- **Voting**: Users can vote by choosing one of the two presented options.
- **Result Display**: After a user votes, the section will update to show the choice they made and the overall voting statistics from all users.
- **Revoting**: An option to "Vote Again" will be available, allowing the user to change their vote or simply re-engage with the content.
- **"More Games" Link**: A link will be provided to direct users to a page listing more balance games.

### 6.2. UI Requirements

- **Section Header**: The title of the current balance game will be displayed.
- **Pre-Vote State**:
  - The two options will be shown side-by-side.
  - Each option will include an emoji and a text label.
  - A "VS" element will be placed between the two options.
  - The total number of participants will be displayed at the bottom.
- **Post-Vote State**:
  - A progress bar will show the percentage breakdown of votes for each option.
  - The option selected by the user will be highlighted with a "My Choice" badge.
  - The specific vote count and percentage for each option will be displayed.
  - "Explore Other Tests" and "Vote Again" buttons will be available.
- **Loading State**: A skeleton UI will be shown while the balance game data is being fetched.

### 6.3. Interaction Requirements

- **Voting Action**: A vote is cast immediately upon clicking an option button.
- **Voting State**: The buttons will be disabled temporarily while the vote is being processed.
- **Result Animation**: The results will be displayed with a smooth animation.
- **"Vote Again" Action**: Clicking this button will revert the section to its initial, pre-vote state.
- **"Explore Other Tests" Action**: Clicking this button will navigate to the main test list page.
- **"More Balance Games" Action**: Clicking this link will navigate to the balance game list page.

---

## 7. New Tests Section

### 7.1. Functional Requirements

- **Conditional Display**: This entire section will only be rendered if there are any tests that have been recently added.
- **Test List Display**: It will show the latest tests in a horizontal carousel format.
- **Test Card Interaction**: Clicking a test card navigates to the test's detail page.
- **Carousel Navigation**: Left and right arrow buttons will be provided for scrolling.
- **Section Title**: The section will be titled "New Tests" and include a "NEW" badge.

### 7.2. UI Requirements

- **Section Header**: The header will display the title and a "NEW" badge.
- **Test Card**: The card design will be identical to that used in the Popular Tests section.
- **Carousel Layout**: The tests will be displayed in a horizontally scrollable carousel.
- **Navigation Buttons**: Navigation arrows will appear only if there are more tests than can be displayed at once.

### 7.3. Interaction Requirements

- **Hover Effect**: Hovering over a card will produce a visual effect.
- **Click Action**: Clicking a card will navigate to the corresponding test detail page.
- **Carousel Control**: The arrow buttons will scroll through the test list.

---

## 8. Advertisement Banner

### 8.1. Functional Requirements

- **Banner Display**: An inline banner for advertisements will be displayed.
- **Click Action**: Clicking the banner can optionally navigate the user to a specified external link.

### 8.2. UI Requirements

- **Full Width**: The banner will span the entire width of the browser.
- **No Padding**: There will be no horizontal padding, allowing the banner to be flush with the edges of the screen.
- **Image Ratio**: The banner image will maintain a consistent aspect ratio.

### 8.3. Interaction Requirements

- **Click Navigation**: If a link is provided, clicking the banner will open it.

---

## 9. Recommended Tests Section

### 9.1. Functional Requirements

- **Test List Display**: A curated list of recommended tests will be shown in a horizontal carousel.
- **Test Card Interaction**: Clicking a card navigates to the test's detail page.
- **Carousel Navigation**: Left and right arrow buttons will be used for scrolling.
- **Section Title**: The section will be titled "Recommended Tests" and feature a "PICK" badge.

### 9.2. UI Requirements

- **Section Header**: The header will display the title and a "PICK" badge.
- **Test Card**: The card design will be the same as in the Popular Tests section.
- **Carousel Layout**: The tests will be in a horizontally scrollable carousel.
- **Navigation Buttons**: Arrows will appear if needed for navigation.

### 9.3. Interaction Requirements

- **Hover Effect**: A visual effect will occur on mouse hover.
- **Click Action**: Clicking a card opens the test detail page.
- **Carousel Control**: Arrow buttons scroll the test list.

---

## 10. Hall of Fame Section

### 10.1. Functional Requirements

- **Test List Display**: The top-rated or most popular tests of all time will be displayed in a horizontal carousel.
- **Test Card Interaction**: Clicking a card navigates to the test's detail page.
- **Carousel Navigation**: Left and right arrow buttons will be used for scrolling.
- **Section Title**: The section will be titled "Hall of Fame" and have a "TOP" badge.

### 10.2. UI Requirements

- **Section Header**: The header will show the title and a "TOP" badge.
- **Test Card**: The card design will match the other test sections.
- **Carousel Layout**: The tests will be in a horizontally scrollable carousel.
- **Navigation Buttons**: Arrows will appear if needed.
- **Bottom Margin**: Additional spacing will be added at the bottom of this section to provide a clear end to the page content.

### 10.3. Interaction Requirements

- **Hover Effect**: A visual effect will occur on mouse hover.
- **Click Action**: Clicking a card opens the test detail page.
- **Carousel Control**: Arrow buttons scroll the test list.

---

## 11. Common Test Card Specifications

### 11.1. Card Components

Each test card across all sections will be composed of:

- **Thumbnail Image**: A representative image for the test.
- **Tags**: Up to two category tags associated with the test.
- **Title**: The title of the test.

### 11.2. Card Interaction

- **Hover Effect**: A visual feedback mechanism will be triggered on mouse hover.
- **Click Action**: The entire card area will be clickable and navigate to the test's detail page.
- **Image Loading**: A placeholder will be displayed while the thumbnail image is loading.

---

## 12. Error Handling

### 12.1. Data Loading Failure

- If data for a section fails to load, an appropriate error message will be displayed in its place.
- An option for the user to retry loading the data may be provided. (Optional)

### 12.2. Empty State

- If there are no tests to display in any of the sections, a user-friendly message indicating the empty state will be shown.
- If a specific section has no data, that section should either be hidden or display its own empty state message.

---

## 13. Accessibility

### 13.1. Keyboard Navigation

- All interactive elements (buttons, links, cards) must be accessible and operable via the keyboard.
- A clear and visible focus indicator must be present for all focusable elements.

### 13.2. Screen Readers

- Appropriate ARIA labels must be provided for each section to give context to screen reader users.
- All images must have descriptive alternative text.
- Buttons and links must have clear and descriptive text labels.

### 13.3. Visual Feedback

- Visual feedback should be provided for all interactions to confirm that an action has been registered.
- Loading states must be clearly communicated to the user.

---

## 14. Performance

### 14.1. Initial Loading

- Content that is visible in the initial viewport (above the fold) must be prioritized for loading.
- The main banner image, in particular, should be loaded eagerly (not lazy-loaded).

### 14.2. Image Optimization

- All images must be optimized for the web, using appropriate file formats and compression.
- Lazy loading should be applied to all images that are not in the initial viewport.

---

## 15. User Experience

### 15.1. Loading State

- Skeleton UIs or loading indicators should be used to provide feedback when data is being fetched.
- Users should always be aware that content is loading.

### 15.2. Interaction Feedback

- All clickable elements must provide immediate visual feedback.
- Animations should be smooth and quick, enhancing the user experience without causing delays.

### 15.3. Content Flow

- The layout should guide the user naturally from one section to the next.
- The structure should make it easy for users to explore content as they scroll down the page.

---

# Category Page PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/category/{categoryId}` (e.g., `/category/love`, `/category/personality`)
- **Page Type**: Content Listing Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Category Page displays all tests belonging to a specific category. Its main purpose is to allow users who have selected a category of interest to explore all relevant content in one place.

- To provide a comprehensive view of all tests within a chosen category.
- To enable users to sort and filter tests based on criteria like popularity or creation date.
- To facilitate easy navigation through a potentially large number of tests via pagination.

### 1.3. User Scenarios

- **Focused User**: A user clicks on the "Love" category from the home page to see all available romance-related tests. They then sort by "Most Popular" to find the most-played one.
- **Explorer User**: A user lands on a category page and browses through the entire list, using pagination to move between pages to discover a test that looks interesting.
- **Indecisive User**: A user arrives on a category page, feels overwhelmed by the number of tests, and uses the "Sort by Newest" filter to try the latest content.

---

## 2. Page Structure

### 2.1. Overall Layout

The category page will be structured as follows:

```
[Category Header]
[Sort Options]
[Test Grid]
[Pagination]
```

### 2.2. Section Spacing

- Consistent spacing will be maintained between the header, sort options, test grid, and pagination to ensure a clean and readable layout.

---

## 3. Category Header

### 3.1. Functional Requirements

- **Display Category Information**: The header must display the name of the current category.
- **Display Category Description**: A brief description of the category should be shown to give users context.

### 3.2. UI Requirements

- **Category Title**: The category name should be a prominent heading (e.g., `H1` or `H2`).
- **Category Description**: The descriptive text should be placed below the title in a smaller font size.
- **Background Image/Color**: The header might feature a unique background image or color theme related to the category to enhance visual appeal. (Optional)

---

## 4. Sort Options

### 4.1. Functional Requirements

- **Default Sort Order**: By default, the tests will be sorted by popularity (most played).
- **Sorting Options**: Users must be able to re-sort the test list. The available options are:
  - **Popularity**: Sorts by the highest number of participants.
  - **Newest**: Sorts by the most recently created date.
- **Active Sort Indicator**: The currently active sort option must be visually indicated.

### 4.2. UI Requirements

- **Layout**: The sort options should be displayed horizontally, typically aligned to the right, above the test grid.
- **Appearance**: The options can be presented as simple text links or buttons. The active option should be bold or have a different color to stand out.

### 4.3. Interaction Requirements

- **Click Action**: Clicking a sort option will immediately re-fetch and re-render the test grid with the new sort order applied. The page should not fully reload.
- **State Persistence**: The selected sort order should be maintained as the user navigates through pages using pagination.

---

## 5. Test Grid

### 5.1. Functional Requirements

- **Display Test List**: All tests for the selected category will be displayed in a grid format.
- **Test Card Click**: Each test card is a clickable element that navigates the user to the corresponding test detail page.

### 5.2. UI Requirements

- **Layout**: A responsive grid layout (e.g., 2 columns on mobile, 3-4 columns on desktop).
- **Test Card**: The design of the test cards will be consistent with those used on the home page (see Home Page PRD, section 11). Each card includes:
  - Test thumbnail image
  - Test title
  - Test tags (optional, as they are already in a category)
- **Loading State**: When data is being fetched or when sorting is in progress, a skeleton UI representing the grid and cards should be displayed.

### 5.3. Interaction Requirements

- **Hover Effect**: Test cards will have a visual feedback effect on mouse hover.
- **Click Navigation**: Clicking anywhere on the test card navigates the user to that test's detail page.

---

## 6. Pagination

### 6.1. Functional Requirements

- **Conditional Display**: Pagination controls will only be displayed if the total number of tests in the category exceeds the number of items per page.
- **Page Navigation**: Users can navigate to the next page, previous page, or a specific page number.
- **Items per Page**: A fixed number of tests (e.g., 12 or 16) will be displayed per page.

### 6.2. UI Requirements

- **Layout**: The pagination component will be centered horizontally below the test grid.
- **Components**: It should include:
  - "Previous" and "Next" arrow buttons.
  - Page number buttons.
  - An indicator for the current page (e.g., highlighted number).
  - Ellipsis (...) if there are many pages.

### 6.3. Interaction Requirements

- **Click Action**: Clicking a page number or the "Next"/"Previous" buttons will load the tests for the corresponding page. The view should scroll to the top of the test grid upon loading a new page.
- **Disabled State**: The "Previous" button will be disabled on the first page, and the "Next" button will be disabled on the last page.

---

## 7. Error Handling & Empty States

### 7.1. Invalid Category

- If a user navigates to a URL with a non-existent `categoryId`, a "404 Not Found" page or a page with a "Category not found" message should be displayed.

### 7.2. Data Loading Failure

- If the list of tests fails to load, an error message should be displayed in place of the test grid, with an option to "Retry".

### 7.3. Empty State

- If a valid category contains no tests, a message like "There are no tests in this category yet." should be displayed instead of the test grid and sort options.

---

# Test Detail/Progress Page PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/tests/[id]`
- **Page Type**: Test Progression Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Test Detail/Progress Page is where users start, answer, and complete a test. The main objectives are:

- To introduce the test and encourage users to start.
- To provide a customized question-and-answer experience tailored to the test type.
- To offer an intuitive and smooth interface for progressing through questions.
- To save user answers and collect data for calculating results.

### 1.3. User Scenarios

1.  **Starting a Test**: Enters the test detail page → Reads the test introduction → Clicks the "Start" button → Begins answering questions.
2.  **Psychology Test**: Selects gender → Answers a question → Can navigate back to the previous question → Completes all questions → Navigates to the result page.
3.  **Balance Game**: Chooses between two options → Views statistics → Proceeds to the next question → Completes all questions → Navigates to the result page.
4.  **Quiz**: Answers multiple-choice or short-answer questions → Immediately moves to the next question upon selection (except for the last question) → Completes all questions → Navigates to the result page.

---

## 2. Page Structure

### 2.1. Overall Layout

The Test Detail/Progress Page consists of the following states:

```
[Test Intro Screen]
  ↓ (On "Start" click)
[Question Progress Screen] (Varies by type)
  ↓ (After all questions are answered)
[Navigate to Result Page]
```

### 2.2. Test Types

- **Psychology**: Psychological test (requires gender selection, allows moving to previous questions).
- **Balance**: Balance game (choose between two options, displays statistics).
- **Quiz**: Quiz with multiple-choice or short-answer questions (selection immediately proceeds to the next question).

---

## 3. Test Intro Screen

### 3.1. Functional Requirements

- **Display Test Information**: Show the test's thumbnail, title, and description.
- **Display Participant Count**: Show the number of users who have participated so far (with an animation effect).
- **"Start" Button**: Provide a button to begin the test.
- **Gender Selection Modal**: For Psychology tests, display a modal to select gender.
- **Increment Participant Count**: When the start button is clicked, asynchronously increment the participant count.

### 3.2. UI Requirements

- **Layout**: A centrally-aligned card-based layout.
- **Thumbnail Image**:
  - Display the main image for the test.
  - Square aspect ratio.
  - Rounded corners.
- **Title**: Display the test title in a large font size.
- **Description**: Display the test description (supports line breaks).
- **Participant Count Section**:
  - Gradient background.
  - Text format: "So far, {count} people have participated!"
  - Animate the number count-up.
- **"Start" Button**:
  - Full-width.
  - Gradient background.
  - Shadow effect on hover.
- **Gender Selection Modal**:
  - Modal overlay.
  - Male/Female selection buttons.
  - Each button should have an icon and text.

### 3.3. Interaction Requirements

- On "Start" button click:
  - **Psychology Test**: Show the gender selection modal.
  - **Other Tests**: Immediately transition to the question progress screen.
- On gender selection in the modal, close the modal and start the questions.
- The participant count should be incremented asynchronously on start click, without blocking the UI.

---

## 4. Common Question Progress Layout

### 4.1. Functional Requirements

- **Display Progress**: Show the current question number and the total number of questions.
- **Progress Bar**: Display a visual progress bar.
- **Navigate to Previous Question**: For Psychology tests, provide a button to go back to the previous question.

### 4.2. UI Requirements

- **Header Area**:
  - Display question number at the top (e.g., "1 / 10").
  - Back button (only for Psychology tests, hidden on the first question).
  - Progress bar with a gradient background.
- **Question Area**: Display the question text.
- **Answer Area**: UI varies by test type.

### 4.3. Interaction Requirements

- The progress bar should animate smoothly when the question changes.
- Clicking the back button should navigate to the previous question, preserving the previously selected answer.

---

## 5. Psychology Test Question Progress

### 5.1. Functional Requirements

- **Gender Selection**: Gender must be selected before starting the test.
- **Display Question**: Display the question text in the center.
- **Display Choices**: Show multiple choices as buttons.
- **Answer Selection**: Clicking a choice immediately moves to the next question.
- **Navigate to Previous Question**: Ability to return to the previous question.
- **Save Answers**: Store the answer for each question.

### 5.2. UI Requirements

- **Question Section**:
  - Gradient background.
  - Centrally aligned question text.
  - Large font size.
- **Choice Buttons**:
  - Each choice is a button.
  - Show a check icon on hover.
  - Change background and border color on hover.
  - Slight scale effect on click.
- **Back Button**: Display a back button in the header.

### 5.3. Interaction Requirements

- Clicking a choice immediately moves to the next question.
- Clicking the back button moves to the previous question, displaying the previously selected answer.
- After completing the last question, navigate to the result page.

---

## 6. Balance Game Question Progress

### 6.1. Functional Requirements

- **Display Question**: Show question text and an optional image.
- **Two-Option Selection**: Choose between two options, A or B.
- **Display Statistics**: After selection, show the overall user statistics for that choice.
- **Move to Next Question**: Proceed to the next question after viewing stats.
- **Save Answers**: Store the answer for each question.

### 6.2. UI Requirements

- **Pre-selection State**:
  - Display question text and image (if available).
  - Display options as two large A/B buttons.
  - Each button has an A/B label and the option text.
  - Border color change and shadow effect on hover.
- **Post-selection State**:
  - Keep the question text visible.
  - Display the selection ratio for each option as a progress bar.
  - The user's choice is marked with a "Selected" badge.
  - Show the percentage and participant count for each option.
  - Display a "Next Question" or "View Results" button.

### 6.3. Interaction Requirements

- Selecting an option immediately transitions to the statistics view.
- Statistics are displayed with an animation.
- Clicking "Next Question" moves to the next question.
- For the last question, the button changes to "View Results".
- After completing the last question, navigate to the result page.

---

## 7. Quiz Question Progress

### 7.1. Functional Requirements

- **Display Question**: Show question text and an optional image.
- **Support Multiple Choice/Short Answer**: Support both question formats.
- **Select/Enter Answer**:
  - **Multiple Choice**: Select one of the options.
  - **Short Answer**: Input text.
- **Immediate Next**: For multiple choice, move to the next question immediately upon selection (except for the last question).
- **Submit Button**: Display a submit button for the last question or for short-answer questions.
- **Save Answers**: Store the answer for each question.

### 7.2. UI Requirements

- **Question Section**:
  - Display question text.
  - Display image if available.
- **Multiple-Choice UI**:
  - Display choices as buttons.
  - Visually distinguish the selected option.
  - Change background and border color on hover.
- **Short-Answer UI**:
  - Text input field.
  - Display placeholder text.
  - Guide users that they can submit with the Enter key.
- **Submit Button**:
  - Only visible on the last question or for short-answer questions.
  - Disabled if no answer is provided.
  - Gradient background.

### 7.3. Interaction Requirements

- On multiple-choice selection:
  - If not the last question: Immediately move to the next question.
  - If the last question: Enable the submit button.
- On short-answer input:
  - Can be submitted with the Enter key.
  - Can be submitted with the submit button.
  - Submission is disabled if the answer is empty.
- After completing the last question, navigate to the result page.

---

## 8. Answer Storage and State Management

### 8.1. Answer Storage

- **Storage Method**: Managed in client-side state.
- **Storage Format**: Map question IDs to selected choice IDs.
- **Session Storage**: Utilize Session Storage if needed to persist state across refreshes.

### 8.2. State Management

- **Current Question Index**: Manage the index of the current question.
- **Answer List**: Store answers for all questions.
- **Test Completion Status**: Manage whether all questions have been answered.

---

## 9. Test Completion Process

### 9.1. Completion Condition

- When all questions have been answered.

### 9.2. Action on Completion

- **Calculate Results**: Calculate the result based on the collected answers.
- **Store Results**: Save the calculated results to Session Storage.
- **Page Navigation**: Automatically navigate to the result page.

### 9.3. Navigation to Result Page

- **URL**: `/tests/[id]/result`
- **Navigation Method**: Programmatic navigation.

---

## 10. Error Handling

### 10.1. Data Loading Failure

- If test information fails to load, redirect to a 404 page.
- Provide a clear error message to the user.

### 10.2. Invalid Test ID

- If the test ID does not exist, redirect to a 404 page.

### 10.3. No Question Data

- If a test has no questions, display an appropriate message or redirect to a 404 page.

---

## 11. Accessibility

### 11.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible.
- Choices can be navigated sequentially using the Tab key.
- Choices can be selected using the Enter key.
- Focus indicators must be clearly visible.

### 11.2. Screen Readers

- Question text must be readable by screen readers.
- Provide clear labels for choices.
- Progress information must be perceivable by screen readers.
- Provide alt text for all images.

### 11.3. Visual Feedback

- Provide visual feedback for all interactions.
- Focus states must be clearly indicated.
- Selected states must be clearly distinguishable.

---

## 12. Performance

### 12.1. Initial Loading

- Use Server-Side Rendering (SSR) to load initial test information.
- The test thumbnail image should be prioritized for loading.

### 12.2. Question Progression

- All question data should be loaded initially.
- Transitions between questions should be handled on the client-side for speed.

### 12.3. Image Optimization

- All images must be optimized with appropriate sizes and formats.
- Apply lazy loading to question images if necessary.

---

## 13. User Experience

### 13.1. Loading State

- Display a skeleton UI or loading indicator during initial load.
- Clearly communicate to the user that content is loading.

### 13.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements.
- Use smooth animations for transitions between questions.
- Provide immediate feedback upon selection.

### 13.3. Progression Experience

- The progress bar should clearly indicate the user's current position.
- The question counter helps users understand how many questions are left.
- Provide an optimized experience tailored to each test type.

### 13.4. Completion Experience

- Ensure a natural transition to the result page upon completion.
- Minimize unnecessary waiting time during the completion process.

---

# Test Result Page PRD

## 1. Overview

### 1.1. Page Information

- **Page Path**: `/tests/[id]/result`
- **Query Parameter**: `?ref=share` (for shared links)
- **Page Type**: Result Display Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Test Result Page displays the results of a completed test, allows for sharing, and recommends related tests. The main objectives are:

- To display customized results based on the test type.
- To provide detailed information about the result.
- To encourage social sharing and viral spread.
- To drive re-engagement by recommending related tests.

### 1.3. User Scenarios

1.  **Checking Results**: Enters the result page after completing a test → Views the result → Shares or retakes the test.
2.  **Accessing via Shared Link**: Clicks a shared link → Views the shared result → Clicks "Take This Test Too".
3.  **Exploring Results**: Views the result → Checks recommended tests → Selects another test.

### 1.4. Distinction by Test Type

- **Psychology**: Psychology test results (personality analysis, compatibility, gifts, careers).
- **Balance**: Balance game results (fun statistics).
- **Quiz**: Quiz results (score, accuracy, detailed feedback).

---

## 2. Common Elements

### 2.1. CTA Button Area

#### 2.1.1. User's Own Result Page (mode="result")

- **"Retry" Button**: Navigates to the test page to retake the test.
- **"Share" Button**: Shares the result (using native Share API or copying to clipboard).
- **"Explore Other Tests" Button**: Navigates to the home page.

#### 2.1.2. Shared Result Page (mode="shared")

- **"Take This Test Too" Button**: Navigates to the test page to start the test.
- **"Explore Other Tests" Button**: Navigates to the home page.

### 2.2. Share Functionality

#### 2.2.1. Sharing Method

- **Native Share API**: Use the system's share dialog on mobile environments.
- **Clipboard Copy**: If the native Share API is unavailable or fails, copy the URL to the clipboard.
- **Success Toast**: Display a toast message upon successful sharing.

#### 2.2.2. Shared URL

- **Psychology/Quiz**: The result page URL (`/tests/[id]/result?ref=share`).
- **Balance Game**: The test page URL (`/tests/[id]?ref=share`).

#### 2.2.3. Shared Text

- User's name (if available) or "A friend".
- The name of the result.
- The share URL.

### 2.3. Popular Test Recommendations

- Display a "Popular Tests" section at the bottom of the result page.
- Provide a list of popular tests, excluding the current one.
- Clicking a test card navigates to that test's detail page.

---

## 3. Psychology Test Results

### 3.1. Page Structure

```
[Result Header]
[Description Section]
[Careers Section]
[Compatibility Section]
[Gifts Section]
[Popular Tests Section]
[CTA Button Area]
```

### 3.2. Result Header

#### 3.2.1. Functional Requirements

- **Display Result Image**: Show the main image for the result (if available).
- **Display Result Name**: Show the name of the result type.
- **Display Result Description**: Show a brief, one-line description of the result.

#### 3.2.2. UI Requirements

- **Card Format**: A card with a white background.
- **Image Area**:
  - If a result image exists, display it at the top.
  - Square aspect ratio.
  - Center-aligned.
- **Title Area**:
  - Display the result name in a large font.
  - Apply a theme color.
- **Description Area**:
  - Display only the first line of the description.
  - Center-aligned.

### 3.3. Description Section

#### 3.3.1. Functional Requirements

- **Display Detailed Description**: Show a multi-line, detailed description of the result.
- **Support Line Breaks**: Properly render line breaks in the description text.

#### 3.3.2. UI Requirements

- **Card Format**: A card with a gradient background.
- **Background Decoration**: A circular decorative element in the top-right corner.
- **Text Style**: Readable font size and line height.

### 3.4. Careers Section

#### 3.4.1. Functional Requirements

- **Display Career List**: Show a list of suitable careers as tags.
- **Max Display Count**: Display a maximum of 8 careers.

#### 3.4.2. UI Requirements

- **Card Format**: A card with a white background.
- **Section Title**: "Recommended Careers" with a dot prefix.
- **Career Tags**:
  - Each career is a rounded tag.
  - Background color based on the theme color.
  - Slight scale effect on hover.
- **Background Decoration**: A circular decorative element in the top-right corner.

### 3.5. Compatibility Section

#### 3.5.1. Functional Requirements

- **Display Best Match**: Show a list of the most compatible types.
- **Display Worst Match**: Show a list of the least compatible types.

#### 3.5.2. UI Requirements

- **Card Format**: A card with a white background.
- **Section Titles**: "Best Match" / "Worst Match" with a dot prefix.
- **Type List**:
  - Each type is a card.
  - Best Match: Positive color scheme (e.g., shades of green).
  - Worst Match: Negative color scheme (e.g., shades of red).
  - Each card displays the type name and a brief description.
- **Background Decoration**: A circular decorative element in the top-left corner.

### 3.6. Gifts Section

#### 3.6.1. Functional Requirements

- **Display Gift List**: Show a list of recommended gifts suitable for the result type.

#### 3.6.2. UI Requirements

- **Card Format**: A card with a white background.
- **Section Title**: "Recommended Gifts" with a dot prefix.
- **Gift List**:
  - Each gift is a card.
  - Background color based on the theme color.
  - Background color change on hover.
- **Background Decoration**: A circular decorative element in the top-left corner.

### 3.7. Shared Link Landing Page

#### 3.7.1. Functional Requirements

- **Display Shared Result**: When accessed via a shared link, display the shared result.
- **"Take This Test Too"**: Provide a button that navigates to the test page.

#### 3.7.2. UI Requirements

- **Result Display**: Same layout as the user's own result page.
- **CTA Buttons**: "Take This Test Too" and "Explore Other Tests" buttons.

---

## 4. Balance Game Results

### 4.1. Page Structure

```
[Result Header]
[Fun Statistics Section]
[Popular Tests Section]
[CTA Button Area]
```

### 4.2. Result Header

#### 4.2.1. Functional Requirements

- **Display Test Title**: Show the title of the balance game.
- **Display User Name**: For logged-in users, display their name (optional).

#### 4.2.2. UI Requirements

- **Check Icon**: Display a check icon to indicate completion.
- **Title**: Display the test title in a large font.
- **User Name**: Display in the format: "{Name}'s Balance Game Results".
- **Center Alignment**: All elements should be centered.

### 4.3. Fun Statistics Section

#### 4.3.1. Functional Requirements

- **Closest Matchup**: Display the question with the most even vote distribution.
- **Landslide Victory**: Display the question with the most one-sided vote distribution.

#### 4.3.2. Closest Matchup UI

- **Card Format**: A card with a white background.
- **Section Title**: "Closest Matchup" with a scale icon.
- **Description**: "Opinions were extremely divided on this one."
- **Question Display**: Show the question text on a purple/pink gradient background.
- **Choice Display**:
  - Option A: Purple-themed background.
  - Option B: Pink-themed background.
  - Show percentage and participant count for each choice.
  - Visualize the ratio with a progress bar.

#### 4.3.3. Landslide Victory UI

- **Card Format**: A card with a white background.
- **Section Title**: "Landslide Victory" with a flame icon.
- **Description**: "Almost everyone chose one side for this question."
- **Question Display**: Show the question text on an orange/amber gradient background.
- **Choice Display**:
  - Winning Choice: Orange/amber gradient background, highlighted.
  - Losing Choice: Gray background, de-emphasized.
  - Show percentage and participant count for each choice.
  - Visualize the ratio with a progress bar.

### 4.4. Shared Link Handling

- Balance Games do not support result page sharing.
- If accessed via a shared link, display a message guiding the user to the test page.
- Provide a "Go to Test" button.

---

## 5. Quiz Results

### 5.1. Page Structure

```
[Result Header]
[Detailed Results Section]
[Popular Tests Section]
[CTA Button Area]
```

### 5.2. Result Header

#### 5.2.1. Functional Requirements

- **Display Quiz Title**: Show the quiz title.
- **Display Score**: Show the earned score as a large number.
- **Display Grade**: Show a grade based on the score (e.g., A, B, C).
- **Display Correct Answers Count**: Show the number of correct answers vs. total questions.
- **Display Accuracy Rate**: Show the accuracy as a percentage.

#### 5.2.2. UI Requirements

- **Header Background**: Theme-based gradient background.
- **Score Card**:
  - Card with a white, semi-transparent background.
  - Display the score as a very large number.
  - Display the grade as a badge.
- **Answer Info**: Display the correct answer count and accuracy rate as text.
- **Center Alignment**: All elements should be centered.

### 5.3. Detailed Results Section

#### 5.3.1. Functional Requirements

- **Show Incorrect Answers**: Display only the questions the user answered incorrectly.
- **Randomize Question Order**: Shuffle the incorrect questions.
- **Default Display Count**: Initially show only 3 incorrect answers.
- **"Show More" Functionality**: A "Show More" button reveals the rest of the incorrect answers.

#### 5.3.2. UI Requirements

- **Card Format**: A card with a white background.
- **Section Title**: "Incorrect Answers" with a count of incorrect questions.
- **Question Card**:
  - Each incorrect answer is a separate card.
  - Display an incorrect answer icon.
  - Display the question number.
  - Display an "Incorrect" badge.
  - Clearly distinguish "Your Answer" from "Correct Answer".
    - Your Answer: Regular text.
    - Correct Answer: Highlighted green text.
- **"Show More" Button**:
  - Displayed if there are more than 3 incorrect answers.
  - Clicking it reveals the remaining questions.
  - Provide a "Collapse" function.

#### 5.3.3. Empty State Handling

- If there are no incorrect answers, hide this entire section.

### 5.4. Shared Link Handling

- Quizzes do not support result page sharing.
- If accessed via a shared link, display a message guiding the user to the test page.
- Provide a "Go to Test" button.

---

## 6. Error Handling

### 6.1. Data Loading Failure

- If result data fails to load, display an error message.
- Provide an option for the user to retry (optional).

### 6.2. No Result Data

- If there is no result data, display an appropriate message.
- Provide a button to navigate to the test page.

### 6.3. Invalid Test ID

- If the test ID is invalid, redirect to a 404 page.

---

## 7. Accessibility

### 7.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible.
- Buttons can be navigated sequentially using the Tab key.
- Buttons can be clicked using the Enter key.
- Focus indicators must be clearly visible.

### 7.2. Screen Readers

- Result information must be readable by screen readers.
- Provide appropriate ARIA labels for sections.
- Provide alt text for images.
- Provide clear descriptions for buttons and links.

### 7.3. Visual Feedback

- Provide visual feedback for all interactions.
- Focus states must be clearly indicated.
- Hover states must be clearly distinguishable.

---

## 8. Performance

### 8.1. Initial Loading

- Result data is loaded on the client-side.
- Display a skeleton UI or loading indicator during load.

### 8.2. Image Optimization

- All images must be optimized with appropriate sizes and formats.
- Result images should be loaded with priority.

### 8.3. Data Optimization

- Load only necessary data.
- Use memoization to prevent unnecessary recalculations.

---

## 9. User Experience

### 9.1. Loading State

- Display a skeleton UI or loading indicator during data loading.
- Clearly communicate to the user that content is loading.

### 9.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements.
- Display a toast message on successful share.
- Provide visual effects on button hover.

### 9.3. Content Flow

- Result information is displayed in a logical order.
- Maintain a natural flow between sections.
- Place recommended tests in an appropriate location.

### 9.4. Sharing Experience

- The share function should be intuitive and easily accessible.
- Provide clear feedback on successful sharing.
- Display a friendly guide message when accessing a shared link.

---

# Authentication Page PRD

## 1. Overview

### 1.1. Page Information

- **Login Page Path**: `/auth/login`
- **Registration Page Path**: `/auth/register`
- **Page Type**: Authentication Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Authentication Page allows users to log in or register for the service. The main objectives are:

- To provide personalized services through user authentication
- To encourage quick registration through convenient social login
- To provide secure email/password-based authentication
- To provide convenient access through the side drawer

### 1.3. User Scenarios

1. **Direct Access**: Direct access via login/registration page URL
2. **Side Drawer Access**: Click header menu button → Open side drawer → Click "Login / Register" button → Navigate to login page
3. **Login**: Email/password or Kakao login → Redirect to homepage on success
4. **Registration**: Email/password or Kakao registration → Redirect to homepage on success

---

## 2. Page Access Paths

### 2.1. Direct Access

- Direct access via URL: `/auth/login`, `/auth/register`

### 2.2. Side Drawer Access

- **Header Menu Button**: Click menu button in the top-right of the header
- **Open Side Drawer**: Side drawer opens
- **Login/Register Button**: "Login / Register" button displayed at the top of the side drawer
- **Page Navigation**: Clicking the button navigates to the login page

### 2.3. Page Navigation

- Provide a link from the login page to the registration page
- Provide a link from the registration page to the login page

---

## 3. Login Page

### 3.1. Page Structure

```
[Header Area]
  - Title: "Login"
  - Subtitle: "Discover yourself on Pickid"
[Authentication Form]
  - Kakao login button
  - Divider
  - Email input field
  - Password input field
  - Login button
  - Registration page link
```

### 3.2. Functional Requirements

#### 3.2.1. Email/Password Login

- **Email Input**: Email address input field
- **Password Input**: Password input field (masked)
- **Form Validation**:
  - Email format validation
  - Password minimum length validation (6 characters or more)
- **Login Processing**: Attempt login with entered information
- **Success Action**: Redirect to homepage on successful login
- **Failure Action**: Display error message

#### 3.2.2. Kakao Social Login

- **Kakao Login Button**: Provide Kakao login button
- **Social Login Processing**: Execute Kakao authentication flow
- **Success Action**: Redirect to homepage on successful login
- **Failure Action**: Display error message

#### 3.2.3. Error Handling

- **Error Message Display**: Display error message at the top on login failure
- **Error Message Format**: Warning box with red background
- **Error Message Content**: Display user-friendly error messages

### 3.3. UI Requirements

#### 3.3.1. Layout

- **Center Alignment**: Form placed at the center of the page
- **Background Effect**: Animated background blob effect
- **Card Format**: Card with semi-transparent white background
- **Responsive**: Adapt to various screen sizes

#### 3.3.2. Header Area

- **Title**: Display "Login" in large font
- **Subtitle**: Display "Discover yourself on Pickid" in smaller font

#### 3.3.3. Kakao Login Button

- **Button Style**: Apply Kakao brand color
- **Icon**: Display Kakao icon
- **Text**: "Start in 3 seconds with Kakao"
- **Position**: Top of the form

#### 3.3.4. Divider

- **Position**: Between Kakao login button and email login form
- **Text**: "Or login with email"

#### 3.3.5. Input Fields

- **Email Field**:
  - Label: "Email"
  - Placeholder: "your@email.com"
  - Red border on error state
- **Password Field**:
  - Label: "Password"
  - Placeholder: "••••••••"
  - Password show/hide toggle button
  - Red border on error state

#### 3.3.6. Login Button

- **Style**: Gradient background (rose-pink)
- **Text**: "Login"
- **Loading State**: Display loading indicator and "Logging in..." text when logging in
- **Disabled**: Disable button during submission

#### 3.3.7. Registration Link

- **Position**: Bottom of the form
- **Text**: "Don't have an account yet? Register"
- **Link Color**: Rose color

---

## 4. Registration Page

### 4.1. Page Structure

```
[Header Area]
  - Logo (optional)
  - Title: "Register"
  - Subtitle: "Start with Pickid"
[Authentication Form]
  - Kakao registration button
  - Divider
  - Nickname or name input field
  - Email input field
  - Password input field
  - Password confirmation input field
  - Registration button
  - Login page link
```

### 4.2. Functional Requirements

#### 4.2.1. Email/Password Registration

- **Nickname Input**: Nickname or name input field
- **Email Input**: Email address input field
- **Password Input**: Password input field (masked)
- **Password Confirmation Input**: Password confirmation input field (masked)
- **Form Validation**:
  - Nickname: 2-20 characters
  - Email format validation
  - Password minimum length validation (6 characters or more, maximum 100 characters)
  - Password match validation
- **Registration Processing**: Attempt registration with entered information
- **Success Action**: Redirect to homepage on successful registration
- **Failure Action**: Display error message

#### 4.2.2. Kakao Social Registration

- **Kakao Registration Button**: Provide Kakao login button (same as login)
- **Social Registration Processing**: Execute Kakao authentication flow
- **Success Action**: Redirect to homepage on successful registration
- **Failure Action**: Display error message

#### 4.2.3. Error Handling

- **Error Message Display**: Display error message at the top on registration failure
- **Field-Specific Error Display**: Display error message for each input field
- **Error Message Format**: Display in red text below the field

### 4.3. UI Requirements

#### 4.3.1. Layout

- Same layout as login page
- Logo display option (only on registration page)

#### 4.3.2. Header Area

- **Logo**: Display logo image (optional)
- **Title**: Display "Register" in large font
- **Subtitle**: Display "Start with Pickid" in smaller font

#### 4.3.3. Kakao Registration Button

- Same style as login page
- Text: "Start in 3 seconds with Kakao"

#### 4.3.4. Divider

- **Position**: Between Kakao registration button and email registration form
- **Text**: "Or continue with email"

#### 4.3.5. Input Fields

- **Nickname Field**:
  - Label: "Nickname or Name"
  - Placeholder: "Enter your nickname or name"
  - Red border on error state
- **Email Field**: Same as login page
- **Password Field**:
  - Label: "Password"
  - Placeholder: "Password with 6 or more characters"
  - Password show/hide toggle button
  - Red border on error state
- **Password Confirmation Field**:
  - Label: "Confirm Password"
  - Placeholder: "Enter your password again"
  - Password show/hide toggle button
  - Red border on error state

#### 4.3.6. Registration Button

- **Style**: Gradient background (rose-pink)
- **Text**: "Register"
- **Loading State**: Display loading indicator and "Registering..." text when registering
- **Disabled**: Disable button during submission

#### 4.3.7. Login Link

- **Position**: Bottom of the form
- **Text**: "Already have an account? Login"
- **Link Color**: Rose color

---

## 5. Form Validation

### 5.1. Login Form Validation

- **Email**:
  - Required
  - Valid email format
- **Password**:
  - Required
  - Minimum 6 characters

### 5.2. Registration Form Validation

- **Nickname**:
  - Required
  - Minimum 2 characters
  - Maximum 20 characters
- **Email**:
  - Required
  - Valid email format
- **Password**:
  - Required
  - Minimum 6 characters
  - Maximum 100 characters
- **Password Confirmation**:
  - Required
  - Must match password

### 5.3. Real-Time Validation

- **Validation During Input**: Validate in real-time as the user types
- **Error Display**: Display error message immediately on validation failure
- **Error Removal**: Automatically remove error message on validation success

---

## 6. Error Handling

### 6.1. Form Errors

- **Field-Specific Errors**: Display error message in red text below each input field
- **General Errors**: Display error message in warning box with red background at the top of the form

### 6.2. Authentication Errors

- **Login Failure**: Display error messages for incorrect email/password, non-existent account, etc.
- **Registration Failure**: Display error messages for existing email, weak password, etc.
- **Social Login Failure**: Display error message on social login cancellation or failure

### 6.3. Error Message Format

- **User-Friendly**: Easy-to-understand messages instead of technical error messages
- **Clear Guidance**: Messages that provide problem-solving methods

---

## 7. Success Handling

### 7.1. Login Success

- **Redirect**: Automatically navigate to homepage (`/`)
- **Session Maintenance**: Maintain login state

### 7.2. Registration Success

- **Redirect**: Automatically navigate to homepage (`/`)
- **Auto Login**: Automatically switch to logged-in state upon registration

---

## 8. Accessibility

### 8.1. Keyboard Navigation

- All input fields must be accessible via Tab key in sequence
- Form submission possible with Enter key
- Focus indicators must be clearly visible

### 8.2. Screen Readers

- Provide appropriate labels for all input fields
- Error messages must be readable by screen readers
- Provide clear descriptions for buttons

### 8.3. Visual Feedback

- Provide visual feedback for all interactions
- Focus states must be clearly indicated
- Error states must be clearly distinguishable

---

## 9. Performance

### 9.1. Form Validation

- Optimize real-time validation through debouncing
- Prevent unnecessary re-renders

### 9.2. Loading State

- Display loading indicator on button during submission
- Disable button during submission to prevent duplicate submissions

---

## 10. User Experience

### 10.1. Loading State

- Display clear loading state during login/registration processing
- Ensure users can recognize the progress

### 10.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements
- Provide visual effects on button hover
- Provide visual effects on input field focus

### 10.3. Form Flow

- Arrange input fields in logical order
- Distinguish between required and optional fields
- Natural transitions between pages

### 10.4. Social Login Experience

- Place Kakao login button prominently
- Encourage quick registration through social login
- Provide clear guidance on social login failure

---

# Feedback Page PRD

## 1. Overview

### 1.1. Page Information

- **Feedback List Page Path**: `/feedback`
- **Feedback Create Page Path**: `/feedback/create`
- **Feedback Detail Page Path**: `/feedback/[id]`
- **Page Type**: Feedback Collection and Viewing Page
- **Access Permission**: Accessible to both non-members and members.

### 1.2. Page Purpose

The Feedback Page allows users to submit feedback and view submitted feedback. The main objectives are:

- To collect user opinions and suggestions
- To collect bug reports and improvement suggestions
- To transparently display submitted feedback
- To facilitate communication through admin responses

### 1.3. User Scenarios

1. **Submitting Feedback**: Enters feedback list page → Clicks feedback create button → Writes feedback → Submits
2. **Viewing Feedback**: Views feedback list on feedback list page → Navigates to feedback detail page
3. **Checking Admin Response**: Views admin response on feedback detail page

---

## 2. Feedback List Page

### 2.1. Page Structure

```
[Header Area]
  - Title: "Feedback"
  - Subtitle: "Share your thoughts"
  - Feedback create button
[Feedback List Area]
  - Feedback card list
  - Empty state handling
  - Loading state handling
  - Error state handling
```

### 2.2. Functional Requirements

#### 2.2.1. Feedback List Display

- **List View**: Display all submitted feedback list
- **Sort by Latest**: Latest feedback displayed at the top
- **Feedback Card Click**: Clicking a feedback card navigates to the detail page

#### 2.2.2. Feedback Create Button

- **Button Position**: Top-right of header
- **Button Click**: Navigates to feedback create page

#### 2.2.3. Loading State

- **Loading Indicator**: Display spinner while data is loading

#### 2.2.4. Error State

- **Error Message**: Display error message when data loading fails
- **Retry Button**: Provide retry button when error occurs

### 2.3. UI Requirements

#### 2.3.1. Header Area

- **Title**: Display "Feedback" in large font
- **Subtitle**: Display "Share your thoughts" in smaller font
- **Feedback Create Button**:
  - Button with dark background
  - "Create Feedback" text
  - Navigates to feedback create page on click

#### 2.3.2. Feedback Card

- **Card Format**: Card with white background
- **Card Components**:
  - Left indicator: Blue if admin response exists, gray otherwise
  - Category emoji and title
  - Status badge (pending, in_progress, completed, replied, rejected)
  - Content preview (up to 2 lines)
  - Admin response preview (if available, up to 1 line)
  - Author name and creation date
- **Hover Effect**: Shadow and border color change on card hover
- **Clickable**: Entire card is clickable

#### 2.3.3. Empty State

- **Icon**: Display conversation emoji
- **Title**: "No feedback yet"
- **Description**: "Be the first to leave feedback"

#### 2.3.4. Loading State

- **Spinner**: Display rotating spinner at center

#### 2.3.5. Error State

- **Icon**: Display warning emoji
- **Title**: "An error occurred"
- **Error Message**: Display error message
- **Retry Button**: Provide "Retry" button

---

## 3. Feedback Create Page

### 3.1. Page Structure

```
[Header Area]
  - Title: "Send Feedback"
  - Subtitle: "Share your thoughts"
[Feedback Form]
  - Category selection
  - Title input field
  - Content input field
  - Submit error message
  - Cancel/Submit buttons
```

### 3.2. Functional Requirements

#### 3.2.1. Category Selection

- **Category Options**:
  - Bug Report (🐛)
  - Feature Suggestion (💡)
  - UI/UX Improvement (🎨)
  - Content Related (📝)
  - Other (💭)
- **Required Selection**: Category must be selected
- **Selection Indicator**: Display check icon on selected category

#### 3.2.2. Title Input

- **Required Input**: Title must be entered
- **Minimum Length**: 2 characters or more
- **Real-Time Validation**: Validate in real-time during input

#### 3.2.3. Content Input

- **Required Input**: Content must be entered
- **Minimum Length**: 10 characters or more
- **Multi-line Input**: Text area allows multiple lines
- **Real-Time Validation**: Validate in real-time during input

#### 3.2.4. Form Submission

- **Submission Processing**: Submit only when all fields are valid
- **Submission State**: Disable button and display loading during submission
- **Success Action**: Navigate to feedback list page on successful submission
- **Failure Action**: Display error message

#### 3.2.5. Cancel Functionality

- **Cancel Button**: Navigate to previous page on cancel button click
- **Cancel During Submission**: Disable cancel button during submission

### 3.3. UI Requirements

#### 3.3.1. Header Area

- **Title**: Display "Send Feedback" in large font
- **Subtitle**: Display "Share your thoughts" in smaller font

#### 3.3.2. Category Selection UI

- **Layout**: Display category list as buttons
- **Category Button**:
  - Each category is a button
  - Display emoji, category name, description
  - Selected category has dark border and background color
  - Display check icon on selected category
- **Error State**: Display red border and error message when category is not selected

#### 3.3.3. Title Input Field

- **Label**: "Title" (required indicator)
- **Placeholder**: "Enter title"
- **Error State**: Display red border and error message on validation failure

#### 3.3.4. Content Input Field

- **Label**: "Content" (required indicator)
- **Placeholder**: "Enter content"
- **Text Area**: Text area that allows multiple lines
- **Error State**: Display red border and error message on validation failure

#### 3.3.5. Submit Error Message

- **Position**: Bottom of form, above buttons
- **Style**: Warning box with red background
- **Content**: Display error message on submission failure

#### 3.3.6. Button Area

- **Cancel Button**:
  - Outline style
  - "Cancel" text
  - Navigate to previous page on click
- **Submit Button**:
  - Dark background
  - "Submit" text
  - Display "Submitting..." text and loading indicator during submission
  - Disable button during submission

---

## 4. Feedback Detail Page

### 4.1. Page Structure

```
[Back Button]
[Feedback Detail Card]
  - Header area (category, status, title, author, creation date)
  - Content area
  - Admin response area (if available)
```

### 4.2. Functional Requirements

#### 4.2.1. Feedback Detail Information Display

- **Category Display**: Display category emoji and name
- **Status Display**: Display status badge
- **Title Display**: Display feedback title
- **Author Display**: Display author name (or "Anonymous" if not available)
- **Creation Date Display**: Display creation date
- **Content Display**: Display full feedback content (preserve line breaks)

#### 4.2.2. Admin Response Display

- **Conditional Display**: Display only if admin response exists
- **Response Content Display**: Display admin response content
- **Response Date Display**: Display admin response date (if available)

#### 4.2.3. Back Functionality

- **Back Button**: Provide back button at the top
- **Back Action**: Navigate to previous page

#### 4.2.4. Loading State

- **Loading Indicator**: Display spinner while data is loading

#### 4.2.5. Error State

- **Error Message**: Display error message when feedback cannot be found
- **Action Buttons**: Provide "Back" and "Home" buttons

### 4.3. UI Requirements

#### 4.3.1. Back Button

- **Position**: Top header area
- **Style**: Arrow icon and "Back" text
- **Hover Effect**: Text color change on hover

#### 4.3.2. Feedback Detail Card

- **Card Format**: Card with white background
- **Header Area**:
  - Category emoji icon
  - Category name and status badge
  - Title
  - Author name and creation date
- **Content Area**:
  - Display full feedback content
  - Preserve line breaks
  - Readable font size and line height

#### 4.3.3. Admin Response Area

- **Position**: Below feedback content
- **Style**: Box with blue background
- **Header**:
  - Admin icon (A indicator)
  - "Admin Response" text
  - Response date (if available)
- **Content**:
  - Display admin response content
  - Preserve line breaks
  - Readable font size and line height

#### 4.3.4. Loading State

- **Spinner**: Display rotating spinner at center
- **Text**: Display "Loading..." text

#### 4.3.5. Error State

- **Title**: "Feedback not found"
- **Description**: "The requested feedback does not exist"
- **Buttons**: Provide "Back" and "Home" buttons

---

## 5. Feedback Categories

### 5.1. Category Types

- **Bug Report** (🐛): Report errors or issues
- **Feature Suggestion** (💡): Suggest new features
- **UI/UX Improvement** (🎨): Report design improvements
- **Content Related** (📝): Content-related opinions
- **Other** (💭): Other opinions

### 5.2. Category Display

- **Emoji**: Display unique emoji for each category
- **Name**: Display category name
- **Description**: Display description when category is selected

---

## 6. Feedback Status

### 6.1. Status Types

- **Pending** (pending): Feedback submitted and awaiting review
- **In Progress** (in_progress): Feedback reviewed and in progress
- **Completed** (completed): Feedback completed
- **Replied** (replied): Admin response completed
- **Rejected** (rejected): Feedback rejected

### 6.2. Status Display

- **Badge Format**: Display status as badge
- **Color Distinction**: Apply different colors by status
  - Pending: Yellow
  - In Progress: Blue
  - Completed/Replied: Green
  - Rejected: Red

---

## 7. Form Validation

### 7.1. Category Validation

- **Required Selection**: Category must be selected
- **Error Message**: "Please select a category."

### 7.2. Title Validation

- **Required Input**: Title must be entered
- **Minimum Length**: 2 characters or more
- **Error Messages**:
  - Not entered: "Please enter a title."
  - Minimum length not met: "Title must be at least 2 characters."

### 7.3. Content Validation

- **Required Input**: Content must be entered
- **Minimum Length**: 10 characters or more
- **Error Messages**:
  - Not entered: "Please enter content."
  - Minimum length not met: "Content must be at least 10 characters."

### 7.4. Real-Time Validation

- **Validation During Input**: Validate in real-time as the user types
- **Error Display**: Display error message immediately on validation failure
- **Error Removal**: Automatically remove error message on validation success

---

## 8. Error Handling

### 8.1. Form Errors

- **Field-Specific Errors**: Display error message in red text below each input field
- **Submit Errors**: Display error message in warning box with red background at the bottom of the form

### 8.2. Data Loading Errors

- **List Loading Failure**: Display error message and retry button when feedback list loading fails
- **Detail Loading Failure**: Display error message and action buttons when feedback detail loading fails

### 8.3. Error Message Format

- **User-Friendly**: Easy-to-understand messages instead of technical error messages
- **Clear Guidance**: Messages that provide problem-solving methods

---

## 9. Success Handling

### 9.1. Feedback Submission Success

- **Redirect**: Automatically navigate to feedback list page
- **Success Feedback**: Submitted feedback can be viewed on the list page

---

## 10. Accessibility

### 10.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible
- Input fields can be navigated sequentially using Tab key
- Form submission possible with Enter key
- Focus indicators must be clearly visible

### 10.2. Screen Readers

- Provide appropriate labels for all input fields
- Error messages must be readable by screen readers
- Provide clear descriptions for buttons and links

### 10.3. Visual Feedback

- Provide visual feedback for all interactions
- Focus states must be clearly indicated
- Error states must be clearly distinguishable

---

## 11. Performance

### 11.1. Data Fetching

- Feedback list is fetched on the client-side
- Feedback detail is fetched on the client-side
- Apply appropriate caching strategy

### 11.2. Form Validation

- Optimize real-time validation through debouncing
- Prevent unnecessary re-renders

### 11.3. Loading State

- Display loading indicator on button during submission
- Disable button during submission to prevent duplicate submissions

---

## 12. User Experience

### 12.1. Loading State

- Display clear loading state during data loading
- Ensure users can recognize the progress

### 12.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements
- Provide visual effects on button hover
- Provide visual effects on input field focus

### 12.3. Form Flow

- Arrange input fields in logical order
- Distinguish between required and optional fields
- Natural transitions between pages

### 12.4. Feedback Viewing Experience

- Configure to easily view submitted feedback
- Clearly distinguish admin responses
- Intuitively understand feedback status

---

# Common Components & Layout PRD

## 1. Overview

### 1.1. Purpose

Common Components and Layout define components and layout structures used across all pages. The main objectives are:

- To provide a consistent user experience
- To ensure reusability of common functionality
- To provide global settings and state management
- To provide error handling and navigation

---

## 2. Global Layout (Root Layout)

### 2.1. Functional Requirements

#### 2.1.1. Metadata Configuration

- **Basic Metadata**: Set site title, description, keywords
- **Open Graph**: Configure OG tags for social media sharing
- **Twitter Card**: Configure card for Twitter sharing
- **Robots**: Configure search engine crawling
- **Verification**: Configure site verification tags

#### 2.1.2. Providers Configuration

- **QueryClientProvider**: Provide TanStack Query client
- **SessionProvider**: Provide authentication session management
- **Toaster**: Provide global toast messages

#### 2.1.3. Global Styles

- **Font Loading**: Configure global fonts
- **CSS Files**: Load global stylesheets

### 2.2. UI Requirements

- **HTML Structure**: Standard HTML structure
- **Language Setting**: Set to Korean (ko)
- **Viewport Setting**: Configure responsive viewport

---

## 3. App Layout (App Component)

### 3.1. Functional Requirements

#### 3.1.1. Container Structure

- **Max Width**: Set mobile max width
- **Background**: Semi-transparent white background with blur effect
- **Shadow**: Card-style shadow effect

#### 3.1.2. Top Gradient Line

- **Position**: Top of the page
- **Style**: Rose-pink gradient line
- **Height**: 1px

#### 3.1.3. Header Display

- **Position**: Top of all pages
- **Fixed**: Fixed to top on scroll

#### 3.1.4. Footer Display

- **Conditional Display**: Display only on main page
- **Position**: Bottom of the page

#### 3.1.5. Side Drawer

- **Position**: Accessible from all pages
- **Trigger**: Click header menu button

---

## 4. Header

### 4.1. Functional Requirements

#### 4.1.1. Logo/Back Button

- **Conditional Display**:
  - Main page or result share page: Display logo
  - Other pages: Display back button
- **Logo Click**: Navigate to main page
- **Back Click**: Navigate to previous page

#### 4.1.2. Menu Button

- **Position**: Top-right of header
- **Function**: Open side drawer

#### 4.1.3. Scroll Behavior

- **Scroll Up**: Show header when scrolling up
- **Scroll Down**: Hide header when scrolling down
- **Animation**: Smooth transition effect

### 4.2. UI Requirements

#### 4.2.1. Layout

- **Fixed Position**: Fixed to top (sticky)
- **Background**: White background
- **Border**: Gray border at bottom

#### 4.2.2. Logo

- **Image**: Logo SVG image
- **Size**: Display at appropriate size
- **Priority Loading**: Priority loading

#### 4.2.3. Back Button

- **Icon**: Left arrow icon
- **Hover Effect**: Background color change on hover

#### 4.2.4. Menu Button

- **Icon**: Hamburger menu icon
- **Hover Effect**: Background color change on hover

---

## 5. Footer

### 5.1. Functional Requirements

#### 5.1.1. Conditional Display

- **Display Condition**: Display only on main page
- **Hide Condition**: Hidden on other pages

#### 5.1.2. Information Display

- **Copyright**: Display copyright information
- **Contact**: Display email contact
- **Email Link**: Open mail app on email click

### 5.2. UI Requirements

#### 5.2.1. Layout

- **Background**: Gradient background
- **Center Alignment**: Center-align all content
- **Text Size**: Display in small font

#### 5.2.2. Information Display

- **Copyright**: "© 2025 픽키드. All rights reserved."
- **Contact**: "Contact: email address"
- **Email Link**: Clickable email link

---

## 6. Side Drawer

### 6.1. Functional Requirements

#### 6.1.1. Drawer Open/Close

- **Open**: Open on header menu button click
- **Close**:
  - Close on background click
  - Close on ESC key press
  - Close on menu item click
  - Close on back button click

#### 6.1.2. Authentication State-Based UI

- **Non-logged-in State**: Display logo, site information, login/register button
- **Logged-in State**: Display user profile, email, logout button

#### 6.1.3. Menu Navigation

- **Main Menu**: List of main feature menus
- **Other Features**: List of other feature menus
- **Menu Click**: Navigate to page and close drawer

### 6.2. UI Requirements

#### 6.2.1. Drawer Container

- **Position**: Slide from left side of screen
- **Width**: Mobile max width
- **Height**: Full screen height
- **Background**: White background
- **Overlay**: Display background overlay when drawer opens

#### 6.2.2. Non-logged-in State UI

- **Top Area**:
  - Background: Gray background
  - Logo/Site Information: Center-aligned
  - Site Name: Display in large font
  - Site Description: Display in smaller font
  - Login/Register Button: Rounded button style
- **Middle Area**:
  - Menu List: Scrollable area
  - Main Menu Section: "Main Menu" title and menu list
  - Other Features Section: "Other Features" title and menu list

#### 6.2.3. Logged-in State UI

- **Top Area**:
  - Background: Gray background
  - Profile Image: Circular profile image or default icon
  - Email: Display user email address
- **Middle Area**:
  - Menu List: Scrollable area
  - Main Menu Section: "Main Menu" title and menu list
  - Other Features Section: "Other Features" title and menu list
- **Bottom Area**:
  - Logout Button: Button with red border
  - Border: Gray border at top

### 6.3. Menu Configuration

#### 6.3.1. Main Menu

- **Psychology Test**: Navigate to psychology test category page
- **Balance Game**: Navigate to balance game category page
- **Personality Type Test**: Navigate to personality type test category page
- **Love Type Test**: Navigate to love type test category page
- **Popular Tests**: Navigate to popular tests page

#### 6.3.2. Other Features

- **Submit Feedback**: Navigate to feedback page

#### 6.3.3. Menu Item UI

- **Icon**: Display unique icon for each menu
- **Label**: Display menu name
- **Hover Effect**: Background color change on hover
- **Click Action**: Navigate to page and close drawer on click

### 6.4. Interaction Requirements

#### 6.4.1. Drawer Open/Close

- **Open Animation**: Slide-in animation from left
- **Close Animation**: Slide-out animation to left
- **Overlay**: Display background overlay when drawer opens

#### 6.4.2. Menu Click

- **Page Navigation**: Navigate to clicked menu's page
- **Drawer Close**: Automatically close drawer after page navigation

#### 6.4.3. Login/Register Button

- **Non-logged-in State**: Display "Login / Register" button
- **Click Action**: Navigate to login page and close drawer

#### 6.4.4. Logout Button

- **Position**: Bottom of drawer
- **Click Action**: Process logout, navigate to homepage, and close drawer

---

## 7. Error Pages

### 7.1. 404 Error Page (Not Found)

#### 7.1.1. Functional Requirements

- **Display Condition**: Display when accessing non-existent page
- **Error Message**: Display "Page not found" message
- **Description**: Display "The requested page does not exist or may have been moved." description
- **Action Buttons**:
  - "Home" button: Navigate to homepage
  - "Previous Page" button: Navigate to previous page

#### 7.1.2. UI Requirements

- **Layout**: Center-aligned error message
- **Icon**: Display error icon (optional)
- **Buttons**: Provide action buttons

### 7.2. General Error Page (Error)

#### 7.2.1. Functional Requirements

- **Display Condition**: Display when application error occurs
- **Error Message**: Display "An error occurred" message
- **Description**: Display "Please try again later or go to the homepage." description
- **Error Code**: Display error code (if available)
- **Action Buttons**:
  - "Retry" button: Attempt error recovery
  - "Home" button: Navigate to homepage
- **Additional Guidance**: Display "If the problem persists, please contact customer service." guidance message

#### 7.2.2. UI Requirements

- **Layout**: Center-aligned error message
- **Background**: Gradient background
- **Card Format**: Card with white background
- **Icon**: Display warning icon
- **Buttons**: Provide action buttons

---

## 8. Accessibility

### 8.1. Keyboard Navigation

- All interactive elements must be keyboard-accessible
- Side drawer can be closed with ESC key
- Sequential navigation possible with Tab key
- Focus indicators must be clearly visible

### 8.2. Screen Readers

- Provide clear descriptions for all buttons and links
- Drawer title must be readable by screen readers
- Error messages must be readable by screen readers

### 8.3. Visual Feedback

- Provide visual feedback for all interactions
- Focus states must be clearly indicated
- Hover states must be clearly distinguishable

---

## 9. Performance

### 9.1. Layout Optimization

- Prevent unnecessary re-renders
- Optimize conditional rendering

### 9.2. Image Optimization

- Priority loading for logo images
- Optimize profile images to appropriate size

### 9.3. Animation Optimization

- Provide smooth animations
- Use animations that do not impact performance

---

## 10. User Experience

### 10.1. Consistency

- Provide consistent layout across all pages
- Ensure consistent behavior of common components

### 10.2. Interaction Feedback

- Provide immediate visual feedback for all clickable elements
- Smooth animations for drawer open/close
- Visual effects on button hover

### 10.3. Navigation Experience

- Intuitive navigation structure
- Clear menu configuration
- Easy access paths

### 10.4. Error Handling Experience

- Provide clear error messages
- Provide recovery options
- Friendly error page design
