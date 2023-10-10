export function isStartDateBeforeEndDate(obj: { start: string; end: string }) {
  // Check if the object has both start and end properties
  if (obj.hasOwnProperty("start") && obj.hasOwnProperty("end")) {
    // Parse the start and end date strings and compare them
    var start = Date.parse(obj.start);
    var end = Date.parse(obj.end);
    return start < end;
  } else {
    // Return false if the object does not have both properties
    return false;
  }
}
