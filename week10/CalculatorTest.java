/**
 * filename: CalculatorTest.java
 * purpose : demonstrate use of JUnit 4 unit test framework
 * @author : Dr. Johnson
 * @date   : 2022-01-01
 * @note   : shows testing two things in the same test framework
 *             also shows that just because one fails doesn't mean
 *             the entire test run is aborted...
 */

// We gotta have these to get the JUnit 4 test stuff linked in
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class CalculatorTest {

  // Test of the original Calculator class ~ FAILS!
   @Test
   public void evaluatesExpression() {
      Calculator calculator = new Calculator();
      int sum = calculator.evaluate( "1+2+3" );
      assertEquals( 6, sum );
   }

  // Test of the new Calculator2 class ~ PASSES!
   @Test
   public void evaluatesExpression2() {
      Calculator2 calculator2 = new Calculator2();
      int sum = calculator2.evaluate( "1+2+3" );
      assertEquals( 6, sum );
   }

  // Test of the new Calculator2 class ~ PASSES!
   @Test
   public void evaluatesExpression3() {
      Calculator2 calculator2 = new Calculator2();
      int sum = calculator2.evaluate( "1+2+3+4" );
      assertEquals( 6, sum );
   }

}


