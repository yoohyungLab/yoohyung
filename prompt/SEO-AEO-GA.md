# SEO, AEO, GA, and Sitemap Guide

## 1. Overview

### 1.1 Purpose

This document provides a comprehensive guide for Search Engine Optimization (SEO), Naver Search Engine Registration (AEO), Google Analytics (GA) configuration, and sitemap management for the Pickid web project.

### 1.2 Scope

- **SEO**: Metadata, Open Graph, Structured Data
- **AEO**: Naver Search Engine registration and verification
- **GA**: Google Analytics 4 configuration and event tracking
- **Sitemap**: Dynamic sitemap generation and management
- **robots.txt**: Search engine crawling control

---

## 2. SEO (Search Engine Optimization)

### 2.1 Metadata Management

#### 2.1.1 Global Metadata

**Location**: `src/app/layout.tsx`

- **Basic Metadata**:
  - Title: "픽키드 | 나를 알아가는 심리테스트"
  - Description: Site description
  - Keywords: Array of relevant keywords
- **Title Template**: Page-specific titles generated in `%s | 픽키드` format
- **Metadata Base URL**: Site base URL configuration

#### 2.1.2 Page-Specific Metadata

**Dynamic Generation**: Each page uses the `generateMetadata` function

- **Home Page**: Dynamic description including test count
- **Test Detail Page**: Test title, description, thumbnail image
- **Test Result Page**: Result title, description, shared link distinction

#### 2.1.3 Metadata Components

- **Title**: Unique title per page
- **Description**: Page description (150-160 characters recommended)
- **Keywords**: Array of relevant keywords
- **Authors**: Site information
- **Language**: Korean (ko_KR)

### 2.2 Open Graph (OG) Tags

#### 2.2.1 Basic OG Tags

**Location**: `src/app/layout.tsx`

- **Type**: website
- **Locale**: ko_KR
- **Site Name**: 픽키드
- **Default Image**: `/og-image.png` (1200x630)

#### 2.2.2 Page-Specific OG Tags

- **Test Detail Page**: Uses test thumbnail image
- **Test Result Page**: Uses test thumbnail image (if available)
- **Dynamic Images**: Representative image for each page

### 2.3 Twitter Card

#### 2.3.1 Basic Configuration

- **Card Type**: summary_large_image
- **Title**: Site title
- **Description**: Site description
- **Image**: Same as OG image
- **Creator**: @pickid

### 2.4 Structured Data

#### 2.4.1 Test Result Page Structured Data

**Location**: `src/components/seo/test-result-structured-data.tsx`

- **Quiz Schema**: Displays test results as Quiz type
- **Article Schema**: Displays test results as Article type
- **Breadcrumb Schema**: Displays navigation path

#### 2.4.2 Schema Components

- **Quiz Schema**:
  - Test name, description, URL
  - Image, author, publication date
  - Educational level, learning resource type
  - Target audience (if gender information is available)
- **Article Schema**:
  - Headline, description, URL
  - Image, author, publisher
  - Main entity information
- **Breadcrumb Schema**:
  - Home → Test → Test Detail → Result

### 2.5 Robots Meta Tags

#### 2.5.1 Basic Configuration

- **Indexing**: Allowed (index: true)
- **Follow**: Allowed (follow: true)
- **Google Bot**:
  - Indexing allowed
  - Image preview: large
  - Snippet: unlimited

#### 2.5.2 Conditional Configuration

- **Shared Links**: Shared links on result pages are not indexed (index: false, follow: true)

---

## 3. AEO (Naver Search Engine Optimization)

### 3.1 Naver Search Registration

#### 3.1.1 Site Registration

- **Naver Search Advisor**: Access https://searchadvisor.naver.com
- **Site Registration**: Register site URL
- **Verification Code**: Store in environment variables

#### 3.1.2 Verification Code Configuration

**Location**: `src/constants/site-config.ts`

- **Environment Variable**: `NEXT_PUBLIC_NAVER_VERIFICATION`
- **Meta Tag**: `<meta name="naver-site-verification" content="{verification_code}" />`
- **Auto Application**: Conditionally applied in layout.tsx

### 3.2 Naver Search Optimization

#### 3.2.1 Sitemap Submission

- **Sitemap URL**: Submit sitemap to Naver Search Advisor
- **Update Frequency**: Regular sitemap updates

#### 3.2.2 Metadata Optimization

- **Title**: Clear and search-intent aligned titles
- **Description**: User search-intent aligned descriptions
- **Keywords**: Consider Naver search trends

---

## 4. Google Analytics (GA)

### 4.1 GA4 Configuration

#### 4.1.1 Account and Property Creation

- **GA4 Account**: Create Google Analytics account
- **Property Creation**: Create web property
- **Measurement ID**: Issue measurement ID in G-XXXXXXXXXX format

#### 4.1.2 Environment Variable Configuration

**Location**: `.env.local`

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### 4.1.3 GA Component Integration

