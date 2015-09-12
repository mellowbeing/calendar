/*
  Calendar App
  Jennifer Refat - March 2015
  
  Expected input format:
  [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}, ... ]
  
  - The value of these attributes is the number of minutes since 9am. So {start:30, end:90) represents an event from 9:30am to 10:30am.
  
  
  Rules:
  - No events may visually overlap.
  - If two events collide in time, they MUST have the same width. This is an invariant. Call this width W.
  W should be the maximum value possible without breaking the previous invariant.
  
  
  Usage:
  function layOutDay(events) {} is in the global namespace.  It can be invoked in the browser console given an array of events.
  This function will layout the calendar events based on the above rules.
*/


var Calendar = (function() {

  var self = this;
  
  function layOutDay(events) {
    
    if (events.length) {
    
      initialize();
      
      sortEvents(events);
      
      // Assign each event to a group with all overlapping events.
      assignToGroup(events);
      
      // Assign each event to the appropriate column
      assignToColumns(events);
      
      // Display events on calendar
      renderEvents();
    }
  }
  
  
  /*
    Reset all counters
  */
  function initialize () {
    // Used to keep track of total number of columns and their contents
    var columns,
        $el,
        columnWidths;
      
      self.columns       = [];
      self.$el           = $('.calendarContainer');
      self.columnWidths  = [];
  }
  
  
  /*
    Assign each event to a group which contains all overlapping events.
    
    Break events into subgraphs, where an edge is an overlap between two events.
    All subgraphs are disjoint, and have a unique identifier stored in event.groupIndex of each event in the subgraph.
  */
  function assignToGroup(events) {
    
    var i, 
        end = -1,
        groupIndex = -1;
    
    for (i=0; i<events.length; i++) {
      
      // current event overlaps with previous event - add to same group
      if (events[i].start < end) {
        events[i].groupIndex = groupIndex;
        // keep the end time of the event that ends the latest.
        end = Math.max(events[i].end, end);
      }
      // no overlap - create a new group, and add the current event to that group
      else {
        groupIndex++;
        events[i].groupIndex = groupIndex;
        columnWidths[groupIndex] = 0;
        end = events[i].end;
      }
    }
  }
  
  
  /*
    Assign each event to a column. Events are expected to be sorted by start time.
    Events are iterated in order and assigned to the leftmost column where there is no overlapping event.
  */
  function assignToColumns(events) {
    
    var eventsLen = events.length,
        hasBeenAdded,
        maxColumnIndex,
        i,
        j;
    
    for (i=0; i<eventsLen; i++) {
      
      hasBeenAdded = false;
      
      for (j=0; j<columns.length; j++) {

        if (!hasCollision(events[i], columns[j])) {
          hasBeenAdded = true;
          
          // add to first empty column
          columns[j].push(events[i]);
          
          // get the larger of current column width and the stored one
          maxColumnIndex = Math.max(columnWidths[events[i].groupIndex], j);
          
          // update group's column width with max column width
          columnWidths[events[i].groupIndex] = maxColumnIndex;
          
          break;
        }
      }
      
      // create new column
      if (!hasBeenAdded) {
        columns.push([events[i]]);
        
        // set the column index to current column
        columnWidths[events[i].groupIndex] = columns.length - 1;
      }
    }
  }
  
  
  /*
    Determine whether an event overlaps with any event in a given column
  */
  function hasCollision(event, column) {
  
    var i, eventOne, eventTwo;
    
    for (i=0; i<column.length; i++) {
      
      eventOne = event;
      eventTwo = column[i];
      
      // collision
      if ( (eventOne.start < eventTwo.end) && (eventOne.end > eventTwo.start) ) {
        return true;
      }   
    }    
    return false;
  }


  /*
    Render all the events!
  */  
  function renderEvents() {
    var totalPercent = 100,
        currentEvent,
        curCol,
        width,
        height,
        leftOffset,
        eventText,
        i,
        j;
    
    // empty container before adding new events
    $el.empty();
    
    // go through all columns
    for (i=0; i<columns.length; i++) {
      
      // go through all events in single column
      for (j=0; j<columns[i].length; j++) {
        currentEvent = columns[i][j];
        
        width       = totalPercent / (columnWidths[currentEvent.groupIndex] + 1);
        height      = currentEvent.end - currentEvent.start;
        leftOffset  = i * width;
        
        // If container is too short, only display event title
        if (height < 45) {
          eventText = "<h2>Sample Event</h2>";
        }
        // Otherwise, display event title & location
        else {
          eventText = "<h2>Sample Event</h2><h3>Sample Location</h3>";
        }
        
        $el.append('<div class="calendarSlot" style="width: ' + width + '%; height:'+ height +'px; top:' + currentEvent.start + 'px; left: ' + leftOffset + '%">' + eventText + '</div>');
      }
    }
  }
  
  /*
    Sort events by start time in ascending order
  */
  function sortEvents(events) {
    events.sort(function(a,b) { 
      return parseFloat(a.start) - parseFloat(b.start);
    });
  }
  
  
  // Set layOutDay() as a public function
  return {
    layOutDay : layOutDay
  }
})();


var events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];

Calendar.layOutDay(events);