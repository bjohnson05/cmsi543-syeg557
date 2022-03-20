<!doctype html>
<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
<  PHP access to MySQL database
<  database name is testmysql
<
<  Steps:
<    1. create a database connection
<    2. perform a database query
<    3. use the returned data (if any)
<    4. release the data/memory
<    5. close the database connection
<
<  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->

<html>

   <head>
      <meta charset='UTF-8' />
      <title>TWELVE Database Response</title>
      <link rel ='stylesheet'    type='text/css' href='crossword.css' />
      <link rel ='shortcut icon' href='CGU_logo2.ico' />
   </head>
   <body style='background-color: #eee'>
      <pre>
      <?php
         global $connection;
         global $elapsedTime;
         global $result;
         global $score;
         global $subjectID;
         global $timeScore;
         global $total;

        // This side gets the values                  this side displays them (cruft for debugging later)
         $elapsedTime = $_GET[ 'elapsedTime' ];    // echo "ELAPSED TIME: " . $elapsedTime . "<br />";
         $score       = $_GET[ 'score' ];          // echo "SCORE: "        . $score . "<br />";
         $subjectID   = $_GET[ 'subjectID' ];      // echo "SUBJECT ID: "   . $subjectID . "<br />";
         $timeScore   = $_GET[ 'timeScore' ];      // echo "TIME SCORE: "   . $timeScore . "<br />";
         $total       = $_GET[ 'total' ];          // echo "TOTAL: "        . $total . "<br /><br />";

         // print_r($_SERVER);
         error_reporting( E_ALL );
         ini_set( "display_errors", 1 );
         print "<h1 class='title'>TWELVE Research Study Response Page</h1>";

        // 1. set up the connection parameters
        //    then call the mysqli_connect function to make the connection
        //    inform if the connection is good or not
         $dbhost = "bjohnson.lmu.build";
         $dbuser = "bjohnson_twelve";
         $dbpass = "Ki\$\$MyGrits77";
         $dbname = "bjohnson_twelveDB";
         $connection = mysqli_connect( $dbhost, $dbuser, $dbpass, $dbname );
         if( $connection ) {
            print "CONNECTED to TWELVE database...<br />";
         } else {
            print "Connection to TWELVE database FAILED...<br />";
         }

        // 2. perform a database query to get the contents of all rows in the table
        //    result is a "mysqli_result" which is a collection of database rows
        //    TODO: this is cruft in case I need it for debugging; will remove it later.
        // if( $connection ) {
        //    print "Performing query<br />";
        //    $query = "SELECT subjectID, correctness, timescore, time, totalscore FROM `studydata`;";
        //    $result = mysqli_query( $connection, $query );
        //    if( !$result ) {
        //       print  "DATABASE QUERY FAILED...<br />";
        //    } else {
        //       print  "QUERY SUCCEEDED!!<br />";
        //       while( $row = mysqli_fetch_row( $result ) ) {
        //          print "SubjectID: $row[0] - correctness: $row[1] - timescore: $row[2] - time: $row[3] - totalscore: $row[4]<br />";
        //       }
        //    }
        // }

        // 3. perform a database query to insert values into the table in a new row
        //    notify if the operation succeeded or not
         if( $connection ) {
            print "Writing your data to the TWELVE database....<br />";
            $query = "INSERT INTO `studydata`( `subjectID`, `correctness`, `timescore`, `time`, `totalscore`) VALUES ( '$subjectID', $score, $timeScore, $elapsedTime, $total )";
            $result = mysqli_query( $connection, $query );
            if( !$result ) {
               print "<strong style='font-size: 150%; color: red;'><br />TWELVE DATABASE insertion FAILED...</strong><br />";
               print "<p>Please write down the following values and " .
                     "e-mail them to <a href='mailto:robert.johnson@cgu.edu'>Robert Johnson</a>.</p>";
               print "<blockquote style='font-size: 125%;'><strong>Your Subject ID: " . $subjectID . "<br />" .
                     "Your correctness score: " . $score . "<br />" .
                     "Your time score: " . $timeScore . "<br />" .
                     "Your elapsed time: " . $elapsedTime . "<br />" .
                     "Your total score: " . $total . "</strong></blockquote><br /><br />";
            } else {
               print  "<h3 style='font-size: 200%; background-color: #ddd;'>SUCCESS!!  Your data has been saved.</h3><br />";
            }
         }

        // 4. perform a database query to get the contents of all rows in the table again
        //    notify if the operation succeeded or not; verifies if the data was inserted properly
         if( $connection ) {
            print "Performing Verification....<br /><br />";
            $query = "SELECT subjectID, correctness, timescore, time, totalscore FROM `studydata`;";
            $result = mysqli_query( $connection, $query );
            if( !$result ) {
               print "DATABASE Verification FAILED...<br />";
               print "<p>Please write down the following values and " .
                     "e-mail them to <a href='mailto:robert.johnson@cgu.edu'>Robert Johnson</a>.</p>";
               print "<blockquote style='font-size: 125%;'><strong>Your Subject ID: " . $subjectID . "<br />" .
                     "Your correctness score: " . $score . "<br />" .
                     "Your time score: " . $timeScore . "<br />" .
                     "Your elapsed time: " . $elapsedTime . "<br />" .
                     "Your total score: " . $total . "</strong></blockquote><br /><br />";
            } else {
               while( $row = mysqli_fetch_row( $result ) ) {
                  // print "SubjectID: $row[0] - correctness: $row[1] - timescore: $row[2] - time: $row[3] - totalscore: $row[4]<br />";
                  if( $row[0] == $subjectID ) {
                     print "<strong style='font-size: 125%; color: green;'>DATABASE Verification SUCCEEDED!!</strong><br />";
                     print "<br /><br /><h2 style='font-size: 150%; text-align: center; color: green;'>" .
                           "I've successfully saved your data!<br />" .
                           "Thank you for your participation in the TWELVE Research Study!</h2>";
                  }
               }
            }
         }

        // 5. close the database connection
        // print "<br />CLOSING DATABASE CONNECTION...<br />";
         $result->free();
         mysqli_close( $connection );
      ?>

      </pre>
   </body>
</html>

