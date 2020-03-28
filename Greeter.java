/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  File name     :  Greeter.java
 *  Purpose       :  Says "Hello world"; first program; provides a header template for Java programs
 *  Author        :  B.J. Johnson
 *  Date          :  2020-03-18
 *  Description   :  Demonstrator java class file for TDD testing demo in CMSI 543
 *  Notes         :  None
 *  Warnings      :  None
 *  Exceptions    :  None
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Revision Histor
 *  ---------------
 *            Rev      Date     Modified by:  Reason for change/modification
 *           -----  ----------  ------------  -----------------------------------------------------------
 *  @version 1.0.0  2020-03-18  B.J. Johnson  Initial writing and release
 *  @version 1.1.0  2020-03-27  B.J. Johnson  Modified sayMessage() to throw exception on empty string
 *                                            Added listArgs() method
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
public class Greeter {

  // simple little method to echo a message to the display
  //  2020-03-27: added the check for zero-length message
   public void sayMessage( String message ) {
      if( 0 == message.length() ) {
         throw new IllegalArgumentException();
      }
      System.out.println( "Message is: " + message );
   }

  // another simple method that lists any command line arguments to the display
   public int listArgs( String [] args ) {
      if( 0 == args.length ) {
         return -1;
      }
      for( int i = 0; i < args.length; i++ ) {
         System.out.println( "args[" + i + "] is: " + args[i] );
      }
      return args.length;
   }

  // main method doesn't do anything with the above methods, it's just here
  //  to show you can have one; basic "hello world" program
   public static void main( String args[] ) {

      System.out.println( "\n  Hello, world!\n\n" );

   }

}
