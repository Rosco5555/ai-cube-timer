# Attempted one shot at a basic speed solving cubing website in React + Typescript

## PROMPT:

Write me react + typescript app that is rubiks cube timer website. The spacebar stops and starts the timer. When the timer is stopped a new Rubik's cube scramble is generated using the TNoodle algorithm.

The times should be stored in local storage and displayed a list.

The current average of 5, average of 12, average of 50, and average of 100 should be calculated.

These are calculated by removing the highest and lowest value. For example 1,2,34,5 has an average of 5 of 3.

Also add a button to clear all the times and averages

## Model: Claude Opus 4.1

### Follow up prompts:

The page is overflowing vertically when there are too many times. The width of the page changes depending on the length of the scramble. I want both to be constant

The width of the content still changes depending on the length of the scramble. Show me ONLY the css I need to fix this