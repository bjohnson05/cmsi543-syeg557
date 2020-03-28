/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  File name     :  GreeterTester.java
 *  Purpose       :  Test harness for the Greeter program
 *  Author        :  B.J. Johnson
 *  Date          :  2020-03-18
 *  Description   :  See purpose (in this case; other files will have more details)
 *  Notes         :  None
 *  Warnings      :  None
 *  Exceptions    :  None
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Revision Histor
 *  ---------------
 *            Rev      Date     Modified by:  Reason for change/modification
 *           -----  ----------  ------------  -----------------------------------------------------------
 *  @version 1.0.0  2020-03-18  B.J. Johnson  Initial writing and release
 *  @version 1.1.0  2020-03-27  B.J. Johnson  added tests and reformatted for expected/actual outputs
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


public class GreeterTester {

   private static int testNumber  = 1;
   private static int testsPassed = 0;

   public static void main( String [] args ) {

      System.out.println( "\n\n" +
                          "   ======================================\n" +
                          "     Test Harness for the Greeter class\n" +
                          "   ======================================" );
      Greeter g = new Greeter();
      String myMessage = "Demonstration Test of TDD ~ hope things work!";
      g.sayMessage( myMessage );

      try {
         System.out.print( "    Test " + testNumber++ + ": checking sayMessage(): \n" +
                             "      expecting: Message is: Demonstration Test of TDD ~ hope things work!\n" +
                             "        and got: " );
         g.sayMessage( myMessage );
         System.out.print( "\n\n    Test " + testNumber++ + ": checking sayMessage(): \n" +
                             "      expecting: Message is: Bozo Rules\n" +
                             "        and got: " );
         g.sayMessage( "Bozo Rules" );
         System.out.print( "\n\n    Test " + testNumber++ + ": checking sayMessage(): \n" +
                             "      expecting: Message is: 23\n" +
                             "        and got: " );
         g.sayMessage( "23" );
         System.out.print( "\n\n    Test " + testNumber++ + ": checking sayMessage() with empty string: \n" +
                             "      expecting: exception to be thrown\n" +
                             "        and got: " );
         g.sayMessage( "" );
      }
      catch( Exception e ) {
         System.out.println( "Exception thrown:  " + e.toString() );
         e.printStackTrace();
      }

      System.out.println( "number of tests: " + (testNumber - 1) );
      System.exit( 0 );

   }

}
