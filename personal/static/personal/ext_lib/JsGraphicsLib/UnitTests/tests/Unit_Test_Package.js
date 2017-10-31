/* end imports (DO NOT REMOVE THIS LINE!) */
/**
 * This checks that the unit testing framework is operation,
 * and subsequent tests can be taken seriously.
 * @author Martin Dale Lyness <martin.lyness@gmail.com>
 */

testAsserts: function() { with(this) {
	var tmp = "This is a string."
	assertEqual("This is a string.", tmp, "Test failed to register a string 'This is a string.' and a variable with the contents '"+tmp+"' as equal!");

	tmp = [20, 20, 69];
	assertEnumEqual([20, 20, 69], tmp, "Test failed to register enumerated value '"+[20, 20, 69]+"' and a variable with the contents '"+tmp+"' as equal!");

	assertNotEqual("Not Equal", "Equal", "The values 'Not Equal' and 'Equal' appear the same to the unit tester!");

	assertNull(null, "The 'null' keyword does not cause assertNull to pass!");

	assertMatch("the", "the green dog", "The regex expresion for 'the' was not found in the phrase 'the green dog' this should not happen!");

	assertType(Number, 3403, "The number '3403' did not register as of type Number!");

	benchmark( function() { 
			Function.tmpF = function(v) { 
				if(v == undefined) v = 1;
				else if(v > 1000000) return v;
				else tmpF(v+1); }}, 10, "Testing the speed of a recurisve function counting to 1 million");
}}
