Product Requirement Document (PRD) \& Development Plan

Project: VibeInvite - Premium Digital Invitation SaaS



1\. Project Overview \& Architecture

1.1 Goal

Build a high-end digital invitation SaaS tailored for western social etiquette (Weddings, Galas, Milestone Parties). The core value proposition is "High-fidelity paper-like unboxing experience + Zero-friction RSVP guest management."



1.2 Tech Stack (Recommended for Claude Code Efficiency)

Frontend: Next.js 14+ (App Router), Tailwind CSS, Framer Motion (for premium animations).



Backend/Database: Supabase (PostgreSQL, Auth, Storage, Edge Functions).



Email/SMS: Resend (Transactional Email) + Twilio (SMS).



Payments: Stripe (Subscription + Pay-per-event models).



AI Integration: OpenAI API / Anthropic Claude API (for copywriting \& layout generation).



1.3 System Architecture Overview

\[Frontend: Next.js + Framer Motion] 

&#x20;      │ (Authed Rest / Realtime Subscription)

&#x20;      ▼

\[Backend: Supabase] ──(Edge Functions)──► \[Third-Party API: Resend/Stripe/AI]

&#x20;      │

&#x20;      ▼

\[PostgreSQL Database]

2\. Database Schema (Supabase / PostgreSQL)

Claude Code can use this schema to generate migrations.



SQL

\-- 1. Users Profile (Extended from Supabase Auth)

CREATE TABLE profiles (

&#x20;   id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,

&#x20;   full\_name TEXT,

&#x20;   updated\_at TIMESTAMP WITH TIME ZONE

);



\-- 2. Events Table

CREATE TABLE events (

&#x20;   id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

&#x20;   user\_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

&#x20;   title TEXT NOT NULL,

&#x20;   event\_type TEXT NOT NULL, -- 'wedding', 'gala', 'party'

&#x20;   event\_date TIMESTAMP WITH TIME ZONE NOT NULL,

&#x20;   location\_name TEXT,

&#x20;   location\_address TEXT,

&#x20;   registry\_url TEXT, -- External gift registry link

&#x20;   cover\_image\_url TEXT,

&#x20;   config JSONB DEFAULT '{}'::jsonb, -- Store theme colors, music, font configs

&#x20;   created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



\-- 3. Guests Table

CREATE TABLE guests (

&#x20;   id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

&#x20;   event\_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,

&#x20;   first\_name TEXT NOT NULL,

&#x20;   last\_name TEXT NOT NULL,

&#x20;   email TEXT,

&#x20;   phone TEXT,

&#x20;   status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'

&#x20;   plus\_one\_allowed BOOLEAN DEFAULT false,

&#x20;   plus\_one\_count INT DEFAULT 0,

&#x20;   dietary\_restrictions TEXT,

&#x20;   custom\_responses JSONB DEFAULT '{}'::jsonb, -- Answers to custom questions

&#x20;   access\_token UUID DEFAULT gen\_random\_uuid(), -- Unique token for passwordless login via link

&#x20;   updated\_at TIMESTAMP WITH TIME ZONE

);



\-- 4. Seating Tables (Bonus/Phase 2)

CREATE TABLE tables (

&#x20;   id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

&#x20;   event\_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,

&#x20;   table\_name TEXT NOT NULL,

&#x20;   capacity INT NOT NULL

);



ALTER TABLE guests ADD COLUMN table\_id UUID REFERENCES tables(id) ON DELETE SET NULL;

3\. Core Feature Specifications \& Sprint Tasks

Phase 1: Authentication \& Event Dashboard (MVP Foundation)

Claude Prompt Directive: "Set up Next.js app with Supabase Auth. Create an event creation wizard."



Task 1.1: Auth Setup



Implement Magic Link (Passwordless) login and Google OAuth via Supabase.



Task 1.2: Event Creation Wizard



Form to collect: Event Title, Type, Date, Location, and Design Theme selection.



Store configuration in the events table.



Phase 2: The "Unboxing" Premium RSVP Page (Guest View)

Claude Prompt Directive: "Create a highly interactive, animated envelope unboxing page using Framer Motion."



Task 2.1: Envelope Opening Animation



Component: EnvelopeUX.tsx.



Animation sequence: Click Wax Seal ──► Seal breaks ──► Envelope flap opens ──► Card slides out smoothly.



Task 2.2: Dynamic RSVP Form



Steps inside the card:



Attendance: "Accept with Pleasure" / "Decline with Regret".



Plus One (if allowed): Name of partner.



Meal Choice / Dietary Selection (Dropdown).



Submission updates the guests table via access\_token securely without requiring guest login.



Phase 3: Host Dashboard \& Guest Management (CRM)

Claude Prompt Directive: "Build a dashboard for hosts to track RSVPs, manage guest lists, and send bulk reminders."



Task 3.1: RSVP Realtime Analytics



Metrics Grid: Total Invited | Attending | Declined | No Response.



Pie chart showing Dietary Restrictions breakdown (using recharts or shadcn/ui charts).



Task 3.2: Multi-channel Blast System



Integrate Resend API for HTML email invitations.



Email design should match the chosen event theme.



Generate individual personalized URLs: https://vibeinvite.com/invitation/\[access\_token].



Phase 4: Smart Features (AI Assist \& Seating Chart)

Claude Prompt Directive: "Integrate OpenAI/Claude API for copywriting assistant and implement a drag-and-drop seating chart."



Task 4.1: AI Copywriter



Input: Tone (e.g., Formal, Funny, Romantic), Event Details.



Output: 3 variants of formal western wedding invitation copy (e.g., "Request the honor of your presence...").



Task 4.2: Drag-and-Drop Seating Chart



Use @hello-pangea/dnd or @dnd-kit.



Visual representation of tables (circles/rectangles). Drag guests from the "Unassigned List" into specific tables.



4\. Claude Code Implementation Roadmap (Step-by-Step Prompts)

You can feed these prompts one by one to Claude Code to execute the development:



🚀 Step 1: Initialize Project

"Claude, please initialize a Next.js 14 project using TypeScript, Tailwind CSS, and shadcn/ui. Setup the directory structure using the App Router. Install @supabase/supabase-js and set up the client initialization."



🗄️ Step 2: Database and Schema

"Based on the schema provided in the development markdown, please generate the SQL migration file or Supabase client service layer functions to handle CRUD operations for profiles, events, and guests."



🎨 Step 3: Framer Motion Invitation Animation

"Create a React component using framer-motion that simulates opening a luxury wedding invitation envelope. It should include a clickable wax seal, an opening flap, and a letter card that slides up. Make it responsive and visually stunning."



✉️ Step 4: Outbound Email Integration

"Write a backend API route in Next.js that uses resend to send an elegant HTML email to a list of guests. The email must contain a secure individualized link using the guest's access\_token."



5\. Non-Functional Requirements \& UX Benchmarks

Performance: RSVP landing page must score >90 on Google Lighthouse (Mobile) to ensure guests on cellular networks can open the animation instantly.



SEO/Social Preview: When the link is shared via WhatsApp/iMessage, it must unfurl a beautiful OpenGraph image showing a preview of the envelope with the text: "You are cordially invited to..."



Privacy: Guest list and emails must be encrypted or secured with strict RLS (Row Level Security) policies in Supabase so hosts cannot see other hosts' data.

