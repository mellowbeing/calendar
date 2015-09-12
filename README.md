# Calendar App

## Demo

Demo can be found [here](http://jenrefat.com/demos/calendar/ "Calendar App")  
  
## Rules:
* No events may visually overlap.
* If two events collide in time, they MUST have the same width. This is an invariant. Call this width W.
  W should be the maximum value possible without breaking the previous invariant.
  
## Usage:
* function layOutDay(events) {} is in the global namespace.  It can be invoked in the browser console given an array of events.
* This function will layout the calendar events based on the above rules.

* Expected input format:
[ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}, ... ]
  
* The value of these attributes is the number of minutes since 9am. So {start:30, end:90) represents an event from 9:30am to 10:30am.
