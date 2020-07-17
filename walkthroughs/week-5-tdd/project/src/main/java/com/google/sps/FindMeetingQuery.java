// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

public final class FindMeetingQuery {

  /**
  * Queries through a list of events and creates a list of possible time ranges
  * where the requested meeting can take place.
  * @param events the list of events taking place to be considered.
  * @param request a meeting request with information about the meeting.
  * @return a list of time ranges where the requested meeting could take place.
  */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<TimeRange> possibleTimes = new ArrayList<>();
    List<Event> eventList = new ArrayList<>(events);
    long duration = request.getDuration();

    // Begins with the assumption that the entire day is available.
    return findOpennings(possibleTimes, eventList, 0, TimeRange.START_OF_DAY, duration, request.getAttendees());
  }

  /**
  * Sorts the list of events taking place by their start times.
  */
  private static void sortEventsByStart(List<Event> eventList) {
    eventList.sort(new Comparator<Event>() {
      @Override
      public int compare(Event a, Event b) {
        return TimeRange.ORDER_BY_START.compare(a.getWhen(), b.getWhen());
      }
    });
  }

  /**
  * Whether there is at least a required attendee for the meeting attending the event. 
  */
  private static boolean attendeesRequired(Collection<String> meetingAttendees, Set<String> eventAttendees) {
    for (String meetingAttendee: meetingAttendees) {
      if (eventAttendees.contains(meetingAttendee))
        return true;
    }
    return false;
  }

  /**
  * Recursively goes through the list of events to find gaps in time ranges where the
  * requested meeting could take place.
  */
  private Collection<TimeRange> findOpennings(List<TimeRange> possibleTimes, List<Event> eventList, int eventIdx, int position, long duration, Collection<String> meetingAttendees) {
    if (eventIdx >= eventList.size()) {
      if (TimeRange.END_OF_DAY - position >= duration) {
        // Add time range if the gap between the last event and the end of the day is sufficient for the meeting
        TimeRange gap = TimeRange.fromStartEnd(position, TimeRange.END_OF_DAY, true);
        possibleTimes.add(gap);
      }
      return possibleTimes;
    }

    // Skip current event if none of its attendees are required for the meeting
    if (!attendeesRequired(meetingAttendees, eventList.get(eventIdx).getAttendees()))
      return findOpennings(possibleTimes, eventList, eventIdx+1, position, duration, meetingAttendees);

    TimeRange eventRange = eventList.get(eventIdx).getWhen();

    if (eventRange.start() - position >= duration) {
      // Add time range if the time gap between the position and the start of the event is sufficient for the meeting
      TimeRange gap = TimeRange.fromStartEnd(position, eventRange.start()-1, true);
      possibleTimes.add(gap);
    }

    position = eventRange.end();
    int nextEventIdx = eventIdx+1;

    if (nextEventIdx < eventList.size()) {
      TimeRange nextEventRange = eventList.get(nextEventIdx).getWhen();
      if (eventRange.overlaps(nextEventRange)) {
        if (nextEventRange.end() > eventRange.end()) {
          // Set position to the end of the next event if it overlaps with the current event but ends after it
          position = nextEventRange.end();
        }
        nextEventIdx++;
      }
    }

    return findOpennings(possibleTimes, eventList, nextEventIdx, position, duration, meetingAttendees);
  }
}
