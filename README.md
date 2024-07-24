# Risk Visuals Dashboard

## Table of Contents

- [Introduction](#introduction)
- [Stack](#stack)
- [Features](#features)
- [Dataset Example](#dataset-example)
- [Get Started](#get-started)
- [Demo](#demo)

## Introduction

The purpose of this project is to demonstrate proficiency in advanced global state management using Redux Toolkit, component animations and transitions, creating responsive components, and utilizing JavaScript/TypeScript.

## Stack

**Next.js**  
**PostgreSQL**  
**ORM (Object-Relational Mapping):**  
**Redux Toolkit**  
**Tailwind CSS**

## Features

The project involves a dashboard designed to visualize the exposure of businesses to future climate-related risks. The dashboard includes:

- A line chart (D3.js)
- A map (Mapbox)
- A table

## Dataset Example

A typical entry in the risks dataset includes the following information:

- Asset Name: Jones Ltd
- Latitude: 42.8334
- Longitude: -80.38297
- Business Category: Energy
- Risk Rating: 0.14
- Year: 2050
- Risk Factors:
  - Extreme heat: 0.01
  - Wildfire: 0.04
  - Tornado: 0.03
  - Flooding: 0.02
  - Volcano: 0.01
  - Hurricane: 0.02
  - Earthquake: 0.01

## Get Started

To begin, select a year from the provided dropdown menu.

### Map Visualization

Business assets for the selected year will appear on the map as color-coded markers based on their risk rating.
The map features interactivity, including zooming, panning, and tooltips displaying further details such as the risk rating (shown as a percentage), asset name, and business category.

### Table Visualization

The table also responds to the selected year from the dropdown menu.
It includes filtering and sorting capabilities.
Hovering over the risk rating in the table shows a tooltip with a breakdown of the risk factors contributing to the overall risk rating.
The table can handle large datasets efficiently through built-in pagination, adjustable rows per page, and the ability to show/hide columns.

### Line Chart Visualization

The line chart is drawn based on either clicking a marker on the map or selecting asset names/business categories from another dropdown menu.
For each selection in a given year, the corresponding risk rating (shown as a percentage) is calculated by aggregating data to find the maximum risk rating.
The line chart transitions smoothly with animations when input changes or after window resizing events.

By integrating these features, the project aims to provide a comprehensive and interactive tool for visualizing climate risk exposure for businesses.

## Demo

Below are a few short demos of the key features of the dashboard in action.

Interactivity between the map and the line chart, animated transtions in the line chart:
![Risk Visuals Dashboard Key Highlights - 1](public/gifs/mg-1.gif)

Responsiveness of the dashboard components and animated resizing of the line chart:
![Risk Visuals Dashboard Key Highlights - 2](public/gifs/mg-2.gif)

Ability to plot the risks for single or a combination of business names/categories:
![Risk Visuals Dashboard Key Highlights - 3](public/gifs/mg-3.gif)

Table with filtering and sorting capabilities:
![Risk Visuals Dashboard Key Highlights - 4](public/gifs/mg-4.gif)

