# Pages structure

Each route has its own folder so you can see which code belongs to which page.

## Public pages

| Folder            | Route            | Main file          |
|-------------------|------------------|--------------------|
| `home/`           | `/`              | HomePage.tsx       |
| `library/`        | `/library`       | Library.tsx        |
| `watch/`          | `/watch/:id`     | Watch.tsx          |
| `community/`      | `/community`     | Community.tsx      |
| `login/`          | `/login`         | Login.tsx          |
| `signup/`         | `/signup`        | SignUp.tsx         |
| `contact/`        | `/contact`       | Contact.tsx        |
| `support/`        | `/support`       | Support.tsx        |
| `privacy-policy/` | `/privacy-policy`| PrivacyPolicy.tsx  |
| `terms-of-service/` | `/terms-of-service` | TermsOfService.tsx |
| `about-us/`       | `/about-us`      | AboutUs.tsx        |
| `how-it-works/`   | `/how-it-works`  | HowItWorks.tsx     |
| `not-found/`      | `*` (404)        | NotFound.tsx       |

## Admin pages

| Folder             | Route               | Main file        |
|--------------------|---------------------|------------------|
| `admin/dashboard/`      | `/admin`           | Dashboard.tsx    |
| `admin/upload/`         | `/admin/upload`    | UploadVideo.tsx  |
| `admin/manage-videos/`   | `/admin/videos`    | ManageVideos.tsx |
| `admin/edit-video/`      | `/admin/videos/edit/:id` | EditVideo.tsx |
| `admin/analytics/`       | `/admin/analytics` | Analytics.tsx    |
| `admin/settings/`        | `/admin/settings`  | Settings.tsx    |
| `admin/manage-messages/`  | `/admin/messages`  | ManageMessages.tsx |

Each folder has an `index.ts` that re-exports the page component so `App.tsx` can import by path (e.g. `from "@/pages/home"`). Add page-specific components or styles inside the same folder if you want to keep that page’s code together.
