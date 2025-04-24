// data hand off
<form method="post" action="submit.php">
  <!-- form fields for name, adults, children, infants, hazards -->
  
  <button type="submit">Submit</button>
</form>

//data passback
// Start session
session_start();

// Check if gear list exists
if(isset($_SESSION['gearList'])) {

  // Display gear list
  echo "<p>Recommended Gear:</p>";
  echo "<p>" . $_SESSION['gearList'] . "</p>";
  
  // Unset session variable
  unset($_SESSION['gearList']);

} else {

  // Show default text
  echo "<p>Complete the form to see recommended gear</p>";

}