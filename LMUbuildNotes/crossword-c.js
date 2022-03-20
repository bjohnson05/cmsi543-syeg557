/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * An event-based crossword puzzle.
 *
 * File name   :  crossword.html
 * Purpose     :  a crossword puzzle game to test hexadecimal number system learning
 * Author      :  B.J. Johnson, from an idea by VESLL at LMU; see dissertation for citation
 * Date        :  2015-05-26
 * Description :  This is the event-based code that makes the puzzle page work.  The design is for a click
 *                event to trigger a change in the value of the cell.  Cells are in "groups" vertically,
 *                such that the green/red arrow above/below any cell controls the value of the cell.  The
 *                green arrow increments and the red arrow decrements the value.  The values are in hex,
 *                and the value will wrap, meaning that going up from a maximum of "F" will return the
 *                cell to a zero value; going down from zero will cause the cell to become "F".
 *
 * Further design descriptions:
 *  The cells in the puzzle are in vertical sets of three.  The top cell has an "up arrow" symbol, and the
 *  bottom cell has a "down arrow" symbol; when either of these is clicked, the value of the middle cell
 *  will change appropriately, incrementing or decrementing.  There are "start" and "stop" buttons which
 *  control the puzzle, and start/stop the timer that tracks the duration of the session.  Scoring is done
 *  by giving 10 points for each correct value in a cell, minus one point for each intersection of across
 *  and down solutions.  Additionally, 150 points is added if the time does not exceed the limit of (TBD)
 *  minutes.  For each minute or partial minute that the time limit is exceeded, 10 points is subtracted.
 *  This means that if the allotted time is 15 minutes, participants have up to 30 minutes before the time
 *  score starts affecting the correctness score.
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Revision History
 * ----------------
 *
 *  Rev      Date     Modified by:  Description of modification
 * -----  ----------  ------------  ----------------------------------------
 * rev -  2015-05-26  B.J. Johnson  Initial version
 * rev-a  2016-03-05  B.J. Johnson  Changed code that outputs results to perform output at end
 *                                  Added some additional output prompts to show time minutes AND score
 *                                  Added code to reset the tracking array when the scores are output
 *                                     (fixes re-displaying of scores when reset clicked for second run)
 * rev-b  2016-05-22  B.J. Johnson  Added code to track whether all tiles have been clicked; revised the
 *                                     scoring for time completion from 15/30 to 30/45
 *                                  Modified to NOT award time points if not all tiles have been clicked
 *                                  Added functions to handle new odometer page functionality
 * rev-c  2016-11-26  B.J. Johnson  Added code to prompt participant for ID number; changed "alert" to
 *                                     "prompt"; added function to call google docs to write results to
 *                                     a MySQL database; requires a separate web page that will connect
 *                                     to the lmu.build database and insert the data using php/mysqli()
 * rev-c  2017-01-15  B.J. Johnson  Minor addition to add either "i" or "r" to subjectID to indicate if
 *                                     the result is "initial" or "retention" test, respectively
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* Constants */
var CUTOFF_TIME  = 30;        // change to 4 for testing
var MAX_TIME_CUT = 45;        // change to 8 for testing
var NOT_FOUND    = -1;
var ODO_TILE_CNT =  7;        // count of odometer tiles

/* Variables */
var cellIndex    = 0;
var elapsedTime  = 0;
var numberBase   = 10;        // default to base-10 system; only used in odometer
var puzzle       = null;      // 1 for post-training test; 2 for retention test; 3 for odometer
var solution1    = "";
var solution2    = "";
var start        = 0;
var stop         = 0;
var subjectID    = null;
var timeScore    = 0;

