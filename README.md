# Inner Compass

Use this as a detailed prompt for Lovable:

Build an AI-Powered Journaling & Personal Growth Platform

Create a modern, premium, mobile-first web application called ReflectAI (placeholder name) that combines journaling, mood tracking, habit tracking, goal tracking, and AI-powered personal insights.

The product should feel like a combination of Apple Journal, Notion, Day One, and an AI life coach.

Product Vision

The application should help users:

Capture thoughts effortlessly

Track moods and emotions

Build habits

Track goals

Reflect on life experiences

Discover patterns through AI

Improve mental clarity and personal growth

The experience should be calming, elegant, minimal, and distraction-free.

Design Requirements

Visual Style

Modern SaaS design

Premium Apple-inspired aesthetic

Rounded corners

Smooth animations

Glassmorphism used subtly

Soft shadows

Clean typography

Minimalistic layout

Responsive for mobile, tablet, and desktop

Color Palette

Primary:

Deep Indigo

Soft Blue

Secondary:

White

Light Gray

Accent:

Emerald Green

Warm Orange

Mood colors:

Happy → Green

Calm → Blue

Neutral → Gray

Sad → Purple

Angry → Red

Support Dark Mode and Light Mode.

Authentication

Pages:

Landing Page

Sections:

Hero section

Features

AI Insights showcase

Testimonials

Pricing

FAQ

Footer

Hero headline:

"Understand Yourself Better Every Day"

CTA buttons:

Start Journaling Free

Watch Demo

Sign Up

Options:

Email

Google OAuth

Login

Email

Google OAuth

Dashboard

After login, users land on a personalized dashboard.

Display:

Greeting based on time

Current streak

Today's mood prompt

Quick journal button

Weekly summary card

Recent entries

Example:

Good Evening, John

How are you feeling today?

😊 😌 😐 😔 😡

[Start Writing]

Journal Module

Journal Editor

Two modes:

Free Writing

Large distraction-free editor

Features:

Rich text

Markdown support

Auto-save

Word count

Character count

Guided Journaling

AI-generated prompts

Examples:

What went well today?

What challenged you today?

What did you learn?

What will you improve tomorrow?

Journal Features

Users can:

Create entry

Edit entry

Delete entry

Archive entry

Pin entry

Favorite entry

Each entry supports:

Text

Images

Voice notes

Tags

Examples:

#fitness
#career
#college
#relationships

Mood Tracking

Each journal entry includes mood selection.

Mood options:

😊 Happy

😌 Calm

😐 Neutral

😔 Sad

😡 Angry

Store mood history.

Display:

Weekly trends

Monthly trends

Yearly trends

Visualize using beautiful charts.

Calendar View

Create a calendar page.

Each date should show:

Mood icon

Entry count

Habit completion

Clicking a day opens entries.

Timeline View

Create a personal timeline.

Display:

Date

Entry title

Mood

Thumbnail image if available

Infinite scroll.

Habit Tracker

Users can create habits.

Examples:

Gym

Running

Reading

Meditation

Coding

Features:

Daily check-ins

Streaks

Completion percentage

Progress charts

Dashboard widget:

Gym
████████░░ 80%

Running
██████░░░░ 60%

Goal Tracking

Users can create goals.

Examples:

Run Half Marathon

Build SaaS Product

Read 20 Books

Each goal includes:

Title

Description

Target Date

Progress Percentage

Users can attach journal entries to goals.

Display goal progress visually.

AI Features

Create dedicated AI functionality.

Daily Summary

AI generates:

Key achievements

Main emotions

Notable moments

Based on journal entries.

Weekly Reflection

Generate:

Biggest wins

Biggest challenges

Lessons learned

Emotional trends

Monthly Reflection

Generate:

Most discussed topics

Habit consistency

Mood patterns

Growth insights

AI Coach

Chat interface.

Users ask:

Why am I feeling stressed?

What patterns do you notice?

How can I improve consistency?

AI analyzes journal history and provides insights.

Search

Global search.

Users can search:

Keywords

Tags

Dates

Goals

Habits

Include AI semantic search.

Example:

Search:

"gym motivation"

Returns related entries even if exact words aren't used.

Memory Vault

Special section for important memories.

Categories:

Life Lessons

Achievements

Dreams

Important Moments

Favorite Memories

Users can pin entries permanently.

Analytics Page

Create beautiful analytics dashboard.

Display:

Mood Analytics

Weekly chart

Monthly chart

Yearly chart

Writing Analytics

Entry count

Words written

Longest streak

Habit Analytics

Completion rates

Consistency score

Topic Analytics

AI-generated insights:

Fitness → 35%

Career → 25%

Education → 20%

Relationships → 10%

Other → 10%

Notifications

Daily reminders.

Examples:

Time to journal

Complete habits

Weekly reflection ready

Allow user customization.

Privacy & Security

Features:

End-to-end privacy focused design

Password protection

PIN lock

Biometric support architecture

Secure encrypted storage

Premium Features

Prepare architecture for:

AI Coach

Unlimited AI summaries

Voice journaling

PDF export

Advanced analytics

Unlimited storage

Technical Requirements

Frontend:

React

TypeScript

Tailwind CSS

shadcn/ui

Backend:

Supabase

Database:

PostgreSQL

Authentication:

Supabase Auth

Google OAuth

Charts:

Recharts

State Management:

Zustand

AI Integration:

OpenAI API compatible architecture

Deliverables

Generate:

Complete application UI

Landing page

Authentication pages

Dashboard

Journal editor

Mood tracking screens

Habit tracker

Goal tracker

Analytics dashboard

AI Coach chat screen

Calendar view

Timeline view

Settings page

Responsive mobile layouts

Dark mode support

Supabase database schema

API architecture

Component architecture

Production-ready code structure

Build this as a polished startup-quality SaaS product that is visually impressive, intuitive, and ready for future monetization.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://reflect-mindful-insights.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3823b854-3b23-47cf-aed0-2ba1c1b88750).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