**Location**: `src/components/google-analytics.tsx`

- **Loading Strategy**: afterInteractive (after page load)
- **Script**: Load gtag.js script
- **Configuration**: Automatic page path tracking

### 4.2 Event Tracking

#### 4.2.1 Automatic Tracking Events

**Enhanced Measurement** automatically tracks:

- **page_view**: Page view
- **scroll**: 90% page scroll
- **click**: Exit click
- **first_visit**: First visit
- **session_start**: Session start

#### 4.2.2 Custom Events

**Location**: `src/lib/analytics.ts`

- **test_start**: Test start
  - Category: engagement
  - Label: Test title
  - Value: 1
- **result_viewed**: Result view
  - Category: engagement
  - Label: Result name + login status
- **result_shared**: Result share
  - Category: social
  - Label: Share method + result name

#### 4.2.3 Event Trigger Locations

- **test_start**: When test start button is clicked
- **result_viewed**: When result page is entered
- **result_shared**: When result share button is clicked

### 4.3 GA Report Utilization

#### 4.3.1 Key Reports

- **Real-time**: Current active users and events
- **Engagement**: Statistics by event
- **Acquisition**: Traffic source analysis
- **Technology**: Device, browser, OS analysis

#### 4.3.2 Conversion Event Configuration

Recommended conversion events:

- `test_complete`: Test completion
- `result_shared`: Result sharing

---

## 5. Sitemap

### 5.1 Sitemap Generation

#### 5.1.1 Static Sitemap

**Location**: `src/app/sitemap.ts`

- **Base URL**: https://pickid.co.kr
- **Included Pages**:
  - Home page (priority: 1.0, changefreq: daily)
  - Test list (priority: 0.8, changefreq: daily)
  - My page (priority: 0.6, changefreq: weekly)
  - Feedback (priority: 0.5, changefreq: monthly)

#### 5.1.2 Dynamic Sitemap (Optional)

**Location**: `next-sitemap.config.js`

- **Dynamic Paths**: Test detail pages, etc.
- **Priority Configuration**: Automatic priority setting by path
- **Change Frequency**: Automatic change frequency setting by path

### 5.2 Sitemap Components

#### 5.2.1 URL Information

- **loc**: Page URL
- **lastmod**: Last modification date
- **changefreq**: Change frequency (daily, weekly, monthly)
- **priority**: Priority (0.0 ~ 1.0)

#### 5.2.2 Priority Criteria

- **Home Page**: 1.0
- **Test Related**: 0.8
- **Category**: 0.8
- **My Page**: 0.6
- **Feedback**: 0.5

### 5.3 Sitemap Submission

#### 5.3.1 Google Search Console

- **Sitemap URL**: https://pickid.co.kr/sitemap.xml
- **Submission Method**: Submit sitemap in Google Search Console

#### 5.3.2 Naver Search Advisor

- **Sitemap URL**: https://pickid.co.kr/sitemap.xml
- **Submission Method**: Submit sitemap in Naver Search Advisor

---

## 6. robots.txt

### 6.1 robots.txt Generation

#### 6.1.1 Basic Configuration

**Location**: `src/app/robots.ts`

- **User Agent**: All crawlers (\*)
- **Allow**: Allow all (/)
- **Disallow**:
  - `/admin/`: Admin pages
  - `/api/`: API endpoints
  - `/auth/`: Authentication pages

#### 6.1.2 Sitemap Reference

- **Sitemap URL**: https://pickid.co.kr/sitemap.xml

### 6.2 Crawling Control

#### 6.2.1 Allowed Areas

- **Public Pages**: Allow crawling of all public pages
- **Test Pages**: Allow crawling of test detail and result pages

#### 6.2.2 Blocked Areas

- **Admin Pages**: Block crawling of admin-only pages
- **API Endpoints**: Block crawling of API paths
- **Authentication Pages**: Block crawling of login/registration pages

---

## 7. Search Engine Verification

### 7.1 Google Verification

#### 7.1.1 Verification Code Configuration

**Location**: `src/constants/site-config.ts`

- **Environment Variable**: `NEXT_PUBLIC_GOOGLE_VERIFICATION`
- **Meta Tag**: `<meta name="google-site-verification" content="{verification_code}" />`
- **Auto Application**: Conditionally applied in layout.tsx

#### 7.1.2 Google Search Console Registration

- **Site Registration**: Register site in Google Search Console
- **Verification**: Verify via meta tag or HTML file upload
- **Sitemap Submission**: Submit sitemap URL

### 7.2 Naver Verification

#### 7.2.1 Verification Code Configuration

**Location**: `src/constants/site-config.ts`

- **Environment Variable**: `NEXT_PUBLIC_NAVER_VERIFICATION`
- **Meta Tag**: `<meta name="naver-site-verification" content="{verification_code}" />`
- **Auto Application**: Conditionally applied in layout.tsx

#### 7.2.2 Naver Search Advisor Registration

