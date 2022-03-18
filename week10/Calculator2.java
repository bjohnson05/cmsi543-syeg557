/**
 * filename: Calculator2.java
 * purpose : demonstrate use of JUnit 4 unit test framework
 * @author : Dr. Johnson
 * @date   : 2022-01-01
 * @note   : TEST OF THIS CLASS/FUNCTION WILL PASS
 */
public class Calculator2 {
   public int evaluate( String expression ) {
      int sum = 0;
      for( String summand: expression.split( "\\+" ) ) {
         sum += Integer.valueOf( summand );
      }
      return sum;
   }

}
