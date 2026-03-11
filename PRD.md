Product Requirements Document (PRD)
Product Name

Fitway – Gym CRM for Indian Gym Owners

1. Overview

Fitway is a simple gym management CRM designed for small and medium gym owners in India to manage their members, memberships, and payments.

Many gym owners in India still manage their members using registers, notebooks, or Excel sheets, which becomes difficult as the gym grows.

Fitway solves this by providing a simple web dashboard where gym owners can:

Add and manage gym members

Track membership plans

Track payment status

Easily see who has payment due

Maintain member records in one place

The MVP focuses on core membership management. Advanced features like WhatsApp reminders, workout plans, analytics, etc., will come later.

2. Goals
Primary Goals

Help gym owners digitize member management

Help them track membership payments

Easily identify members with upcoming or overdue payments

Reduce dependency on notebooks or Excel

MVP Success Metrics

Gym owner can onboard and start adding members within 5 minutes

Gym owner can see upcoming or overdue payments instantly

Gym owner can manage 100–500 members easily

3. Target Users
Primary Users

Small to Medium Gym Owners in India

Typical characteristics:

Own gyms with 50–500 members

Limited technical knowledge

Prefer simple dashboards

Use mobile phones often

Often forget payment dates

Mostly operate with monthly memberships

4. Key Problems

Gym owners face the following problems:

Hard to remember who has paid and who hasn't

Difficult to track membership expiry

Managing members in notebooks becomes messy

No easy way to see upcoming payments

No centralized system to store member details

5. Product Scope (MVP)

The MVP will include:

1️⃣ Gym Owner Account

Gym owners can:

Sign up

Log in

Manage their gym members

Each gym owner has isolated data.

2️⃣ Member Management

Gym owner can:

Add member

Edit member

Delete member

View member profile

Member fields:

Field	Type
Name	string
Phone Number	string
Email	optional string
Photo	optional
Address	optional
Join Date	date
Notes	optional
3️⃣ Membership Plan Tracking

Each member has a membership plan.

Example:

Monthly

3 Months

6 Months

12 Months

Fields:

Field	Type
Plan Name	string
Duration	integer (days/months)
Price	number

Gym owner can create custom plans.

4️⃣ Membership Record

When a member pays, a membership record is created.

Fields:

Field	Type
Member	relation
Plan	relation
Start Date	date
End Date	date
Amount Paid	number
Payment Status	paid / due
Payment Mode	cash / upi / card
Notes	optional
5️⃣ Payment Due Tracking

Dashboard should show:

Upcoming Due

Membership expiring in next 7 days

Overdue Payments

Members whose membership has already expired

This is the most important feature for gym owners.

6️⃣ Dashboard

Main dashboard should show:

Total members

Active memberships

Payments due

Expiring soon

Recently added members

Example cards:

Total Members
Active Members
Payments Due
Expiring Soon

7️⃣ Member Profile Page

Each member page shows:

Member details

Membership history

Current membership

Payment status

Example:

Name
Phone
Email
Photo

Current Plan
Start Date
End Date
Payment Status

6. Non-Goals (Not in MVP)

These features will not be built in MVP:

❌ WhatsApp reminders
❌ Workout tracking
❌ Diet plans
❌ Trainer assignment
❌ Attendance tracking
❌ Analytics reports
❌ Mobile app

7. User Flow
Gym Owner Onboarding
Visit Website
     ↓
Sign Up
     ↓
Login
     ↓
Create First Membership Plan
     ↓
Add Members

Add Member Flow
Dashboard
   ↓
Add Member
   ↓
Fill Details
   ↓
Select Plan
   ↓
Add Payment
   ↓
Save

Payment Tracking Flow
Dashboard
    ↓
Payments Due Section
    ↓
Click Member
    ↓
Renew Membership

8. Core Features
Feature 1 — Member Management

Gym owners can:

Add members

Edit members

Delete members

Search members

Feature 2 — Membership Plans

Gym owners can:

Create plans

Edit plans

Assign plans to members

Example plans:

Monthly – ₹1000
3 Months – ₹2500
6 Months – ₹4500

Feature 3 — Payment Tracking

Track:

Paid memberships

Expired memberships

Upcoming renewals

Feature 4 — Due List

Important list:

Members with expired membership
Members expiring within 7 days

Feature 5 — Search

Gym owner should be able to search by:

Member name

Phone number

9. UI Screens

MVP Screens:

1️⃣ Login Page
2️⃣ Signup Page
3️⃣ Dashboard
4️⃣ Members List
5️⃣ Add Member
6️⃣ Member Profile
7️⃣ Membership Plans
8️⃣ Payments Due Page

10. Tech Stack

Frontend:

Next.js 16

React Server Components

Tailwind CSS

Backend:

Next.js API routes

Database:

PostgreSQL

ORM:

Prisma

File Storage:

S3 / Cloudflare R2 (for photos)

Authentication:

NextAuth / Auth.js

Hosting:

Vercel

11. Database Schema (MVP)
GymOwner
id
name
email
password
created_at

Member
id
gym_owner_id
name
phone
email
photo_url
address
join_date
notes
created_at

MembershipPlan
id
gym_owner_id
name
duration_days
price
created_at

Membership
id
member_id
plan_id
start_date
end_date
amount_paid
payment_status
payment_mode
notes
created_at