/* Tracking and usage arrays; two puzzles */
var touchArray1 = [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
var indexArray1 = ['cell0106', 'cell0107', 'cell0108', 'cell0109', 'cell0112',
                   'cell0402', 'cell0405', 'cell0407', 'cell0410', 'cell0412',
                   'cell0700', 'cell0701', 'cell0702', 'cell0704', 'cell0705', 'cell0706', 'cell0707', 'cell0708', 'cell0709', 'cell0710', 'cell0711', 'cell0712',
                   'cell1000', 'cell1003', 'cell1004', 'cell1005', 'cell1007', 'cell1010', 'cell1011', 'cell1012', 'cell1013',
                   'cell1300', 'cell1301', 'cell1302', 'cell1303', 'cell1304', 'cell1305', 'cell1308', 'cell1309', 'cell1310', 'cell1311'];

var touchArray2 = [1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var indexArray2 = ['cell0100', 'cell0103', 'cell0104', 'cell0105', 'cell0106', 'cell0109', 'cell0112',
                   'cell0400', 'cell0403', 'cell0404', 'cell0405', 'cell0407', 'cell0409', 'cell0411', 'cell0412', 'cell0413',
                   'cell0700', 'cell0701', 'cell0702', 'cell0703', 'cell0704', 'cell0705', 'cell0707', 'cell0709', 'cell0710', 'cell0711', 'cell0712',
                   'cell1002', 'cell1005', 'cell1006', 'cell1007', 'cell1008', 'cell1009',
                   'cell1302', 'cell1303', 'cell1304', 'cell1307'];

/* Function to increase the value of a cell digit */
function bumpup( cellNumber ) {
   var myCell = document.getElementById( cellNumber );
   var value = myCell.innerHTML;
   if( 16 === numberBase ) {
      myCell.innerHTML = hexAdjust( parseInt( value, 16 ) + 1 );
      if( puzzle === 1 ) {
         cellIndex = indexArray1.indexOf( cellNumber );
         touchArray1[cellIndex] = 1;
      } else {
         cellIndex = indexArray2.indexOf( cellNumber );
         touchArray2[cellIndex] = 1;
      }
   } else {
      myCell.innerHTML = decAdjust( parseInt( value, 10 ) + 1 );
   }
}

/* Function to decrease the value of a cell digit */
function bumpdn( cellNumber ) {
   var myCell = document.getElementById( cellNumber );
   var value = myCell.innerHTML;
   if( 16 === numberBase ) {
      myCell.innerHTML = hexAdjust( parseInt( value, 16 ) - 1 );
      if( puzzle === 1 ) {
         cellIndex = indexArray1.indexOf( cellNumber );
         touchArray1[cellIndex] = 1;
      } else {
         cellIndex = indexArray2.indexOf( cellNumber );
         touchArray2[cellIndex] = 1;
      }
   } else {
      myCell.innerHTML = decAdjust( parseInt( value, 10 ) - 1 );
   }
}

/* Function to reset the values to zeros */
function resetToZero() {
   var name  = '';
   for( var i = 0; i < ODO_TILE_CNT; i++ ) {
   var name  = '';
      document.getElementById('cell010' + i).innerHTML = '0';
   }
}

/* Function to toggle number base between 10 and 16 */
function changeBase() {
   numberBase = (numberBase === 10) ? 16 : 10;
   resetToZero();
   alert( "Number base is now: " + numberBase );
}

/* Function to calculate the base-10 value and display it */
function calcBase10() {
   var value = 0;
   var power = 0;
   var total = 0;
   var output = "Calculating Base 10 value:\n";
   for( var i = ODO_TILE_CNT - 1; i >= 0 ; i-- ) {
      value = parseInt( document.getElementById('cell010' + i).innerHTML, numberBase ) * Math.pow( numberBase, power++ );
      output += "Adding " + value + " to " + total + "\n";
      total += value;
   }
   output += "\nTotal is: " + total + "\n";
   alert( output );
}

/* Function to handle display of a decimal digit */
function decAdjust( value ) {
   switch( value ) {
      case 0: case 1: case 2: case 3: case 4:
      case 5: case 6: case 7: case 8: case 9:
               return value;
               break;
      case 10: return "0";
               break;
      case -1: return "9";
               break;
   }
}

/* Function to handle display of a hexadecimal digit */
function hexAdjust( value ) {
   switch( value ) {
      case 0: case 1: case 2: case 3: case 4:
      case 5: case 6: case 7: case 8: case 9:
               return value;
               break;
      case 10: return "A";
               break;
      case 11: return "B";
               break;
      case 12: return "C";
               break;
      case 13: return "D";
               break;
      case 14: return "E";
               break;
      case 15: return "F";
               break;
      case 16: return "0";
               break;
      case -1: return "F";
               break;
   }
}

/* Initialization funciton for puzzle number 1, the post-training puzzle */
function initSolution1() {
   var sums = new Array();
   sums[0]  = (0xBAAC + 0x32).toString( 16 ).toUpperCase();
   sums[1]  = (0xD7B - 0xCCC).toString( 16 ).toUpperCase();
   sums[2]  = (0xFAF5B9698 - 0x2789BCA).toString( 16 ).toUpperCase();
   sums[3]  = (0x10C24 - 0xFF77).toString( 16 ).toUpperCase();
   sums[4]  = (0xC0D0 + 0xE).toString( 16 ).toUpperCase();
   sums[5]  = (0xFACAEC - 0xE).toString( 16 ).toUpperCase();
   sums[6]  = (0xACE + 0x7 + 0xF418).toString( 16 ).toUpperCase();

   solution1 = sums[0];
   for( var i = 1; i < sums.length; i++ ) {
      if( i === 1 ) {
         solution1 += "80FCF60";
      } else if( i === 3 ) {
         solution1 += "F";
      } else if( i === 4 ) {
         solution1 += "D";
      }
      solution1 += sums[i];
   }
   puzzle = 1;
   numberBase = 16;
   document.getElementById('startbtn').disabled = false;
   document.getElementById('stopbtn').disabled = true;
}

/* Initialization funciton for puzzle number 2, the retention test puzzle */
function initSolution2() {
   var sums = new Array();
   sums[0]  = (0xA88A + 0x1234).toString( 16 ).toUpperCase();
   sums[1]  = (0xC1B8 - 0xC0DA).toString( 16 ).toUpperCase();
   sums[2]  = (0xABC - 0xA0D).toString( 16 ).toUpperCase();
   sums[3]  = (0xFACAEC - 0xE).toString( 16 ).toUpperCase();
   sums[4]  = (0x90E0 + 0x1C0D).toString( 16 ).toUpperCase();
   sums[5]  = (0xEB30F + 0xFADE).toString( 16 ).toUpperCase();
   sums[6]  = (0xD9DC - 0xCDEF).toString( 16 ).toUpperCase();

   solution2 = "0" + sums[0] + "DCF0";
   for( var i = 1; i < sums.length; i++ ) {
      if( i === 2 ) {
         solution2 += "CE0";
      } else if( i === 4 ) {
         solution2 += "E";
      } else if( i === 5 ) {
         solution2 += "A";
      }
      solution2 += sums[i];
   }
   solution2 += "E";
   puzzle = 2;
   numberBase = 16;
   document.getElementById('startbtn').disabled = false;
   document.getElementById('stopbtn').disabled = true;
}

/* Initialization for puzzle 3 which is not currently implemented */
function initSolution3() {
   puzzle = 3;
}

/* Function to start the timer;
 *  actually just logs the current time when "Start" button is clicked */
function startTimer() {
   start = new Date().getTime();
   document.getElementById('startbtn').disabled = true;
   document.getElementById('stopbtn').disabled = false;
}

/* Function to assess and display the participant score when the "Stop" button is clicked */
function stopAndCheck() {
   var answer = "";
   var score = 0;
   var scoreArray1 = [10,9,10,10,10,10,10,10,10,10,9,10,9,9,9,10,9,10,10,9,9,9,10,9,9,9,10,9,9,9,10,9,10,10,9,9,9,10,10,9,9];
   var scoreArray2 = [10,9,9,9,10,10,10,10,9,9,9,10,10,9,9,10,9,10,9,9,9,9,10,9,10,9,9,10,9,10,9,10,9,9,10,10,10];
   stop  = new Date().getTime();
   elapsedTime = Math.ceil( ((stop - start) / 1000) / 60 );
   if( (CUTOFF_TIME < elapsedTime) && (elapsedTime < MAX_TIME_CUT) ) {
      if( puzzle === 1 ) {
         if( NOT_FOUND === touchArray1.indexOf( 0 ) ){
            timeScore = (150 - ((elapsedTime - CUTOFF_TIME) * 10));
         }
      } else {
         if( NOT_FOUND === touchArray2.indexOf( 0 ) ){
            timeScore = (150 - ((elapsedTime - CUTOFF_TIME) * 10));
         }
      }
   } else if( MAX_TIME_CUT <= elapsedTime ) {
      timeScore = 0;
   } else {
      if( puzzle === 1 ) {
         if( NOT_FOUND === touchArray1.indexOf( 0 ) ){
            timeScore = 150;
         }
      } else {
         if( NOT_FOUND === touchArray2.indexOf( 0 ) ){
            timeScore = 150;
         }
      }
   }
   document.getElementById('startbtn').disabled = true;  // disable buttons to prevent retries
   document.getElementById('stopbtn').disabled = true;

  /* Two puzzles, two solutions, make a string to compare to the solution string */
   if( puzzle === 1 ) {
      answer += document.getElementById('cell0106').innerHTML + document.getElementById('cell0107').innerHTML +
                document.getElementById('cell0108').innerHTML + document.getElementById('cell0109').innerHTML +
                document.getElementById('cell0112').innerHTML + document.getElementById('cell0402').innerHTML +
                document.getElementById('cell0405').innerHTML + document.getElementById('cell0407').innerHTML +
                document.getElementById('cell0410').innerHTML + document.getElementById('cell0412').innerHTML +
                document.getElementById('cell0700').innerHTML + document.getElementById('cell0701').innerHTML +
                document.getElementById('cell0702').innerHTML + document.getElementById('cell0704').innerHTML +
                document.getElementById('cell0705').innerHTML + document.getElementById('cell0706').innerHTML +
                document.getElementById('cell0707').innerHTML + document.getElementById('cell0708').innerHTML +
                document.getElementById('cell0709').innerHTML + document.getElementById('cell0710').innerHTML +
                document.getElementById('cell0711').innerHTML + document.getElementById('cell0712').innerHTML +
                document.getElementById('cell1000').innerHTML + document.getElementById('cell1003').innerHTML +
                document.getElementById('cell1004').innerHTML + document.getElementById('cell1005').innerHTML +
                document.getElementById('cell1007').innerHTML + document.getElementById('cell1010').innerHTML +
                document.getElementById('cell1011').innerHTML + document.getElementById('cell1012').innerHTML +
                document.getElementById('cell1013').innerHTML + document.getElementById('cell1300').innerHTML +
                document.getElementById('cell1301').innerHTML + document.getElementById('cell1302').innerHTML +
                document.getElementById('cell1303').innerHTML + document.getElementById('cell1304').innerHTML +
                document.getElementById('cell1305').innerHTML + document.getElementById('cell1308').innerHTML +
                document.getElementById('cell1309').innerHTML + document.getElementById('cell1310').innerHTML +
                document.getElementById('cell1311').innerHTML;

     /* Evaluation loop for puzzle one (initial) */
      for( var i = 0; i < answer.length; i++ ) {
         if( solution1[i] === answer[i] ) {
            score += scoreArray1[i];
         }
      }
   } else {
      answer += document.getElementById('cell0100').innerHTML + document.getElementById('cell0103').innerHTML +
                document.getElementById('cell0104').innerHTML + document.getElementById('cell0105').innerHTML +
                document.getElementById('cell0106').innerHTML + document.getElementById('cell0109').innerHTML +
                document.getElementById('cell0112').innerHTML + document.getElementById('cell0400').innerHTML +
                document.getElementById('cell0403').innerHTML + document.getElementById('cell0404').innerHTML +
                document.getElementById('cell0405').innerHTML + document.getElementById('cell0407').innerHTML +
                document.getElementById('cell0409').innerHTML + document.getElementById('cell0411').innerHTML +
                document.getElementById('cell0412').innerHTML + document.getElementById('cell0413').innerHTML +
                document.getElementById('cell0700').innerHTML + document.getElementById('cell0701').innerHTML +
                document.getElementById('cell0702').innerHTML + document.getElementById('cell0703').innerHTML +
                document.getElementById('cell0704').innerHTML + document.getElementById('cell0705').innerHTML +
                document.getElementById('cell0707').innerHTML + document.getElementById('cell0709').innerHTML +
                document.getElementById('cell0710').innerHTML + document.getElementById('cell0711').innerHTML +
                document.getElementById('cell0712').innerHTML + document.getElementById('cell1002').innerHTML +
                document.getElementById('cell1005').innerHTML + document.getElementById('cell1006').innerHTML +
                document.getElementById('cell1007').innerHTML + document.getElementById('cell1008').innerHTML +
                document.getElementById('cell1009').innerHTML + document.getElementById('cell1302').innerHTML +
                document.getElementById('cell1303').innerHTML + document.getElementById('cell1304').innerHTML +
                document.getElementById('cell1307').innerHTML;

     /* Evaluation loop for puzzle two (retention) */
      for( var i = 0; i < answer.length; i++ ) {
         if( solution2[i] === answer[i] ) {
            score += scoreArray2[i];
         }
      }
   }

  /* Output result and get participant ID to send to google docs sheet */
   while( subjectID == null || subjectID.length == 0 ) {
      subjectID = prompt( "CONGRATULATIONS!!\n\n" +
                          "Your correctness score is: " + score + "\n" +
                          "Your elapsed time is: " + elapsedTime + " minutes\n" +
                          "Your elapsed time score is: " + timeScore + "\n" +
                          "Your total score is: " + (score + timeScore) + "\n\n" +
                          "Please enter your participant ID number: " );
   }
   if( puzzle === 1 ) {
      subjectID += 'i';
   } else {
      subjectID += 'r';
   }

   var URLquery = '?subjectID=' + subjectID + '&score=' + score + '&elapsedTime=' + elapsedTime + '&timeScore=' + timeScore + '&total=' + (score + timeScore);
   window.location = 'http://bjohnson.lmu.build/researchproject/connecttest1.php' + URLquery;
}