- **Site Registration**: Register site in Naver Search Advisor
- **Verification**: Verify via meta tag
- **Sitemap Submission**: Submit sitemap URL

---

## 8. Metadata Management Guide

### 8.1 Centralized Management

#### 8.1.1 Site Configuration

**Location**: `src/constants/site-config.ts`

- **Site Name**: 픽키드
- **Default Title**: 픽키드 | 나를 알아가는 심리테스트
- **Default Description**: Site description
- **Base URL**: Environment variable or default value
- **OG Image**: `/og-image.png`
- **Keywords**: Array of relevant keywords

#### 8.1.2 Verification Codes

- **Google Verification**: `NEXT_PUBLIC_GOOGLE_VERIFICATION`
- **Naver Verification**: `NEXT_PUBLIC_NAVER_VERIFICATION`

### 8.2 Page-Specific Metadata

#### 8.2.1 Dynamic Generation Pattern

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
	// Load data
	const data = await fetchData();

	return {
		title: data.title,
		description: data.description,
		openGraph: {
			images: [data.image],
		},
	};
}
```

#### 8.2.2 Metadata Priority

1. Page-specific `generateMetadata` function
2. Global metadata (layout.tsx)
3. Default value (fallback)

---

## 9. Structured Data Management

### 9.1 Schema Types

#### 9.1.1 Quiz Schema

- **Purpose**: Test result pages
- **Type**: Quiz
- **Key Fields**: name, description, url, image, author, publisher

#### 9.1.2 Article Schema

- **Purpose**: Test result pages
- **Type**: Article
- **Key Fields**: headline, description, url, image, author, publisher

#### 9.1.3 Breadcrumb Schema

- **Purpose**: Display navigation path
- **Type**: BreadcrumbList
- **Key Fields**: itemListElement (Home → Test → Detail → Result)

### 9.2 Structured Data Application

#### 9.2.1 Application Location

- **Test Result Pages**: Apply Quiz, Article, Breadcrumb schemas
- **Dynamic Generation**: Dynamically generated on client side

#### 9.2.2 Cleanup

- **Component Unmount**: Remove scripts in useEffect cleanup
- **Duplicate Prevention**: Prevent duplicate schema generation

---

## 10. Performance Optimization

### 10.1 Metadata Optimization

#### 10.1.1 Server-Side Generation

- **SSR**: Metadata generated on server
- **Caching**: Apply appropriate caching strategy

#### 10.1.2 Image Optimization

- **OG Image**: Appropriate size (1200x630)
- **Image Format**: Use optimized format
- **Lazy Loading**: Load only when needed

### 10.2 GA Optimization

#### 10.2.1 Script Loading

- **Loading Strategy**: afterInteractive (after page load)
- **Minimize Performance Impact**: Async loading

#### 10.2.2 Event Optimization

- **Essential Events Only**: Track only necessary events
- **Batch Transmission**: Batch transmission when possible

---

## 11. Monitoring and Maintenance

### 11.1 SEO Monitoring

#### 11.1.1 Google Search Console

- **Search Performance**: Check search rankings and impressions
- **Coverage**: Check indexing status
- **Sitemap**: Check sitemap submission status

#### 11.1.2 Naver Search Advisor

- **Search Impressions**: Check Naver search impressions
- **Sitemap**: Check sitemap submission status

### 11.2 GA Monitoring

#### 11.2.1 Real-Time Monitoring

- **Real-Time Reports**: Check current active users
- **Event Verification**: Check event tracking status

#### 11.2.2 Regular Inspection

- **Event Accuracy**: Verify event tracking accuracy
- **Conversion Configuration**: Check conversion event configuration

### 11.3 Sitemap Maintenance

#### 11.3.1 Regular Updates

- **New Page Addition**: Update sitemap when adding new pages
- **Priority Adjustment**: Adjust priority as needed

#### 11.3.2 Validation

- **Sitemap Validation**: Validate sitemap format
- **Crawling Verification**: Check search engine crawling status

---

## 12. Checklist

### 12.1 SEO Checklist

- [ ] Set unique title for all pages
- [ ] Set meta description for all pages
- [ ] Configure OG image (1200x630)
- [ ] Apply structured data (for necessary pages)
- [ ] Optimize keywords
- [ ] Optimize internal link structure

### 12.2 AEO Checklist

- [ ] Register with Naver Search Advisor
- [ ] Configure verification code
- [ ] Submit sitemap
- [ ] Optimize metadata

### 12.3 GA Checklist

- [ ] Create GA4 account
- [ ] Configure measurement ID
- [ ] Set environment variables
- [ ] Implement event tracking
- [ ] Configure conversion events

### 12.4 Sitemap Checklist

- [ ] Generate sitemap
- [ ] Configure robots.txt
- [ ] Submit to Google Search Console
- [ ] Submit to Naver Search Advisor
- [ ] Regular updates

---

**Created**: 2025-01-XX  
**Version**: 1.0.0
