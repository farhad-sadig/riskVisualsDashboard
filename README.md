**Frontend Framework:** Next.js  
**Database:** PostgreSQL  
**ORM (Object-Relational Mapping):** Prisma  
**Global State Managenent:** Redux Toolkit  
**Styling:** Tailwind CSS

**ABOUT**  
The overall purpose of the project is to demonstrate proficiency in complicated global state management using Redux Toolkit, component animations/transitions, creation of responsive components and use of JavaScript/TypeScript.

The project involves a dashboard to visualize exposure of businesses to risks associated with the climate in the future. The dashboard includes a line chart (D3.js), a map (Mapbox) and a table.

A typical entry in the risks dataset has the following:  
**Asset Name:** Jones Ltd  
**Lat:** 42.8334  
**Long:** -80.38297  
**Business Category:** Energy  
**Risk Rating:** 0.14  
**Year:** 2050  
**Risk Factors:** {"Extreme heat": 0.01, "Wildfire": 0.04, "Tornado": 0.03, "Flooding": 0.02, "Volcano": 0.01, "Hurricane": 0.02, "Earthquake": 0.01}

To get started with either the map or the table, select a year from the provided dropdown.

For the selected year, business assets will be visualized on the map as color-coded markers based on their risk rating. The map has added interactivity, such as zooming, panning and displays a tooltip with further details like corresponding risk ratings shown as a percentage, asset name and business category.

The table also responds to the selection of a year from the dropdown. In addition to filtering and sorting capabilities, it has a tooltip showing risk rating breakdown (risk factors that add up to risk rating) when hovering over the rating. Furthermore, the table can easily be optimized to efficiently handle much larger datasets via built-in pagination, can be changed to dispay various amount of rows per page and can hide/show the available columns.

The line chart gets drawn as a result of either clicking a marker on the map or choosing asset names/business categories from another dropdown. Since there are numerous entries in the dataset for each possible selection in a given year, the corresponding risk rating (shown as a percentage) is calculated by performing data aggregation to find the maximum. When the line chart input changes, it smoothly transitions from the old input to new via animations. Animations are also engaged after window resizing events.
